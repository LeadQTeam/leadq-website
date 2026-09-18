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
  ["voice.html", "Voice AI", "voice"],
];

function nav(current, { voice = false } = {}) {
  const links = NAV_LINKS.map(([href, text, key]) => `<a href="${href}"${key === current ? ' aria-current="page"' : ""}>${text}</a>`).join("");
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
        <a href="index.html#how">How it works</a><a href="use-cases.html">Use cases</a><a href="voice.html">Voice AI</a><a href="pricing.html">Pricing</a><a href="about.html">About</a><a href="privacy-policy.html">Privacy</a><a href="terms-of-service.html">Terms</a>
      </nav>
    </div>
    <div class="footer-legal">&copy; 2026 LeadQ Inc.</div>
  </div>
</footer>`;

function page({ file, title, desc, ogDesc, canonical, robots = "index,follow", ogImage = "https://www.leadq.co/og-image.png", jsonld = [], bodyAttr = "", navHtml, main, legal = false }) {
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
<script src="site.js" defer></script>
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

/* plan cards, shared by home and pricing */
const plans = `<div class="plans">
      <div class="plan" data-plan="starter">
        <h3>Starter</h3><p class="for">Solo, or just trying it out</p>
        <div class="amt"><span data-price="starter">$59</span><small> /mo</small></div>
        <ul><li>20,000 credits a month</li><li>1 seat, 1 channel</li><li>Assistant, FAQ and lead capture</li></ul>
        <a class="btn btn-ghost btn-block" href="${SIGNUP}&plan=starter">Choose Starter</a>
      </div>
      <div class="plan hot" data-plan="growth">
        <span class="flag">Most popular</span>
        <h3>Growth</h3><p class="for">The main plan for a growing business</p>
        <div class="amt"><span data-price="growth">$149</span><small> /mo</small></div>
        <ul><li>45,000 credits a month</li><li>3 seats</li><li data-na-only>1 phone number</li><li>3 channels</li><li>Booking, calendar and reminders</li><li>Follow-ups, custom fields, profiles</li><li>Basic integrations and analytics</li></ul>
        <a class="btn btn-primary btn-block" href="${SIGNUP}&plan=growth">Start with Growth</a>
      </div>
      <div class="plan" data-plan="pro">
        <h3>Pro</h3><p class="for">Established, multi-channel, high volume</p>
        <div class="amt"><span data-price="pro">$399</span><small> /mo</small></div>
        <ul><li>120,000 credits a month</li><li>10 seats</li><li data-na-only>2 phone numbers</li><li data-pro-channels>All channels</li><li class="voice" data-na-only>AI voice receptionist</li><li>Support mode: troubleshooting, vision, tickets</li><li>Remove LeadQ branding</li></ul>
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
  ["What's a credit?", "Credits are how LeadQ measures usage. AI conversations, texts, calls and email all draw from one monthly pool, so there's no per-channel math to do. Run low and you top up in one tap. WhatsApp's own conversation fees are billed by Meta, on your WhatsApp Business account."],
  ["What happens if I run out of credits?", "Your assistant stops replying until your pool resets or you top up. Topping up takes one tap in the app, and it picks straight back up."],
  ["Is there a contract?", "No. Plans are month to month, and you can cancel whenever you want from inside the app. If you cancel, we release the phone numbers on the account."],
  ["Do I need to register for texting?", "In the US, business texting needs A2P registration. We guide you through it inside the app. Canada doesn't need it, and the UAE runs on WhatsApp instead."],
  ["Can I keep my WhatsApp number?", "Yes. Connect a new number or bring the one your customers already message."],
  ["Can I take over a conversation?", "Any time. Pause the assistant for one contact or a whole channel, reply yourself, then hand it back."],
];

page({
  file: "index.html",
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
<!-- hero -->
<section class="lit-hero">
  <div class="wrap home-hero">
    <div>
      <span class="pill">One assistant. Every channel.</span>
      <h1 class="h-hero">Stop chasing. Start closing.</h1>
      <p class="lead">Every message you miss is a job someone else books. LeadQ answers WhatsApp, texts, web chat, email and your phone line in seconds, then books the appointment. At midnight, on a Sunday, or while you're with a customer.</p>
      <div class="ctas">
        <a class="btn btn-primary btn-lg" href="${SIGNUP}">Get started</a>
        <a class="btn btn-ghost btn-lg" href="#how" data-open-chat>See it work</a>
      </div>
      <p class="fine">Set it up from your phone in minutes. No AI knowledge needed.</p>
    </div>
    <div class="stage">
      <div class="stage-word" aria-hidden="true"></div>
      <div class="orb" aria-hidden="true"></div>
      <div class="stage-tilt">
        <div class="stage-drift">
        ${homeChat}
        </div>
      </div>
      <div class="float-card fc-1" aria-hidden="true"><span class="faint">Replied</span><b>In seconds</b></div>
      <div class="float-card fc-2 good" aria-hidden="true"><b>New booking</b><span class="faint">Added to Schedule</span></div>
    </div>
  </div>
</section>

<!-- one brain -->
<section class="sec">
  <div class="wrap brain">
    <div class="orbit" role="img" aria-label="WhatsApp, SMS, web chat, email and voice, all run by one assistant">
      <div class="orbit-ring" aria-hidden="true"></div>
      <div class="orbit-core" aria-hidden="true"><span>One<br>assistant</span></div>
      <div class="chan" style="--x:0px;--y:-170px" aria-hidden="true">${chIcon('whatsapp')}WhatsApp</div>
      <div class="chan" style="--x:162px;--y:-53px" aria-hidden="true">${chIcon('sms')}SMS</div>
      <div class="chan" style="--x:100px;--y:138px" aria-hidden="true">${chIcon('webchat')}Web chat</div>
      <div class="chan" style="--x:-100px;--y:138px" aria-hidden="true">${chIcon('email')}Email</div>
      <div class="chan" style="--x:-162px;--y:-53px" aria-hidden="true">${chIcon('voice')}Voice</div>
    </div>
    <div>
      <h2 class="h-sec">Not five tools. One assistant.</h2>
      <p class="lead" style="margin-top:18px">Most businesses juggle a chat widget, a texting app, an inbox, a booking tool and a voicemail box, and still drop messages. LeadQ is one assistant that knows your business and works every channel the same way.</p>
      <div class="items">
        <div class="item"><b>Change it once</b><span>Update your hours or add a service, and every channel knows. The phone too.</span></div>
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
        <h3>Texts back missed calls</h3>
        <p>Can't pick up? They get a text right away, so the lead stays warm.</p>
        <div class="vis"><div class="shot" aria-hidden="true">
          <div class="sc-row"><span class="sc-ic" style="color:#e0826d">${I.missed}</span><span class="sc-tx"><span class="sc-name">Missed call</span><span class="sc-sub">+1 (555) 402-8811, 2:14 PM</span></span></div>
          <div class="sc-row"><span class="sc-ic">${I.msg}</span><span class="sc-tx"><span class="sc-name">Text sent</span><span class="sc-sub good"><span class="d"></span>2:14 PM, a few seconds later</span></span></div>
          <div class="ap-bubble out" style="margin:10px 0 0 auto">Sorry we missed your call. This is Baxter from Rivera Dental. How can I help?</div>
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
        <p>Every detail and an AI summary of the chat, before you ever pick up the phone.</p>
        <div class="vis"><div class="shot" aria-hidden="true">
          <div class="sc-cp"><span class="sc-cpav">J</span><span><span class="sc-name" style="font-size:15px">Jane Doe</span><span class="sc-chip">Booked</span></span></div>
          <div class="sc-sum"><div class="sc-sumhd">Summary</div><div class="sc-sumbody">New patient, prefers afternoons. Booked a cleaning for Wed 2:30 PM with Dr. Rivera.</div></div>
          <div class="sc-row"><span class="sc-tx"><span class="sc-name">+1 (555) 123-4567</span><span class="sc-sub">Mobile, WhatsApp and SMS</span></span></div>
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

<!-- inside the app: light sheet over night -->
<section class="sheet app-light">
  <div class="wrap sheet-grid">
    <div>
      <h2 class="h-sec">Every booking, in your pocket.</h2>
      <p class="lead" style="margin-top:18px">It's a real app, not a chat widget. Your calendar fills itself, and every booking keeps the whole story behind it: the reason, the details, and the conversation that led there.</p>
      <div class="items">
        <div class="item"><b>Your calendar fills itself</b><span>Bookings land grouped by day, reminders already sent.</span></div>
        <div class="item"><b>Nothing gets forgotten</b><span>Open any appointment to see what they told your assistant.</span></div>
        <div class="item with-icon"><img class="app-icon" src="icon-192.png" alt="" width="46" height="46"><span><b>On your home screen</b><span>Add LeadQ to your phone like any app. Your whole team can log in.</span></span></div>
      </div>
    </div>
    <div class="sheet-phones">
        ${sheetSchedule}
        ${sheetDetail}
    </div>
  </div>
</section>

<!-- voice teaser -->
<section class="sec">
  <div class="wrap">
    <div class="voice-band" style="--c:#a98cf0" data-live>
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
    <div class="sec-head"><h2 class="h-sec">Live in minutes, from your phone.</h2></div>
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
        <p>WhatsApp, text, web chat and email. We guide you through SMS registration.</p>
        <div class="shot" aria-hidden="true">
          <div class="sc-row"><span class="sc-ic">${chIcon('whatsapp')}</span><span class="sc-tx"><span class="sc-name">WhatsApp</span></span><span class="sc-ok">Connected</span></div>
          <div class="sc-row"><span class="sc-ic">${chIcon('sms')}</span><span class="sc-tx"><span class="sc-name">SMS</span></span><span class="sc-ok">Connected</span></div>
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
      <div class="outcome"><b>Costs less than a shift</b><span data-price-sentence="starter">Plans start at $59 a month. No receptionist hours to cover.</span></div>
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
      <p class="fine">Set it up from your phone. No contracts, cancel anytime.</p>
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
    <p class="lead">Set up your assistant in minutes, from your phone.</p>
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
          <tr><th scope="row">Credits a month</th><td class="mono">20,000</td><td data-plan="growth" class="hot mono">45,000</td><td class="mono">120,000</td></tr>
          <tr><th scope="row">Seats</th><td>1</td><td data-plan="growth" class="hot">3</td><td>10</td></tr>
          <tr data-na-only><th scope="row">Phone numbers</th><td>${no}</td><td data-plan="growth" class="hot">1</td><td>2</td></tr>
          <tr><th scope="row">Channels</th><td>1</td><td data-plan="growth" class="hot">3</td><td data-pro-channels>All</td></tr>
          <tr><th scope="row">Assistant, FAQ and lead capture</th><td>${yes}</td><td data-plan="growth" class="hot">${yes}</td><td>${yes}</td></tr>
          <tr><th scope="row">Booking, calendar and reminders</th><td>${no}</td><td data-plan="growth" class="hot">${yes}</td><td>${yes}</td></tr>
          <tr><th scope="row">Follow-ups, custom fields, profiles</th><td>${no}</td><td data-plan="growth" class="hot">${yes}</td><td>${yes}</td></tr>
          <tr><th scope="row">Integrations and analytics</th><td>${no}</td><td data-plan="growth" class="hot">Basic</td><td>${yes}</td></tr>
          <tr data-na-only><th scope="row">AI voice receptionist</th><td>${no}</td><td data-plan="growth" class="hot">${no}</td><td><span class="yes voice" aria-label="Included">&#10003;</span></td></tr>
          <tr><th scope="row">Support mode: troubleshooting, vision, tickets</th><td>${no}</td><td data-plan="growth" class="hot">${no}</td><td>${yes}</td></tr>
          <tr><th scope="row">Remove LeadQ branding</th><td>${no}</td><td data-plan="growth" class="hot">${no}</td><td>${yes}</td></tr>
        </tbody>
      </table>
    </div>

    <div class="voice-strip" style="--c:#a98cf0" data-na-only>
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
          <tr><td>Small<small>10,000 credits</small></td><td data-pack="small">$25</td></tr>
          <tr><td>Standard<small>25,000 credits</small></td><td data-pack="standard">$55</td></tr>
          <tr><td>Large<small>60,000 credits</small></td><td data-pack="large">$120</td></tr>
          <tr><td>Bulk<small>150,000 credits</small></td><td data-pack="bulk">$270</td></tr>
        </table>
      </div>
      <div class="tbox full">
        <h2>Add-ons. Four extras, that's the whole menu.</h2>
        <table>
          <tr><td>Extra phone number<small>Monthly</small></td><td data-addon="number">$8/mo</td></tr>
          <tr><td>Extra seat<small>Monthly</small></td><td data-addon="seat">$15/mo</td></tr>
          <tr><td>Done-for-you setup and knowledge base load<small>One-time, if you'd rather we set it up</small></td><td data-addon="setup">$299 once</td></tr>
          <tr><td>SMS activation, A2P<small>One-time, US only</small></td><td data-addon="a2p">$99 once</td></tr>
        </table>
      </div>
    </div>
    <p class="fine-print">Month to month. No contracts, cancel anytime. Your monthly credits cover every channel and reset each cycle. Credits you buy never expire. If your subscription ends, we release its phone numbers.</p>
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
<section class="lit-hero" data-live>
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

<section class="sec">
  <div class="wrap picker">
    <div>
      <h2 class="h-sec">Choose a voice your callers will trust.</h2>
      <p class="lead" style="margin-top:18px">Nearly 40 voices across American, British and French accents, standard and premium. Preview any of them in the app, set the speaking pace, and you're done. It's the one thing you can't judge from words on a page, so press play.</p>
    </div>
    ${voicePicker}
  </div>
</section>

<section class="sec" style="padding-top:0">
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

<section class="sec" style="padding-top:0">
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

<section class="sec" style="padding-top:0">
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
        <div class="amt"><span data-price="pro">$399</span><small> /mo</small></div>
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
      <p class="lead" data-uc-p>It answers every call, books the chair, and reminds them the day before. Even while you're with a patient.</p>
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
      <div class="without"><h3>Without LeadQ</h3><ul><li>The phone rings while you're with a customer</li><li>Messages sit unread until tonight</li><li>New leads book with whoever answers first</li></ul></div>
      <div class="with"><h3>With LeadQ</h3><ul><li>Every call and message answered in seconds</li><li>Booked straight into your calendar, reminders sent</li><li>Follow-ups go out while you work</li></ul></div>
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
    <p class="lead">Set it up from your phone in minutes. It learns your business, then gets to work.</p>
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
    body: "It answers every call and message, books the chair, confirms the day before, and captures new patients while you're with a patient. On WhatsApp, text, web chat and the phone.",
    rows: [["10:00", "AM", "Marcus Bell", "Consultation, Sarah", "Booked, reminder sent"], ["2:30", "PM", "Jane Doe", "Cleaning, Dr. Rivera"], ["4:00", "PM", "Priya Nair", "New patient, Dr. Rivera"]],
    h2: "A front desk that never goes to voicemail.",
    without: ["The phone rings mid-procedure", "No-shows leave empty chairs", "New patients call after you've closed"],
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
    closeBody: "Set it up from your phone in minutes. It learns your practice, then gets to work.",
  },
  {
    file: "for-salons.html", c: "#f27eb4", img: "salon", alt: "A stylist working in a hair salon", crumb: "Salons",
    title: "AI receptionist for salons and barbershops | LeadQ",
    desc: "LeadQ is an AI receptionist for salons and barbershops. It replies while your hands are full, books the seat, reschedules in seconds, and answers every call and text.",
    service: "An AI assistant that answers calls, texts and web chat for salons and barbershops, books and reschedules appointments, and confirms bookings.",
    pill: "For salons and barbershops",
    h1: "Books while your hands are full.",
    body: "It answers every call and text, books the seat, reschedules in seconds, and confirms the day before. So you can keep cutting.",
    rows: [["11:00", "AM", "Chloe Tan", "Balayage, Mia", "Booked, reminder sent"], ["1:30", "PM", "Aria West", "Cut and color, Jordan"], ["3:00", "PM", "Sam Cole", "Men's cut, Riley"]],
    h2: "Never miss a booking mid-cut.",
    without: ["You can't text back mid-cut", "Last-minute changes blow up the day", "Missed calls become missed bookings"],
    with: ["Replies while your hands are full", "Reschedules in seconds", "Answers every call and text, and books it"],
    noun: "customer",
    faqTitle: "Salons and barbershops ask us",
    faq: [
      ["Can it reply while I'm with a client?", "Yes. It handles the whole conversation on WhatsApp, text and web chat and books it, so you never stop mid-cut."],
      ["Can I still jump in myself?", "Any time. Pause it on a channel, reply yourself, and switch it back on."],
      ["Will it take bookings after hours?", "Yes, 24/7. It books, reschedules and confirms around the clock and sends reminders the day before."],
      ["How long does setup take?", "Minutes from your phone. It learns your services and prices from your website, and you approve before it goes live."],
    ],
    close: "Keep every chair full.",
    closeBody: "Set it up from your phone in minutes. It learns your salon, then gets to work.",
  },
  {
    file: "for-home-services.html", c: "#f5a524", img: "home", alt: "A technician on a home services job", crumb: "Home services",
    title: "AI receptionist for home services, HVAC and plumbing | LeadQ",
    desc: "LeadQ is an AI receptionist for home services businesses. It answers calls while you're on the job, books the visit, handles after-hours emergencies, and captures quote details.",
    service: "An AI assistant for HVAC, plumbing, electrical and other home services that answers calls and texts, books visits, handles after-hours emergencies and captures quote details.",
    pill: "For home services",
    h1: "Answers while you're on the job.",
    body: "HVAC, plumbing, electrical, cleaning and more. It picks up every call, books the visit, answers after-hours emergencies, and captures what you need to quote.",
    rows: [["8:00", "AM", "Dana Ruiz", "AC tune-up, Dave", "Booked, reminder sent"], ["11:30", "AM", "Owen Park", "Furnace repair, Miguel"], ["2:00", "PM", "Nina Blake", "On-site estimate, Dave"]],
    h2: "Win the job without leaving the ladder.",
    without: ["You're on a roof, not on the phone", "After-hours calls go to voicemail", "Job details get lost in texts"],
    with: ["Books the job while you're on site", "Answers emergencies at 2am", "Captures the details for the quote"],
    noun: "job",
    faqTitle: "Home services teams ask us",
    faq: [
      ["Does it answer emergencies after hours?", "Yes, 24/7. It gets the details, books the visit, and hands urgent jobs to you on your rules."],
      ["Can it capture what I need to quote?", "It asks the questions you set and logs the details on the job, so you arrive prepared."],
      ["What if I'm on a job and can't talk?", "It handles the whole conversation and books for you. You get the booking without stopping."],
      ["Which channels does it cover?", "WhatsApp, text and web chat, plus your phone line on the Pro plan. One assistant across all of them."],
      ["How fast is setup?", "Minutes from your phone. It learns your services and service area from your website."],
    ],
    close: "Book more jobs. Miss fewer calls.",
    closeBody: "Set it up from your phone in minutes. It learns your business, then gets to work.",
  },
  {
    file: "for-real-estate.html", c: "#7dd3fc", img: "realestate", alt: "A modern home exterior for sale", crumb: "Real estate",
    title: "AI assistant for real estate agents | LeadQ",
    desc: "LeadQ is an AI assistant for real estate agents. It replies to new leads in seconds, books showings around your calendar, qualifies buyers, and follows up automatically.",
    service: "An AI assistant for real estate agents that replies to new leads in seconds, books showings, qualifies buyers and follows up across WhatsApp, text, web chat and email.",
    pill: "For real estate",
    h1: "Answers leads before they go cold.",
    body: "It replies to new enquiries in seconds, books the showing around your day, qualifies the buyer, and follows up. No lead waits while you're at a closing.",
    rows: [["9:30", "AM", "Liam Ford", "Showing, 14 Oak St", "Booked, reminder sent"], ["12:00", "PM", "Sofia Reyes", "Buyer call, Ana"], ["4:30", "PM", "Noah Kim", "Listing visit, 8 Elm Ave"]],
    h2: "Be first to every lead, every time.",
    without: ["Leads go cold in minutes", "Showings clash across your day", "You're at a closing, phone ringing"],
    with: ["Replies to new leads in seconds", "Books showings around your calendar", "Qualifies the buyer before you call"],
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
    closeBody: "Set it up from your phone in minutes. It learns your market, then gets to work.",
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
      <h1 class="h-hero">${v.h1}</h1>
      <p class="lead">${v.body}</p>
      <div class="ctas"><a class="btn btn-primary btn-lg" href="${SIGNUP}">Get started</a><a class="btn btn-ghost btn-lg" href="pricing.html">See pricing</a></div>
    </div>
    ${phone({ label: `The LeadQ app Schedule, filled with ${v.crumb.toLowerCase()} bookings`, tab: "schedule", header: scheduleHeader, body: scheduleBody(v.rows) })}
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head"><h2 class="h-sec">${v.h2}</h2></div>
    <div class="ww">
      <div class="without"><h3>Without LeadQ</h3><ul>${v.without.map((x) => `<li>${x}</li>`).join("")}</ul></div>
      <div class="with"><h3>With LeadQ</h3><ul>${v.with.map((x) => `<li>${x}</li>`).join("")}</ul></div>
    </div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap roi-sec">
    <div>
      <h2 class="h-sec">What slow replies cost you.</h2>
      <p class="lead" style="margin-top:18px">Set how many calls and messages slip through in a week, and what a new ${v.noun} is worth to you. The rest is simple math.</p>
    </div>
    <div class="roi" data-roi>
      <label for="roi-missed"><span>Missed calls and messages per week</span><b data-roi-missed-out>10</b></label>
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
      <p class="lead">LeadQ is one AI assistant for your whole business. It answers WhatsApp, SMS, web chat, email and your phone line, and it books the appointment while you work.</p>
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
    <p class="lead">Local businesses lose real money in the gap between a customer reaching out and someone getting back to them. It happens at midnight, on a Sunday, and in the twenty minutes you were with another customer. Missed calls and unread texts don't add up to lost messages. They add up to lost bookings.</p>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap story">
    <h2 class="h-sec">You shouldn't need five tools to answer a customer.</h2>
    <p class="lead">Most small teams stitch together a chat widget, a texting app, an inbox, a booking tool and a receptionist, and still drop messages. It should be one assistant that knows your business, speaks in your voice, and works every channel the same way. So that's what we built.</p>
  </div>
</section>

<section class="horizon" style="text-align:left">
  <div class="wrap">
    <div class="story" style="text-align:center">
      <h2 class="h-sec" style="margin:0 auto">An app you run yourself.</h2>
      <p class="lead" style="margin:18px auto 0">Not an agency. Not a service you wait on. You set it up from your phone in minutes, it learns your services and your tone, and it starts answering. You stay in control, and you can jump into any conversation whenever you want.</p>
    </div>
    <div class="grid g3" style="margin-top:44px">
      <div class="card"><h3>Every channel</h3><p>WhatsApp, SMS, web chat, email, and your phone line on Pro.</p></div>
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
