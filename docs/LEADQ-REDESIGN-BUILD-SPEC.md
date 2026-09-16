# LeadQ website redesign: build spec

> **For:** Claude Code, working in the `leadq-website` repo (static HTML/CSS/JS, GitHub Pages).
> **Visual reference:** `leadq-redesign-brochure.html` (open it in a browser). It shows every page, the motion, and the photo treatment. When this spec and the brochure disagree, **this spec wins**.
> **Scope:** a design and copy change. The offer, prices, credits and add-ons do not change.

---

## 0. Read this first: locked decisions

These override `REDESIGN-BRIEF.md` and `DESIGNER-HANDOFF.md` wherever they conflict.

1. **Dark mode is the default.** Keep a working light mode behind the existing `data-theme` switch, but the site ships dark.
2. **Pricing is the credit model on the live `pricing.html`.** Three tiers: Starter, Growth, Pro. Monthly credit pools. **No Agency tier** on the site. **No conversation allowances** shown.
3. **Voice is included in Pro** and draws from the credit pool at about 220 credits a minute. Remove every mention of "300 minutes", "$0.25 a minute", or a separate $99 voice module.
4. **No sales calls, no demos, no intake.** Delete `intake.html` and replace it with a redirect to `/`. No "Book a demo", "Book a call" or "strategy session" anywhere.
5. **Every primary CTA goes to account signup at `https://app.leadq.co`.** Visitors create an account first, then choose a plan and pay inside the app.
6. **No contracts. Month to month. Cancel anytime.** Say it near purchase decisions.
7. **Salon page:** no waitlist claim. Use "reschedules in seconds" instead.

---

## 1. Copy rules (hard)

- **No em dashes or en dashes in site copy.** Use periods and commas. Before committing, grep every HTML file for `—` and `–` in visible text and fix them. Page `<title>` tags currently use `—`; change those to a pipe or a comma.
- Second person, short two-beat lines, sentence case.
- Never say "SaaS", "unlimited", "done-for-you systems", "we join your team", "90-day partnership", "strategy session", "book a call", "book a demo".
- Words to reuse: every channel, one assistant, books itself, never miss a lead, live in minutes, from your phone, answers the phone too, you stay in control, sounds like you, no contracts.
- Only describe features that exist. Do **not** mention Instagram, Messenger, outbound calling (except "on the roadmap"), app store availability, a waitlist, or self-serve multi-workspace creation.
- No invented stats. The ROI slider uses the visitor's own inputs.
- No arrow characters (`→`) appended to links or buttons.

### CTA ladder

| Button | Where | Destination |
|---|---|---|
| **Get started** (primary, blue) | Every page, nav and hero and final CTA | `https://app.leadq.co` |
| **See it work** (secondary) | Home hero | Opens the Baxter web chat widget |
| **See pricing** (secondary) | Industry pages, use cases, signup section | `pricing.html` |
| **Log in** (quiet ghost) | Nav only | `https://app.leadq.co` |
| **Get Pro** (purple) | Voice page only | `https://app.leadq.co` |

Plan buttons ("Choose Starter", "Start with Growth", "Choose Pro") also go to `https://app.leadq.co`.

---

## 2. Design direction

**Concept: "Lit by the product."** The site lives at night. The only bright things on screen are the product working: a message arriving, a booking landing, a call being answered.

Three principles:
1. **Light comes from the app.** Every glow has a source (a phone, a lit card, a call ring). No decorative gradient blobs in empty space.
2. **Each page has its own color of light.** Night base stays constant. Page hue changes (section 3.2).
3. **Depth means importance.** Four planes only: night, surface, glass, lit object. The Growth plan physically floats above the others.

What we took from the reference images:
- **Banking app (Conceptzilla):** sky-to-ink fades, a sheet sliding up over a dark hero.
- **Sereno:** one huge calm sentence for section openers and the final CTA. A "conversation line" that traces a lead to a booking.
- **Sentry IoT:** floating pill nav like an app tab bar, dashboard tiles, the dial (used on Voice).
- **superconscious:** giant outlined wordmark behind a tilted phone, dotted glowing orb, pinned corner dock.

---

## 3. Design tokens

Replace the `:root` block in `styles.css`. Dark values become the default. Move the current light values under `:root[data-theme="light"]` and `@media (prefers-color-scheme: light)` guarded with `:root:not([data-theme="dark"])`.

### 3.1 Core (dark, default)

```css
:root{
  color-scheme: dark;
  --night:#070b13;      /* page behind everything */
  --bg:#0a0f18;         /* section and window background */
  --surface:#111927;    /* cards */
  --surface-2:#0e1520;  /* quiet cards, tables */
  --raise:#152030;
  --app:#0c1622;        /* phone screen background, matches app manifest */
  --ink:#eef2f8; --ink-2:#aeb9c8; --ink-3:#7c8795;
  --line:#20293a; --line-2:#1a2230;
  --accent:#4d86ff; --accent-ink:#7ba6ff;   /* the only action color */
  --pop:#a98cf0; --pop-deep:#7b5bd6;        /* Voice only */
  --good:#37c98b; --warn:#e0ae5a;

  --display:"Instrument Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --sans:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --mono:"JetBrains Mono", "SF Mono", ui-monospace, Menlo, Consolas, monospace;

  /* elevation */
  --e1:0 1px 0 rgba(255,255,255,.04) inset, 0 1px 2px rgba(0,0,0,.4), 0 8px 24px -12px rgba(0,0,0,.6);
  --e2:0 1px 0 rgba(255,255,255,.06) inset, 0 20px 40px -20px rgba(0,0,0,.8), 0 2px 6px rgba(0,0,0,.35);
  --e3:0 1px 0 rgba(255,255,255,.08) inset, 0 60px 90px -40px rgba(0,0,0,.95), 0 24px 40px -24px rgba(0,0,0,.7);

  --wrap:1180px;
}
```

### 3.2 Page lights

Set `--c` (and optionally `--c2`) on `<body>` per page. Hero glows, pills, active tabs and photo tints read from it. Buttons never use it (blue stays the action color).

| Page | `--c` | `--c2` |
|---|---|---|
| Home | `#4d86ff` | `#38d3ff` |
| Pricing | `#2fc6e8` | `#4d86ff` |
| Voice | `#a98cf0` | `#7b5bd6` |
| Use cases | `#2dd4bf` (changes with tab) | |
| Dental | `#2dd4bf` | |
| Salons | `#f27eb4` | |
| Home services | `#f5a524` | |
| Real estate | `#7dd3fc` | |
| About | `#ffb38a` | `#4d86ff` |
| Legal | none, no glow | |

Purple (`--pop`) appears **only** on `voice.html`, on the home page voice section, and on the pricing page voice strip.

### 3.3 Type

Load from Google Fonts:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wdth,wght@75..100,400..700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
```

| Role | Font | Size / line-height | Settings |
|---|---|---|---|
| Hero headline | `--display` | `clamp(46px, 6.4vw, 88px)` / .9 | `font-stretch:78%; font-weight:600; letter-spacing:-.045em; text-wrap:balance` |
| Section headline | `--display` | `clamp(36px, 5vw, 56px)` / .96 | `font-stretch:82%; letter-spacing:-.04em` |
| Card title | `--display` | 20 to 24px / 1.15 | weight 600, `letter-spacing:-.02em` |
| Body | `--sans` | 16px / 1.6 | `--ink-2` for supporting text, max ~62ch |
| Prices and numbers | `--mono` | as needed | `font-variant-numeric: tabular-nums` |

Avoid: all-caps eyebrow labels, coloring a single word in a headline, numbered markers on content that isn't a sequence.

---

## 4. Shared components

### 4.1 Floating nav (every page)
- Sticky, `top:14px`, centered glass pill: `background:rgba(17,25,39,.6); backdrop-filter:blur(14px) saturate(1.4); border:1px solid rgba(255,255,255,.08); border-radius:999px; box-shadow:var(--e2)`.
- Contents: LeadQ wordmark (Q in `--accent`), How it works, Use cases, Pricing, Voice AI, Log in (ghost), Get started (primary).
- Current page link gets `background:rgba(255,255,255,.07)`.
- Needs `position:relative; z-index` above hero photos.
- Mobile (<620px): wordmark plus Get started plus a menu button that opens a glass sheet with the links.

### 4.2 Buttons
- Pill, `padding:11px 20px`, 14px, weight 600.
- **Primary:** `background:linear-gradient(180deg,#6b9bff,#2f6df6); color:#fff; box-shadow:0 10px 26px -10px rgba(47,109,246,.95), inset 0 1px 0 rgba(255,255,255,.35)`.
- **Ghost:** `background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1)`.
- **Voice:** `background:linear-gradient(180deg,#c3aef6,#7b5bd6); color:#150c2e`.
- Visible `:focus-visible` ring: `outline:2px solid var(--accent-ink); outline-offset:3px`.

### 4.3 Status pill
Dot with a ring, colored by `--c`: a 6px dot plus a `box-shadow:0 0 0 3px` ring at 30% of the same color.

### 4.4 Phone mockup
HTML, not images. Frame `border-radius:44px; padding:9px`, dark metallic gradient border, `box-shadow:var(--e3)`. Screen `background:var(--app); border-radius:36px`. Dynamic island. App bottom tab bar: Assistant, Inbox, Schedule, Settings. Build it as one reusable markup pattern.

### 4.5 Demo dock (every page except legal)
- Fixed bottom-right glass card: "**Talk to Baxter now**" / "He's our demo assistant. Try to book." with a white "Start chat" button.
- Clicking opens the existing web chat widget. Keep the current embed:
  `<script defer src="https://chat.leadqmail.co/w.js" data-leadq="8273801b-5b0c-48e0-8708-8fd1b3164c0e" data-autoopen="4" data-theme="dark"></script>`
- Check the widget's API for a programmatic open. If it has none, style the dock to sit beside the widget launcher, or hide the dock when the widget launcher is visible. Do not ship two competing chat bubbles.
- Consider removing `data-autoopen` if the dock makes it redundant. Ask the owner before changing it.
- Mobile: the dock collapses to a round button.

### 4.6 Photo treatment (industry imagery)
Wrapper `.ph` absolutely positioned behind content, `z-index:-1` inside an `isolation:isolate` parent.
```css
.ph img{width:100%;height:100%;object-fit:cover;filter:grayscale(.3) contrast(1.08) brightness(.62)}
.ph::before{content:"";position:absolute;inset:0;background:var(--c);mix-blend-mode:color;opacity:.38}
.ph::after{content:"";position:absolute;inset:0;
  background:linear-gradient(90deg,var(--bg) 0%,rgba(10,15,24,.9) 38%,rgba(10,15,24,.35) 72%,rgba(10,15,24,.25) 100%),
             linear-gradient(0deg,var(--bg) 0%,transparent 35%)}
```
For tiles, the fade runs bottom to top instead. The photo must never extend past its section (no negative bottom inset), or it will cover the next section.

Use the existing files `img/verticals/dental.jpg`, `salon.jpg`, `home.jpg`, `realestate.jpg`. Export WebP versions around 1400px wide and use `<picture>` with JPG fallback. Always include alt text:
- dental: "A patient in a modern dental clinic"
- salon: "A stylist working in a hair salon"
- home: "A technician on a home services job"
- realestate: "A modern home exterior for sale"

### 4.7 Segmented control (market switch)
Recessed track `background:rgba(255,255,255,.05); box-shadow:inset 0 1px 2px rgba(0,0,0,.4)`. Active segment raised with a lighter gradient and shadow. Buttons use `aria-pressed`.

### 4.8 Cards, tables, FAQ
- Cards: `border-radius:22px; background:var(--surface-2); border:1px solid var(--line-2); box-shadow:var(--e1)`.
- FAQ: native `<details>/<summary>` with a + / − indicator. No JS required.

---

## 5. Motion

One living moment per page. Everything else stays still.

| Moment | Where | Behavior |
|---|---|---|
| Live phone | Home hero | Messages appear one by one on a loop: customer, assistant, customer, typing dots, assistant, green "Booked, reminder set" card. ~3.8s pause, then restart. Phone drifts a few px (7s ease-in-out) and tilts toward the cursor (max 8°). |
| Filling calendar | Home "Every booking" section | A new booking slides into Schedule every ~6s with a brief blue glow. |
| Voice dial | Voice hero, home voice section | Ring outer ticks rotate slowly (18s). Waveform bars animate. Two expanding pulse rings on the call core. |
| Market switch | Pricing | Prices fade and slide 6px when the market changes. |
| Industry switch | Use cases hero | Photo crossfades, `--c` changes, headline swaps, schedule rows restagger. |

Requirements:
- Respect `prefers-reduced-motion: reduce`: disable all animation, show chats in their final state.
- Pause loops when off-screen (IntersectionObserver).
- No fade-up-on-scroll for every section. No hover animations on every card.

---

## 6. Pricing config (`site.js`)

Keep one config driving every price. Add credits and remove the conversation allowance and the separate voice pricing. Market detection and `localStorage` stay as they are.

```js
const CREDITS = { starter: 20000, growth: 45000, pro: 120000 }; // same in every market
const CREDIT_RATES = { conv: 80, sms: 15, wa: "included", voiceMin: 220, email: 1 }; // approximate, shown with ~
const PACK_CREDITS = { small: 10000, standard: 25000, large: 60000, bulk: 150000 };

const MARKETS = {
  US:  { label:"United States", cur:"$",   pos:"pre",  per:"/mo", hasSMS:true,  waFirst:false,
         tiers:{ starter:59,  growth:149, pro:399 },
         addons:{ number:8,    seat:15, setup:299,  a2p:99 },
         packs:{ small:25, standard:55, large:120, bulk:270 } },
  CA:  { label:"Canada",        cur:"$",   pos:"pre",  per:"/mo", hasSMS:true,  waFirst:false,
         tiers:{ starter:79,  growth:199, pro:499 },
         addons:{ number:10,   seat:19, setup:399,  a2p:null },
         packs:{ small:35, standard:75, large:165, bulk:369 } },
  UAE: { label:"UAE",           cur:"AED", pos:"post", per:"/mo", hasSMS:false, waFirst:true,
         tiers:{ starter:199, growth:549, pro:1299 },
         addons:{ number:null, seat:55, setup:1099, a2p:null },
         packs:{ small:95, standard:205, large:445, bulk:995 } },
};
```

Per-market behavior:
- **US:** note under switch: "US texting needs a one-time A2P activation. It's in the add-ons." Show A2P row.
- **CA:** note: "Canada needs no A2P registration." Hide A2P row.
- **UAE:** note: "UAE runs WhatsApp-first. No SMS line needed." Hide the SMS credit row, the extra number row and the A2P row. The Growth channel line reads "WhatsApp and web chat".

Replace the `—` placeholder that `money()` returns for null values; rows with null values should simply be hidden.

---

## 7. Pages

Each page: the floating nav, the demo dock, and the footer. Footer tagline: **"Answered. Booked. While you work."** Footer links: How it works, Use cases, Voice AI, Pricing, About, Privacy, Terms. © 2026 LeadQ Inc.

### 7.1 Home, `index.html` (light: blue into cyan)

**1. Hero.** Two columns. Left: copy. Right: tilted phone (`rotate(-7deg) rotateY(-10deg)`) in front of an outlined lowercase `leadq` wordmark (`color:transparent; -webkit-text-stroke:1px rgba(123,166,255,.2)`, ~180 to 360px) and a dotted blue orb (radial gradient plus a masked dot grid). Two small glass cards float beside the phone: "Replied / In seconds" and a green "New booking / Added to Schedule".
- Pill: One assistant. Every channel.
- H1: **Stop chasing. Start closing.**
- Body: Every message you miss is a job someone else books. LeadQ answers WhatsApp, texts, web chat, email and your phone line in seconds, then books the appointment. At midnight, on a Sunday, or while you're with a customer.
- CTAs: Get started / See it work
- Fine print: Set it up from your phone in minutes. No AI knowledge needed.
- Phone chat (SMS, contact Jane Doe): "Can I come in Thursday?" / "Thursday at 3:00 PM works. Want it?" / "Yes please" / typing / "You're booked. Reminder coming Wednesday." / card "Booked, reminder set, Thu, 3:00 PM"

**2. One brain.** Five channel chips (WhatsApp, SMS, Web chat, Email, Voice) orbit a glowing assistant core and settle into place as the section scrolls in.
- H2: **Not five tools. One assistant.**
- Body: Most businesses juggle a chat widget, a texting app, an inbox, a booking tool and a voicemail box, and still drop messages. LeadQ is one assistant that knows your business and works every channel the same way.
- Change it once: Update your hours or add a service, and every channel knows. The phone too.
- Sounds like you: Warm, brisk, formal, luxe. Pick a tone and it talks like your front desk.
- Hands off on your rules: Decide when a person takes over, and what it should never say.

**3. What it does.** Dashboard tiles, each a live slice of app UI (keep the existing calendar, channels list, pause sheet and contact card mockups, restyled dark).
- H2: **Runs the whole conversation. And the booking.**
- Books into your calendar: Checks real availability, respects your booking rules, books and reminds.
- Follows up for you: A lead goes quiet, it nudges them on a schedule. Never during your quiet hours.
- Texts back missed calls: Can't pick up? They get a text right away, so the lead stays warm.
- You're always in control: Pause it on one channel or all of them. For an hour, or until you say so.
- Contacts, ready at a glance: Every detail and an AI summary of the chat, before you ever pick up the phone.
- Learns from your website: It reads your site and suggests answers. Nothing goes live until you approve it.

**4. Inside the app.** A light app sheet slides up over the dark background (banking reference). Show the Schedule screen and a booking detail (keep the existing Rivera Dental data).
- H2: **Every booking, in your pocket.**
- Body: It's a real app, not a chat widget. Your calendar fills itself, and every booking keeps the whole story behind it: the reason, the details, and the conversation that led there.
- Your calendar fills itself: Bookings land grouped by day, reminders already sent.
- Nothing gets forgotten: Open any appointment to see what they told your assistant.
- On your home screen: Add LeadQ to your phone like any app. Your whole team can log in.

**5. Voice teaser.** Page light shifts to purple. Breathing call ring plus four voice name chips (Ava, Noah, Mia, Sarah).
- H2: **Then it picks up the phone too.**
- Body: A receptionist that sounds human, takes the calls you can't, books the job, and warm-transfers to you when it matters. No more voicemail.
- CTA (purple): Meet the AI Receptionist, links to `voice.html`

**6. How it works.** Three steps connected by a conversation line (SVG path) that draws once when in view. Keep the existing step mockups.
- H2: **Live in minutes, from your phone.**
- 1. Paste your website: It drafts your FAQ, services and prices. You approve.
- 2. Connect your channels: WhatsApp, text, web chat and email. We guide you through SMS registration.
- 3. It answers and books: With reminders and follow-ups built in. You watch it work.

**7. Outcomes.** Three quiet cards, big type, no decoration.
- H2: **Time saved. Costs down. Sales never missed.**
- Answers in seconds: 24/7, so no lead waits for a callback.
- Costs less than a shift: Plans start at $59 a month. No receptionist hours to cover. *(Price must come from the config for the visitor's market.)*
- Books itself: Straight into your calendar, while you do the actual work.

**8. Pricing preview.** Three plan cards with the market switch (same component as pricing page). Growth floats.
- H2: **One recovered lead covers the month.**
- Body: Every plan includes the full assistant and a monthly credit pool that covers every channel. Pick the one that fits today and move up when you're ready.
- CTAs: Start with Growth / See all plans

**9. FAQ.**
- H2: **Questions, answered.**
- *What's a credit?* Credits are how LeadQ measures usage. AI conversations, texts, calls and email all draw from one monthly pool, so you never see a separate phone or WhatsApp bill. Run low and you top up in one tap.
- *Is there a contract?* No. Plans are month to month, and you can cancel whenever you want from inside the app.
- *Do I need to register for texting?* In the US, business texting needs A2P registration. We guide you through it inside the app. Canada doesn't need it, and the UAE runs on WhatsApp instead.
- *Can I keep my WhatsApp number?* Yes. Connect a new number or bring the one your customers already message.
- *Can I take over a conversation?* Any time. Pause the assistant for one contact or a whole channel, reply yourself, then hand it back.

**10. Signup section.** Two columns: copy left, a lit card right listing the path.
- Pill: From click to live
- H2: **Create your account. Your assistant is minutes away.**
- Body: Sign up, paste your website, and watch it draft your FAQ and services. Pick your plan inside the app when you're ready to go live.
- CTAs: Get started / See pricing
- Fine print: Set it up from your phone. No contracts, cancel anytime.
- Path card: 1. Create your account (app.leadq.co) / 2. Paste your website / 3. Approve your answers / 4. Choose a plan and subscribe / 5. Connect channels, go live (each tagged "In the app").
- ⚠️ Confirm this order matches real onboarding before shipping.

**11. Final CTA.** One sentence over a horizon glow (Sereno reference). One button.
- H2: **Your next lead isn't going to wait.**
- Body: Set up your assistant in minutes, from your phone.
- CTA: Get started

### 7.2 Pricing, `pricing.html` (light: ice)

Remove the current "Pick a plan — the whole spec is right here." heading (em dash) and the in-page app dashboard mock.

- H1: **Plans, priced for your market.**
- Body: Every plan includes the full assistant and one credit pool for all your usage. Shown in your local currency, never a conversion.
- Market switch plus per-market note (section 6).

**Plan cards** (three columns, max ~900px wide, Growth raised 10px with blue ring, colored shadow and "Most popular" flag):

| | Starter | Growth | Pro |
|---|---|---|---|
| Tagline | Solo, or just trying it out | The main plan for a growing business | Established, multi-channel, with voice |
| Price | from config | from config | from config |
| Lines | 20,000 credits a month · 1 seat, 1 channel · Assistant, FAQ and lead capture | 45,000 credits a month · 3 seats, 1 phone number · WhatsApp, SMS and web chat · Booking, calendar and reminders · Follow-ups, custom fields, profiles · Basic integrations and analytics | 120,000 credits a month · 10 seats, 2 phone numbers · All channels · AI voice receptionist · Support mode: troubleshooting, vision, tickets · Integrations, analytics, API · Remove LeadQ branding |
| Button | Choose Starter | Start with Growth (primary) | Choose Pro |

(Middle dots above are only table separators; render each as its own list item.)

Under the plan buttons: *Create your account, then subscribe inside the app. No contracts, cancel anytime.*

Keep a full comparison table below the cards, with the existing rows restyled.

**Voice strip** (purple): round gradient disc · "**AI Receptionist, part of Pro**" · "The same assistant answers the phone, books live and captures every missed call. Inbound first, outbound later." · right side "Included / About 220 credits a minute".

**Credits card:** H "One credit pool for everything". Rows: AI conversation (a thread in a 24 hour window) ~80 · Text message (per segment) ~15, hidden in UAE · WhatsApp reply (in window) Included · Voice minute ~220 · Email ~1. Footnote: So Growth's 45,000 credits is around 550 AI conversations, or any mix of texts, calls and email.

**Top-ups card:** H "Top up anytime. Credits roll over." Rows: Small 10,000 credits · Standard 25,000 · Large 60,000 · Bulk 150,000, with prices from config.

**Add-ons card:** H "Add-ons. Four extras, that's the whole menu." Rows: Extra phone number (monthly) · Extra seat (monthly) · Done-for-you setup and knowledge base load (one-time, if you'd rather we set it up) · SMS activation, A2P (one-time, US only).

Bottom line: *Month to month. No contracts, cancel anytime. Credits cover every channel and roll over.*

### 7.3 Voice, `voice.html` (light: purple)

Background `radial-gradient(70% 60% at 50% 30%, rgba(123,91,214,.35), transparent 70%), #0d0b1c`. Nav CTA becomes purple "Get Pro".

**Hero.** Left copy, right the dial: SVG ring (r=150, 22px track at 7% white, 16px gradient arc `#e3d8ff` to `#7b5bd6` ~65% filled with a blurred glow copy behind), slowly rotating tick marks, white knob at the arc end, dark inset center disc with "Live call / Answered by Baxter" and animated waveform.
- Pill: AI Receptionist, part of Pro
- H1: **The same assistant. Now it picks up.**
- Body: It answers every inbound call in your assistant's persona and voice, books live against your real calendar, and hands off to you on your rules. No more voicemail.
- Voice chips: Ava, Noah, Mia, Sarah (tap to preview if audio samples exist; otherwise visual selection only)
- Call transcript card: 00:02 "Hi, do you have any openings tomorrow?" / 00:05 Baxter: "We do. I can offer 9:30 AM or 2:00 PM. Which works best?" / 00:11 "2 o'clock is perfect." / 00:14 Booked for tomorrow at 2:00 PM, and confirmed by text.
- Stat row: **Pro** Included, runs from your credit pool · **~40** Voices across accents · **24/7** Every inbound call answered

**Pick a voice.** App-style picker (accent tabs American, British, French; Standard: Ava, Noah, Mia; Premium: Sarah, Brian, Alice; pace: Slower, Natural, Brisk).
- H2: **Choose a voice your callers will trust.**
- Body: Nearly 40 voices across American, British and French accents, standard and premium. Preview any of them in the app, set the speaking pace, and you're done. It's the one thing you can't judge from words on a page, so press play.

**On the call.** Six tiles.
- H2: **A receptionist that never misses.**
- Answers 24/7: Every inbound call, in your persona and your chosen voice.
- Books live: Books, reschedules and cancels against your real calendar.
- Knows your business: Answers from the same knowledge base as your texts.
- Captures the caller: Their details, the call log, and the full transcript.
- Transfers to you: A warm handoff whenever your rules say so.
- Handles real calls: Interruptions, silences, tricky names, and your call flow.

**One brain.** A text thread and a call transcript side by side, sharing the same booking.
- H2: **Not a second robot.**
- Body: It's the same assistant. It just answers the phone too. Change your hours once and the phone knows. Add a service and it can quote the duration on a call that same afternoon.

**Close.**
- H2: **Stop sending callers to voicemail.**
- Body: The AI Receptionist comes with Pro and runs from the same monthly credit pool as your texts. A call uses about 220 credits a minute, since it costs more than a message. Right now it answers your calls. Outbound calling is on the roadmap.
- CTAs: Get Pro (purple) / See all pricing

### 7.4 Use cases, `use-cases.html` (light: changes with industry)

**Hero with industry switcher.** Photo fills the hero behind the copy (section 4.6). Right side: phone showing Schedule. Tabs change photo, `--c`, pill, headline, body and the three schedule rows together. Default to Dental. No need to remember the choice between visits.

| Tab | `--c` | H1 | Body | Schedule rows (time, name, detail, status) |
|---|---|---|---|---|
| Dental and clinics | `#2dd4bf` | Built for how clinics actually work. | It answers every call, books the chair, and reminds them the day before. Even while you're with a patient. | 10:00 Marcus Bell, Consultation, Sarah, Booked, reminder sent · 2:30 Jane Doe, Cleaning, Dr. Rivera, Booked · 4:00 Priya Nair, New patient, Dr. Rivera, Booked |
| Salons | `#f27eb4` | Built for how salons actually work. | It replies to every call and text, books the seat, and confirms the day before. Even mid-cut. | 11:00 Chloe Tan, Balayage, Mia, Booked, reminder sent · 1:30 Aria West, Cut and color, Jordan, Booked · 3:00 Sam Cole, Men's cut, Riley, Booked |
| Home services | `#f5a524` | Built for how trades actually work. | It picks up every call, books the visit, and captures the job details. Even while you're on a roof. | 8:00 Dana Ruiz, AC tune-up, Dave, Booked, reminder sent · 11:30 Owen Park, Furnace repair, Miguel, Booked · 2:00 Nina Blake, On-site estimate, Dave, Booked |
| Real estate | `#7dd3fc` | Built for how agents actually work. | It answers new leads in seconds, books the showing, and qualifies the buyer. Even while you're at a closing. | 9:30 Liam Ford, Showing, 14 Oak St, Booked, reminder sent · 12:00 Sofia Reyes, Buyer call, Ana, Booked · 4:30 Noah Kim, Listing visit, 8 Elm Ave, Booked |

CTAs: Get started / See pricing

**Industry tiles.** H2: **See it set up for your world.** Four tall tiles, photo on top fading into the card, each with its own `--c`. Subtle photo zoom on hover is the one allowed hover motion.
- Dental and clinics: Fill chairs, cut no-shows
- Salons: Reply while your hands are full
- Home services: Book jobs from the field
- Real estate: Answer leads in seconds
- Link text: Explore, with a round `--c` colored + badge

**Beyond four.** H2: **If you book appointments, it fits.** Body: It learns any business the same way. These are just the ones we hear from most. Chips: Dental, Med spas, Chiro and physio, Salons, Barbershops, HVAC, Plumbing, Electrical, Cleaning, Real estate, Fitness studios, Auto shops.

Keep the existing "The same problems, in every trade." without/with comparison, restyled (section 7.5 pattern).

### 7.5 Industry pages (one template, four pages)

Template, top to bottom:
1. **Hero:** photo full-bleed behind, fading to night on the left where the copy sits. Pill, H1, body, CTAs Get started / See pricing. Optional phone on the right with that industry's schedule rows (from 7.4).
2. **Difference:** H2 plus "Without LeadQ" (grey dash bullets) and "With LeadQ" (`--c` dot bullets, tinted card).
3. **ROI slider** (dental and home services at minimum): "Missed calls and messages per week" (1 to 60, default 10) and "Average value of a new [patient / customer / job / client]" (50 to 1500 step 50, default 250). Output "Revenue at stake each month" = weekly × value × 52 ÷ 12, rounded, in the visitor's currency symbol. Footnote: Your numbers, not ours. Weekly figure times 52, divided by 12.
4. **FAQ** (5 questions, existing ones restyled, edits below).
5. **Closing CTA** plus links to the other three industries.

**`for-dental.html`** (`#2dd4bf`)
- Pill: For dental and aesthetic clinics
- H1: **The receptionist your practice never has to train.**
- Body: It answers every call and message, books the chair, confirms the day before, and captures new patients while you're with a patient. On WhatsApp, text, web chat and the phone.
- H2: **A front desk that never goes to voicemail.**
- Without: The phone rings mid-procedure / No-shows leave empty chairs / New patients call after you've closed
- With: Answered while you're with a patient / Confirmations and reminders cut no-shows / New patients booked at 11pm
- FAQ: keep the current five. *Will it cut no-shows?* It confirms every booking and sends a reminder the day before, which is where most no-shows disappear. *Will it sound like our practice?* It learns your services, policies and tone, so replies read like your front desk, not a generic bot. *Does it book new patients after hours?* Yes, 24/7. It books them on the spot, straight into your calendar.
- Close: **Fill more chairs. Answer every patient.**

**`for-salons.html`** (`#f27eb4`)
- Pill: For salons and barbershops
- H1: **Books while your hands are full.**
- Body: It answers every call and text, books the seat, reschedules in seconds, and confirms the day before. So you can keep cutting.
- H2: **Never miss a booking mid-cut.**
- Without: You can't text back mid-cut / Last-minute changes blow up the day / Missed calls become missed bookings
- With: Replies while your hands are full / Reschedules in seconds / Answers every call and text, and books it
- FAQ: **remove "Does it fill last-minute cancellations?"** Keep: *Can it reply while I'm with a client?* Yes. It handles the whole conversation on WhatsApp, text and web chat and books it, so you never stop mid-cut. *Can I still jump in myself?* Any time. Pause it on a channel, reply yourself, and switch it back on. *Will it take bookings after hours?* (existing) *How long does setup take?* Minutes from your phone. It learns your services and prices from your website, and you approve before it goes live.
- Close: **Keep every chair full.**

**`for-home-services.html`** (`#f5a524`)
- Pill: For home services
- H1: **Answers while you're on the job.**
- Body: HVAC, plumbing, electrical, cleaning and more. It picks up every call, books the visit, answers after-hours emergencies, and captures what you need to quote.
- H2: **Win the job without leaving the ladder.**
- Without / With: keep existing.
- FAQ edits: *Does it answer emergencies after hours?* Yes, 24/7. It gets the details, books the visit, and hands urgent jobs to you on your rules. *Which channels does it cover?* WhatsApp, text and web chat, plus your phone line on the Pro plan. One assistant across all of them.
- Close: **Book more jobs. Miss fewer calls.**

**`for-real-estate.html`** (`#7dd3fc`)
- Pill: For real estate
- H1: **Answers leads before they go cold.**
- Body: It replies to new enquiries in seconds, books the showing around your day, qualifies the buyer, and follows up. No lead waits while you're at a closing.
- H2: **Be first to every lead, every time.**
- Without / With: keep existing.
- FAQ edits: *Does it qualify buyers?* It asks the questions you set, like budget, timeline and pre-approval, and logs the answers before you call. *Will it sound like me?* It learns your voice and your listings, so replies feel personal, not automated. (Remove the parentheses from the current version.)
- Close: **Never lose a lead to a slow reply.**

### 7.6 About, `about.html` (light: dawn)

- Pill: About LeadQ
- H1: **One app, instead of five tools and a front desk.**
- Body: LeadQ is one AI assistant for your whole business. It answers WhatsApp, SMS, web chat, email and your phone line, and it books the appointment while you work.
- **Founders:** `RobBusiness.png` and `AmrBusiness.png` in glass frames (10px padding, 26px radius, `--e3` shadow), rotated -3° and 3°. Caption: Rob, Co-founder / Amr, Co-founder.
  - Export to WebP around 520px wide (targets under 60KB). The originals are ~8MB.
  - **Crop the bottom ~10% of both photos.** They carry a small AI-generator sparkle watermark in the bottom-right corner.
- **Why we built it.** H2: **Every missed message is a job someone else books.** Body: Local businesses lose real money in the gap between a customer reaching out and someone getting back to them. It happens at midnight, on a Sunday, and in the twenty minutes you were with another customer. Missed calls and unread texts don't add up to lost messages. They add up to lost bookings.
- **What we believe.** H2: **You shouldn't need five tools to answer a customer.** Body: Most small teams stitch together a chat widget, a texting app, an inbox, a booking tool and a receptionist, and still drop messages. It should be one assistant that knows your business, speaks in your voice, and works every channel the same way. So that's what we built.
- **What LeadQ is.** H2: **An app you run yourself.** Body: Not an agency. Not a service you wait on. You set it up from your phone in minutes, it learns your services and your tone, and it starts answering. You stay in control, and you can jump into any conversation whenever you want.
  - Every channel: WhatsApp, SMS, web chat, email, and your phone line on Pro.
  - Books the work: Checks real availability, books, reschedules and reminds.
  - Sounds like you: Replies read like your business, not a bot.
  - CTAs: Get started / See it for your industry

### 7.7 Legal, `privacy-policy.html` and `terms-of-service.html`

- **Do not change any legal text.**
- No page glow. Single readable column (max ~68ch), 15 to 16px body.
- Sticky left contents rail generated from the H2s, highlighting the current section (IntersectionObserver). On mobile it becomes a horizontal scroll row.
- No demo dock on legal pages.

### 7.8 Remove

- `intake.html`: replace with a meta refresh and JS redirect to `/`, `<meta name="robots" content="noindex">`.
- Remove intake from `sitemap.xml` and any internal links.
- Remove Agency from any visible pricing UI.

---

## 8. Technical requirements

- Stay static. No framework, no build step required. Vanilla JS.
- Update `<title>` and meta descriptions to remove em dashes, e.g. `LeadQ | One AI assistant for every channel`.
- Update `theme-color` meta to `#0a0f18`.
- Responsive breakpoints: 980px (two columns to one) and 620px (nav collapses, tiles to one column). No horizontal scroll at 360px.
- Wide content (tables) scrolls inside its own `overflow-x:auto` container.
- Accessibility: visible focus rings, `aria-pressed` on toggle groups, alt text on all photos, color contrast AA on body text, `<details>` for FAQ.
- Performance: glows are CSS gradients, phones are HTML. Lazy-load below-fold images. WebP with JPG fallback. Preload the display font.
- `backdrop-filter` needs the `-webkit-` prefix for Safari.
- Keep existing analytics, OG tags and the chat widget embed.

## 9. Acceptance checklist

- [ ] `grep -rn "—\|–" *.html` finds nothing in visible copy
- [ ] No text anywhere says Book a demo, Book a call, strategy session, unlimited, Agency, 300 minutes, $0.25
- [ ] Every primary CTA links to `https://app.leadq.co`
- [ ] All prices render from `site.js` and match section 6 in US, CA and UAE
- [ ] UAE hides SMS credit row, extra number and A2P; CA hides A2P
- [ ] Purple appears only on Voice surfaces
- [ ] `intake.html` redirects to `/`
- [ ] Industry photos visible on use cases hero, tiles and all four industry page heroes
- [ ] Founder photos cropped (no watermark) and under 60KB each
- [ ] Works with `prefers-reduced-motion`
- [ ] Light mode still works via `data-theme="light"`
- [ ] Only one chat launcher visible at a time
