# LeadQ — Website Redesign Handoff Pack

> **What this is:** a single, self-contained context pack to hand a website designer (human or a
> Claude design assistant) so it understands LeadQ before designing a new marketing site. It
> covers what the product/app does, the current website and its design, brand + voice, pricing,
> and an inventory of the visual assets to attach.
>
> **How to use it:** read this end to end first. The reader will *also* be given external website
> references to draw from — the goal is to take the best of those **while staying true to LeadQ's
> product truth, brand voice, pricing, and visual identity defined here.** Where an external
> reference conflicts with a hard rule in §4 or §11, this document wins.
>
> **Companion file:** `REDESIGN-BRIEF.md` (same folder) is the deeper canonical product/positioning
> brief; this handoff folds in its essentials and adds the current-site snapshot + asset inventory.

---

## 1. What LeadQ is

**One AI assistant for a whole small business.** It answers WhatsApp, SMS, website chat, email, and
the phone, captures every lead, books appointments, and handles support — 24/7. The business owner
sets it up themselves in minutes and pays a monthly subscription plus metered usage.

- **One-liner:** *the affordable, self-serve AI receptionist + assistant for small businesses,
  across every channel, in one place.*
- **The model pivot (important):** the site sells the **self-serve app** (`app.leadq.co`) — a
  product you configure and subscribe to. LeadQ is **no longer** sold as a done-for-you agency /
  90-day managed service; that survives only as an optional **setup add-on**. Any "we join your
  team / done-for-you systems / strategy session" framing is retired.
- **Live product:** the app exists today at `app.leadq.co` (recently also planned for iOS/Android
  as a sign-in companion; **not** yet in the stores — don't imply app-store availability).

---

## 2. What the app actually does (depict it accurately)

The real product is a mobile-first, phone-framed PWA (single-page app). One assistant, configured
once, working across every channel. Screen-level inventory (pulled from the app code):

**Setup surface (the "Assistant" dashboard):**
- **Persona** — name, tone (7 presets: Warm, Brisk, Formal, Playful, Luxe, Reassuring, Bold, or
  free-text), primary goal (book / answer / capture leads) + secondary goals, global greeting and
  **per-channel opening messages** (WhatsApp / SMS / web chat, with `{firstname}`-style tokens, now
  also **per lead source**), behavior rules, never-say list, human-handoff rules, an AI on/off
  master switch.
- **Knowledge base** — about/business info + FAQ + photos; **AI suggests knowledge** by crawling
  the business's website for owner approval; document import.
- **Offerings** — categorized services/products (name, price, duration); the label is renamable
  (Services / Menu / Subscriptions / …).
- **Business setup** — weekly hours + closed dates; single or multi-location + service-area model;
  booking rules (min notice, buffer, max advance, cancellation); timezone, currency.
- **Lead capture** — configurable fields to collect (on/off + required), custom fields.
- **Follow-ups & timing** — multi-step no-reply follow-ups, quiet hours, missed-call text-back.

**Channels (all from one config):**
- **WhatsApp** (Meta Cloud API, guided provisioning), **SMS** (full US 10DLC/A2P flow; Twilio /
  Telnyx / Bandwidth / GoHighLevel), **website chat** (embeddable widget with snippet + install
  guides for WordPress/Shopify/Wix/Squarespace/Webflow; goes live by real message evidence),
  **email** (Resend sending domain + inbound), **voice** (see below).

**Voice AI Receptionist (premium module):**
- ~38 selectable voices with in-app previews, adjustable pace. Answers inbound calls 24/7 in the
  assistant's persona; books/reschedules/cancels live against the calendar; answers from the KB;
  captures caller details + logs call/transcript; transfers to a human on rules. Call-flow script
  builder, pronunciation overrides, AI-disclosure toggle. **Inbound only for now.**

**Operate:**
- **Inbox** — live real-time conversations across every channel; send manually, pause the AI on a
  contact to take over, AI-summarize a thread, edit contact + notes inline.
- **Schedule** — bookings (start/end, staff/resource, status, captured fields); book/cancel/
  reschedule with free-busy checks; **Google Calendar** OAuth per person; reminders.
- **Team** — members + roles + per-plan seat limits; per-person calendars; resources (rooms/
  equipment); email invites.
- **Reporting** — dashboard stats (Conversations / Booked / Waiting).
- **Agency/admin** — multi-client "god-view", white-label (remove LeadQ branding), pooled usage,
  bring-your-own LLM key; platform admin + impersonation.
- **Billing** — subscription + credits, managed in-app (web) via Stripe; cancel or close workspace.
- Everything is **edited then Published**; some screens autosave; per-section validation.

**Do NOT depict as available (stubs / coming):** Instagram & Messenger channels (disabled
placeholders), outbound voice campaigns, self-serve "add a new business/workspace" (currently
"Contact us"), and a standalone calendar-integrations panel (calendar connect is per-person today).

**The headline capability to show:** it's genuinely **multi-channel from one config** — the same
assistant answers a text and a phone call with the same knowledge and the same calendar. Truest
hero visuals: a phone showing a live WhatsApp/SMS **booking conversation**, a **voice call being
answered and booked**, and a **calendar filling itself**.

---

## 3. The current website (the starting point)

Live at **leadq.co** (repo: `leadq-website`, static HTML/CSS/JS, deployed on GitHub Pages via
`CNAME`). This is the **recent light-first rebuild** — the old dark glassmorphic agency site is
retired. It is clean and functional but the redesign is meant to level it up.

**Pages that exist today:**
| Page | File | Purpose |
|---|---|---|
| Home | `index.html` + `home.js` | Hero + how-it-works + channels + ROI + CTA; the live interactive demo lives here |
| Pricing | `pricing.html` + `site.js` | Four tiers + market switch (US/CA/UAE) + usage + add-ons + voice |
| Voice | `voice.html` | The Voice AI Receptionist module (purple/premium treatment) |
| Use cases | `use-cases.html` | Cross-vertical |
| Verticals | `for-dental.html`, `for-salons.html`, `for-home-services.html`, `for-real-estate.html` | Per-ICP landing pages |
| About | `about.html` | Founders (Rob + Amr) |
| Intake | `intake.html` | Lead/onboarding form |
| Legal | `privacy-policy.html`, `terms-of-service.html` | |

**Current home page section flow (real headlines — the current copy voice):**
1. Hero — *"Stop chasing."* + CTA **Get started**
2. *"Not five tools. One assistant."*
3. *"Runs the whole conversation. And the booking."*
4. *"Every booking, in your pocket."*
5. *"Then it picks up the phone too."* (voice)
6. *"Live in minutes, from your phone."*
7. *"Time saved. Costs down. Sales never missed."*
8. *"One recovered lead covers the month."*
9. Final CTA — *"Your next lead isn't going to wait."* + **Get started**

**Interactive demo:** the current site has a live "text/call the AI" demo — this is the single best
proof asset. **Keep and feature it** in any redesign.

---

## 4. Brand voice & copy rules

- **Punchy, plain, product-led, second person.** Short two-beat lines. Speak to outcomes, not
  features. ("One recovered lead covers the month.")
- **⚠️ HARD RULE — no em-dashes / long dashes.** The owner reads them as an AI tell. Use periods and
  commas, short human sentences. (This document uses them for editorial clarity; the *site copy*
  must not.)
- **Self-serve CTAs:** "Get started", "Start free", "See it work", "Try the demo". "Book a demo" is
  secondary only. Avoid agency-era CTAs like "Book a strategy session".
- **Reusable vocabulary:** "every channel", "one assistant", "books itself", "24/7", "never miss a
  lead", "live in minutes", "answers the phone too".
- **Retired phrasing (do not use):** "we join your team", "done-for-you systems", "90-day
  partnership". Done-for-you is an add-on, not the pitch.
- Never say "SaaS" as a label.

---

## 5. Visual system & design tokens (confirmed live in `styles.css`)

A **clean, light-first product look with a real dark mode.** Blue primary, purple reserved for
Voice, system fonts, mono for numbers, rounded cards, soft shadows. Use these exact tokens as the
baseline (the redesign can evolve them, but this is LeadQ's current identity):

**Light (default):**
```
--bg:#f6f8fb;  --surface:#ffffff;  --surface-2:#eef2f8;  --raise:#ffffff;
--ink:#0f1520;  --ink-2:#454f5f;  --ink-3:#78828f;
--line:#e2e8f1;  --line-2:#eaeff6;
--accent:#2f6df6;  --accent-ink:#215ad6;  --accent-soft:rgba(47,109,246,.10);
--good:#158a58;  --warn:#a86a12;
--pop:#7b5bd6;  --pop-ink:#5f45a8;  --pop-soft:rgba(123,91,214,.10);   /* purple = Voice only */
--shadow:0 1px 2px rgba(16,24,40,.04), 0 8px 24px -12px rgba(16,24,40,.14);
--radius:14px;  --radius-lg:16px;  --wrap:1080px;
```
**Dark:**
```
--bg:#0a0f18;  --surface:#111927;  --surface-2:#0e1520;  --raise:#152030;
--ink:#eef2f8;  --ink-2:#aeb9c8;  --ink-3:#78838f;
--line:#20293a;  --line-2:#1a2230;
--accent:#4d86ff;  --accent-ink:#7ba6ff;  --pop:#a98cf0;  --pop-ink:#c3aef6;
--good:#37c98b;  --warn:#e0ae5a;
```
- **Type:** system sans (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial`);
  **mono** (`SF Mono, ui-monospace, JetBrains Mono, Menlo, Consolas`) with **tabular numerals** for
  all prices/stats. Big headings, tight tracking (`letter-spacing:-.02em`), `text-wrap:balance`.
- **Layout:** 1080px max width; sticky blurred nav; light/dark via `data-theme` + `prefers-color-scheme`.
- **Components:** pill chips, dot-bullets with an accent ring, feature cards with hairline borders +
  soft shadow; the "Most popular" plan (Growth) gets an accent ring + flag. **Purple (`--pop`) is
  reserved for the Voice module** so it reads as premium — don't use it elsewhere.
- **Logo:** wordmark "LeadQ" with the **Q in accent blue**; mark files `leadq-logo.png` /
  `GearLogo.png`. Standardize logo sizing (the old site was inconsistent).

---

## 6. The app's own visual identity

The app (`app.leadq.co`) is a **phone-framed, mobile-first** product UI with its own look, skewing
**dark navy** — manifest `theme_color` / `background_color` = **`#0C1622`**. It uses cards, pill
chips, a four-tab bottom nav (Assistant / Inbox / Schedule / Settings), and a responsive desktop
layout above 1024px. When the site shows "the product", these are the screens to render in device
mockups. The app's full palette/CSS lives in `leadq-app/index.html` if pixel-accurate mockups are
needed.

---

## 7. Pricing (full — the core of the site)

Four tiers, priced **in local currency per market, never a raw FX conversion**, with a market
switcher (default to the visitor's market). Numbers are **launch anchors to validate**, present as
the intended structure.

| Tier | For | US /mo | CA /mo | UAE /mo | Included | Seats |
|---|---|---|---|---|---|---|
| **Starter** | Solo / trying it | **$59** | **$79** | **199 AED** | 250 AI conversations | 1 |
| **Growth** ⭐ *Most popular* | Growing SMBs (the anchor plan) | **$149** | **$199** | **549 AED** | 1,000 conv · 1 number | 3 |
| **Pro** | Established, multi-channel + support | **$399** | **$499** | **1,299 AED** | 5,000 conv · 2 numbers | 10 |
| **Agency** | Resellers / white-label | **$499+** | **$649+** | **1,799 AED+** | Pooled usage · ∞ workspaces | ∞ |

**What climbs the ladder:** Starter = 1 channel + persona/FAQ/lead capture. Growth = WhatsApp + SMS
+ web chat, booking/calendar/reminders, follow-ups/custom fields/profiles. Pro = all channels +
support mode (troubleshooting KB, image/vision, tickets), integrations/analytics/API, remove "Powered
by LeadQ". Agency = god-view multi-client, white-label, BYO LLM key.

**Metered usage (billed as "LeadQ credits", never a Twilio/Meta line item):**
| Unit | US | CA | UAE |
|---|---|---|---|
| AI conversation (core) | $0.05 | $0.07 | 0.20 AED |
| SMS segment (US/CA) | $0.04 | $0.05 | n/a |
| WhatsApp conversation (24h) | $0.10 | $0.12 | 0.40 AED |
| Dedicated number | 1 incl., then $8/mo | 1 incl., then $10/mo | WhatsApp-based |

**Credit top-up packs:** US $25/$55/$120/$270 · CA $35/$75/$165/$369 · UAE 95/205/445/995 AED
(small / standard / large / bulk).

**Add-ons (five max):** extra number ($8/$10/n-a mo) · conversation pack +1,000 ($29/$39/109 AED mo)
· extra seat ($15/$19/55 AED mo) · done-for-you setup ($299/$399/1,099 AED once) · SMS activation
A2P (US only, $99 once).

**Voice AI Receptionist module:** US $99 · CA $129 · UAE 349 AED /mo, **300 minutes included**,
overage ≈ $0.30 CAD/min. Purple/premium treatment.

**Pricing-page principles:** price local (no FX), sell credits not vendor bills, four tiers + five
add-ons + voice module (legibility is the point), anchor on Growth as "most popular". UAE is
**WhatsApp-first (no SMS/A2P)**; Canada needs no A2P; US does (that's the one-time A2P add-on).

---

## 8. Audience & markets

**ICP:** small businesses with high inquiry volume, high value per lead, and painful no-shows —
where one saved lead pays for the plan. Lead verticals: **clinics/healthcare, salons/spas/med-spas,
home services (roofing/HVAC/cleaning), real estate**, plus any appointment-driven local business.
Write to a busy owner/operator who misses calls and leads because they're doing the actual work.
**Markets:** US, Canada, UAE (UAE is WhatsApp-first).

---

## 9. Asset inventory (attach these to the designer)

All paths relative to the repos noted. **Flag:** the founder photos are ~8MB each — optimize before
web use.

**`leadq-website/` (marketing brand assets):**
| File | What it is | Notes |
|---|---|---|
| `leadq-logo.png` (18KB) | Primary LeadQ logo/wordmark | Q in accent blue |
| `GearLogo.png` (2.6MB) | Gear mark variant of the logo | Large; export smaller sizes |
| `og-image.png` (140KB), `LeadQOpenGraph.png` (749KB) | Social/Open-Graph share images | |
| `img/verticals/dental.jpg`, `salon.jpg`, `home.jpg`, `realestate.jpg` | Vertical/ICP photography | Used on the per-vertical pages |
| `RobBusiness.png`, `AmrBusiness.png` (~8MB each) | Founder photos (Rob, Amr) | About page; heavy, optimize |

**`leadq-app/` (product/app identity):**
| File | What it is | Notes |
|---|---|---|
| `logo-app.png` | In-app logo | |
| `logo-email.png` | Email/logo lockup | |
| `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | App/PWA icons | |
| `manifest.webmanifest` | App theme colors | `#0C1622` dark navy |

**Design source of truth:** `leadq-website/styles.css` (live tokens), `leadq-website/site.js`
(pricing config), and this pack.

---

## 10. Suggested structure & what to keep

Reference flow (from the canonical brief): Hero (multi-channel assistant, live demo / phone mock,
"Start free") → How it works (set persona → connect channels → it books) → Channels (WhatsApp/SMS/
web/email/voice, one config) → Use-cases by vertical → **Voice AI Receptionist** block (purple,
premium) → Pricing (four tiers + market switch + usage/add-ons) → Proof/results → FAQ (usage/credits,
A2P, WhatsApp, cancel anytime) → final CTA.

**Carry over from the current site:** the interactive text/call demo, the market switcher, the
light-first + dark-mode system, the blue/purple identity, and the multi-channel hero concept.

---

## 11. Guardrails (don't misrepresent)

- **Usage is metered** (conversations / SMS / WhatsApp / voice minutes) — bundled allowance + credits,
  never "unlimited".
- **Agency = reseller/white-label**, not a support level. Don't market it to end SMBs.
- **Voice is inbound-first** — no outbound campaign promises.
- **Prices are launch anchors** — the intended structure, final numbers are the owners' call.
- **Only advertise what exists** — see §2 "do not depict". No app-store availability yet.
- **No em-dashes**, no "SaaS", purple only for Voice.

---

## 12. Sources
Pulled 2026-09-15 from: `leadq-website/` (`REDESIGN-BRIEF.md`, `styles.css`, `site.js`, `index.html`,
page set) and `leadq-app/` (`index.html`, `manifest.webmanifest`, icons). `REDESIGN-BRIEF.md` is the
deeper canonical product brief; this handoff is the designer-facing consolidation plus the current-site
snapshot and asset inventory.
