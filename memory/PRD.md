# OMNIVEXX — Tech Service Agency Website

## Original Problem Statement
Website for agency "omnivexx", a tech service based agency offering: 1) Digital ADS & marketing, 2) Influencer marketing, 3) Data science & structure management, 4) Trading & indicators & bots, 5) Social media farming, 6) SaaS, 7) Startup incubation. Best possible website with really cool scroll animations.

## User Choices
- Bold dark futuristic theme (deep dark + neon accents), full cinematic scroll animations
- Working contact/lead form saving to database
- Core sections only: hero, services, about, contact
- Contact info: founder Dhimant S Reddy, email sdhim8055@gmail.com, phone +91 6361751228

## Architecture
- Frontend: React 19 + Tailwind + framer-motion + lenis (momentum scroll) + sonner toasts. Components in /app/frontend/src/components/ (Navbar, Hero, StatsRibbon, Manifesto, Services, Marquee, Contact, Footer, Cursor).
- Backend: FastAPI at /api — POST /api/leads, GET /api/leads (MongoDB, collection `leads`).
- Design source: /app/design_guidelines.json (Bold Dark Futuristic: #06060A base, cyan #06B6D4 + violet #A855F7 accents, Syne/Plus Jakarta Sans/JetBrains Mono fonts).

## User Personas
- Founders/CMOs looking for growth engineering services
- Startup founders seeking incubation or MVP builds

## Implemented (2026-09-12)
- Kinetic hero with masked line-by-line reveal, mouse-parallax glow + grid
- Stats ribbon with scroll-triggered animated counters
- Manifesto section: 3 numbered chapters, parallax image, founder quote
- Services: 7 expandable numbered rows with tags, metrics, "Deploy This" prefill → contact form
- Slow editorial marquee (outlined/filled alternating kinetic text)
- Contact: founder card (mailto/tel + copy buttons), lead form → POST /api/leads → MongoDB, toast feedback
- Footer with giant outlined OMNIVEXX kinetic text, system status
- Custom cursor (dot + spring ring), Lenis smooth scrolling, glassmorphic navbar
- Verified: lead POST/GET via curl, form submit e2e with toast, accordion interaction, hero render

## Implemented (2026-09-12, update 2)
- Theme shifted to mixed "cool" look per user: dark hero + dark footer, light ice-white content sections (stats, manifesto, services, case studies, marquee, contact)
- Footer giant OMNIVEXX text clipping fixed (leading + bottom padding)
- Startup-realistic stats: 7 disciplines, $250K+ ad spend managed, 87% bot win-rate, 24/7 ops
- Case Studies section (#work): 3 polished sample engagements with images, metrics, CTAs (marked "sample engagements")
- AI Chat Concierge "VEXX": floating widget, streaming SSE via emergentintegrations LlmChat (openai/gpt-5.4, EMERGENT_LLM_KEY), quick chips, chat history in db.chat_messages, Book-a-Call mini form -> saves as lead (service "AI Concierge — Call Booking")
- Lead Inbox at /admin: JWT auth (POST /api/auth/login, bcrypt, admin seeded from env), GET /api/leads now Bearer-protected, leads list UI with refresh/logout
- Navbar: added "Work" link; Footer: added "Admin" link
- Verified: login wrong-pass 401 + success, leads 401 without token / 200 with token, chat SSE streams, admin UI e2e, case studies + footer render

## Implemented (2026-09-12, update 3)
- Lead email alerts: every new enquiry (contact form OR concierge call booking) triggers an instant email to the owner via Emergent-managed Resend proxy (non-blocking asyncio task, guardrail-gated template). Verified in logs: "Lead notification emailed to owner".
- Hero redesigned to purple/lavender theme: aurora glow, 3 floating lavender/violet/fuchsia orbs, 2 counter-rotating orbital rings reacting to cursor, shimmer beam, masked line reveal with lavender gradient "DIGITAL", scroll-driven parallax (content lifts + fades, grid scales on scroll).

## Implemented (2026-09-12, update 4)
- Site-wide accent switched from cyan to violet/lavender (all sections, buttons, chat widget, admin, gradients, glows) to match the purple hero
- Full-screen animated mobile menu (staggered oversized links, violet aurora bg, CTA + status) behind hamburger on <md screens
- Hero rotating headline: "// DEPLOYING <service>" cycles through all 7 services every 2.8s with vertical roll animation

## Implemented (2026-09-12, update 5)
- Service detail pages at /services/:slug for all 7 services: dark violet hero, 4-step process, 3-tier pricing hints (placeholder ranges), FAQ accordion, CTA back to contact. Data in /app/frontend/src/data/services.js. Linked from each expanded service row ("Full Breakdown").
- Cursor glow trail: fading violet light dots follow the cursor on desktop (Cursor.jsx, pointer:fine only).
- Visitor analytics: POST /api/analytics/track (public, pageview/chat, once per session via sessionStorage flags), GET /api/analytics/summary (Bearer-protected). Admin inbox shows stats strip: visits/chats/leads this week + all-time.

## Implemented (2026-09-12, update 6)
- Real startup INR pricing on all 7 service pages (e.g. Ads ₹15K–₹75K+, SaaS MVP ₹50K–₹1.5L, indicators ₹5K–₹12K)
- Weekly email digest: Sundays 9:00 AM IST, visits/chats/leads summary + lead list to owner; dedupe via db.meta; "Digest Now" button in admin for instant send
- Lead replies from inbox: POST /api/leads/{id}/reply (JWT-protected, branded template, escapes input), admin UI with inline composer + "Replied" badges
- Vercel prep: frontend/vercel.json (SPA rewrites), backend/vercel.json + backend/api/index.py, .env.example files for both; secrets gitignored
- Git: local repo committed on `main` (109 files, no .env/secrets), remote origin set to https://github.com/sdhim8055-ai/omnivexx-.git — PUSH BLOCKED: no GitHub credentials in environment (needs user's PAT or Emergent GitHub connect)
- Verified: reply e2e (toast + Replied badge), digest-now email sent, INR pricing renders, reply endpoint 401 without auth

## Implemented (2026-09-12, update 7)
- VEXX call bookings now trigger a separate URGENT-branded email to owner (subject "[URGENT] Call booked via VEXX — <name>", red badge template); regular enquiries keep the standard violet template. Verified in logs.
- GitHub push attempted with user-provided PAT: FAILED — token is valid (login sdhim8055-ai) but has NO write access (x-oauth-scopes empty; API contents write returns Not Found; git push 403). Needs a classic PAT with `repo` scope, or a fine-grained PAT with repository access to omnivexx- + Contents: Read and Write. Token was pasted in chat — user should revoke it at github.com/settings/tokens after generating the new one. Local commit on `main` remains ready to push.

## Implemented (2026-09-12, update 8)
- GitHub push DONE: 131 files pushed to https://github.com/sdhim8055-ai/omnivexx- (main branch). Verified remotely via API — key files present, zero .env/secret files leaked. Working token used via one-off push URL, never stored in git config.

## Backlog / Remaining
- P0: none — code is on GitHub
- P1: Vercel deploy (frontend root=frontend, backend root=backend, env vars from .env.example; MongoDB Atlas for MONGO_URL)
- P1: Replace sample case studies + stats with real client results; email notification to founder on new lead (Resend)
- P2: Team section, blog, SEO meta/OG images, real founder portrait, chat concierge tool-calling

## Test Credentials
See /app/memory/test_credentials.md. Admin: admin@omnivexx.com / Omnivexx@2026 (test credentials — reseed anytime). Auth tests: /app/auth_testing.md.
