import os
import re
import json
import uuid
import asyncio
import logging
import ipaddress
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import StreamingResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, EmailStr
import bcrypt
import jwt
import httpx
from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"
ADMIN_EMAIL = os.environ["ADMIN_EMAIL"].lower()
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
OWNER_EMAIL = os.environ["OWNER_EMAIL"]

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are VEXX, the AI concierge of Omnivexx, a tech service agency founded by Dhimant S Reddy.
Omnivexx offers 7 services: 1) Digital ADS & Marketing, 2) Influencer Marketing, 3) Data Science & Structure Management, 4) Trading Indicators & Bots, 5) Social Media Farming, 6) SaaS Engineering, 7) Startup Incubation.
Founder contact: sdhim8055@gmail.com, +91 6361751228.
Tone: sharp, confident, friendly. Keep replies to 2-4 short sentences.
Help visitors understand which service fits their goal. Never invent prices — say pricing is scoped per project.
If the visitor wants to talk to the team or book a call, tell them to tap the "Book a Call" button in this chat."""


# ---------- Email guardrail gate (G2 + G3 structural defense) ----------
_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: Optional[str] = None) -> Optional[str]:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    async with httpx.AsyncClient(timeout=30) as http:
        resp = await http.post(
            f"{EMAIL_BASE_URL}/api/v1/email/send",
            headers={"X-Email-Key": EMAIL_KEY},
            json=payload,
        )
    resp.raise_for_status()
    return resp.json().get("id")


def _lead_row(label: str, value: str) -> str:
    return (
        f'<tr><td style="padding:10px 16px;color:#7C7C96;font-size:11px;text-transform:uppercase;'
        f'letter-spacing:2px;font-family:Arial,sans-serif;white-space:nowrap">{label}</td>'
        f'<td style="padding:10px 16px;color:#0B1220;font-size:14px;font-family:Arial,sans-serif">{value}</td></tr>'
    )


async def notify_owner_new_lead(lead: "Lead") -> None:
    is_call_booking = "Call Booking" in lead.service
    if is_call_booking:
        subject = f"[URGENT] Call booked via VEXX — {lead.name}"
        header = '<span style="display:inline-block;background:#DC2626;color:#FFFFFF;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;padding:6px 14px;border-radius:999px">Urgent — Call Booking</span>'
        title = f'{escape(lead.name)} wants a call'
        note = "This came through VEXX, your AI concierge. Fast replies close deals."
    else:
        subject = f"New Omnivexx enquiry — {lead.service}"
        header = '<span style="display:inline-block;background:#7C3AED;color:#FFFFFF;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;padding:6px 14px;border-radius:999px">New Enquiry</span>'
        title = "New enquiry received"
        note = "This lead is also saved in your Lead Inbox."
    html = (
        '<table role="presentation" width="100%" style="background:#F4F7FB;padding:32px 0"><tr><td align="center">'
        '<table role="presentation" width="520" style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:32px">'
        f'<tr><td style="padding-bottom:16px">{header}</td></tr>'
        f'<tr><td style="font-family:Arial,sans-serif;font-size:20px;font-weight:bold;color:#0B1220;padding-bottom:4px">{title}</td></tr>'
        '<tr><td style="font-family:Arial,sans-serif;font-size:12px;color:#7C3AED;letter-spacing:3px;text-transform:uppercase;padding-bottom:20px">Omnivexx Website</td></tr>'
        '<tr><td><table role="presentation" width="100%" style="border-top:1px solid #E2E8F0">'
        + _lead_row("Name", escape(lead.name))
        + _lead_row("Email", f'<a href="mailto:{escape(lead.email)}" style="color:#7C3AED">{escape(lead.email)}</a>')
        + _lead_row("Service", escape(lead.service))
        + _lead_row("Budget", escape(lead.budget or "—"))
        + _lead_row("Message", escape(lead.message))
        + f'</table></td></tr><tr><td style="padding-top:24px;font-family:Arial,sans-serif;font-size:11px;color:#94A3B8">{note}</td></tr>'
        '</table></td></tr></table>'
    )
    try:
        await send_email(to=OWNER_EMAIL, subject=subject, html=html)
        logger.info(f"{'URGENT call booking alert' if is_call_booking else 'Lead notification'} emailed to {OWNER_EMAIL}")
    except Exception as e:
        logger.error(f"Lead notification email failed: {e}")


# ---------- Auth ----------
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(pw: str, hashed: str) -> bool:
    return bcrypt.checkpw(pw.encode("utf-8"), hashed.encode("utf-8"))


@app.on_event("startup")
async def seed_admin():
    existing = await db.users.find_one({"email": ADMIN_EMAIL})
    if not existing:
        await db.users.insert_one({
            "email": ADMIN_EMAIL,
            "password_hash": hash_password(ADMIN_PASSWORD),
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    elif not verify_password(ADMIN_PASSWORD, existing["password_hash"]):
        await db.users.update_one(
            {"email": ADMIN_EMAIL},
            {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}},
        )


class LoginInput(BaseModel):
    email: EmailStr
    password: str


@api_router.post("/auth/login")
async def login(input: LoginInput):
    user = await db.users.find_one({"email": input.email.lower()})
    if not user or not verify_password(input.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = jwt.encode(
        {
            "sub": str(user["_id"]),
            "email": user["email"],
            "exp": datetime.now(timezone.utc) + timedelta(hours=12),
            "type": "access",
        },
        JWT_SECRET,
        algorithm=JWT_ALGORITHM,
    )
    return {"token": token, "email": user["email"]}


async def get_current_admin(creds: HTTPAuthorizationCredentials = Depends(security)):
    if not creds:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        return jwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    service: str
    budget: str = ""
    message: str


class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    service: str
    budget: str = ""
    message: str
    replied: bool = False
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


@api_router.get("/")
async def root():
    return {"message": "omnivexx api operational"}


@api_router.post("/leads", response_model=Lead)
async def create_lead(input: LeadCreate):
    lead = Lead(**input.model_dump())
    doc = lead.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.leads.insert_one(doc)
    asyncio.create_task(notify_owner_new_lead(lead))
    return lead


@api_router.get("/leads", response_model=List[Lead])
async def get_leads(admin=Depends(get_current_admin)):
    leads = await db.leads.find({}, {"_id": 0}).sort("timestamp", -1).to_list(1000)
    for lead in leads:
        if isinstance(lead['timestamp'], str):
            lead['timestamp'] = datetime.fromisoformat(lead['timestamp'])
    return leads


ANALYTICS_TYPES = {"pageview", "chat"}


class TrackInput(BaseModel):
    type: str


@api_router.post("/analytics/track")
async def track_event(input: TrackInput):
    if input.type not in ANALYTICS_TYPES:
        raise HTTPException(status_code=400, detail="Invalid event type")
    await db.analytics.insert_one({"type": input.type, "ts": datetime.now(timezone.utc).isoformat()})
    return {"ok": True}


@api_router.get("/analytics/summary")
async def analytics_summary(admin=Depends(get_current_admin)):
    week_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    week_events = await db.analytics.find({"ts": {"$gte": week_ago}}, {"_id": 0}).to_list(100000)
    return {
        "week_pageviews": sum(1 for e in week_events if e["type"] == "pageview"),
        "week_chats": sum(1 for e in week_events if e["type"] == "chat"),
        "week_leads": await db.leads.count_documents({"timestamp": {"$gte": week_ago}}),
        "total_pageviews": await db.analytics.count_documents({"type": "pageview"}),
        "total_chats": await db.analytics.count_documents({"type": "chat"}),
        "total_leads": await db.leads.count_documents({}),
    }


# ---------- Weekly digest (Sundays 9:00 AM IST) ----------
async def _week_stats() -> dict:
    week_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    week_events = await db.analytics.find({"ts": {"$gte": week_ago}}, {"_id": 0}).to_list(100000)
    return {
        "week_ago": week_ago,
        "pageviews": sum(1 for e in week_events if e["type"] == "pageview"),
        "chats": sum(1 for e in week_events if e["type"] == "chat"),
        "leads": await db.leads.count_documents({"timestamp": {"$gte": week_ago}}),
    }


async def send_weekly_digest() -> None:
    stats = await _week_stats()
    leads = await db.leads.find(
        {"timestamp": {"$gte": stats["week_ago"]}}, {"_id": 0}
    ).sort("timestamp", -1).to_list(50)
    lead_rows = "".join(
        f'<tr><td style="padding:8px 16px;font-family:Arial,sans-serif;font-size:13px;color:#0B1220">{escape(l["name"])}</td>'
        f'<td style="padding:8px 16px;font-family:Arial,sans-serif;font-size:13px;color:#0B1220">{escape(l["service"])}</td>'
        f'<td style="padding:8px 16px;font-family:Arial,sans-serif;font-size:13px"><a href="mailto:{escape(l["email"])}" style="color:#7C3AED">{escape(l["email"])}</a></td></tr>'
        for l in leads
    ) or '<tr><td style="padding:8px 16px;font-family:Arial,sans-serif;font-size:13px;color:#94A3B8">No new leads this week.</td></tr>'
    html = (
        '<table role="presentation" width="100%" style="background:#F4F7FB;padding:32px 0"><tr><td align="center">'
        '<table role="presentation" width="560" style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:32px">'
        '<tr><td style="font-family:Arial,sans-serif;font-size:20px;font-weight:bold;color:#0B1220;padding-bottom:4px">Your week at Omnivexx</td></tr>'
        '<tr><td style="font-family:Arial,sans-serif;font-size:12px;color:#7C3AED;letter-spacing:3px;text-transform:uppercase;padding-bottom:20px">Weekly Digest</td></tr>'
        '<tr><td><table role="presentation" width="100%" style="border-top:1px solid #E2E8F0">'
        + _lead_row("Site visits", str(stats["pageviews"]))
        + _lead_row("VEXX chats", str(stats["chats"]))
        + _lead_row("New leads", str(stats["leads"]))
        + '</table></td></tr>'
        '<tr><td style="padding-top:20px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;color:#0B1220">New enquiries</td></tr>'
        f'<tr><td><table role="presentation" width="100%">{lead_rows}</table></td></tr>'
        '<tr><td style="padding-top:24px;font-family:Arial,sans-serif;font-size:11px;color:#94A3B8">'
        'Sent by the Omnivexx website every Sunday morning (IST).</td></tr>'
        '</table></td></tr></table>'
    )
    await send_email(
        to=OWNER_EMAIL,
        subject=f"Omnivexx Weekly Digest — {stats['leads']} new leads, {stats['pageviews']} visits",
        html=html,
    )
    logger.info("Weekly digest emailed to owner")


async def digest_loop():
    while True:
        try:
            now_ist = datetime.now(timezone.utc) + timedelta(hours=5, minutes=30)
            if now_ist.weekday() == 6 and now_ist.hour == 9:
                iso = now_ist.isocalendar()
                key = f"digest:{iso.year}-W{iso.week:02d}"
                if not await db.meta.find_one({"key": key}):
                    await send_weekly_digest()
                    await db.meta.insert_one({"key": key, "sent_at": datetime.now(timezone.utc).isoformat()})
        except Exception as e:
            logger.error(f"Digest loop error: {e}")
        await asyncio.sleep(1800)


@app.on_event("startup")
async def start_digest_loop():
    asyncio.create_task(digest_loop())


class ReplyInput(BaseModel):
    message: str


@api_router.post("/leads/{lead_id}/reply")
async def reply_to_lead(lead_id: str, input: ReplyInput, admin=Depends(get_current_admin)):
    lead = await db.leads.find_one({"id": lead_id}, {"_id": 0})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    if not input.message.strip():
        raise HTTPException(status_code=400, detail="Reply message is empty")
    body_html = "<br>".join(escape(input.message).splitlines())
    html = (
        '<table role="presentation" width="100%" style="background:#F4F7FB;padding:32px 0"><tr><td align="center">'
        '<table role="presentation" width="560" style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:32px">'
        '<tr><td style="font-family:Arial,sans-serif;font-size:12px;color:#7C3AED;letter-spacing:3px;text-transform:uppercase;padding-bottom:16px">Omnivexx</td></tr>'
        f'<tr><td style="font-family:Arial,sans-serif;font-size:15px;color:#0B1220;line-height:1.7">{body_html}</td></tr>'
        '<tr><td style="padding-top:28px;border-top:1px solid #E2E8F0;font-family:Arial,sans-serif;font-size:12px;color:#64748B">'
        'Dhimant S Reddy — Founder, Omnivexx<br>+91 6361751228</td></tr>'
        '</table></td></tr></table>'
    )
    await send_email(
        to=lead["email"],
        subject=f"Re: Your Omnivexx enquiry — {lead['service']}",
        html=html,
    )
    await db.leads.update_one(
        {"id": lead_id},
        {"$set": {"replied": True, "replied_at": datetime.now(timezone.utc).isoformat()}},
    )
    return {"ok": True}


@api_router.post("/analytics/digest-now")
async def digest_now(admin=Depends(get_current_admin)):
    await send_weekly_digest()
    return {"ok": True}


class ChatInput(BaseModel):
    session_id: str
    message: str


@api_router.post("/chat")
async def chat_endpoint(input: ChatInput):
    history = await db.chat_messages.find(
        {"session_id": input.session_id}, {"_id": 0}
    ).sort("ts", 1).to_list(20)
    transcript = "\n".join(
        f"{'Visitor' if m['role'] == 'user' else 'VEXX'}: {m['text']}" for m in history[-8:]
    )
    prompt = f"{transcript}\nVisitor: {input.message}" if transcript else input.message
    await db.chat_messages.insert_one({
        "session_id": input.session_id,
        "role": "user",
        "text": input.message,
        "ts": datetime.now(timezone.utc).isoformat(),
    })

    chat = LlmChat(
        api_key=os.environ["EMERGENT_LLM_KEY"],
        session_id=f"{input.session_id}-{uuid.uuid4()}",
        system_message=SYSTEM_PROMPT,
    ).with_model("openai", "gpt-5.4")

    async def event_generator():
        full = ""
        try:
            async for ev in chat.stream_message(UserMessage(text=prompt)):
                if isinstance(ev, TextDelta):
                    full += ev.content
                    yield f"data: {json.dumps({'delta': ev.content})}\n\n"
                elif isinstance(ev, StreamDone):
                    break
        except Exception:
            yield f"data: {json.dumps({'delta': 'Signal dropped — please try again, or email sdhim8055@gmail.com directly.'})}\n\n"
        if full:
            await db.chat_messages.insert_one({
                "session_id": input.session_id,
                "role": "assistant",
                "text": full,
                "ts": datetime.now(timezone.utc).isoformat(),
            })
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
