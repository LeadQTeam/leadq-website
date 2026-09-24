// One-off generator for the LeadQ redesign. Writes plain static HTML into the repo.
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
// the repo root, so this runs from any checkout
const R = path.resolve(__dirname, "..");
const APP = "https://app.leadq.co";
// Every call to action opens the signup form directly; a plan picked here rides along so the
// app leads with it at go-live. Log in stays on the plain app URL.
const SIGNUP = APP + "/?signup";
const WIDGET = '<script defer src="https://chat.leadqmail.co/w.js" data-leadq="8273801b-5b0c-48e0-8708-8fd1b3164c0e" data-autoopen="4" data-theme="dark"></script>';
const FONT = "https://fonts.googleapis.com/css2?family=Instrument+Sans:wdth,wght@75..100,400..700&family=JetBrains+Mono:wght@400;600&display=swap";

// The wordmark ships in two versions because the site ships dark but keeps a light mode.
const wordmark = (cls = "") => `<picture><source srcset="img/brand/leadq-wordmark.webp" type="image/webp"><img class="brand-logo brand-night${cls ? " " + cls : ""}" src="img/brand/leadq-wordmark.png" alt="LeadQ" width="512" height="199"></picture><img class="brand-logo brand-ink" src="img/brand/leadq-wordmark-ink.png" alt="" aria-hidden="true" width="512" height="202">`;

const I = {
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
  calcheck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  transfer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
  wave: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 10v4M7 6v12M11 3v18M15 8v8M19 5v14M23 10v4"/></svg>',
  msg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  missed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16 2 6 6M22 2l-6 6"/><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
};

const CH = {
 "whatsapp": {
  "bg": "rgba(37,211,102,.15)",
  "fg": "#25D366",
  "path": "<path d=\"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z\"/>",
  "evenodd": false
 },
 "sms": {
  "bg": "rgba(55,138,221,.16)",
  "fg": "#7ba6ff",
  "path": "<path d=\"M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z\"/>",
  "evenodd": false
 },
 "email": {
  "bg": "rgba(122,130,232,.16)",
  "fg": "#8A92F0",
  "path": "<path d=\"M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z\"/>",
  "evenodd": false
 },
 "webchat": {
  "bg": "rgba(45,200,170,.16)",
  "fg": "#2EC8AA",
  "path": "<path d=\"M4 3h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm8 2.7a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 1 0 0-4.2Zm0 5.1c-2.6 0-4.7 1.5-4.7 3.4h9.4c0-1.9-2.1-3.4-4.7-3.4ZM10.8 16h2.4v2.6h-2.4ZM7 18.6h10a1.1 1.1 0 0 1 0 2.2H7a1.1 1.1 0 0 1 0-2.2Z\"/>",
  "evenodd": true
 },
 "voice": {
  "bg": "rgba(139,110,240,.16)",
  "fg": "#9B8CF0",
  "path": "<path d=\"M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.24 1.02l-2.2 2.2z\"/>",
  "evenodd": false
 }
};
const chIcon = (k) => `<i class="ch-ic" style="background:${CH[k].bg}"><svg viewBox="0 0 24 24" fill="${CH[k].fg}"${CH[k].evenodd ? ' fill-rule="evenodd"' : ""} aria-hidden="true">${CH[k].path}</svg></i>`;

const TABS = {
  assistant: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.4l1.65 4.45a3 3 0 0 0 1.78 1.78L19.6 10.3l-4.17 1.55a3 3 0 0 0-1.78 1.78L12 18.2l-1.65-4.45a3 3 0 0 0-1.78-1.78L4.4 10.3l4.17-1.67a3 3 0 0 0 1.78-1.78z"/></svg>Assistant',
  inbox: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>Inbox',
  schedule: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>Schedule',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><circle cx="12" cy="12" r="3.1"/><path d="M19.5 12.9a7.5 7.5 0 0 0 0-1.8l1.9-1.5-1.9-3.3-2.3 1a7.5 7.5 0 0 0-1.6-.9L15.2 4H8.8l-.4 2.4a7.5 7.5 0 0 0-1.6.9l-2.3-1-1.9 3.3 1.9 1.5a7.5 7.5 0 0 0 0 1.8l-1.9 1.5 1.9 3.3 2.3-1a7.5 7.5 0 0 0 1.6.9l.4 2.4h6.4l.4-2.4a7.5 7.5 0 0 0 1.6-.9l2.3 1 1.9-3.3z"/></svg>Settings',
};
const tabbar = (on) => `<div class="ap-nav">${Object.keys(TABS).map((k) => `<span class="ap-tab${k === on ? " on" : ""}">${TABS[k]}</span>`).join("")}</div>`;

/* reusable phone: frame, screen, island, status bar, content, app tab bar */
const phone = ({ label, body, tab, header = "", extra = "", light = false, cls = "" }) =>
  `<div class="phone${cls ? " " + cls : ""}" role="img" aria-label="${label}">
          <div class="ap-screen${light ? " light" : ""}">
            <div class="ap-island"></div>
            <div class="ap-status"><span>9:41</span><span>5G</span></div>
            ${header}
            <div class="ap-body">${body}</div>
            ${extra}
            ${tabbar(tab)}
          </div>
        </div>`;

const appt = (t, ap, name, sub, stat = "Booked", cls = "") =>
  `<div class="ap-appt${cls ? " " + cls : ""}"><span class="ap-appt-time"><span class="ap-appt-t">${t}</span><span class="ap-appt-ap">${ap}</span></span><span class="ap-appt-mid"><span class="ap-appt-nm">${name}</span><span class="ap-appt-sub">${sub}</span><span class="ap-appt-stat"><span class="d"></span>${stat}</span></span></div>`;

const scheduleBody = (rows, { day = "Today, Wed Aug 27", rowCls = "", tail = "" } = {}) =>
  `<div class="ap-scr">
              <div class="ap-seg"><span class="sel">Upcoming</span><span>Past</span></div>
              <div class="ap-dayhd">${day}<span class="ln"></span>${rows.length}</div>
              ${rows.map((r) => appt(...r.slice(0, 4), r[4] || "Booked", rowCls)).join("\n              ")}
              ${tail}
            </div>`;
const scheduleHeader = '<div class="ap-header plain"><span class="ap-hname big">Schedule</span></div>';

const picture = (name, alt, eager) =>
  `<picture><source srcset="img/verticals/${name}.webp" type="image/webp"><img src="img/verticals/${name}.jpg" alt="${alt}" width="1600" height="1067"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"></picture>`;

const NAV_LINKS = [
  ["index.html#how", "How it works", "how"],
  ["use-cases.html", "Use cases", "use-cases"],
  ["pricing.html", "Pricing", "pricing"],
  // The fourth field marks a link that only exists where voice may be sold. The UAE does not
  // permit AI voice agents on its networks, so this link is removed for that visitor rather
  // than left as a route to a product they cannot legally buy.
  ["voice.html", "Voice AI", "voice", "voice"],
];

function nav(current, { voice = false } = {}) {
  const links = NAV_LINKS.map(([href, text, key, needs]) =>
    `<a href="${href}"${key === current ? ' aria-current="page"' : ""}${needs === "voice" ? " data-needs-voice" : ""}>${text}</a>`).join("");
  const cta = voice
    ? `<a class="btn btn-voice btn-sm" href="${SIGNUP}&plan=pro">Get Pro</a>`
    : `<a class="btn btn-primary btn-sm" href="${SIGNUP}">Get started</a>`;
  return `<header class="nav">
  <div class="nav-pill">
    <a class="brand" href="index.html" aria-label="LeadQ home">${wordmark()}</a>
    <nav class="nav-links" aria-label="Main">${links}</nav>
    <div class="nav-actions">
      <a class="btn btn-ghost btn-sm login" href="${APP}">Log in</a>
      ${cta}
      <button class="nav-menu" type="button" aria-label="Menu" aria-expanded="false" aria-controls="nav-sheet">${I.menu}</button>
    </div>
    <div class="nav-sheet" id="nav-sheet" hidden>${links}<a href="about.html">About</a><a href="${APP}">Log in</a></div>
  </div>
</header>`;
}

const dock = `<aside class="dock" hidden aria-label="Demo assistant">
  <div class="dock-copy"><b>Talk to Baxter now</b><span class="faint">He's our demo assistant. Try to book.</span></div>
  <button class="btn btn-white btn-sm dock-btn" type="button">Start chat</button>
</aside>`;

const footer = `<footer class="footer">
  <div class="wrap">
    <div class="footer-top">
      <div>
        <a class="brand" href="index.html" aria-label="LeadQ home">${wordmark()}</a>
        <p class="footer-tag">Answered. Booked. While you work.</p>
      </div>
      <nav class="footer-links" aria-label="Footer">
        <a href="index.html#how">How it works</a><a href="use-cases.html">Use cases</a><a href="voice.html" data-needs-voice>Voice AI</a><a href="pricing.html">Pricing</a><a href="about.html">About</a><a href="privacy-policy.html">Privacy</a><a href="terms-of-service.html">Terms</a>
      </nav>
    </div>
    <div class="footer-legal">&copy; 2026 LeadQ Inc.</div>
  </div>
</footer>`;

function page({ file, title, desc, ogDesc, canonical, robots = "index,follow", ogImage = "https://www.leadq.co/og-image.png", jsonld = [], bodyAttr = "", navHtml, main, legal = false , mockup = false }) {
  const html = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#0a0f18">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="${robots}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="LeadQ">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${ogDesc || desc}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<script>document.documentElement.classList.add("js")</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="${FONT}">
<link rel="stylesheet" href="${FONT}">
<link rel="stylesheet" href="styles.css">
<script src="site.js" defer></script>${mockup ? '\n<script src="app-mockup.js" defer></script>' : ""}
${jsonld.map((j) => `<script type="application/ld+json">\n${j}\n</script>`).join("\n")}
</head>
<body${bodyAttr ? " " + bodyAttr : ""}>

${navHtml}

<main>
${main}
</main>

${footer}
${legal ? "" : "\n" + dock + "\n" + WIDGET}
</body>
</html>
`;
  fs.writeFileSync(path.join(R, file), html.replace(/\n{3,}/g, "\n\n"));
  console.log("wrote", file);
}

const faqHtml = (items) => `<div class="faq">
      ${items.map(([q, a], i) => `<details${i === 0 ? " open" : ""}><summary>${q}</summary><p>${a}</p></details>`).join("\n      ")}
    </div>`;
const faqLd = (items) => JSON.stringify({
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q.replace(/&amp;/g, "&"), acceptedAnswer: { "@type": "Answer", text: a.replace(/&amp;/g, "&") } })),
});

/* One string for North America, another where WhatsApp is the only channel. Returns the plain
   string when there is no variant, so a line that reads the same everywhere stays one line of
   markup and one thing to change.

   The test is `wa == null`, NOT whether wa is truthy. An EMPTY variant is a real answer -- it
   means "this clause does not exist in that market" -- and a truthiness test silently ignored it
   and shipped the North American text to everyone. That happened twice while writing this. */
const mkt = (na, wa) => (wa == null
  ? na
  : `<span data-na-only>${na}</span><span data-wa-only hidden>${wa}</span>`);

/* plan cards, shared by home and pricing */
const plans = `<div class="plans">
      <div class="plan" data-plan="starter">
        <h3>Starter</h3><p class="for">${mkt("Solo, or just trying it out", "The main plan for a growing business")}</p>
        <div class="amt"><span data-price="starter">$59</span><small> <span data-code>USD</span> /mo</small></div>
        <ul><li><span data-cell="starter.credits">20,000</span> credits a month</li><li data-na-only>1 seat, 1 channel</li><li data-wa-only hidden>3 seats, 1 channel</li><li data-wa-only hidden>Booking, calendar and reminders</li><li data-wa-only hidden>Follow-ups, custom fields, profiles</li><li>Assistant, FAQ and lead capture</li></ul>
        <a class="btn btn-ghost btn-block" href="${SIGNUP}&plan=starter">Choose Starter</a>
      </div>
      <div class="plan hot" data-plan="growth">
        <span class="flag">Most popular</span>
        <h3>Growth</h3><p class="for">The main plan for a growing business</p>
        <div class="amt"><span data-price="growth">$149</span><small> <span data-code>USD</span> /mo</small></div>
        <ul><li><span data-cell="growth.credits">45,000</span> credits a month</li><li><span data-cell="growth.seats">3</span> seats</li><li data-na-only>1 phone number</li><li><span data-cell="growth.channels">3</span> channels</li><li>Booking, calendar and reminders</li><li>Follow-ups, custom fields, profiles</li><li>Calendar sync with Google and Outlook</li></ul>
        <a class="btn btn-primary btn-block" href="${SIGNUP}&plan=growth">Start with Growth</a>
      </div>
      <div class="plan" data-plan="pro">
        <h3>Pro</h3><p class="for">Established, multi-channel, high volume</p>
        <div class="amt"><span data-price="pro">$399</span><small> <span data-code>USD</span> /mo</small></div>
        <p class="plus" data-plus>Everything in Growth, plus:</p>
        <ul><li><span data-cell="pro.credits">120,000</span> credits a month</li><li><span data-cell="pro.seats">10</span> seats</li><li data-na-only>2 phone numbers</li><li data-pro-channels>All channels</li><li class="voice" data-needs-voice>AI voice receptionist</li><li>Insights dashboard</li><li>Priority support</li></ul>
        <a class="btn btn-ghost btn-block" href="${SIGNUP}&plan=pro">Choose Pro</a>
      </div>
    </div>`;

/* ======================================================= HOME */
const homeChat = phone({
  label: "The LeadQ app booking an appointment over text",
  tab: "inbox",
  header: '<div class="ap-header"><span class="ap-av">J</span><span><span class="ap-hname">Jane Doe</span><span class="ap-hsub"><span class="ch">SMS</span>, Baxter is replying</span></span><span class="ap-live">Live</span></div>',
  body: `<div class="ap-chat live-chat">
              <div class="ap-bubble in">Can I come in Thursday?</div>
              <div class="ap-bubble out">Thursday at 3:00 PM works. Want it?</div>
              <div class="ap-bubble in">Yes please</div>
              <div class="ap-typing" aria-hidden="true"><i></i><i></i><i></i></div>
              <div class="ap-bubble out">You're booked. Reminder coming Wednesday.</div>
              <div class="ap-booked"><b>Booked, reminder set</b>Thu, 3:00 PM</div>
            </div>`,
});

const sheetSchedule = phone({
  label: "The Schedule tab in the LeadQ app, filling with bookings",
  tab: "schedule", light: true,
  header: scheduleHeader,
  body: scheduleBody(
    [["10:00", "AM", "Marcus Bell", "Consultation, Sarah", "Booked, reminder sent"], ["2:30", "PM", "Jane Doe", "Cleaning, Dr. Rivera"], ["4:00", "PM", "Priya Nair", "New patient, Dr. Rivera"]],
    { tail: `<div class="ap-dayhd">Tomorrow, Thu Aug 28<span class="ln"></span>1</div>
              <div class="ap-appt" data-fill aria-live="off"></div>` }),
  extra: `<div class="ap-fab">${I.plus}</div>`,
});

const sheetDetail = phone({
  label: "An appointment in the LeadQ app, with what the customer told the assistant",
  tab: "schedule", light: true,
  header: `<div class="ap-header plain"><span class="ap-back">${I.back}</span><span class="ap-hname">Appointment</span></div>`,
  body: `<div class="ap-scr">
              <div class="ap-apxstat"><span class="d"></span>Booked, reminder sent</div>
              <div class="ap-apxwhen">Wednesday, 27 Aug<br>2:30 PM</div>
              <div class="ap-apxmeta">Cleaning, 30 minutes, with Dr. Rivera. Booked by Baxter.</div>
              <div class="ap-apxbtns"><span class="pri">Message</span><span>Reschedule</span><span class="dng">Cancel</span></div>
              <div class="ap-lbl">Customer</div>
              <div class="ap-cprow"><span class="ap-cpav">J</span><span class="ap-cprt"><b>Jane Doe</b><span>+1 (555) 123-4567</span></span></div>
              <div class="ap-lbl">What they told Baxter</div>
              <div class="ap-frow"><span class="k">Reason</span><span class="v">Overdue cleaning</span></div>
              <div class="ap-frow"><span class="k">Insurance</span><span class="v">Yes, Delta</span></div>
              <div class="ap-frow"><span class="k">First visit</span><span class="v">No</span></div>
            </div>`,
});

const homeFaq = [
  ["What's a credit?", "Credits are how LeadQ measures usage. Everything the assistant does on every channel draws from one monthly pool, so there's no per-channel math to do. Run low and you top up in one tap. WhatsApp's own conversation fees are billed by Meta, on your WhatsApp Business account."],
  ["What happens if I run out of credits?", "Your assistant stops replying until your pool resets or you top up. Topping up takes one tap in the app, and it picks straight back up."],
  ["Is there a contract?", "No. Plans are month to month, and you can cancel whenever you want from inside the app. If you cancel, we release any phone numbers on the account."],
  ["Do I need to register for texting?", "In the US, business texting needs A2P registration. We guide you through it inside the app. Canada doesn't need it, and the UAE runs on WhatsApp instead."],
  ["Can I keep my WhatsApp number?", "Yes. Connect a new number or bring the one your customers already message."],
  ["Can I take over a conversation?", "Any time. Pause the assistant for one contact or a whole channel, reply yourself, then hand it back."],
];

page({
  file: "index.html",
  // Only the home page carries the desktop app mockups, so only it loads their driver.
  mockup: true,
  title: "LeadQ | One AI assistant for every channel",
  desc: "LeadQ answers WhatsApp, SMS, web chat, email and your phone line with one AI assistant, and books the appointment while you work. Live in minutes.",
  ogDesc: "One AI assistant answers WhatsApp, SMS, web chat, email and your phone line, and books the appointment while you work.",
  canonical: "https://www.leadq.co/",
  bodyAttr: 'style="--c:#4d86ff;--c2:#38d3ff"',
  jsonld: [
    '{"@context":"https://schema.org","@type":"Organization","name":"LeadQ","url":"https://www.leadq.co","logo":"https://www.leadq.co/icon-512.png"}',
    '{"@context":"https://schema.org","@type":"WebSite","name":"LeadQ","url":"https://www.leadq.co"}',
    '{"@context":"https://schema.org","@type":"SoftwareApplication","name":"LeadQ","applicationCategory":"BusinessApplication","operatingSystem":"Web","description":"One AI assistant for your whole business. It answers WhatsApp, SMS, web chat, email and your phone line, and books the appointment automatically.","offers":{"@type":"Offer","price":"59","priceCurrency":"USD"}}',
    faqLd(homeFaq),
  ],
  navHtml: nav(null),
  main: `
<div hidden aria-hidden="true"><svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<linearGradient id="lqg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4b9ae6"/><stop offset="1" stop-color="#23409a"/></linearGradient>
<symbol id="lq-mark" viewBox="0 0 100 100"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M76 65 A30 30 0 1 0 64.1 76.5 L83 86 Z" stroke-width="6"/><path d="M40.5 42v16M50 36.5v27.5M59.5 42v16" stroke-width="3.4"/></g></symbol>
<symbol id="lq-app" viewBox="0 0 100 100"><rect width="100" height="100" rx="23" fill="url(#lqg)"/><use href="#lq-mark" color="#fff"/></symbol>
<symbol id="i-home" viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></symbol>
<symbol id="i-inbox" viewBox="0 0 24 24"><path d="M3 13l2.5-7.5A2 2 0 0 1 7.4 4h9.2a2 2 0 0 1 1.9 1.5L21 13v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M3 13h5l1.5 2.5h5L16 13h5"/></symbol>
<symbol id="i-cal" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/></symbol>
<symbol id="i-bot" viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 14h.01M15 14h.01M9.5 17h5"/></symbol>
<symbol id="i-gear" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></symbol>
<symbol id="i-bell" viewBox="0 0 24 24"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0"/></symbol>
<symbol id="i-sms" viewBox="0 0 24 24"><path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1z"/></symbol>
<symbol id="i-phone" viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></symbol>
<symbol id="i-wa" viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 21l2.1-5.6A8.4 8.4 0 1 1 21 11.5z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z"/></symbol>
<symbol id="i-web" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M9 10.5h.01M12 10.5h.01M15 10.5h.01"/></symbol>
<symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></symbol>
<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></symbol>
<symbol id="i-send" viewBox="0 0 24 24"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></symbol>
<symbol id="i-plug" viewBox="0 0 24 24"><path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0zM12 17v5"/></symbol>
<symbol id="i-filter" viewBox="0 0 24 24"><path d="M3 4h18l-7 8.5V19l-4 2v-8.5z"/></symbol>
<symbol id="i-hash" viewBox="0 0 24 24"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></symbol>
<symbol id="i-card" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></symbol>
<symbol id="i-dollar" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></symbol>
<symbol id="i-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M16 4a4 4 0 0 1 0 8M22 21a7 7 0 0 0-5-6.7"/></symbol>
<symbol id="i-build" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01M10 21v-3h4v3"/></symbol>
<symbol id="i-chev" viewBox="0 0 24 24"><path d="m8 9 4-4 4 4M8 15l4 4 4-4"/></symbol>
<symbol id="i-down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></symbol>
<symbol id="i-hand" viewBox="0 0 24 24"><path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8a8 8 0 0 0 16 0v-3a2 2 0 0 0-4 0"/></symbol>
<symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>
</defs></svg></div>
<!-- hero: centred copy over a full-width product stage -->
<section class="lit-hero">
  <div class="wrap">
    <div class="sec-head hero-head">
      <span class="pill">One assistant. Every channel.</span>
      <h1 class="h-hero">Stop chasing. Start closing.</h1>
      <p class="lead">Every message you miss is a job someone else books. LeadQ answers ${mkt("WhatsApp, texts, web chat, email and your phone line", "WhatsApp, web chat and email")} in seconds, then books the appointment. At midnight, on a Sunday, or while you are with a customer.</p>
      <div class="ctas">
        <a class="btn btn-primary btn-lg" href="${SIGNUP}">Get started</a>
        <a class="btn btn-ghost btn-lg" href="#how" data-open-chat>See it work</a>
      </div>
      <p class="fine">Set it up in minutes. No AI knowledge needed.</p>
    </div>
    <div class="pstage" role="img" aria-label="LeadQ inbox showing Baxter booking an appointment">
  <div class="wm" aria-hidden="true">leadq</div><div class="glow" aria-hidden="true"></div>
  <span class="plabel" style="--c:#4d86ff"><i></i>You see it handled in LeadQ</span>
  <div class="appwin"><div class="abar"><i></i><i></i><i></i><span>app.leadq.co</span></div><div class="dkw"><div class="dk hero-dk" id="heroDk"><aside class="dk-side"><div class="dk-brand"><svg class="app" viewBox="0 0 100 100" aria-hidden="true"><use href="#lq-app"/></svg>LeadQ<svg class="ic" aria-hidden="true"><use href="#i-chev"/></svg></div><button type="button" tabindex="-1" class="dk-nav" data-go="home"><svg class="ic" aria-hidden="true"><use href="#i-home"/></svg>Home</button><button type="button" tabindex="-1" class="dk-nav on" data-go="inbox"><svg class="ic" aria-hidden="true"><use href="#i-inbox"/></svg>Inbox</button><button type="button" tabindex="-1" class="dk-nav"><svg class="ic" aria-hidden="true"><use href="#i-cal"/></svg>Schedule</button><button type="button" tabindex="-1" class="dk-nav"><svg class="ic" aria-hidden="true"><use href="#i-bot"/></svg>Assistant<span class="badge">2</span></button><button type="button" tabindex="-1" class="dk-nav" data-go="settings"><svg class="ic" aria-hidden="true"><use href="#i-gear"/></svg>Settings</button><div class="dk-bax"><span class="bot"><svg class="ic" aria-hidden="true"><use href="#i-bot"/></svg></span><span><b>Baxter</b><small>On, 5 channels</small></span></div><div class="dk-user"><svg class="app" viewBox="0 0 100 100" aria-hidden="true"><use href="#lq-app"/></svg>info@riveradental.com</div></aside><div class="dk-main" style="display:flex;flex-direction:column"><div class="dk-top"><div><div class="dk-h6">Inbox</div><p>Baxter is handling 1 conversation.</p></div><button type="button" tabindex="-1" class="dk-bell" aria-label="Notifications"><svg class="ic" aria-hidden="true"><use href="#i-bell"/></svg></button></div><div class="dk-scr"><div class="dk-inbox"><div class="dk-list"><div class="dk-search"><svg class="ic" aria-hidden="true"><use href="#i-search"/></svg>Search people and messages</div>
<div class="dk-filters"><span class="on">All<i>11</i></span><span>Needs you<i>1</i></span><span>Handed off<i>1</i></span><span>Booked<i>3</i></span><span>Went quiet<i>4</i></span><span>All channels<i>11</i></span></div><div class="dk-conv sel" data-hrow><span class="dk-av">JD</span><div><b>Jane Doe</b><span>Can I come in Thursday?</span><em class="blue">Baxter replying</em></div><time>now</time></div><div class="dk-conv"><span class="dk-av">MB</span><div><b>Marcus Bell</b><span>Can I talk to someone about my insurance...</span><em class="amber">Needs you</em></div><time>2h</time></div><div class="dk-conv"><span class="dk-av">PN</span><div><b>Priya Nair</b><span>Baxter: See you Thursday at 4:00 PM.</span><em class="green">Booked</em></div><time>1h</time></div><div class="dk-conv"><span class="dk-av">TA</span><div><b>Tom Alvarez</b><span>${mkt("Tom called about a follow-up visit.", "Tom asked about a follow-up visit.")}</span><em class="blue">Baxter replying</em></div><time>2h</time></div><div class="dk-conv"><span class="dk-av">WV</span><div><b>Website visitor</b><span>Do you take Delta Dental?</span><em class="grey">Went quiet</em></div><time>5h</time></div></div><div class="dk-thread"><div class="dk-th-h"><span class="chn"><svg class="ic" aria-hidden="true"><use href="#i-sms"/></svg></span><div><b>Jane Doe</b><small><svg class="ic" aria-hidden="true"><use href="#i-sms"/></svg>${mkt("SMS", "WhatsApp")}</small></div>
<div class="right"><span class="dk-chip blue">Baxter is handling</span><button type="button" tabindex="-1" class="dk-btn">Take over</button></div></div>
<div class="dk-msgs" data-hmsgs><div class="dk-b cust" data-h="0">Can I come in Thursday?<small>3:02 PM</small></div>
<div class="dk-typing" data-h="t"><i></i><i></i><i></i></div>
<div class="dk-b bax" data-h="1">Thursday at 3:00 PM works. Want it?<small>Baxter, 3:02 PM</small></div>
<div class="dk-b cust" data-h="2">Yes please<small>3:03 PM</small></div>
<div class="dk-b bax" data-h="3">You're booked. Reminder coming Wednesday.<small>Baxter, 3:03 PM</small></div></div>
<div class="dk-comp"><div class="via">Baxter is replying via <b>${mkt("SMS", "WhatsApp")}</b></div><div class="row"><span class="inp">Type to take over</span><button type="button" tabindex="-1" class="dk-send" aria-label="Send"><svg class="ic" aria-hidden="true"><use href="#i-send"/></svg></button></div></div></div><div class="dk-contact"><div class="who"><span class="dk-av">JD</span><div><b>Jane Doe</b><span class="dk-chip grey">Patient</span></div></div>
<div class="acts"><button type="button" tabindex="-1" class="dk-btn"><svg class="ic" aria-hidden="true"><use href="#i-phone"/></svgdata-needs-voice>Call</button><button type="button" tabindex="-1" class="dk-btn blue"><svg class="ic" aria-hidden="true"><use href="#i-cal"/></svg>Book</button></div>
<div class="dk-kv"><span class="dk-lbl">Summary</span><p>Returning patient, overdue for a cleaning. Prefers afternoons.</p></div>
<div class="dk-kv"><span class="dk-lbl">Appointments</span><div data-happt><p style="color:var(--ink-3);font-size:1.25em">Nothing booked yet.</p></div></div></div></div></div></div></div></div></div>
  <div class="cphone"><span class="plabel" style="--c:#2dd4bf"><i></i>Your customer ${mkt("texts", "messages")}</span><div class="phone"><div class="screen">
    <div class="island"></div><div class="status"><span>3:02</span><span>5G</span></div>
    <div class="ctop"><span class="cav">RD</span><b>Rivera Dental</b><small>${mkt("Text message", "WhatsApp message")}</small></div>
    <div class="chat" data-hphone>
      <div class="msg cust" data-h="0">Can I come in Thursday?</div>
      <div class="typing" data-h="t"><i></i><i></i><i></i></div>
      <div class="msg biz" data-h="1">Thursday at 3:00 PM works. Want it?</div>
      <div class="msg cust" data-h="2">Yes please</div>
      <div class="msg biz" data-h="3">You're booked. Reminder coming Wednesday.</div>
    </div>
    <div class="ccomp">${mkt("Text message", "WhatsApp message")}</div>
  </div></div></div>
</div>
  </div>
</section>

<!-- one brain -->
<section class="sec">
  <div class="wrap brain">
    <div class="orbit" role="img" data-na-only aria-label="WhatsApp, SMS, web chat, email and voice, all run by one assistant">
      <div class="orbit-ring" aria-hidden="true"></div>
      <div class="orbit-core" aria-hidden="true"><span>One<br>assistant</span></div>
      <div class="chan" style="--x:0px;--y:-170px" aria-hidden="true">${chIcon('whatsapp')}WhatsApp</div>
      <div class="chan" style="--x:162px;--y:-53px" aria-hidden="true">${chIcon('sms')}SMS</div>
      <div class="chan" style="--x:100px;--y:138px" aria-hidden="true">${chIcon('webchat')}Web chat</div>
      <div class="chan" style="--x:-100px;--y:138px" aria-hidden="true">${chIcon('email')}Email</div>
      <div class="chan" style="--x:-162px;--y:-53px" aria-hidden="true">${chIcon('voice')}Voice</div>
    </div>
    <div class="orbit" role="img" data-wa-only hidden aria-label="WhatsApp, web chat and email, all run by one assistant">
      <div class="orbit-ring" aria-hidden="true"></div>
      <div class="orbit-core" aria-hidden="true"><span>One<br>assistant</span></div>
      <div class="chan" style="--x:0px;--y:-170px" aria-hidden="true">${chIcon('whatsapp')}WhatsApp</div>
      <div class="chan" style="--x:147px;--y:85px" aria-hidden="true">${chIcon('webchat')}Web chat</div>
      <div class="chan" style="--x:-147px;--y:85px" aria-hidden="true">${chIcon('email')}Email</div>
    </div>
    <div>
      <h2 class="h-sec">${mkt("Not five tools. One assistant.", "Not three tools. One assistant.")}</h2>
      <p class="lead" style="margin-top:18px"><span data-na-only>Most businesses juggle a chat widget, a texting app, an inbox, a booking tool and a voicemail box, and still drop messages.</span><span data-wa-only hidden>Most businesses run WhatsApp off one person's phone, with a chat widget, an inbox and a booking tool beside it, and still drop messages.</span> LeadQ is one assistant that knows your business and works every channel the same way.</p>
      <div class="items">
        <div class="item"><b>Change it once</b><span>Update your hours or add a service, and every channel knows.${mkt(" The phone too.", "")}</span></div>
        <div class="item"><b>Sounds like you</b><span>Warm, brisk, formal, luxe. Pick a tone and it talks like your front desk.</span></div>
        <div class="item"><b>Hands off on your rules</b><span>Decide when a person takes over, and what it should never say.</span></div>
      </div>
    </div>
  </div>
</section>

<!-- what it does -->
<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head"><h2 class="h-sec">Runs the whole conversation. And the booking.</h2></div>
    <div class="tiles">
      <div class="tile">
        <h3>Books into your calendar</h3>
        <p>Checks real availability, respects your booking rules, books and reminds.</p>
        <div class="vis"><div class="shot" aria-hidden="true">
          <div class="sc-calhd"><span class="sc-calm">September</span><span class="sc-calnav"><span>&lsaquo;</span><span>&rsaquo;</span></span></div>
          <div class="sc-dow"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>
          <div class="sc-grid">
            <span class="sc-day">8</span><span class="sc-day">9</span><span class="sc-day">10</span><span class="sc-day">11</span><span class="sc-day">12</span><span class="sc-day">13</span><span class="sc-day">14</span>
            <span class="sc-day today">15</span><span class="sc-day">16</span><span class="sc-day sel">17</span><span class="sc-day">18</span><span class="sc-day">19</span><span class="sc-day">20</span><span class="sc-day">21</span>
            <span class="sc-day">22</span><span class="sc-day">23</span><span class="sc-day">24</span><span class="sc-day">25</span><span class="sc-day">26</span><span class="sc-day">27</span><span class="sc-day">28</span>
          </div>
          <div class="sc-slots"><span class="sc-slot">9:30 AM</span><span class="sc-slot sel">2:00 PM</span><span class="sc-slot">4:30 PM</span></div>
        </div></div>
      </div>
      <div class="tile">
        <h3>Follows up for you</h3>
        <p>A lead goes quiet, it nudges them on a schedule. Never during your quiet hours.</p>
        <div class="vis"><div class="shot" aria-hidden="true">
          <span class="shot-lbl">Follow-up, sent 10:00 AM</span>
          <div class="ap-chat" style="padding:0;height:auto">
            <div class="ap-bubble in">How much is a whitening?</div>
            <div class="ap-bubble out">It's $249 and takes about an hour. Want me to find you a time?</div>
            <div class="ap-bubble out">Hi Sam, just checking in. I still have Friday at 11:00 AM open if you'd like it.</div>
            <div class="ap-bubble in">Friday works!</div>
          </div>
        </div></div>
      </div>
      <div class="tile">
        <h3>Answers questions 24/7</h3>
        <p>Hours, pricing, insurance, parking. It answers from your own information, at 11 PM on a Sunday.</p>
        <div class="vis"><div class="shot" aria-hidden="true">
          <span class="shot-lbl">Sunday, 11:42 PM</span>
          <div class="ap-chat" style="padding:0;height:auto">
            <div class="ap-bubble in">Do you take Delta Dental?</div>
            <div class="ap-bubble out">We do, both PPO and Premier. Want me to check your coverage before you come in?</div>
            <div class="ap-bubble in">And where do I park?</div>
            <div class="ap-bubble out">Free parking behind the building off 4th, or street parking out front.</div>
          </div>
        </div></div>
      </div>
      <div class="tile">
        <h3>You're always in control</h3>
        <p>Pause it on one channel or all of them. For an hour, or until you say so.</p>
        <div class="vis"><div class="shot" aria-hidden="true">
          <div class="sc-ph">Pause Baxter</div>
          <p class="sc-psub">Baxter stops replying on all channels.</p>
          <div class="sc-scope"><span>Just WhatsApp</span><span class="sel">All channels</span></div>
          <div class="sc-opt"><b>For one hour</b><small>Back at 3:30 PM</small></div>
          <div class="sc-opt"><b>Until tomorrow morning</b><small>Back at 8:00 AM, when you open</small></div>
          <div class="sc-opt"><b>Until I turn it back on</b><small>No automatic resume</small></div>
        </div></div>
      </div>
      <div class="tile">
        <h3>Contacts, ready at a glance</h3>
        <p>Every detail and an AI summary of the chat, before you ever ${mkt("pick up the phone", "open the thread")}.</p>
        <div class="vis"><div class="shot" aria-hidden="true">
          <div class="sc-cp"><span class="sc-cpav">J</span><span><span class="sc-name" style="font-size:15px">Jane Doe</span><span class="sc-chip">Booked</span></span></div>
          <div class="sc-sum"><div class="sc-sumhd">Summary</div><div class="sc-sumbody">New patient, prefers afternoons. Booked a cleaning for Wed 2:30 PM with Dr. Rivera.</div></div>
          <div class="sc-row"><span class="sc-tx"><span class="sc-name">+1 (555) 123-4567</span><span class="sc-sub"><span data-na-only>Mobile, WhatsApp and SMS</span><span data-wa-only hidden>Mobile and WhatsApp</span></span></span></div>
          <div class="sc-row"><span class="sc-tx"><span class="sc-name">jane.doe@email.com</span><span class="sc-sub">Reminders and confirmations</span></span></div>
          <div class="sc-row"><span class="sc-tx"><span class="sc-name">First seen 12 Aug</span><span class="sc-sub">4 conversations, 2 bookings</span></span></div>
        </div></div>
      </div>
      <div class="tile">
        <h3>Learns from your website</h3>
        <p>It reads your site and suggests answers. Nothing goes live until you approve it.</p>
        <div class="vis"><div class="shot" aria-hidden="true">
          <div class="sc-url"><span class="sc-ic" style="width:22px;height:22px">${I.globe}</span>riveradental.com</div>
          <div class="sc-row"><span class="sc-tx"><span class="sc-name">Services</span></span><span class="sc-tag">6 found</span></div>
          <div class="sc-row"><span class="sc-tx"><span class="sc-name">FAQ answers</span></span><span class="sc-tag">12 to review</span></div>
          <div class="sc-row"><span class="sc-tx"><span class="sc-name">Business hours</span></span><span class="sc-tag">Mon to Fri</span></div>
          <div class="sc-row"><span class="sc-tx"><span class="sc-name">Prices</span></span><span class="sc-tag">9 found</span></div>
          <div class="sc-row"><span class="sc-tx"><span class="sc-name">Policies</span></span><span class="sc-tag">Cancellations, deposits</span></div>
        </div></div>
      </div>
    </div>
  </div>
</section>

<!-- inside the app: centred header over a full-width working tour -->
<section class="sec" id="app">
  <div class="wrap">
    <div class="sec-head">
      <span class="pill">Inside the app</span>
      <h2 class="h-sec">Your whole front desk, on one screen.</h2>
      <p class="lead">Open LeadQ on any computer and see everything at once. Who needs you, what Baxter handled, and what is booked next.</p>
    </div>
    <div class="tour-tabs"><div class="seg" role="group" aria-label="App screen" id="tourSeg">
            <button type="button" data-tab="home" aria-pressed="true">Home</button>
            <button type="button" data-tab="inbox" aria-pressed="false">Inbox</button>
            <button type="button" data-tab="schedule" aria-pressed="false">Schedule</button>
          </div></div>
          <div class="appwin"><div class="abar"><i></i><i></i><i></i><span>app.leadq.co</span></div><div class="dkw"><div class="dk" id="tourDk"><aside class="dk-side"><div class="dk-brand"><svg class="app" viewBox="0 0 100 100" aria-hidden="true"><use href="#lq-app"/></svg>LeadQ<svg class="ic" aria-hidden="true"><use href="#i-chev"/></svg></div><button type="button" class="dk-nav on" data-go="home"><svg class="ic" aria-hidden="true"><use href="#i-home"/></svg>Home</button><button type="button" class="dk-nav" data-go="inbox"><svg class="ic" aria-hidden="true"><use href="#i-inbox"/></svg>Inbox</button><button type="button" class="dk-nav" data-go="schedule"><svg class="ic" aria-hidden="true"><use href="#i-cal"/></svg>Schedule</button><button type="button" class="dk-nav"><svg class="ic" aria-hidden="true"><use href="#i-bot"/></svg>Assistant<span class="badge">2</span></button><button type="button" class="dk-nav"><svg class="ic" aria-hidden="true"><use href="#i-gear"/></svg>Settings</button><div class="dk-bax"><span class="bot"><svg class="ic" aria-hidden="true"><use href="#i-bot"/></svg></span><span><b>Baxter</b><small>On, 5 channels</small></span></div><div class="dk-user"><svg class="app" viewBox="0 0 100 100" aria-hidden="true"><use href="#lq-app"/></svg>info@riveradental.com</div></aside>
<div class="dk-main">
<div data-scr="home" class="dk-page"><div class="dk-top"><div><div class="dk-h6">Good afternoon</div><p><svg class="ic" aria-hidden="true"><use href="#i-clock"/></svg>Monday, September 21. Open until 6:00 PM, then Baxter answers overnight.</p></div><button type="button" class="dk-bell" aria-label="Notifications"><svg class="ic" aria-hidden="true"><use href="#i-bell"/></svg></button></div><div class="dk-scr"><div class="dk-home"><div class="dk-stats">
<div class="dk-card dk-stat need" style="--c:#e0ae5a"><div class="hd"><span class="dk-lbl" style="color:#f3cf8f">Needs you</span><span class="dk-link">Open queue</span></div><div class="n"><b>1</b><span>conversation waiting</span></div><p>Oldest has waited 2 h</p></div>
<div class="dk-card dk-stat" style="--c:#4d86ff"><div class="hd"><span class="dk-lbl" style="color:#a9c5ff">Conversations today</span><span class="dk-link">Open inbox</span></div><div class="n"><b>7</b><span>+3 vs. yesterday</span></div><p><strong>6</strong> handled by Baxter end to end, <strong>1</strong> needed you</p></div>
<div class="dk-card dk-stat" style="--c:#37c98b"><div class="hd"><span class="dk-lbl" style="color:#7fe3b6">Booked</span><span class="dk-link">Schedule</span></div><div class="n"><b>3</b><span>this week by Baxter</span></div><p>Next: today, 2:30 PM</p></div>
</div><div class="dk-colL">
<div class="dk-card"><div class="dk-sec-h"><b>Waiting on you</b><span class="cnt">1</span><span class="hint">Reply to take over.</span></div>
<div class="dk-wait"><span class="dk-av">MB</span><div><div class="who"><b>Marcus Bell</b><span><svg class="ic" aria-hidden="true"><use href="#i-sms"/></svg>${mkt("SMS", "WhatsApp")}</span><em>waiting 2 h</em></div><q>Can I talk to someone about my insurance first?</q><div class="dk-tags"><span>Asked for a human</span><span>Booked before</span></div></div><div class="acts"><button type="button" class="dk-btn">Let Baxter continue</button><button type="button" class="dk-btn white" data-go="inbox">Reply</button></div></div></div>
<div class="dk-card"><div class="dk-sec-h"><b>Recent conversations</b><span class="dk-link" data-go="inbox" style="cursor:pointer">Open inbox</span></div><div class="dk-row"><span class="dk-av">JD</span><div class="t"><b>Jane Doe<svg class="ic" aria-hidden="true"><use href="#i-sms"/></svg></b><span>Booked a cleaning for Wed 2:30 PM with Dr. Rivera.</span></div><span class="dk-chip green">Booked</span><time>12m</time></div><div class="dk-row"><span class="dk-av">PN</span><div class="t"><b>Priya Nair<svg class="ic" aria-hidden="true"><use href="#i-wa"/></svg></b><span>New patient, booked Thu 4:00 PM.</span></div><span class="dk-chip green">Booked</span><time>1h</time></div><div class="dk-row"><span class="dk-av">TA</span><div class="t"><b>Tom Alvarez<svg class="ic" aria-hidden="true"><use href="#i-phone"/></svg></b><span>${mkt("Called about a follow-up, Baxter is confirming a time.", "Asked about a follow-up, Baxter is confirming a time.")}</span></div><span class="dk-chip blue">Baxter replying</span><time>2h</time></div><div class="dk-row"><span class="dk-av">WV</span><div class="t"><b>Website visitor<svg class="ic" aria-hidden="true"><use href="#i-web"/></svg></b><span>Asked if you take Delta Dental insurance.</span></div><span class="dk-chip grey">Went quiet</span><time>5h</time></div></div>
</div><div class="dk-colR">
<div class="dk-card"><div class="dk-master"><span class="chn wa"><svg class="ic" aria-hidden="true"><use href="#i-bot"/></svg></span><span><b data-master-label>Baxter is on</b><small data-master-sub>Answering on <span data-chan-n>5</span> connected channels</small></span><button type="button" class="tg" aria-pressed="true" aria-label="Baxter on or off" data-master></button></div>
<div class="dk-chl"><div class="hd"><span class="dk-lbl">Channels</span><span class="dk-lbl" data-chcount data-chan-count>5 connected</span></div><div class="dk-ch" data-na-only><span class="chn "><svg class="ic" aria-hidden="true"><use href="#i-sms"/></svg></span><b>SMS</b><span>+1 (555) 123-4567</span><button type="button" class="tg" aria-pressed="true" aria-label="SMS replies" data-chtg></button></div><div class="dk-ch" data-needs-voice><span class="chn vo"><svg class="ic" aria-hidden="true"><use href="#i-phone"/></svg></span><b>Voice</b><span>+1 (555) 123-4567</span><button type="button" class="tg" aria-pressed="true" aria-label="Voice replies" data-chtg></button></div><div class="dk-ch"><span class="chn wa"><svg class="ic" aria-hidden="true"><use href="#i-wa"/></svg></span><b>WhatsApp</b><span>+1 (555) 771-0064</span><button type="button" class="tg" aria-pressed="true" aria-label="WhatsApp replies" data-chtg></button></div><div class="dk-ch"><span class="chn web"><svg class="ic" aria-hidden="true"><use href="#i-web"/></svg></span><b>Website chat</b><span>riveradental.com</span><button type="button" class="tg" aria-pressed="true" aria-label="Website chat replies" data-chtg></button></div><div class="dk-ch"><span class="chn em"><svg class="ic" aria-hidden="true"><use href="#i-mail"/></svg></span><b>Email</b><span>hi@riveradental.com</span><button type="button" class="tg" aria-pressed="true" aria-label="Email replies" data-chtg></button></div></div></div>
<div class="dk-card"><div class="dk-sec-h" style="border:0"><b>Up next</b><span class="dk-link" data-go="schedule" style="cursor:pointer">Schedule</span></div><div class="dk-next"><span class="dk-lbl">Today</span><div class="dk-slot"><time>2:30 PM</time><div><b>Jane Doe</b><small>Cleaning, 30 min, booked via <span data-na-only>SMS</span><span data-wa-only hidden>WhatsApp</span></small></div><svg class="ic ok" aria-hidden="true"><use href="#i-check"/></svg></div></div></div>
</div></div></div></div>
<div data-scr="inbox" class="dk-page" hidden><div class="dk-top"><div><div class="dk-h6">Inbox</div><p>1 conversation needs you. Baxter is handling 1.</p></div><button type="button" class="dk-bell" aria-label="Notifications"><svg class="ic" aria-hidden="true"><use href="#i-bell"/></svg></button></div><div class="dk-scr"><div class="dk-inbox"><div class="dk-list"><div class="dk-search"><svg class="ic" aria-hidden="true"><use href="#i-search"/></svg>Search people and messages</div>
<div class="dk-filters"><span class="on">All<i>11</i></span><span>Needs you<i>1</i></span><span>Handed off<i>1</i></span><span>Booked<i>3</i></span><span>Went quiet<i>4</i></span><span>All channels<i>11</i></span></div><div class="dk-conv sel"><span class="dk-av">MB</span><div><b>Marcus Bell</b><span>You: Hi Marcus, this is Sarah from Rivera...</span><em class="amber">Taken over</em></div><time>2h</time></div><div class="dk-conv"><span class="dk-av">JD</span><div><b>Jane Doe</b><span>Baxter: You're booked. Reminder coming...</span><em class="green">Booked</em></div><time>12m</time></div><div class="dk-conv"><span class="dk-av">PN</span><div><b>Priya Nair</b><span>Baxter: See you Thursday at 4:00 PM.</span><em class="green">Booked</em></div><time>1h</time></div><div class="dk-conv"><span class="dk-av">TA</span><div><b>Tom Alvarez</b><span>${mkt("Tom called about a follow-up visit.", "Tom asked about a follow-up visit.")}</span><em class="blue">Baxter replying</em></div><time>2h</time></div><div class="dk-conv"><span class="dk-av">WV</span><div><b>Website visitor</b><span>Do you take Delta Dental?</span><em class="grey">Went quiet</em></div><time>5h</time></div><div class="dk-conv"><span class="dk-av">OJ</span><div><b>Olivia Johnson</b><span>Baxter: Thanks for reaching out, Olivia.</span><em class="grey">Went quiet</em></div><time>1d</time></div></div><div class="dk-thread"><div class="dk-th-h"><span class="chn"><svg class="ic" aria-hidden="true"><use href="#i-sms"/></svg></span><div><b>Marcus Bell</b><small><svg class="ic" aria-hidden="true"><use href="#i-sms"/></svg>${mkt("SMS", "WhatsApp")}</small></div>
<div class="right"><span class="dk-chip amber" data-ho-chip>Taken over</span><button type="button" class="dk-btn" data-ho>Hand back</button></div></div>
<div class="dk-msgs"><div class="dk-b cust">Hi, do you take Delta Dental?<small>2:41 PM</small></div>
<div class="dk-b bax">We do. Would you like to book a cleaning? I have Thursday at 10:00 AM open.<small>2:41 PM</small></div>
<div class="dk-b cust">Can I talk to someone about my insurance first?<small>2:43 PM</small></div>
<div class="dk-b bax">Of course. I've let the team know, and someone will reply here shortly.<small>2:43 PM</small></div>
<div class="dk-b you">Hi Marcus, this is Sarah from Rivera Dental. Happy to walk you through your coverage.<small>You, 4:51 PM</small></div></div>
<div class="dk-comp"><div class="via" data-ho-via>Replying as you via <b>${mkt("SMS", "WhatsApp")}</b></div><div class="row"><span class="inp">Type a message</span><button type="button" class="dk-btn"><svg class="ic" aria-hidden="true"><use href="#i-cal"/></svg>Book</button><button type="button" class="dk-send" aria-label="Send"><svg class="ic" aria-hidden="true"><use href="#i-send"/></svg></button></div></div></div><div class="dk-contact"><div class="who"><span class="dk-av">MB</span><div><b>Marcus Bell</b><span class="dk-chip grey">Patient</span></div></div>
<div class="acts"><button type="button" class="dk-btn"><svg class="ic" aria-hidden="true"><use href="#i-phone"/></svgdata-needs-voice>Call</button><button type="button" class="dk-btn blue"><svg class="ic" aria-hidden="true"><use href="#i-cal"/></svg>Book</button></div>
<div class="dk-kv"><span class="dk-lbl">Summary</span><p>Existing patient. Asked about Delta Dental coverage before booking a cleaning. Prefers mornings.</p></div>
<div class="dk-kv"><span class="dk-lbl">Details</span><dl><div><dt>Phone</dt><dd>+1 (555) 018-0142</dd></div><div><dt>Email</dt><dd>marcus.bell@example.com</dd></div></dl></div>
<div class="dk-kv"><span class="dk-lbl">Appointments</span><div class="dk-appt"><span class="cal"><svg class="ic" aria-hidden="true"><use href="#i-cal"/></svg></span><div><b>Mon, Aug 25, 10:00 AM</b><small>Consultation with Sarah</small></div></div></div>
<div class="dk-kv"><span class="dk-lbl">Internal notes</span><p style="color:var(--ink-3)">No notes yet.</p></div></div></div></div></div>
<div data-scr="schedule" class="dk-page" hidden><div class="dk-top"><div><div class="dk-h6">Schedule</div><p><svg class="ic" aria-hidden="true"><use href="#i-clock"/></svg>Everything Baxter booked, without anyone typing it in.</p></div><button type="button" class="dk-bell" aria-label="Notifications"><svg class="ic" aria-hidden="true"><use href="#i-bell"/></svg></button></div><div class="dk-scr"><div class="dk-sched"><div class="dk-schside"><div class="dk-cal"><div class="hd"><b>September</b><span class="dk-chip blue">Today</span></div><div class="dow"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div><div class="days"><span class="pad"></span><span class="has">1</span><span class="has">2</span><span class="has">3</span><span>4</span><span>5</span><span>6</span><span>7</span><span class="has">8</span><span class="has">9</span><span class="has">10</span><span class="has">11</span><span>12</span><span>13</span><span>14</span><span class="has">15</span><span class="has">16</span><span class="has">17</span><span class="has">18</span><span>19</span><span>20</span><span class="has">21</span><span class="on">22</span><span class="has">23</span><span class="has">24</span><span class="has">25</span><span>26</span><span>27</span><span class="has">28</span><span class="has">29</span><span class="has">30</span></div></div>
<div class="dk-card dk-schsum"><span class="dk-lbl">This week</span><div class="r"><span>Booked by Baxter</span><b>14</b></div><div class="r"><span>Reminders sent</span><b>22</b></div><div class="r"><span>Rescheduled by Baxter</span><b>3</b></div><div class="r"><span>No-shows</span><b>0</b></div></div></div>
<div class="dk-schbody"><div class="dk-sec-h"><b>Tuesday, September 22</b><span class="hint">6 booked, 2 openings left</span></div><div class="dk-day"><div class="dk-ev"><time>8:30 AM</time><div class="ev"><div><b>Olivia Johnson</b><small>Check-up, 30 min</small></div><span class="dk-chip blue">Booked by Baxter</span></div></div><div class="dk-ev"><time>9:15 AM</time><div class="ev"><div><b>Tom Alvarez</b><small>Follow-up, 20 min</small></div><span class="dk-chip blue">Booked by Baxter</span></div></div><div class="dk-ev open"><time>10:00 AM</time><div class="ev">Open, 45 min</div></div><div class="dk-ev"><time>10:45 AM</time><div class="ev"><div><b>Priya Nair</b><small>New patient exam, 45 min</small></div><span class="dk-chip blue">Booked by Baxter</span></div></div><div class="dk-ev"><time>1:00 PM</time><div class="ev"><div><b>Marcus Bell</b><small>Consultation with Sarah</small></div><span class="dk-chip grey">Added by you</span></div></div><div class="dk-ev"><time>2:30 PM</time><div class="ev"><div><b>Jane Doe</b><small>Cleaning, 30 min</small></div><span class="dk-chip green">Reminder sent</span></div></div><div class="dk-ev open"><time>4:00 PM</time><div class="ev">Open, 30 min</div></div></div></div></div></div></div>
</div></div></div></div>
          <p class="scroll-hint">Swipe sideways to see the full screen</p>
          <p class="tour-title" data-cap-title>Know what needs you in five seconds.</p><div class="tour-caps" data-caps><div class="it"><b>Needs you, first</b><span>The one conversation waiting on a person sits at the top, with one-tap Reply or Let Baxter continue.</span></div><div class="it"><b>What Baxter handled</b><span>Today's conversations, bookings and who needed you, at a glance.</span></div><div class="it"><b>Every channel, one switch</b><span>Pause Baxter everywhere, or channel by channel. Try the switches.</span></div></div>
          <p class="tour-note">Runs in your browser. Log in from any computer, and invite your team. The mobile app is coming soon.</p>
  </div>
</section>

<!-- voice teaser -->
<section class="sec">
  <div class="wrap">
    <div class="voice-band" style="--c:#a98cf0" data-live data-needs-voice>
      <div>
        <h2 class="h-sec">Then it picks up the phone too.</h2>
        <p class="lead" style="margin:18px 0 28px">A receptionist that sounds human, takes the calls you can't, books the job, and warm-transfers to you when it matters. No more voicemail.</p>
        <a class="btn btn-voice btn-lg" href="voice.html">Meet the AI Receptionist</a>
        <p class="fine">The AI Receptionist runs on a US or Canadian phone number today.</p>
      </div>
      <div>
        <div class="ring-wrap" aria-hidden="true"><div class="ring-core">${I.phone}</div></div>
        <div class="vchips" role="group" aria-label="Voices" data-press-group>
          <button type="button" aria-pressed="true">Ava</button><button type="button" aria-pressed="false">Noah</button><button type="button" aria-pressed="false">Mia</button><button type="button" aria-pressed="false">Sarah</button>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- how it works -->
<section class="sec" id="how">
  <div class="wrap">
    <div class="sec-head"><h2 class="h-sec">Live in minutes, from any browser.</h2></div>
    <div class="steps">
      <div class="step">
        <span class="n">1</span>
        <h3>Paste your website</h3>
        <p>It drafts your FAQ, services and prices. You approve.</p>
        <div class="shot" aria-hidden="true">
          <div class="sc-url"><span class="sc-ok" style="margin:0"></span>riveradental.com</div>
          <div class="sc-row"><span class="sc-tx"><span class="sc-name">Services</span></span><span class="sc-tag">6 found</span></div>
          <div class="sc-row"><span class="sc-tx"><span class="sc-name">FAQ answers</span></span><span class="sc-tag">12 drafted</span></div>
        </div>
      </div>
      <div class="step">
        <span class="n">2</span>
        <h3>Connect your channels</h3>
        <p><span data-na-only>WhatsApp, text, web chat and email. We guide you through SMS registration.</span><span data-wa-only hidden>WhatsApp, web chat and email. We guide you through WhatsApp Business approval.</span></p>
        <div class="shot" aria-hidden="true">
          <div class="sc-row"><span class="sc-ic">${chIcon('whatsapp')}</span><span class="sc-tx"><span class="sc-name">WhatsApp</span></span><span class="sc-ok">Connected</span></div>
          <div class="sc-row"><span class="sc-ic">${chIcon('sms')}</span><span class="sc-tx"><span class="sc-name">${mkt("SMS", "WhatsApp")}</span></span><span class="sc-ok">Connected</span></div>
          <div class="sc-row"><span class="sc-ic">${chIcon('webchat')}</span><span class="sc-tx"><span class="sc-name">Web chat</span></span><span class="sc-ok">Connected</span></div>
        </div>
      </div>
      <div class="step">
        <span class="n">3</span>
        <h3>It answers and books</h3>
        <p>With reminders and follow-ups built in. You watch it work.</p>
        <div class="shot" aria-hidden="true">
          <div class="ap-bubble in">Can I come in Thursday?</div>
          <div class="ap-bubble out" style="margin-left:auto">Thursday at 3:00 PM works. You're booked.</div>
          <div class="ap-booked"><b>Booked, reminder set</b>Thu, 3:00 PM</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- outcomes -->
<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head"><h2 class="h-sec">Time saved. Costs down. Sales never missed.</h2></div>
    <div class="outcomes">
      <div class="outcome"><b>Answers in seconds</b><span>24/7, so no lead waits for a callback.</span></div>
      <div class="outcome"><b>Costs less than a shift</b><span data-price-sentence="starter">Plans start at $59 USD a month. No receptionist hours to cover.</span></div>
      <div class="outcome"><b>Books itself</b><span>Straight into your calendar, while you do the actual work.</span></div>
    </div>
  </div>
</section>

<!-- pricing preview -->
<section class="lit-hero" style="--c:#2fc6e8;--c2:#4d86ff;padding-top:clamp(72px,9vw,110px)">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="h-sec">One recovered lead covers the month.</h2>
      <p class="lead">Every plan includes the full assistant and a monthly credit pool that covers every channel. Pick the one that fits today and move up when you're ready.</p>
      <p class="mkt-note" data-market-label>Prices for the United States, in US dollars.</p>
    </div>
    ${plans}
    <p class="plans-note">Create your account, then subscribe inside the app. No contracts, cancel anytime.</p>
    <div class="ctas" style="justify-content:center;margin-top:18px"><a class="btn btn-ghost" href="pricing.html">See all plans</a></div>
  </div>
</section>

<!-- faq -->
<section class="sec">
  <div class="wrap">
    <div class="sec-head"><h2 class="h-sec">Questions, answered.</h2></div>
    ${faqHtml(homeFaq)}
  </div>
</section>

<!-- signup path -->
<section class="sec" style="--c:#37c98b;padding-top:0">
  <div class="wrap signup">
    <div>
      <span class="pill good">From click to live</span>
      <h2 class="h-sec" style="margin-top:18px">Create your account. Your assistant is minutes away.</h2>
      <p class="lead" style="margin-top:18px">Sign up, paste your website, and watch it draft your FAQ and services. Pick your plan inside the app when you're ready to go live.</p>
      <div class="ctas"><a class="btn btn-primary btn-lg" href="${SIGNUP}">Get started</a><a class="btn btn-ghost btn-lg" href="pricing.html">See pricing</a></div>
      <p class="fine">Set it up from your computer or your phone. No contracts, cancel anytime.</p>
    </div>
    <ol class="path" aria-label="How signup works" style="list-style:none;margin:0">
      <li class="path-row"><span>1. Create your account</span><b>app.leadq.co</b></li>
      <li class="path-row"><span>2. Paste your website</span><b>In the app</b></li>
      <li class="path-row"><span>3. Approve your answers</span><b>In the app</b></li>
      <li class="path-row"><span>4. Connect channels and test</span><b>In the app</b></li>
      <li class="path-row"><span>5. Choose a plan and go live</span><b>In the app</b></li>
    </ol>
  </div>
</section>

<!-- final call -->
<section class="horizon">
  <div class="wrap">
    <h2>Your next lead isn't going to wait.</h2>
    <p class="lead">Set up your assistant in minutes, from any browser.</p>
    <div class="ctas"><a class="btn btn-primary btn-lg" href="${SIGNUP}">Get started</a></div>
  </div>
</section>`,
});

/* ======================================================= PRICING */
const yes = '<span class="yes" aria-label="Included">&#10003;</span>';
const no = '<span class="no">No</span>';
page({
  file: "pricing.html",
  title: "Pricing | LeadQ",
  desc: "LeadQ plans in your local currency. Starter, Growth and Pro, each with a monthly credit pool that covers every channel. Month to month, cancel anytime.",
  ogDesc: "Three plans in your local currency, one credit pool for every channel, and the AI Receptionist included in Pro.",
  canonical: "https://www.leadq.co/pricing.html",
  bodyAttr: 'style="--c:#2fc6e8;--c2:#4d86ff"',
  navHtml: nav("pricing"),
  main: `
<section class="lit-hero">
  <div class="wrap">
    <div class="price-top">
      <h1 class="h-hero">Plans, priced for your market.</h1>
      <p class="lead">Every plan includes the full assistant and one credit pool for all your usage. Shown in your local currency, never a conversion.</p>
      <p class="mkt-note"><span data-market-label>Prices for the United States, in US dollars.</span> <span data-mkt-note>US texting needs a one-time A2P activation. It's in the add-ons.</span></p>
    </div>
    ${plans}
    <p class="plans-note">Create your account, then subscribe inside the app. No contracts, cancel anytime.</p>

    <div class="cmp-wrap">
      <table class="cmp">
        <caption>Compare plans</caption>
        <thead><tr><th scope="col"><span class="sr-only">Feature</span></th><th scope="col">Starter</th><th scope="col" data-plan="growth" class="hot">Growth</th><th scope="col">Pro</th></tr></thead>
        <tbody>
          <tr><th scope="row">Credits a month</th><td class="mono" data-cell="starter.credits">20,000</td><td data-plan="growth" class="hot mono" data-cell="growth.credits">45,000</td><td class="mono" data-cell="pro.credits">120,000</td></tr>
          <tr><th scope="row">Seats</th><td data-cell="starter.seats">1</td><td data-plan="growth" class="hot" data-cell="growth.seats">3</td><td data-cell="pro.seats">10</td></tr>
          <tr data-na-only><th scope="row">Phone numbers</th><td>${no}</td><td data-plan="growth" class="hot">1</td><td>2</td></tr>
          <tr><th scope="row">Channels</th><td data-cell="starter.channels">1</td><td data-plan="growth" class="hot" data-cell="growth.channels">3</td><td data-pro-channels>All</td></tr>
          <tr><th scope="row">Assistant, FAQ and lead capture</th><td>${yes}</td><td data-plan="growth" class="hot">${yes}</td><td>${yes}</td></tr>
          <tr><th scope="row">Booking, calendar and reminders</th><td><span data-na-only>${no}</span><span data-wa-only hidden>${yes}</span></td><td data-plan="growth" class="hot">${yes}</td><td>${yes}</td></tr>
          <tr><th scope="row">Follow-ups, custom fields, profiles</th><td><span data-na-only>${no}</span><span data-wa-only hidden>${yes}</span></td><td data-plan="growth" class="hot">${yes}</td><td>${yes}</td></tr>
          <tr><th scope="row">Insights dashboard</th><td>${no}</td><td data-plan="growth" class="hot">${no}</td><td>${yes}</td></tr>
          <tr><th scope="row">Priority support</th><td>${no}</td><td data-plan="growth" class="hot">${no}</td><td>${yes}</td></tr>
          <tr><th scope="row">Calendar sync with Google and Outlook</th><td><span data-na-only>${no}</span><span data-wa-only hidden>${yes}</span></td><td data-plan="growth" class="hot">${yes}</td><td>${yes}</td></tr>
          <tr data-needs-voice><th scope="row">AI voice receptionist</th><td>${no}</td><td data-plan="growth" class="hot">${no}</td><td><span class="yes voice" aria-label="Included">&#10003;</span></td></tr>
        </tbody>
      </table>
    </div>

    <div class="voice-strip" style="--c:#a98cf0" data-needs-voice>
      <div class="vr" aria-hidden="true"></div>
      <div><b><a href="voice.html">AI Receptionist, part of Pro</a></b><span>The same assistant answers the phone, books live and captures every missed call. Inbound first, outbound later.</span></div>
      <div class="amt">Included<small>About 220 credits a minute</small></div>
    </div>

    <div class="tables">
      <div class="tbox">
        <h2>One credit pool for everything</h2>
        <table>
          <tr><td>AI conversation<small>One thread with one customer, per day</small></td><td>~80</td></tr>
          <tr data-needs-sms><td>Text you send<small>Per segment</small></td><td>~17</td></tr>
          <tr data-needs-sms><td>Text you receive<small>Per segment</small></td><td>~8</td></tr>
          <tr><td>WhatsApp reply<small>Counted in the conversation above</small></td><td>Included</td></tr>
          <tr data-na-only><td>Voice minute<small>Every voice, standard and premium</small></td><td>~220</td></tr>
          <tr><td>Email you send</td><td>~1</td></tr>
        </table>
        <p class="foot" data-credits-note>So Growth's 45,000 credits is around 550 AI conversations, or any mix of texts, calls and email. WhatsApp's own conversation fees are billed by Meta, on your WhatsApp Business account.</p>
      </div>
      <div class="tbox">
        <h2>Top up anytime. Top-ups never expire.</h2>
        <table>
          <tr><td>Small<small>10,000 credits</small></td><td data-pack="small">$25 USD</td></tr>
          <tr><td>Standard<small>25,000 credits</small></td><td data-pack="standard">$55 USD</td></tr>
          <tr><td>Large<small>60,000 credits</small></td><td data-pack="large">$120 USD</td></tr>
          <tr><td>Bulk<small>150,000 credits</small></td><td data-pack="bulk">$270 USD</td></tr>
        </table>
      </div>
      <div class="tbox full">
        <h2>Add-ons. Four extras, that's the whole menu.</h2>
        <table>
          <tr><td>Extra phone number<small>Monthly</small></td><td data-addon="number">$8 USD/mo</td></tr>
          <tr><td>Extra seat<small>Monthly</small></td><td data-addon="seat">$15 USD/mo</td></tr>
          <tr><td>Done-for-you setup and knowledge base load<small>One-time, if you'd rather we set it up</small></td><td data-addon="setup">$299 USD once</td></tr>
          <tr><td>SMS activation, A2P<small>One-time, US only</small></td><td data-addon="a2p">$99 USD once</td></tr>
        </table>
      </div>
    </div>
    <p class="fine-print">Month to month. No contracts, cancel anytime. Your monthly credits cover every channel and reset each cycle. Credits you buy never expire. If your subscription ends, we release any phone numbers on it.</p>
  </div>
</section>

<section class="horizon">
  <div class="wrap">
    <h2>One recovered lead covers the month.</h2>
    <p class="lead">Create your account, set up your assistant, and pick a plan inside the app.</p>
    <div class="ctas"><a class="btn btn-primary btn-lg" href="${SIGNUP}">Get started</a></div>
  </div>
</section>`,
});

/* ======================================================= VOICE */
const voicePicker = phone({
  label: "Choosing a receptionist voice in the LeadQ app",
  tab: "assistant",
  header: `<div class="ap-header plain"><span class="ap-back">${I.back}</span><span class="ap-hname">Choose a voice</span></div>`,
  body: `<div class="ap-voice" data-voice-cycle>
              <div class="ap-vgroup">Accent</div>
              <div class="ap-vflags"><span class="ap-vflag sel">American</span><span class="ap-vflag">British</span><span class="ap-vflag">French</span></div>
              <div class="ap-vgroup">Standard</div>
              <div class="ap-vgrid"><span class="ap-vtile sel">Ava${I.play}</span><span class="ap-vtile">Noah${I.play}</span><span class="ap-vtile">Mia${I.play}</span></div>
              <div class="ap-vgroup">Premium</div>
              <div class="ap-vgrid"><span class="ap-vtile">Sarah${I.play}</span><span class="ap-vtile">Brian${I.play}</span><span class="ap-vtile">Alice${I.play}</span></div>
              <div class="ap-vgroup">Speaking pace</div>
              <div class="ap-pace"><span>Slower</span><span class="sel">Natural</span><span>Brisk</span></div>
            </div>`,
});

page({
  file: "voice.html",
  title: "AI Receptionist | LeadQ Voice",
  desc: "The same LeadQ assistant now answers the phone. It picks up every inbound call, books live against your calendar, and warm-transfers to you when it matters. Included in Pro.",
  ogDesc: "The same assistant now answers the phone. It picks up every inbound call, books live, and warm-transfers to you when it matters.",
  canonical: "https://www.leadq.co/voice.html",
  bodyAttr: 'class="page-voice" style="--c:#a98cf0;--c2:#7b5bd6"',
  navHtml: nav("voice", { voice: true }),
  main: `
<section class="sec" data-wa-only hidden>
  <div class="wrap">
    <div class="note-card">
      <h1 class="h-sec">The AI Receptionist isn't available in the UAE.</h1>
      <p class="lead">AI voice agents aren't permitted on UAE networks, so we don't offer one there. Everything else LeadQ does works exactly as it should: WhatsApp, web chat and email, answered around the clock, booking straight into your calendar.</p>
      <div class="ctas"><a class="btn btn-primary btn-lg" href="pricing.html">See UAE plans</a><a class="btn btn-ghost btn-lg" href="index.html">How LeadQ works</a></div>
    </div>
  </div>
</section>
<section class="lit-hero" data-live data-needs-voice>
  <div class="wrap">
    <div class="voice-hero">
      <div>
        <span class="pill">AI Receptionist, part of Pro</span>
        <h1 class="h-hero">The same assistant. Now it picks up.</h1>
        <p class="lead">It answers every inbound call in your assistant's persona and voice, books live against your real calendar, and hands off to you on your rules. No more voicemail.</p>
        <div class="vchips" role="group" aria-label="Voices" data-press-group style="justify-content:flex-start">
          <button type="button" aria-pressed="true">Ava</button><button type="button" aria-pressed="false">Noah</button><button type="button" aria-pressed="false">Mia</button><button type="button" aria-pressed="false">Sarah</button>
        </div>
        <div class="call-log" aria-label="Call transcript">
          <div class="ln"><span>00:02</span><span>"Hi, do you have any openings tomorrow?"</span></div>
          <div class="ln"><span>00:05</span><span>Baxter: "We do. I can offer 9:30 AM or 2:00 PM. Which works best?"</span></div>
          <div class="ln"><span>00:11</span><span>"2 o'clock is perfect."</span></div>
          <div class="ln done"><span>00:14</span><span>Booked for tomorrow at 2:00 PM, and confirmed by text.</span></div>
        </div>
      </div>
      <div class="dial" aria-hidden="true">
        <svg viewBox="0 0 400 400">
          <defs>
            <linearGradient id="vg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e3d8ff"/><stop offset="1" stop-color="#7b5bd6"/></linearGradient>
            <filter id="gl" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>
          </defs>
          <g class="tick-rot" stroke="rgba(195,174,246,.35)" stroke-width="2">
            <line x1="200" y1="8" x2="200" y2="24"/><line x1="200" y1="376" x2="200" y2="392"/><line x1="8" y1="200" x2="24" y2="200"/><line x1="376" y1="200" x2="392" y2="200"/>
            <line x1="64" y1="64" x2="74" y2="74"/><line x1="336" y1="64" x2="326" y2="74"/><line x1="64" y1="336" x2="74" y2="326"/><line x1="336" y1="336" x2="326" y2="326"/>
          </g>
          <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="22"/>
          <circle cx="200" cy="200" r="150" fill="none" stroke="url(#vg)" stroke-width="22" stroke-linecap="round" stroke-dasharray="942" stroke-dashoffset="330" transform="rotate(-90 200 200)" filter="url(#gl)" opacity=".6"/>
          <circle cx="200" cy="200" r="150" fill="none" stroke="url(#vg)" stroke-width="16" stroke-linecap="round" stroke-dasharray="942" stroke-dashoffset="330" transform="rotate(-90 200 200)"/>
          <circle cx="79" cy="288" r="11" fill="#fff"/>
        </svg>
        <div class="dial-center"><div><b>Live call</b><small>Answered by Baxter</small><div class="wave"><i style="animation-delay:0s"></i><i style="animation-delay:.12s"></i><i style="animation-delay:.24s"></i><i style="animation-delay:.06s"></i><i style="animation-delay:.3s"></i><i style="animation-delay:.18s"></i><i style="animation-delay:.08s"></i></div></div></div>
      </div>
    </div>
    <div class="vstats">
      <div class="vstat"><b>Pro</b><span>Included, runs from your credit pool</span></div>
      <div class="vstat"><b>~40</b><span>Voices across accents</span></div>
      <div class="vstat"><b>24/7</b><span>Every inbound call answered</span></div>
    </div>
    <p class="fine" style="text-align:center">Voice runs on a US or Canadian phone number today, and comes with the Pro plan.</p>
  </div>
</section>

<section data-needs-voice class="sec">
  <div class="wrap picker">
    <div>
      <h2 class="h-sec">Choose a voice your callers will trust.</h2>
      <p class="lead" style="margin-top:18px">Nearly 40 voices across American, British and French accents, standard and premium. Preview any of them in the app, set the speaking pace, and you're done. It's the one thing you can't judge from words on a page, so press play.</p>
    </div>
    ${voicePicker}
  </div>
</section>

<section data-needs-voice class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head"><h2 class="h-sec">A receptionist that never misses.</h2></div>
    <div class="oncall">
      <div class="tile"><span class="ic">${I.phone}</span><h3>Answers 24/7</h3><p>Every inbound call, in your persona and your chosen voice.</p></div>
      <div class="tile"><span class="ic">${I.calcheck}</span><h3>Books live</h3><p>Books, reschedules and cancels against your real calendar.</p></div>
      <div class="tile"><span class="ic">${I.book}</span><h3>Knows your business</h3><p>Answers from the same knowledge base as your texts.</p></div>
      <div class="tile"><span class="ic">${I.user}</span><h3>Captures the caller</h3><p>Their details, the call log, and the full transcript.</p></div>
      <div class="tile"><span class="ic">${I.transfer}</span><h3>Transfers to you</h3><p>A warm handoff whenever your rules say so.</p></div>
      <div class="tile"><span class="ic">${I.wave}</span><h3>Handles real calls</h3><p>Interruptions, silences, tricky names, and your call flow.</p></div>
    </div>
  </div>
</section>

<section data-needs-voice class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="h-sec">Not a second robot.</h2>
      <p class="lead">It's the same assistant. It just answers the phone too. Change your hours once and the phone knows. Add a service and it can quote the duration on a call that same afternoon.</p>
    </div>
    <div class="twin">
      <div class="card">
        <div class="twin-h"><span class="pill" style="--c:#4d86ff">WhatsApp</span>Monday, 6:12 PM</div>
        <div class="thread">
          <div class="bub in">Do you do evening appointments?</div>
          <div class="bub out">We're open until 7:00 PM on Thursdays. Want me to look at this week?</div>
          <div class="bub in">I'll call tomorrow to sort it</div>
        </div>
      </div>
      <div class="card">
        <div class="twin-h"><span class="pill">Phone call</span>Tuesday, 9:04 AM</div>
        <div class="thread">
          <div class="bub in">"Hi, I messaged yesterday about an evening slot."</div>
          <div class="bub out">"I see that. Thursday at 6:00 PM is open. Shall I book it?"</div>
          <div class="bub in">"Yes, perfect."</div>
        </div>
        <div class="shared-booking"><b>Booked, Thu 6:00 PM</b>One contact, one conversation history, on both channels.</div>
      </div>
    </div>
  </div>
</section>

<section data-needs-voice class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="priceblock">
      <div>
        <h2 class="h-sec">Stop sending callers to voicemail.</h2>
        <p class="lead" style="margin-top:18px">The AI Receptionist comes with Pro and runs from the same monthly credit pool as your texts. A call uses about 220 credits a minute, since it costs more than a message. Right now it answers your calls. Outbound calling is on the roadmap.</p>
        <div class="ctas"><a class="btn btn-voice btn-lg" href="${SIGNUP}&plan=pro">Get Pro</a><a class="btn btn-ghost btn-lg" href="pricing.html">See all pricing</a></div>
        <p class="fine">The AI Receptionist runs on a US or Canadian phone number today. It isn't available in the UAE yet.</p>
      </div>
      <div class="plan-pro">
        <h3>Pro</h3>
        <div class="amt"><span data-price="pro">$399</span><small> <span data-code>USD</span> /mo</small></div>
        <p>AI Receptionist included. 120,000 credits a month, 10 seats and 2 phone numbers. No contracts, cancel anytime.</p>
      </div>
    </div>
  </div>
</section>`,
});

/* ======================================================= USE CASES */
page({
  file: "use-cases.html",
  title: "Use cases | LeadQ for clinics, salons, trades and agents",
  desc: "See how the LeadQ assistant works for your business. Pick your industry and watch the app fill with your kind of bookings, from dental clinics to home services.",
  ogDesc: "Pick your industry and watch the app fill with your kind of bookings, from dental clinics to home services.",
  canonical: "https://www.leadq.co/use-cases.html",
  bodyAttr: 'style="--c:#2dd4bf"',
  navHtml: nav("use-cases"),
  main: `
<section class="lit-hero uc-hero photo-host" data-industry-hero>
  <div class="ph">${picture("dental", "A patient in a modern dental clinic", true)}</div>
  <div class="wrap">
    <div>
      <span class="pill" data-uc-pill>Dental and clinics</span>
      <h1 class="h-hero" data-uc-h>Built for how clinics actually work.</h1>
      <p class="lead" data-uc-p>It answers every ${mkt("call", "message")}, books the chair, and reminds them the day before. Even while you're with a patient.</p>
      <div class="tabs" role="group" aria-label="Industry">
        <button type="button" data-industry="dental" aria-pressed="true">Dental and clinics</button>
        <button type="button" data-industry="salon" aria-pressed="false">Salons</button>
        <button type="button" data-industry="home" aria-pressed="false">Home services</button>
        <button type="button" data-industry="realestate" aria-pressed="false">Real estate</button>
      </div>
      <div class="ctas"><a class="btn btn-primary btn-lg" href="${SIGNUP}">Get started</a><a class="btn btn-ghost btn-lg" href="pricing.html">See pricing</a></div>
    </div>
    ${phone({
      label: "The Schedule tab in the LeadQ app, filled with this industry's bookings",
      tab: "schedule",
      header: scheduleHeader,
      body: scheduleBody([["10:00", "AM", "Marcus Bell", "Consultation, Sarah", "Booked, reminder sent"], ["2:30", "PM", "Jane Doe", "Cleaning, Dr. Rivera"], ["4:00", "PM", "Priya Nair", "New patient, Dr. Rivera"]], { rowCls: "uc-appt" }),
    })}
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head"><h2 class="h-sec">See it set up for your world.</h2></div>
    <div class="uc-tiles">
      <a class="uc-tile" href="for-dental.html" style="--c:#2dd4bf"><div class="ph fade-up">${picture("dental", "A patient in a modern dental clinic")}</div><h3>Dental and clinics</h3><p class="sub">Fill chairs, cut no-shows</p><span class="go">Explore <em aria-hidden="true">+</em></span></a>
      <a class="uc-tile" href="for-salons.html" style="--c:#f27eb4"><div class="ph fade-up">${picture("salon", "A stylist working in a hair salon")}</div><h3>Salons</h3><p class="sub">Reply while your hands are full</p><span class="go">Explore <em aria-hidden="true">+</em></span></a>
      <a class="uc-tile" href="for-home-services.html" style="--c:#f5a524"><div class="ph fade-up">${picture("home", "A technician on a home services job")}</div><h3>Home services</h3><p class="sub">Book jobs from the field</p><span class="go">Explore <em aria-hidden="true">+</em></span></a>
      <a class="uc-tile" href="for-real-estate.html" style="--c:#7dd3fc"><div class="ph fade-up">${picture("realestate", "A modern home exterior for sale")}</div><h3>Real estate</h3><p class="sub">Answer leads in seconds</p><span class="go">Explore <em aria-hidden="true">+</em></span></a>
    </div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head"><h2 class="h-sec">The same problems, in every trade.</h2></div>
    <div class="ww">
      <div class="without"><h3>Without LeadQ</h3><ul><li>${mkt("The phone rings while you're with a customer", "Messages arrive while you're with a customer")}</li><li>Messages sit unread until tonight</li><li>New leads book with whoever answers first</li></ul></div>
      <div class="with"><h3>With LeadQ</h3><ul><li>${mkt("Every call and message answered in seconds", "Every message answered in seconds")}</li><li>Booked straight into your calendar, reminders sent</li><li>Follow-ups go out while you work</li></ul></div>
    </div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="h-sec">If you book appointments, it fits.</h2>
      <p class="lead">It learns any business the same way. These are just the ones we hear from most.</p>
    </div>
    <div class="chips"><span>Dental</span><span>Med spas</span><span>Chiro and physio</span><span>Salons</span><span>Barbershops</span><span>HVAC</span><span>Plumbing</span><span>Electrical</span><span>Cleaning</span><span>Real estate</span><span>Fitness studios</span><span>Auto shops</span></div>
  </div>
</section>

<section class="horizon">
  <div class="wrap">
    <h2>See it with your own bookings.</h2>
    <p class="lead">Set it up in your browser in minutes. It learns your business, then gets to work.</p>
    <div class="ctas"><a class="btn btn-primary btn-lg" href="${SIGNUP}">Get started</a><a class="btn btn-ghost btn-lg" href="pricing.html">See pricing</a></div>
  </div>
</section>`,
});

/* ======================================================= INDUSTRY PAGES */
const VERTICALS = [
  {
    file: "for-dental.html", c: "#2dd4bf", img: "dental", alt: "A patient in a modern dental clinic", crumb: "Dental clinics",
    title: "AI receptionist for dental clinics | LeadQ",
    desc: "LeadQ is an AI receptionist for dental and aesthetic clinics. It answers every call and text, books and confirms appointments, cuts no-shows, and captures new patients 24/7.",
    service: "An AI assistant that answers calls, texts and web chat for dental practices, books appointments, sends reminders and captures new patients 24/7.",
    pill: "For dental and aesthetic clinics",
    h1: "The receptionist your practice never has to train.",
    h1Wa: "The front desk your practice never has to train.",
    body: "It answers every call and message, books the chair, confirms the day before, and captures new patients while you're with a patient. On WhatsApp, text, web chat and the phone.",
    bodyWa: "It answers every message, books the chair, confirms the day before, and captures new patients while you're with a patient. On WhatsApp, web chat and email.",
    rows: [["10:00", "AM", "Marcus Bell", "Consultation, Sarah", "Booked, reminder sent"], ["2:30", "PM", "Jane Doe", "Cleaning, Dr. Rivera"], ["4:00", "PM", "Priya Nair", "New patient, Dr. Rivera"]],
    h2: "A front desk that never goes to voicemail.",
    h2Wa: "A front desk that never leaves a message unread.",
    without: ["The phone rings mid-procedure", "No-shows leave empty chairs", "New patients call after you've closed"],
    withoutWa: ["Messages pile up mid-procedure", null, "New patients message after you've closed"],
    withWa: ["Answered while you're with a patient", null, null],
    with: ["Answered while you're with a patient", "Confirmations and reminders cut no-shows", "New patients booked at 11pm"],
    noun: "patient",
    faqTitle: "Dental clinics ask us",
    faq: [
      ["Can it book straight into our calendar?", "Yes. It checks real availability, books, reschedules and cancels against your calendar, and sends the confirmation and reminder automatically."],
      ["Will it cut no-shows?", "It confirms every booking and sends a reminder the day before, which is where most no-shows disappear."],
      ["Does it book new patients after hours?", "Yes, 24/7. It books them on the spot, straight into your calendar."],
      ["Will it sound like our practice?", "It learns your services, policies and tone, so replies read like your front desk, not a generic bot."],
      ["How long does setup take?", "Minutes. Point it at your website, it drafts your FAQ and services, you approve, then connect your number."],
    ],
    close: "Fill more chairs. Answer every patient.",
    closeBody: "Set it up in your browser in minutes. It learns your practice, then gets to work.",
  },
  {
    file: "for-salons.html", c: "#f27eb4", img: "salon", alt: "A stylist working in a hair salon", crumb: "Salons",
    title: "AI receptionist for salons and barbershops | LeadQ",
    desc: "LeadQ is an AI receptionist for salons and barbershops. It replies while your hands are full, books the seat, reschedules in seconds, and answers every call and text.",
    service: "An AI assistant that answers calls, texts and web chat for salons and barbershops, books and reschedules appointments, and confirms bookings.",
    pill: "For salons and barbershops",
    h1: "Books while your hands are full.",
    body: "It answers every call and text, books the seat, reschedules in seconds, and confirms the day before. So you can keep cutting.",
    bodyWa: "It answers every message, books the seat, reschedules in seconds, and confirms the day before. So you can keep cutting.",
    rows: [["11:00", "AM", "Chloe Tan", "Balayage, Mia", "Booked, reminder sent"], ["1:30", "PM", "Aria West", "Cut and color, Jordan"], ["3:00", "PM", "Sam Cole", "Men's cut, Riley"]],
    h2: "Never miss a booking mid-cut.",
    without: ["You can't text back mid-cut", "Last-minute changes blow up the day", "Missed calls become missed bookings"],
    withoutWa: ["You can't reply mid-cut", null, "Unanswered messages become missed bookings"],
    with: ["Replies while your hands are full", "Reschedules in seconds", "Answers every call and text, and books it"],
    withWa: [null, null, "Answers every message, and books it"],
    noun: "customer",
    faqTitle: "Salons and barbershops ask us",
    faq: [
      ["Can it reply while I'm with a client?", "Yes. It handles the whole conversation on whichever channel they used and books it, so you never stop mid-cut."],
      ["Can I still jump in myself?", "Any time. Pause it on a channel, reply yourself, and switch it back on."],
      ["Will it take bookings after hours?", "Yes, 24/7. It books, reschedules and confirms around the clock and sends reminders the day before."],
      ["How long does setup take?", "Minutes, in your browser. It learns your services and prices from your website, and you approve before it goes live."],
    ],
    close: "Keep every chair full.",
    closeBody: "Set it up in your browser in minutes. It learns your salon, then gets to work.",
  },
  {
    file: "for-home-services.html", c: "#f5a524", img: "home", alt: "A technician on a home services job", crumb: "Home services",
    title: "AI receptionist for home services, HVAC and plumbing | LeadQ",
    desc: "LeadQ is an AI receptionist for home services businesses. It answers calls while you're on the job, books the visit, handles after-hours emergencies, and captures quote details.",
    service: "An AI assistant for HVAC, plumbing, electrical and other home services that answers calls and texts, books visits, handles after-hours emergencies and captures quote details.",
    pill: "For home services",
    h1: "Answers while you're on the job.",
    body: "HVAC, plumbing, electrical, cleaning and more. It picks up every call, books the visit, answers after-hours emergencies, and captures what you need to quote.",
    bodyWa: "HVAC, plumbing, electrical, cleaning and more. It answers every message, books the visit, handles after-hours emergencies, and captures what you need to quote.",
    rows: [["8:00", "AM", "Dana Ruiz", "AC tune-up, Dave", "Booked, reminder sent"], ["11:30", "AM", "Owen Park", "Furnace repair, Miguel"], ["2:00", "PM", "Nina Blake", "On-site estimate, Dave"]],
    h2: "Win the job without leaving the ladder.",
    without: ["You're on a roof, not on the phone", "After-hours calls go to voicemail", "Job details get lost in texts"],
    withoutWa: ["You're on a roof, not on your phone", "After-hours messages sit unread", "Job details get lost in chats"],
    with: ["Books the job while you're on site", "Answers emergencies at 2am", "Captures the details for the quote"],
    noun: "job",
    faqTitle: "Home services teams ask us",
    faq: [
      ["Does it answer emergencies after hours?", "Yes, 24/7. It gets the details, books the visit, and hands urgent jobs to you on your rules."],
      ["Can it capture what I need to quote?", "It asks the questions you set and logs the details on the job, so you arrive prepared."],
      ["What if I'm on a job and can't talk?", "It handles the whole conversation and books for you. You get the booking without stopping."],
      ["Which channels does it cover?", "WhatsApp, text and web chat, plus your phone line on the Pro plan. One assistant across all of them."],
      ["How fast is setup?", "Minutes, in your browser. It learns your services and service area from your website."],
    ],
    close: `Book more jobs. ${mkt("Miss fewer calls.", "Miss fewer messages.")}`,
    closeBody: "Set it up in your browser in minutes. It learns your business, then gets to work.",
  },
  {
    file: "for-real-estate.html", c: "#7dd3fc", img: "realestate", alt: "A modern home exterior for sale", crumb: "Real estate",
    title: "AI assistant for real estate agents | LeadQ",
    desc: "LeadQ is an AI assistant for real estate agents. It replies to new leads in seconds, books showings around your calendar, qualifies buyers, and follows up automatically.",
    service: "An AI assistant for real estate agents that replies to new leads in seconds, books showings, qualifies buyers and follows up across WhatsApp, text, web chat and email.",
    pill: "For real estate",
    h1: "Answers leads before they go cold.",
    body: "It replies to new enquiries in seconds, books the showing around your day, qualifies the buyer, and follows up. No lead waits while you're at a closing.",
    rows: [["9:30", "AM", "Liam Ford", "Showing, 14 Oak St", "Booked, reminder sent"], ["12:00", "PM", "Sofia Reyes", `${mkt("Buyer call, Ana", "Buyer chat, Ana")}`], ["4:30", "PM", "Noah Kim", "Listing visit, 8 Elm Ave"]],
    h2: "Be first to every lead, every time.",
    without: ["Leads go cold in minutes", "Showings clash across your day", "You're at a closing, phone ringing"],
    withoutWa: [null, null, "You're at a closing, messages stacking up"],
    with: ["Replies to new leads in seconds", "Books showings around your calendar", "Qualifies the buyer before you call"],
    withWa: [null, null, "Qualifies the buyer before you reply"],
    noun: "client",
    faqTitle: "Agents ask us",
    faq: [
      ["How fast does it reply to leads?", "In seconds, any hour. Speed to lead is the whole game, and it never sleeps."],
      ["Can it book showings?", "Yes, around your live calendar, and it sends the confirmation and reminder."],
      ["Does it qualify buyers?", "It asks the questions you set, like budget, timeline and pre-approval, and logs the answers before you call."],
      ["Which channels does it cover?", "WhatsApp, text, web chat and email, plus your phone line on the Pro plan."],
      ["Will it sound like me?", "It learns your voice and your listings, so replies feel personal, not automated."],
    ],
    close: "Never lose a lead to a slow reply.",
    closeBody: "Set it up in your browser in minutes. It learns your market, then gets to work.",
  },
];

VERTICALS.forEach((v) => {
  const others = VERTICALS.filter((o) => o !== v).map((o) => `<a href="${o.file}">${o.crumb}</a>`).join("");
  page({
    file: v.file,
    title: v.title,
    desc: v.desc,
    canonical: `https://www.leadq.co/${v.file}`,
    bodyAttr: `style="--c:${v.c}"`,
    jsonld: [
      JSON.stringify({ "@context": "https://schema.org", "@type": "Service", name: `LeadQ ${v.title.split(" | ")[0].replace(/^AI/, "AI")}`, serviceType: "AI receptionist and booking assistant", provider: { "@type": "Organization", name: "LeadQ", url: "https://www.leadq.co" }, areaServed: ["US", "CA", "AE"], description: v.service }),
      JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.leadq.co/" }, { "@type": "ListItem", position: 2, name: "Use cases", item: "https://www.leadq.co/use-cases.html" }, { "@type": "ListItem", position: 3, name: v.crumb, item: `https://www.leadq.co/${v.file}` }] }),
      faqLd(v.faq),
    ],
    navHtml: nav("use-cases"),
    main: `
<section class="lit-hero vp-hero photo-host">
  <div class="ph">${picture(v.img, v.alt, true)}</div>
  <div class="wrap">
    <div>
      <span class="pill">${v.pill}</span>
      <h1 class="h-hero">${mkt(v.h1, v.h1Wa)}</h1>
      <p class="lead">${mkt(v.body, v.bodyWa)}</p>
      <div class="ctas"><a class="btn btn-primary btn-lg" href="${SIGNUP}">Get started</a><a class="btn btn-ghost btn-lg" href="pricing.html">See pricing</a></div>
    </div>
    ${phone({ label: `The LeadQ app Schedule, filled with ${v.crumb.toLowerCase()} bookings`, tab: "schedule", header: scheduleHeader, body: scheduleBody(v.rows) })}
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head"><h2 class="h-sec">${mkt(v.h2, v.h2Wa)}</h2></div>
    <div class="ww">
      <div class="without"><h3>Without LeadQ</h3><ul>${v.without.map((x, i) => `<li>${mkt(x, v.withoutWa && v.withoutWa[i])}</li>`).join("")}</ul></div>
      <div class="with"><h3>With LeadQ</h3><ul>${v.with.map((x, i) => `<li>${mkt(x, v.withWa && v.withWa[i])}</li>`).join("")}</ul></div>
    </div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap roi-sec">
    <div>
      <h2 class="h-sec">What slow replies cost you.</h2>
      <p class="lead" style="margin-top:18px">Set how many ${mkt("calls and messages", "messages")} slip through in a week, and what a new ${v.noun} is worth to you. The rest is simple math.</p>
    </div>
    <div class="roi" data-roi>
      <label for="roi-missed"><span><span data-na-only>Missed calls and messages per week</span><span data-wa-only hidden>Messages you miss or answer late, per week</span></span><b data-roi-missed-out>10</b></label>
      <input id="roi-missed" type="range" min="1" max="60" step="1" value="10" data-roi-missed>
      <label for="roi-value"><span>Average value of a new ${v.noun}</span><b data-roi-value-out>$250</b></label>
      <input id="roi-value" type="range" min="50" max="1500" step="50" value="250" data-roi-value>
      <div class="out"><span>Revenue at stake each month</span><b data-roi-out aria-live="polite">$10,833</b></div>
      <p class="fine">Your numbers, not ours. Weekly figure times 52, divided by 12.</p>
    </div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head"><h2 class="h-sec">${v.faqTitle}</h2></div>
    ${faqHtml(v.faq)}
  </div>
</section>

<section class="horizon">
  <div class="wrap">
    <h2>${v.close}</h2>
    <p class="lead">${v.closeBody}</p>
    <div class="ctas"><a class="btn btn-primary btn-lg" href="${SIGNUP}">Get started</a><a class="btn btn-ghost btn-lg" href="pricing.html">See pricing</a></div>
    <nav class="vp-others" aria-label="Other industries">${others}</nav>
  </div>
</section>`,
  });
});

/* ======================================================= ABOUT */
page({
  file: "about.html",
  title: "About LeadQ",
  desc: "LeadQ is one AI assistant that answers every channel and books the appointment for local businesses. One app, instead of five tools and a front desk you can't always staff.",
  ogDesc: "One AI assistant that answers every channel and books the appointment. One app, instead of five tools and a front desk you can't always staff.",
  canonical: "https://www.leadq.co/about.html",
  bodyAttr: 'style="--c:#ffb38a;--c2:#4d86ff"',
  navHtml: nav(null),
  main: `
<section class="lit-hero">
  <div class="wrap">
    <div class="about-hero">
      <span class="pill">About LeadQ</span>
      <h1 class="h-hero">One app, instead of five tools and a front desk.</h1>
      <p class="lead">LeadQ is one AI assistant for your whole business. It answers ${mkt("WhatsApp, SMS, web chat, email and your phone line", "WhatsApp, web chat and email")}, and it books the appointment while you work.</p>
    </div>
    <div class="founders">
      <figure class="founder"><div class="frame"><picture><source srcset="img/team/rob.webp" type="image/webp"><img src="img/team/rob.jpg" alt="Rob, co-founder of LeadQ" width="520" height="688" decoding="async"></picture></div><figcaption><b>Rob</b><span>Co-founder</span></figcaption></figure>
      <figure class="founder"><div class="frame"><picture><source srcset="img/team/amr.webp" type="image/webp"><img src="img/team/amr.jpg" alt="Amr, co-founder of LeadQ" width="520" height="652" decoding="async"></picture></div><figcaption><b>Amr</b><span>Co-founder</span></figcaption></figure>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap story">
    <h2 class="h-sec">Every missed message is a job someone else books.</h2>
    <p class="lead">Local businesses lose real money in the gap between a customer reaching out and someone getting back to them. It happens at midnight, on a Sunday, and in the twenty minutes you were with another customer. ${mkt("Missed calls and unread texts", "Unread messages and slow replies")} don't add up to lost messages. They add up to lost bookings.</p>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap story">
    <h2 class="h-sec">You shouldn't need five tools to answer a customer.</h2>
    <p class="lead">Most small teams stitch together a chat widget, ${mkt("a texting app, an inbox, a booking tool and a receptionist", "an inbox, a booking tool and a WhatsApp number on someone's phone")}, and still drop messages. It should be one assistant that knows your business, speaks in your voice, and works every channel the same way. So that's what we built.</p>
  </div>
</section>

<section class="horizon" style="text-align:left">
  <div class="wrap">
    <div class="story" style="text-align:center">
      <h2 class="h-sec" style="margin:0 auto">An app you run yourself.</h2>
      <p class="lead" style="margin:18px auto 0">Not an agency. Not a service you wait on. You set it up in your browser in minutes, it learns your services and your tone, and it starts answering. You stay in control, and you can jump into any conversation whenever you want.</p>
    </div>
    <div class="grid g3" style="margin-top:44px">
      <div class="card"><h3>Every channel</h3><p>${mkt("WhatsApp, SMS, web chat, email, and your phone line on Pro.", "WhatsApp, plus web chat and email on Pro.")}</p></div>
      <div class="card"><h3>Books the work</h3><p>Checks real availability, books, reschedules and reminds.</p></div>
      <div class="card"><h3>Sounds like you</h3><p>Replies read like your business, not a bot.</p></div>
    </div>
    <div class="ctas" style="justify-content:center;margin-top:36px"><a class="btn btn-primary btn-lg" href="${SIGNUP}">Get started</a><a class="btn btn-ghost btn-lg" href="use-cases.html">See it for your industry</a></div>
  </div>
</section>`,
});

/* ======================================================= LEGAL (text carried over unchanged from HEAD) */
const slug = (s) => s.toLowerCase().replace(/&amp;/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
// The legal copy is lifted verbatim from the last pre-redesign commit. Pinning the commit
// matters: once the redesign is merged, HEAD holds the rebuilt page, and re-reading HEAD
// would parse this generator's own output instead of the original text.
const LEGAL_SRC = "7210f5b";

function legal(file, title, updatedFallback, desc) {
  const src = execSync(`git show ${LEGAL_SRC}:${file}`, { cwd: R, encoding: "utf8" });
  const intro = src.match(/<p class="policy-intro">([\s\S]*?)<\/p>/)[1];
  const updated = (src.match(/<p class="page-hero-sub">([\s\S]*?)<\/p>/) || [, updatedFallback])[1];
  const sections = [...src.matchAll(/<div class="policy-section">([\s\S]*?)<\/div>/g)].map((m) => {
    const inner = m[1].trim().replace(/ class="terms-list"/g, "").replace(/var\(--font-mono\)/g, "var(--mono)");
    const h = inner.match(/<h2>([\s\S]*?)<\/h2>/)[1];
    return `<section id="${slug(h)}">\n        ${inner}\n      </section>`;
  });
  page({
    file, title: `${title} | LeadQ`, desc, canonical: `https://www.leadq.co/${file}`, robots: "noindex, follow",
    ogImage: "https://www.leadq.co/LeadQOpenGraph.png",
    bodyAttr: 'class="no-glow"', navHtml: nav(null), legal: true,
    main: `
<div class="legal-page">
  <div class="wrap">
    <header class="legal-head"><h1>${title}</h1><p>${updated}</p></header>
    <div class="legal-grid">
      <nav class="toc" aria-label="Contents"></nav>
      <article class="legal-body">
      <p class="intro">${intro}</p>
      ${sections.join("\n      ")}
      </article>
    </div>
  </div>
</div>`,
  });
}
legal("privacy-policy.html", "Privacy Policy", "Last updated: September 2026", "LeadQ's privacy policy outlining how we collect, use, and protect your personal information.");
legal("terms-of-service.html", "Terms of Service", "Last updated: 2026", "LeadQ's terms of service governing the use of SMS and other services provided by LeadQ INC.");

/* ======================================================= intake redirect + sitemap */
fs.writeFileSync(path.join(R, "intake.html"), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=/">
<link rel="canonical" href="https://www.leadq.co/">
<title>LeadQ</title>
<script>location.replace("/");</script>
</head>
<body><p><a href="/">Continue to LeadQ</a></p></body>
</html>
`);
console.log("wrote intake.html");

const today = "2026-09-15";
const urls = [["", "1.0"], ["use-cases.html", "0.9"], ["pricing.html", "0.9"], ["voice.html", "0.8"], ["about.html", "0.5"], ["for-dental.html", "0.8"], ["for-salons.html", "0.8"], ["for-home-services.html", "0.8"], ["for-real-estate.html", "0.8"]];
fs.writeFileSync(path.join(R, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, p]) => `  <url><loc>https://www.leadq.co/${u}</loc><lastmod>${today}</lastmod><priority>${p}</priority></url>`).join("\n")}
</urlset>
`);
console.log("wrote sitemap.xml");
