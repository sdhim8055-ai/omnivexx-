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

## Backlog / Remaining
- P0: none (core complete)
- P1: Case studies/portfolio section, admin view for leads
- P2: Team section, blog, multi-language, SEO meta/OG images, real founder portrait

## Test Credentials
- No auth in app. Contact form is public. Leads readable via GET /api/leads (no admin UI yet).
