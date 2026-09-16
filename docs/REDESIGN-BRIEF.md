# LeadQ — Product & Positioning Brief (Website Redesign)

> **What this is:** the single source of truth for the LeadQ website redesign — what we sell,
> who it's for, how it's priced, and how it should sound and look. Feed this to the design work.
>
> **The pivot (read first):** the new site sells the **LeadQ app — the one app that does it all**:
> a single AI assistant a business sets up itself and pays for by subscription + usage. We are **no
> longer** selling the previous "done-for-you agency" model (90-day partnership, managed service,
> setup fees as the core offer). The old dark glassmorphic marketing site and its agency pricing
> are **retired**. Done-for-you now survives only as an optional **setup add-on**.
>
> Pricing and colors below are anchored to the **"LeadQ Pricing Playbook."** The playbook notes
> its prices are **starting anchors to validate**, not final list prices — present them as the
> intended structure; final numbers are the owners' call.

---

## 1. One-liner

**LeadQ is one AI assistant for your whole business — it answers WhatsApp, SMS, web chat, email, and the phone, captures every lead, books appointments, and handles support, 24/7.** Set it up yourself in minutes; it works while you sleep.

Positioning in a sentence: *the affordable, self-serve AI receptionist + assistant for small businesses, across every channel, in one place.*

---

## 2. The offer & business model

One **app that does it all**, priced on three lines (keep the pricing page legible around these):

1. **Subscription — priced on value.** A tier buys an outcome (leads captured, appointments booked, support deflected). The anchor: *one recovered no-show or captured lead covers the month.*
2. **Metered usage — cost + margin.** AI conversations, SMS segments, WhatsApp conversations are real variable costs. Each tier bundles an allowance; overage is billed as **LeadQ credits** (never an itemized Twilio/Meta bill).
3. **Add-ons — a short menu (five max).** Extra numbers, conversation packs, seats, done-for-you setup, A2P activation. Plus the **Voice AI Receptionist** premium module.

**Go-to-market:** self-serve signup and setup (the app already exists at `app.leadq.co`). Not sales-led — the **Agency** tier is the reseller/white-label path. Multi-market from day one: **US, Canada, UAE.**

---

## 3. The product (what they're actually buying)

One assistant, configured once, working across every channel. The setup surface (this is the real app):

- **Persona** — assistant name, tone, primary goal (book appointments / answer questions / capture leads), greeting, behavior rules, the lead fields to collect, no-reply follow-ups, and human-handoff rules.
- **Knowledge** — business info + FAQ, with AI-suggested answers pulled from a crawl of the business's website.
- **Offerings** — services/products with prices and durations.
- **Business setup** — hours, locations, booking rules (notice / buffer / cancellation), timezone, currency.
- **Channels** — **WhatsApp** (Meta Cloud API), **SMS** (with A2P/10DLC handled), a **website-chat widget** (embed on any site), **Email**, and **Voice** (an AI phone agent, ~38 voices).
- **Inbox** (live conversations), **Schedule** (bookings + reminders), **Reporting**.

**Key product truths for the designer:**
- It's genuinely **multi-channel from one config** — the same assistant answers a text and a phone call with the same knowledge. That unity is the headline capability; show it.
- The truest hero visuals: a **phone showing a live WhatsApp/SMS booking conversation**, a **voice call being answered + booked**, and a **calendar filling itself**.
- Setup is **self-serve** — depict a product you configure, not a service you buy. (Note: multi-workspace self-signup for agencies is the Agency tier; individual businesses self-serve directly.)

---

## 4. Who it's for (ICP)

**Small businesses with high inquiry volume, high value per lead, and painful no-shows** — where one saved lead pays for the plan. Lead with these obvious-ROI verticals:

- **Clinics & healthcare practices**
- **Salons, spas & med-spas**
- **Home services** (roofing, HVAC, cleaning, etc.)
- **Real estate**

Also relevant: any appointment-driven local business. **Markets:** US, Canada, UAE (UAE is **WhatsApp-first** — no SMS there). Write to a busy owner/operator who misses calls and leads because they're doing the actual work.

---

## 5. Pricing (the core of the redesign)

Four tiers. **Price in local currency per market — never a raw FX conversion** — but the anchors line up to roughly the same value everywhere (FX ref: 1 USD ≈ 1.37 CAD, 1 AED ≈ 0.37 CAD). Show the buyer's market by default with a market switch.

### Tiers

| Tier | For | US /mo | CA /mo | UAE /mo | Included | Seats |
|---|---|---|---|---|---|---|
| **Starter** | Solo / trying it out | **$59** | **$79** | **199 AED** | 250 AI conversations | 1 |
| **Growth** ⭐ *Most popular* | Growing SMBs (the main plan) | **$149** | **$199** | **549 AED** | 1,000 conversations · 1 number | 3 |
| **Pro** | Established, multi-channel, support | **$399** | **$499** | **1,299 AED** | 5,000 conversations · 2 numbers | 10 |
| **Agency** | Resellers / white-label | **$499+** | **$649+** | **1,799 AED+** | Pooled usage · unlimited workspaces | ∞ |

**What each tier unlocks:**
- **Starter** — one channel (web chat *or* WhatsApp), assistant persona + FAQ + lead capture, contact list.
- **Growth** — WhatsApp + SMS + web chat; booking, calendar & reminders; follow-ups, custom fields, contact profiles; 500 SMS segments included (US/CA).
- **Pro** — all channels + **support mode** (troubleshooting KB, image/vision, tickets); integrations, analytics, API; remove "Powered by LeadQ" branding.
- **Agency** — god-view multi-client, white-label, bring-your-own LLM key; wholesale ~$29–49 CAD per active client, agency sets retail.

### Feature gating (what climbs the ladder)

| Capability | Starter | Growth | Pro | Agency |
|---|---|---|---|---|
| Assistant, FAQ & lead capture | ✓ | ✓ | ✓ | ✓ |
| Channels | 1 | WA · SMS · Web | All | All |
| Booking, calendar & reminders | — | ✓ | ✓ | ✓ |
| Follow-ups, custom fields, profiles | — | ✓ | ✓ | ✓ |
| Support mode (troubleshoot, vision, tickets) | — | — | ✓ | ✓ |
| Integrations, analytics, API | — | Basic | ✓ | ✓ |
| Included AI conversations / mo | 250 | 1,000 | 5,000 | Pooled |
| Remove LeadQ branding | — | — | ✓ | ✓ |
| White-label · god-view · BYO LLM key | — | — | — | ✓ |

### Metered usage (billed as LeadQ credits, ~3–4× raw cost)

| Unit | US | CA | UAE |
|---|---|---|---|
| AI conversation *(core)* | $0.05 | $0.07 | 0.20 AED |
| SMS segment *(US/CA)* | $0.04 | $0.05 | n/a |
| WhatsApp conversation *(24h)* | $0.10 | $0.12 | 0.40 AED |
| Dedicated number rental | 1 incl., then $8/mo | 1 incl., then $10/mo | WhatsApp-based |

*"AI conversation" = one customer thread in a rolling monthly window.* UAE is WhatsApp-first (no SMS/A2P). Canada needs no A2P registration; the US does — that difference is the one-time A2P add-on, not the monthly price.

### Add-ons (the whole menu — five)

| Add-on | When | US | CA | UAE |
|---|---|---|---|---|
| Extra phone number | monthly | $8 | $10 | n/a |
| Conversation pack (+1,000) | monthly | $29 | $39 | 109 AED |
| Extra seat | monthly | $15 | $19 | 55 AED |
| Done-for-you setup + KB load | one-time | $299 | $399 | 1,099 AED |
| SMS activation (A2P) *(US only)* | one-time | $99 | — | — |

### Premium module — **AI Receptionist (Voice)**

The strongest upsell and differentiator. The *same* assistant now answers the phone.

- **Price:** US $99/mo · CA $129/mo · UAE 349 AED/mo — **300 minutes included**, overage ≈ $0.30 CAD/min. Metered (voice costs 5–10× a text interaction, so it never sits in a flat bundle). **Inbound first, outbound later.**
- **On the call it:** answers every inbound call 24/7 in the assistant's persona + voice; books, reschedules & cancels live against the calendar; answers from the knowledge base; captures caller details + logs the call/transcript; transfers to a human on your rules.
- Runs on Vapi + ElevenLabs voices + Claude, driven by the **same business config** as the text agent.

### Pricing-page principles
- **Price local, don't FX-convert** — clean local numbers per market, market switcher.
- **Sell credits, not vendor bills** — allowance + padded overage; the buyer never sees a Twilio line item.
- **Keep it to four tiers + five add-ons + the voice module** — legibility is the point.
- Growth is the **"most popular"** default; anchor the whole page on it.
- Fair proof point to use: *~84% gross margin on a Growth seat* is internal — don't publish it, but it means we can afford generous allowances.

---

## 6. Why it sells (value props)

- **One recovered lead or no-show pays for the month.** Lead with ROI, not features.
- **Never miss a lead or a call again** — 24/7 across every channel.
- **One assistant, every channel** — text and phone share one brain; no juggling tools.
- **Live in minutes, self-serve** — no agency, no long setup, cancel anytime.
- **Speed to lead** — instant, human-like responses book the appointment before a competitor calls back.

---

## 7. Differentiators

- **Truly multi-channel from a single config** (WhatsApp + SMS + web + email + voice) — most tools do one or two.
- **Voice and text are the same assistant** — same persona, same knowledge, same calendar.
- **Self-serve and affordable** — SMB pricing (from $59/mo), not enterprise/agency retainers.
- **Built for resellers** — the Agency tier white-labels the whole thing.
- **Support mode**, not just sales — deflects troubleshooting with a KB + image/vision (Pro).

---

## 8. Brand voice & copy

- **Punchy, plain, product-led, second person.** Short two-beat lines. Speak to outcomes.
- **Self-serve CTAs:** "Get started," "Start free," "See it work," "Try the demo," "Book a demo" (secondary). Avoid agency-era CTAs like "Book a strategy session" as the primary.
- **Reusable vocabulary:** "every channel," "one assistant," "books itself," "24/7," "never miss a lead," "live in minutes," "answers the phone too."
- **⚠️ Copy rule (owner preference):** **no em-dashes / long dashes** — they read as an AI tell. Short sentences, periods and commas. Keep it human.
- Retire agency-era phrasing: "we join your team," "done-for-you systems," "90-day partnership." (Done-for-you is now just an add-on, not the pitch.)

---

## 9. Visual system (use these tokens)

A **clean, light-first product look** (with a real dark mode), blue primary + purple accent, system fonts, mono for numbers, rounded cards (14–16px), soft shadows. This replaces the old dark glassmorphic brand.

**Light (default):**
```
--bg:#f6f8fb;  --surface:#ffffff;  --surface-2:#eef2f8;
--ink:#0f1520;  --ink-2:#454f5f;  --ink-3:#78828f;
--line:#e2e8f1;  --line-2:#eaeff6;
--accent:#2f6df6;  --accent-ink:#215ad6;  --accent-soft:rgba(47,109,246,.10);
--good:#158a58;  --warn:#a86a12;  --pop:#7b5bd6;   /* purple accent */
--shadow:0 1px 2px rgba(16,24,40,.04), 0 8px 24px -12px rgba(16,24,40,.14);
```
**Dark:**
```
--bg:#0a0f18;  --surface:#111927;  --surface-2:#0e1520;  --raise:#152030;
--ink:#eef2f8;  --ink-2:#aeb9c8;  --ink-3:#78838f;
--line:#20293a;  --line-2:#1a2230;
--accent:#4d86ff;  --accent-ink:#7ba6ff;  --pop:#a98cf0;
--good:#37c98b;  --warn:#e0ae5a;
```
- **Type:** system sans (`-apple-system, "Segoe UI", Roboto, Helvetica, Arial`); **mono** (`SF Mono, JetBrains Mono, Menlo`) with tabular numerals for all prices/stats. Big headings, tight tracking (`letter-spacing:-.02em`), `text-wrap:balance`.
- **Components:** pill chips, dot-bullets with an accent ring, feature cards with hairline borders + soft shadow, the "Most popular" plan gets an accent ring + flag. Purple (`--pop`) reserved for the **Voice module** so it reads as premium.
- **Logo:** `leadq-logo.png` / `GearLogo.png` (the "Q" in accent blue). Standardize logo sizing (the old site was inconsistent).

---

## 10. Suggested site structure

Hero (multi-channel assistant, live demo/phone mock, "Start free") → How it works (set persona → connect channels → it books) → Channels (WhatsApp/SMS/web/email/voice, one config) → Use-cases by vertical (clinic, salon/med-spa, home services, real estate) → **Voice AI Receptionist** feature block (purple, premium) → Pricing (four tiers + market switch + usage/add-ons) → Proof/results → FAQ (usage/credits, A2P, WhatsApp, cancel anytime) → final CTA. Keep a real **interactive demo** (text/call the AI) — it's the best proof asset and worth carrying over from the old site.

---

## 11. Guardrails (don't misrepresent)

- **Be transparent that usage is metered** (conversations/SMS/WhatsApp/voice minutes) — bundled allowance + credits, not "unlimited."
- **Agency = reseller/white-label**, not a support level. Don't market it to end SMBs.
- **Voice is inbound-first** — don't promise outbound calling campaigns yet.
- **Prices are launch anchors** to validate against real costs and each market — treat as the intended structure, confirm final numbers with the owners.
- Only advertise integrations that exist; multi-workspace **self-signup for agencies** and some integrations are still maturing, so don't over-promise a fully self-serve enterprise console.

---

## Appendix — Full capabilities inventory (from the app code)

> A complete, screen-level inventory of what the LeadQ app actually does today, pulled from the
> product code (the app is a single `index.html`; backend logic runs in n8n + Supabase). Use this
> when you need to depict a specific feature or screen accurately. Items marked **(coming)** are
> stubbed in the app — don't present them as live.

### A. App shell & navigation
- Mobile-first, phone-framed app (installable PWA, works offline for the shell).
- **Four bottom-nav tabs:** Assistant (setup dashboard), Inbox (conversations), Schedule (bookings), Settings. ~45 screens total, navigated as a back-stack that restores where you left off.
- **Home dashboard:** today's stats (Conversations / Booked / Waiting), a live list of connected channels each with **Pause/Resume**, and guided-setup groups — *Assistant* (Persona, Knowledge base, Services/Offerings) and *Operations* (Business hours, Users, Channels).
- **Onboarding progress bar** across the required sections (assistant, knowledge, offerings, availability, team, channels, business profile, calendar); a "you're live" state + congrats moment when complete.

### B. The assistant (persona)
- Assistant **name**, **tone** (7 presets: Warm, Brisk, Formal, Playful, Luxe, Reassuring, Bold — or free-text), **primary goal** (book appointments, answer questions, capture leads, etc.) plus secondary "also handles" goals.
- **Greeting** (global) and **per-channel opening messages** (WhatsApp / SMS / web chat), with token insertion like `{firstname}`.
- **Behavior instructions** — a freeform "how it behaves" block with sensible default guardrails.
- **Never-say list** and **human-handoff rules** ("hand off to a person when…").
- **AI on/off** master switch (and per-contact, see Inbox).

### C. Knowledge base
- **About / business info** blurb + **FAQ** (Q&A pairs) + **photos**.
- **AI knowledge suggestions:** crawl the business's website → the AI proposes FAQ/knowledge entries → the owner reviews/approves them.
- **Document import:** upload documents to load into the knowledge base.

### D. Offerings / services
- Categorized **services or products** with name, price, duration, and description. The section label is renamable (e.g. "Services" → "Subscriptions" → "Menu").

### E. Business setup
- **Hours** (weekly schedule) + **closed dates**.
- **Locations:** single location (address, phone, directions) or **multi-location**, plus a **service-area** model (covered areas, out-of-area fee).
- **Booking rules:** minimum notice, buffer between appointments, max advance window, cancellation policy.
- **Timezone**, **currency** (+ optional multi-currency), country.

### F. Lead capture & contacts
- Configurable **fields to collect** from every lead (name, phone, email, plus custom fields; each toggle on/off and required/optional).
- **Contact list** with per-contact profiles, last-seen, internal notes, and a per-contact **AI on/off** toggle.

### G. Follow-ups & timing
- **Multi-step no-reply follow-ups** (automatically nudge a lead who goes quiet, on a schedule).
- **Quiet hours** (don't message between set times).
- Missed-call text-back and reactivation/nurture style sequences.

### H. Channels (all from one config)
- **WhatsApp** — connect via Meta/WhatsApp Cloud API; guided provisioning (provision / adopt an existing number / register), stores the WABA + phone number.
- **SMS** — full US **10DLC / A2P registration** flow (legal entity, EIN, campaign use-case, opt-in, HELP/STOP messages); buy / provision / release / sync numbers; works across multiple providers (Twilio, Telnyx, Bandwidth, GoHighLevel).
- **Website chat** — an embeddable widget with a copy-paste snippet and install guides for WordPress, Shopify, Wix, Squarespace, Webflow; theme (auto/light/dark). Goes "live" by real message **evidence** (a visitor round-trip), not a checkbox.
- **Email** — connect a sending domain (Resend), with DNS/records setup and an inbound address.
- **Voice** — see §I.

### I. Voice AI receptionist (premium)
- Pick from **~38 voices** (with in-app audio previews); adjustable **pace**.
- Answers **inbound calls 24/7** in the assistant's persona; **books / reschedules / cancels** live against the calendar; answers from the knowledge base; **captures caller details, logs the call + transcript**; **transfers to a human** on your rules.
- Config: greeting, transfer number/name, **interrupt** handling, silence timeout, wrap-up limit, a **call-flow script builder**, **pronunciation** overrides, and an "AI disclosure" toggle.
- Provisions a real phone number + voice agent; shows provisioning/live/pending states. (Outbound calling is **(coming)** — inbound first.)

### J. Inbox / conversations
- **Live, real-time** conversation view across all channels.
- Send messages manually; **pause the AI** on a specific contact to take over; **AI summarize** a thread.
- Edit contact profile + notes inline.

### K. Schedule / bookings
- Bookings with start/end, staff/resource, status, and captured fields.
- **Book / cancel / reschedule**; free-busy checks against the calendar.
- **Google Calendar** connect (OAuth) per person; reminders.

### L. Reporting
- Basic activity/reporting (conversations, booked, waiting) on the dashboard.

### M. Team & users
- Add **users/members** with roles; per-plan **seat limits**.
- Team members can connect their own calendar; **resources** (rooms/equipment) for scheduling.
- Invite teammates by email.

### N. Agency / multi-workspace / admin
- **Agency "god-view":** manage multiple client workspaces, **white-label** (remove LeadQ branding), pooled usage, bring-your-own LLM key.
- **Platform admin + impersonation** for support.
- Client/workspace management screens.

### O. Account & auth
- **Email + password** sign-in; password reset; invite/recovery flows; "keep me logged in."

### P. Publish, autosave & validation
- Everything is edited then **Published** (writes the live config); some screens **autosave** as you type.
- **Per-section validation** blocks publishing an incomplete required section once you're live; the config is protected against being overwritten by a bad read.

### Q. Mobile / PWA
- Installable to a phone home screen; offline app shell; always fetches the freshest app on load.

### R. Not yet live — do **not** depict as available
- **Calendar-integrations settings panel** shows "Soon" (calendar connect actually happens per-person today).
- **Instagram & Messenger** channels are visible but disabled placeholders.
- **Self-serve "add a business" / new-workspace creation** is "Contact us," not self-serve yet.
- **Outbound voice** campaigns — inbound only for now.

