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

## Backlog / Remaining
- P0: none
- P1: Replace sample case studies + stats with real client results; email notification to founder on new lead (Resend)
- P2: Team section, blog, SEO meta/OG images, real founder portrait, chat concierge tool-calling

## Test Credentials
See /app/memory/test_credentials.md. Admin: admin@omnivexx.com / Omnivexx@2026 (test credentials — reseed anytime). Auth tests: /app/auth_testing.md.
