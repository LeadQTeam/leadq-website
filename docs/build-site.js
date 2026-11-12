// One-off generator for the LeadQ redesign. Writes plain static HTML into the repo.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");
// the repo root, so this runs from any checkout
const R = path.resolve(__dirname, "..");
/* Our own CSS and JS are linked with a content hash on the end. GitHub Pages serves them with
   Cache-Control: max-age=600 and no version in the path, so a freshly built page could load
   beside a browser copy of the old stylesheet and come out looking half deployed. The query
   changes only when the bytes change, so a cached copy is retired exactly when it is stale. */
const rev = (f) => f + "?v=" + crypto.createHash("sha1").update(fs.readFileSync(path.join(R, f))).digest("hex").slice(0, 8);
const CSS = rev("styles.css"), SITEJS = rev("site.js"), MOCKJS = rev("app-mockup.js");

const APP = "https://app.leadq.co";
// Every call to action opens the signup form directly; a plan picked here rides along so the
// app leads with it at go-live. Log in stays on the plain app URL.
const SIGNUP = APP + "/?signup";
/* The web chat is an ordinary LeadQ workspace addressed by its business id, so a page can point
   at a different one. The distributor page points at LeadQ UAE, whose calendar is the
   distributor's own: the page never has to know what that calendar is, and changing who the
   demo books with is a calendar connection in the app rather than an edit here. */
/* data-chips is ours to say. The widget used to fall back to LeadQ's own demo chips for EVERY
   client, so a plumber's visitors were offered "Book a demo" (channel audit, 2026-10-05). It now
   shows none unless told, so LeadQ's pages name theirs here. */
/* North America sells sign-up and the free trial, never a demo call; only the UAE distributor books demos. */
const widgetTag = (biz, chips) => `<script defer src="https://chat.leadqmail.co/w.js" data-leadq="${biz}" data-autoopen="4" data-theme="dark" data-chips="${chips}"></script>`;
const WIDGET = widgetTag("8273801b-5b0c-48e0-8708-8fd1b3164c0e", "Start my free trial|What does it cost?|How does it work?");

/* The LeadQ UAE workspace, whose web chat IS the demo booking on ae.html. A placeholder here is
   not a cosmetic defect, it is a page whose only call to action does nothing, so the build
   refuses rather than shipping it. A PASTE_ value that ran anyway is how the calendar
   encryption key broke every tenant once already. */
const AE_BIZ = "8273801b-5b0c-48e0-8708-8fd1b3164c0e"; // PREVIEW ONLY, swap for LeadQ UAE
if (/^PASTE_/.test(AE_BIZ)) {
  throw new Error("ae.html: set AE_BIZ in docs/build-site.js to the LeadQ UAE workspace business id (the app shows it under Channels > Website chat) before building.");
}
const AE_WIDGET = widgetTag(AE_BIZ, "Book a demo|What does it cost?|How does it work?");
const FONT = "https://fonts.googleapis.com/css2?family=Instrument+Sans:wdth,wght@75..100,400..700&family=JetBrains+Mono:wght@400;600&display=swap";

// The wordmark ships in two versions because the site ships dark but keeps a light mode.
// Both are SVG now, so there is no raster fallback to choose between.
const wordmark = (cls = "") => `<img class="brand-logo brand-night${cls ? " " + cls : ""}" src="img/brand/leadq-wordmark.svg" alt="LeadQ" width="902" height="324"><img class="brand-logo brand-ink" src="img/brand/leadq-wordmark-ink.svg" alt="" aria-hidden="true" width="902" height="324">`;

const I = {
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
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
 "instagram": {
  "bg": "rgba(240,86,140,.15)",
  "fg": "#F0568C",
  "path": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"5.2\" fill=\"none\" stroke=\"#F0568C\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"4.1\" fill=\"none\" stroke=\"#F0568C\" stroke-width=\"2\"/><circle cx=\"17.2\" cy=\"6.8\" r=\"1.3\"/>",
  "evenodd": false
 },
 "messenger": {
  "bg": "rgba(91,140,255,.16)",
  "fg": "#5B8CFF",
  "path": "<path d=\"M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.43 3.14 7.17.16.14.26.35.27.57l.05 1.78c.02.57.6.94 1.12.71l1.98-.87c.17-.08.36-.09.54-.04.91.25 1.88.38 2.9.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2Zm6 7.46-2.94 4.66c-.47.74-1.47.93-2.17.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.18-.69-.63l2.94-4.66c.47-.74 1.47-.93 2.17-.4l2.34 1.75a.6.6 0 0 0 .72 0l3.16-2.4c.42-.32.97.18.69.63Z\"/>",
  "evenodd": false
 },
 "voice": {
  "bg": "rgba(139,110,240,.16)",
  "fg": "#9B8CF0",
  "path": "<path d=\"M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.24 1.02l-2.2 2.2z\"/>",
  "evenodd": false
 }
};
const chIcon = (k) => `<i class="ch-ic" style="background:${CH[k].bg}"><svg viewBox="0 0 24 24" fill="${CH[k].fg}"${CH[k].evenodd ? ' fill-rule="evenodd"' : ""} aria-hidden="true">${CH[k].path}</svg></i>`;

/* The channel orbit: the real app icon at the centre with its soundwave alive, a spoke out to
   each channel, and a pulse running IN along one spoke at a time, a beat apart. The spoke length
   and angle are worked out from the same x/y the channel tile is placed with, so the line always
   ends under its tile however the ring is sized. */
const orbit = (chans, attr = "") => {
  const spoke = ([, , x, y], i) =>
    `      <span class="spoke" style="--len:${Math.round(Math.hypot(x, y))}px;--ang:${(Math.atan2(y, x) * 180 / Math.PI).toFixed(1)}deg;--d:${(i * 0.42).toFixed(2)}s" aria-hidden="true"><i></i></span>`;
  const tile = ([k, label, x, y], i) =>
    `      <span class="chan" style="--x:${x}px;--y:${y}px;--i:${i}" aria-hidden="true">${chIcon(k)}<span>${label}</span></span>`;
  const names = chans.map((c) => c[1]).join(", ").replace(/, ([^,]*)$/, " and $1");
  return `<div class="orbit" data-live${attr} role="img" aria-label="${names}, all run by one assistant">
      <span class="orbit-ring" aria-hidden="true"></span>
      <span class="orbit-ring r2" aria-hidden="true"></span>
${chans.map(spoke).join(`
`)}
      <span class="hub" aria-hidden="true">
        <img src="img/brand/leadq-app.png" alt="" width="1052" height="1066" loading="lazy" decoding="async">
        <span class="hub-wave"><b></b><b></b><b></b></span>
      </span>
      <span class="hub-tag" aria-hidden="true"><b>Baxter</b><small><i></i><span>On, ${chans.length} channels</span></small></span>
${chans.map(tile).join(`
`)}
    </div>`;
};

const TABS = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>Home',
  assistant: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.4l1.65 4.45a3 3 0 0 0 1.78 1.78L19.6 10.3l-4.17 1.55a3 3 0 0 0-1.78 1.78L12 18.2l-1.65-4.45a3 3 0 0 0-1.78-1.78L4.4 10.3l4.17-1.67a3 3 0 0 0 1.78-1.78z"/></svg>Assistant',
  inbox: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>Inbox',
  schedule: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>Schedule',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><circle cx="12" cy="12" r="3.1"/><path d="M19.5 12.9a7.5 7.5 0 0 0 0-1.8l1.9-1.5-1.9-3.3-2.3 1a7.5 7.5 0 0 0-1.6-.9L15.2 4H8.8l-.4 2.4a7.5 7.5 0 0 0-1.6.9l-2.3-1-1.9 3.3 1.9 1.5a7.5 7.5 0 0 0 0 1.8l-1.9 1.5 1.9 3.3 2.3-1a7.5 7.5 0 0 0 1.6.9l.4 2.4h6.4l.4-2.4a7.5 7.5 0 0 0 1.6-.9l2.3 1 1.9-3.3z"/></svg>Settings',
};
/* keys defaults to the four the rest of the site uses, so adding Home changes nothing else */
const tabbar = (on, keys = ["assistant", "inbox", "schedule", "settings"]) =>
  `<div class="ap-nav">${keys.map((k) => `<span class="ap-tab${k === on ? " on" : ""}" data-go="${k}">${TABS[k]}</span>`).join("")}</div>`;

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
  // "na": the demo films are the North American cut, shown only where that copy is shown.
  ["index.html#demos", "Watch it work", "demos", "na"],
  ["use-cases.html", "Use cases", "use-cases"],
  ["pricing.html", "Pricing", "pricing"],
  // The fourth field marks a link that only exists where voice may be sold. The UAE does not
  // permit AI voice agents on its networks, so this link is removed for that visitor rather
  // than left as a route to a product they cannot legally buy.
  ["voice.html", "Voice AI", "voice", "voice"],
];

function nav(current, { voice = false } = {}) {
  const links = NAV_LINKS.map(([href, text, key, needs]) =>
    `<a href="${href}"${key === current ? ' aria-current="page"' : ""}${needs === "voice" ? " data-needs-voice" : needs === "na" ? " data-na-only" : ""}>${text}</a>`).join("");
  const cta = voice
    ? `<a class="btn btn-voice btn-sm" href="${SIGNUP}&plan=pro">Get Pro</a>`
    : `<a class="btn btn-primary btn-sm" href="${SIGNUP}">Try it Free</a>`;
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

/* North America does not book calls or demos: the dock invites questions only. The UAE pages,
   where the distributor does book demos, get their own line. */
const dockFor = (line) => `<aside class="dock" hidden aria-label="LeadQ assistant">
  <div class="dock-copy"><b>Talk to our assistant now</b><span class="faint">${line}</span></div>
  <button class="btn btn-white btn-sm dock-btn" type="button">Start chat</button>
</aside>`;
const dock = dockFor("Ask it anything about LeadQ.");
const aeDock = dockFor("Ask it anything, or book a demo.");

const footer = `<footer class="footer">
  <div class="wrap">
    <div class="footer-top">
      <div>
        <a class="brand" href="index.html" aria-label="LeadQ home">${wordmark()}</a>
        <p class="footer-tag">Always on. Always You.</p>
      </div>
      <nav class="footer-links" aria-label="Footer">
        <a href="index.html#how">How it works</a><a href="index.html#demos">Watch it work</a><a href="use-cases.html">Use cases</a><a href="voice.html" data-needs-voice>Voice AI</a><a href="pricing.html">Pricing</a><a href="about.html">About</a><a href="privacy-policy.html">Privacy</a><a href="terms-of-service.html">Terms</a>
      </nav>
    </div>
    <div class="footer-legal">&copy; 2026 LeadQ Inc.</div>
  </div>
</footer>`;

/* htmlAttr, widget and footerHtml exist for the distributor page, which is the one page that is
   not the main site in miniature: it declares its own market rather than detecting one, points
   the chat at a different workspace, and must not link to pricing or signup anywhere. */
function page({ file, title, desc, ogDesc, canonical, robots = "index,follow", ogImage = "https://www.leadq.co/og-image.png", jsonld = [], bodyAttr = "", htmlAttr = "", navHtml, main, legal = false , mockup = false, widget = WIDGET, footerHtml = footer }) {
  const html = `<!doctype html>
<html lang="en" data-theme="dark"${htmlAttr ? " " + htmlAttr : ""}>
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
<link rel="icon" type="image/png" sizes="32x32" href="${rev("favicon-32.png")}">
<link rel="icon" type="image/png" sizes="16x16" href="${rev("favicon-16.png")}">
<link rel="apple-touch-icon" href="${rev("apple-touch-icon.png")}">
<script>document.documentElement.classList.add("js")</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="${FONT}">
<link rel="stylesheet" href="${FONT}">
<link rel="stylesheet" href="${CSS}">
<script src="${SITEJS}" defer></script>${mockup ? `\n<script src="${MOCKJS}" defer></script>` : ""}
${jsonld.map((j) => `<script type="application/ld+json">\n${j}\n</script>`).join("\n")}
</head>
<body${bodyAttr ? " " + bodyAttr : ""}>

${navHtml}

<main>
${main}
</main>

${footerHtml}
${legal ? "" : "\n" + (widget === AE_WIDGET ? aeDock : dock) + "\n" + widget}
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
        <h3 data-plan-name="starter">Starter</h3><p class="for">Solo, or just trying it out</p>
        <div class="amt"><span data-price="starter">$59</span><small> <span data-code>USD</span> /mo</small></div>
        <ul><li><span data-cell="starter.credits">20,000</span> credits a month</li><li data-na-only>1 seat</li><li data-na-only>1 text-based channel (no voice)</li><li data-wa-only hidden>3 seats</li><li data-wa-only hidden>1 channel</li><li>Booking, calendar and reminders</li><li>Calendar sync with Google and Outlook</li><li>Follow-ups, custom fields, profiles</li><li>Assistant, FAQ and lead capture</li></ul>
        <a class="btn btn-ghost btn-block" href="${SIGNUP}&plan=starter">Choose Starter</a>
      </div>
      <div class="plan hot" data-plan="growth">
        <span class="flag">Most popular</span>
        <h3 data-plan-name="growth">Growth</h3><p class="for">Multi-channel assistant for a growing business</p>
        <div class="amt"><span data-price="growth">$149</span><small> <span data-code>USD</span> /mo</small></div>
        <ul><li><span data-cell="growth.credits">45,000</span> credits a month</li><li><span data-cell="growth.seats">3</span> seats</li><li data-na-only>1 phone number</li><li><span data-cell="growth.channels" data-unit="text-based channel">3 text-based channels</span> (no voice)</li><li>Booking, calendar and reminders</li><li>Follow-ups, custom fields, profiles</li><li>Calendar sync with Google and Outlook</li></ul>
        <a class="btn btn-primary btn-block" href="${SIGNUP}&plan=growth">Start with Growth</a>
      </div>
      <div class="plan" data-plan="pro">
        <h3 data-plan-name="pro">Pro</h3><p class="for">${mkt("Live voice receptionist, high volume, insights &amp; reporting", "High volume, every channel, insights &amp; reporting")}</p>
        <div class="amt"><span data-price="pro">$399</span><small> <span data-code>USD</span> /mo</small></div>
        <p class="plus" data-plus>Everything in Growth, plus:</p>
        <ul><li><span data-cell="pro.credits">120,000</span> credits a month</li><li><span data-cell="pro.seats">10</span> seats</li><li data-na-only>2 phone numbers</li><li data-needs-a2p>A2P registration fee waived</li><li class="voice" data-needs-voice>AI voice receptionist</li><li data-pro-channels>All channels</li><li>Contact Summary</li><li>Insights and reporting</li><li>Claude connector</li><li>Priority support</li></ul>
        <a class="btn btn-ghost btn-block" href="${SIGNUP}&plan=pro">Choose Pro</a>
      </div>
    </div>
    <div class="ent-row">
      <div class="ent-l">
        <h3>Enterprise</h3>
        <p class="ent-tag">A plan built around your business.</p>
        <p class="ent-for">For multi-location businesses, larger teams and high volume. Everything in Pro, sized to how you actually run.</p>
        <div class="ent-cta">
          <a class="btn btn-white btn-lg" href="enterprise.html">Contact us<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg></a>
        </div>
      </div>
      <ul class="ent-pts">
        <li><span class="ent-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg></span><b>More locations</b><small>Every branch on a single plan.</small></li>
        <li><span class="ent-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span><b>Bigger teams</b><small>Seats for your whole team.</small></li>
        <li><span class="ent-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/></svg></span><b>Higher volume</b><small>Credits sized to your real volume.</small></li>
        <li><span class="ent-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 8-6 4 6 4V8z"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg></span><b>Top priority support</b><small>Video call support when you need it.</small></li>
      </ul>
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

/* The demo library: an overview, a short film per feature and a few use cases, each made from the
   real app with invented businesses (none is a customer). The home page carries the North American
   cut (demos/na/, ending on a "sign up at leadq.co" card); ae.html carries the UAE cut (demos/ae/,
   ending on the distributor's contact card). Each folder holds the films and a poster frame per film. */
const esc = (t) => t.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
/* With JS off every card is a plain link to its film, so nothing here depends on the player. */
/* The films are served from the LeadQTeam/leadq-media repo's own Pages site, not from this repo:
   256 MB of video made this site's deploys time out. The .mp4 files still sit in demos/ and at the
   root on your machine (git ignores them); docs/push-media.bat uploads new or replaced ones. Posters stay here. */
const MEDIA = "https://leadqteam.github.io/leadq-media/";
const demoAttrs = (dir, [slug, , title], kick) => `href="${MEDIA}demos/${dir}/${slug}.mp4" data-demo="${MEDIA}demos/${dir}/${slug}.mp4" data-poster="demos/${dir}/${slug}.jpg" data-kicker="${esc(kick)}" data-title="${esc(title)}"`;
const demoThumb = (dir, [slug, , title, , dur], lazy = true) => `<span class="demo-thumb"><img src="demos/${dir}/${slug}.jpg" alt="" width="1280" height="720"${lazy ? ' loading="lazy"' : ""} decoding="async"><span class="demo-play">${I.play}</span><span class="demo-dur">${dur}</span></span>`;
/* Order of viewing: the one-minute "what it does for your business" film is the one every visitor
   should see, so it leads; the overview and the use cases come next; the ten feature films are the
   detail, for whoever wants it. The player's Next button follows the same order. */
const demoCard = (dir, d, kick, title = d[2], biz = d[3]) => `      <li><a ${demoAttrs(dir, d, kick)}>${demoThumb(dir, d)}<span class="demo-k">${kick}</span><b>${title}</b><span class="demo-biz">${biz}</span></a></li>`;
/* ======================================================= THE FOUR DESKS
   The home page and ae.html read as one sentence down the page: Your 24/7 Front Desk, and Help
   Desk, at Your Desk, or with No Desk at all. Each desk is a helper here, so the two pages share
   one layout and differ only in their channels, businesses and films. */
const tick = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

/* The voices a visitor can hear: each chip plays that voice's real sample from the app
   (audio/voices/, copied from leadq-app/voices/), one at a time (site.js initVoiceSamples).
   One list for the home page's voice band and voice.html, so the two never disagree. */
const voiceChips = `<div class="vchips left" role="group" aria-label="Hear the voices">
          ${[["ava", "Ava"], ["noah", "Noah"], ["sarah", "Sarah"], ["eric", "Eric"]].map(([k, n]) => `<button type="button" class="vchip" data-voice="audio/voices/${k}.mp3" aria-pressed="false"><span class="vc-ic" aria-hidden="true">${I.play}<i></i><i></i><i></i></span><span class="sr-only">Hear </span>${n}</button>`).join("")}
        </div>`;

/* 01 Front Desk: every channel runs into one booking. Each dashed line leaves the middle of its
   channel's row and lands on the middle of the card. The lines are worked out from the row
   count, so the same drawing serves seven channels or five. */
const deskFlow = (chans, card, attr = "") => {
  const H = chans.length * 100;
  const line = (_, i) => `<path d="M0 ${i * 100 + 50}C55 ${i * 100 + 50} 45 ${H / 2} 100 ${H / 2}" vector-effect="non-scaling-stroke"/>`;
  return `<div class="flow" style="--n:${chans.length}" data-live${attr}>
        <ul class="flow-ch" aria-label="Channels">
          ${chans.map(([k, label]) => `<li>${chIcon(k)}${label}</li>`).join("\n          ")}
        </ul>
        <svg class="flow-lines" viewBox="0 0 100 ${H}" preserveAspectRatio="none" aria-hidden="true">${chans.map(line).join("")}</svg>
        <div class="flow-card">
          <div class="flow-top"><span class="k">New booking</span><span class="ok">${tick}Booked</span></div>
          <div class="flow-when">${card.when}</div>
          <div class="flow-what">${card.what}</div>
          <ul class="flow-meta">
            <li>${chIcon(card.via)}${card.from}</li>
            <li>${tick}Added to your calendar</li>
            <li>${tick}Reminder set for ${card.remind}</li>
          </ul>
        </div>
      </div>`;
};
const deskFront = ({ flows, lead, checks }) => `<section class="sec" id="how">
  <div class="wrap desk-front">
    <div class="desk-vis">
      ${flows}
    </div>
    <div class="desk-copy">
      <h2 class="h-desk">Your 24/7<br><span class="hi">Front Desk.</span></h2>
      <p class="lead">${lead}</p>
      <ul class="checks">
        ${checks.map(([b, t]) => `<li><span class="ck">${tick}</span><span><b>${b}</b><span class="t">${t}</span></span></li>`).join("\n        ")}
      </ul>
    </div>
  </div>
</section>`;

/* 02 Help Desk: support after the sale, shown as the conversation itself, each with its film. */
const supportCard = (dir, film, { kick, h, biz, ch, via, msgs, end, hand = false, p, attr = "" }) => `<article class="help-card">
        <span class="k">${kick}</span>
        <h3>${h}</h3>
        <div class="chatbox">
          <div class="chatbox-h">${chIcon(ch)}<b>${biz}</b><small>${via}</small></div>
          <div class="chatbox-m">
            ${msgs.map(([who, t]) => `<p class="cb ${who}">${t}</p>`).join("\n            ")}
            <p class="cb-end ${hand ? "hand" : "ok"}">${hand ? I.transfer : tick}${end}</p>
          </div>
        </div>
        <p>${p}</p>
        <a class="btn btn-ghost btn-sm btn-play watch" ${demoAttrs(dir, film, kick)}${attr}>${I.play}Watch the ${kick.toLowerCase()} film</a>
      </article>`;
const deskHelp = (lead, cards) => `<section class="sec" id="support">
  <div class="wrap">
    <div class="sec-head left">
      <h2 class="h-desk">and <span class="hi">Help Desk.</span></h2>
      <p class="lead">${lead}</p>
    </div>
    <div class="help-grid">
      ${cards.join("\n      ")}
    </div>
  </div>
</section>`;

/* 03 At Your Desk: the films. The one-minute "what it does for your business" film leads, the four
   use cases follow, and the ten feature films show only their top edge, fading out, until clicked
   (site.js initFilmsMore). With JS off that row is simply shown in full and the peek button never
   appears. The player's Next button walks the films in page order. */
function deskFilms(dir, films, attrs = "") {
  const by = (n) => films.find((d) => d[0].startsWith(n + "-"));
  const why = by("14");
  const intro = [by("00"), by("11"), by("12"), by("13")];
  const feats = films.filter((d) => /^(0[1-9]|10)-/.test(d[0]));
  const card = (d, kick) => `      <li><a ${demoAttrs(dir, d, kick)}>${demoThumb(dir, d)}<span class="demo-k">${kick}</span><b>${d[2]}</b><span class="demo-biz">${d[3]}</span></a></li>`;
  return `<section class="sec" id="demos"${attrs}>
  <div class="wrap">
    <div class="desk-head">
      <div>
        <h2 class="h-desk">at <span class="hi">Your Desk.</span></h2>
        <p class="lead">Grab a coffee and see how it works, one short film at a time.</p>
        <p class="fine">All businesses shown are fictional. The app is real.</p>
      </div>
    </div>
    <a class="demo-feature" ${demoAttrs(dir, why, "Start here")} aria-label="Play: ${esc(why[2])}, ${why[4]}">
      ${demoThumb(dir, why, false)}
      <span class="demo-copy">
        <span class="demo-k">Start here · ${why[4]}</span>
        <b>${why[2]}</b>
        <span class="demo-p">Time back, lower running costs and more bookings, in about a minute.</span>
      </span>
    </a>
    <h3 class="demo-sub">See it in action</h3>
    <ol class="demo-grid demo-grid4">
${intro.map((d) => card(d, d[1])).join("\n")}
    </ol>
    <div class="films-more">
      <div class="films-in" id="films-${dir}">
        <h3 class="demo-sub">Feature by feature</h3>
        <ol class="demo-grid">
${feats.map((d, i) => card(d, String(i + 1).padStart(2, "0") + " · " + d[1])).join("\n")}
        </ol>
      </div>
      <button class="films-peek" type="button" aria-expanded="false" aria-controls="films-${dir}" hidden><span>${feats.length} more films<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span></button>
    </div>
  </div>
</section>`;
}

/* 04 No Desk: the app's inbox as two very different owners see it on a phone, mid-job. A row's
   channel is one key, or [North America, WhatsApp market] where the home page needs both. */
const rowCh = (ch) => `<span class="ap-ch">${Array.isArray(ch) ? mkt(chIcon(ch[0]), chIcon(ch[1])) : chIcon(ch)}</span>`;
const inboxRow = (r) => r.need
  ? `<div class="ap-it need"><span class="need-k">Needs you</span><b>${r.name}</b><p>${r.text}</p></div>`
  : `<div class="ap-it"><div class="ap-it-h"><b>${r.name}</b>${rowCh(r.ch)}</div><p>${r.text}</p>${r.pill ? `<span class="ap-pill">${r.pill}</span>` : ""}</div>`;
/* Made-up marks for the made-up businesses: an app-icon tile with one white glyph each. */
const BIZ_LOGO = {
  drop: ["#6aa8ff", "#2f6df6", '<path d="M12 3.2c3.3 3.9 6 7.1 6 10.4a6 6 0 0 1-12 0c0-3.3 2.7-6.5 6-10.4Z" fill="#fff"/><path d="M9.3 14.2a2.8 2.8 0 0 0 2.4 2.7" fill="none" stroke="#2f6df6" stroke-width="1.6" stroke-linecap="round"/>'],
  polish: ["#f8b4d4", "#d9468c", '<rect x="9.8" y="2.8" width="4.4" height="6.6" rx="1.2" fill="#fff"/><rect x="7" y="9.6" width="10" height="11.6" rx="3" fill="#fff"/><path d="M9.6 12.6v5" stroke="#d9468c" stroke-width="1.6" stroke-linecap="round"/>'],
  snow: ["#8ee0ff", "#0b8fd6", '<g fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/><path d="m9.4 4.6 2.6 2.4 2.6-2.4M9.4 19.4l2.6-2.4 2.6 2.4"/></g>'],
  crescent: ["#f7cf96", "#c8698a", '<path d="M14.6 3.6a8.6 8.6 0 1 0 5.8 13.9A7 7 0 1 1 14.6 3.6Z" fill="#fff"/><path d="m17.6 7.4.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6Z" fill="#fff"/>'],
};
const bizLogo = (k) => `<span class="ap-logo" style="background:linear-gradient(145deg,${BIZ_LOGO[k][0]},${BIZ_LOGO[k][1]})"><svg viewBox="0 0 24 24" aria-hidden="true">${BIZ_LOGO[k][2]}</svg></span>`;
const deskNoDesk = (lead, figs) => `<section class="sec" id="on-the-go">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="h-desk">Or with <span class="hi">No Desk</span> at all.</h2>
      <p class="lead">${lead}</p>
    </div>
    <div class="nodesk">
      ${figs.map((f) => `<figure style="--c:${f.glow}">
        <div class="nodesk-stage">${phone({
          label: f.label, tab: "inbox",
          header: `<div class="ap-header plain">${bizLogo(f.logo)}<span><span class="ap-hname">${f.biz}</span><span class="ap-hsub">Inbox</span></span></div>`,
          body: `<div class="ap-list">${f.rows.map(inboxRow).join("")}</div>`,
        })}</div>
        <figcaption><span class="k">${f.kick}</span>${f.cap}</figcaption>
      </figure>`).join("\n      ")}
    </div>
  </div>
</section>`;
const demoPlayer = `<dialog class="dmodal" aria-label="LeadQ demo">
  <div class="dmodal-in">
    <button class="vmodal-x dmodal-x" type="button" aria-label="Close video">${I.x}</button>
    <video class="dmodal-v" controls playsinline preload="none" width="1920" height="1080"></video>
    <div class="dmodal-bar">
      <div class="dmodal-cap"><span class="dmodal-k"></span><b class="dmodal-t"></b></div>
      <button class="btn btn-ghost btn-sm dmodal-next" type="button" hidden>Next: <span class="dmodal-nt"></span></button>
    </div>
  </div>
</dialog>`;
const NA_DEMOS = [
  ["00-overview", "Overview", "LeadQ in one minute", "Coolwave Heating & Air · Phoenix", "1:04"],
  ["01-set-up-in-minutes", "Set up in minutes", "Go live in an afternoon", "Willow Beauty Bar · Austin", "0:51"],
  ["02-persona", "Persona", "Sounds like you", "Harbor & Vine · Boston", "0:58"],
  ["03-knowledge-base", "Knowledge base", "Answers it can stand behind", "Keystone Realty · Toronto", "1:03"],
  ["04-services-hours", "Services & hours", "Bookable, around the clock", "Maple Grove Dental · Vancouver", "0:47"],
  ["05-inbox-contacts", "Inbox & contacts", "Every lead, qualified", "Coastline Car Rental · Miami", "0:47"],
  ["06-schedule", "Schedule", "Every booking, in one place", "Ironside Fitness · Chicago", "0:41"],
  ["07-team-hand-overs", "Team & hand-overs", "The right person, every time", "Hudson Interiors · Brooklyn", "0:44"],
  ["08-channels", "Channels", "Wherever customers message", "Ember & Oak Candle Co. · Montreal", "0:48"],
  ["09-insights", "Insights", "Proof it’s working", "Summit Learning Center · Seattle", "0:44"],
  ["10-account-claude", "Account & Claude", "Change it by just asking", "Coolwave Heating & Air · Phoenix", "0:42"],
  ["11-tech-support", "Tech support", "Help, the moment they need it", "FixPoint Electronics · Houston", "0:50"],
  ["12-customer-support", "Customer support", "Support that never sleeps", "Northwood Home · online, US and Canada", "0:58"],
  ["13-inventory", "Inventory", "“Is it still available?”", "Lakeside Motors · Dallas", "0:53"],
  ["14-what-leadq-does", "Why LeadQ", "What it does for your business", "Time back, lower costs, more revenue", "1:03"],
  ["15-ai-receptionist", "AI receptionist", "Every call, answered", "Ridgeline Plumbing · Denver", "1:14"],
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
<!-- The sprite is hidden by being zero-sized and out of flow, NOT by display:none.
     Chrome will not resolve a gradient paint server out of a display:none subtree, so the
     tile behind a mark here rendered as nothing and only its strokes showed. -->
<div aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden"><svg width="0" height="0" aria-hidden="true"><defs>
<linearGradient id="rdg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5fe3c2"/><stop offset="1" stop-color="#12907a"/></linearGradient>
<symbol id="rd-app" viewBox="0 0 100 100"><rect width="100" height="100" rx="23" fill="url(#rdg)"/><g transform="translate(21.5 21) scale(2.375)" fill="#fff"><path d="M12 2.2c-2.1 0-3 .9-4.6.9C5.3 3.1 3.6 4.6 3.6 7.6c0 2.6.9 4.3 1.5 6.4.5 1.7.6 3.3.9 4.8.3 1.5.9 2.6 1.9 2.6 1.1 0 1.5-1.2 1.8-3 .3-1.8.5-3.6 2.3-3.6s2 1.8 2.3 3.6c.3 1.8.7 3 1.8 3 1 0 1.6-1.1 1.9-2.6.3-1.5.4-3.1.9-4.8.6-2.1 1.5-3.8 1.5-6.4 0-3-1.7-4.5-3.8-4.5-1.6 0-2.5-.9-4.6-.9z"/></g></symbol>
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
      <h1 class="h-hero">Stop <span class="ko">chasing.</span><br>Start <span class="hi">closing.</span></h1>
      <p class="lead">Every missed message is a job someone else books. LeadQ answers every channel in seconds${mkt(", your phone line too,", "")} and books the appointment.</p>
      <div class="ctas">
        <a class="btn btn-primary btn-lg" href="${SIGNUP}">Try it Free</a>
        <a class="btn btn-ghost btn-lg btn-play" href="#how" data-video>${I.play}What is LeadQ?</a>
      </div>
      <p class="fine">Set it up in minutes. No AI knowledge needed. 7-day&nbsp;free&nbsp;trial.</p>
    </div>
    <div class="pstage" role="img" aria-label="LeadQ inbox showing Baxter booking an appointment">
  <div class="glow" aria-hidden="true"></div>
  
  <div class="appwin"><div class="abar"><i></i><i></i><i></i><span>app.leadq.co</span></div><div class="dkw"><div class="dk hero-dk" id="heroDk"><aside class="dk-side"><div class="dk-brand"><svg class="app" viewBox="0 0 100 100" aria-hidden="true"><use href="#rd-app"/></svg><span class="nm">Rivera Dental</span><svg class="ic" aria-hidden="true"><use href="#i-chev"/></svg></div><button type="button" tabindex="-1" class="dk-nav" data-go="home"><svg class="ic" aria-hidden="true"><use href="#i-home"/></svg>Home</button><button type="button" tabindex="-1" class="dk-nav on" data-go="inbox"><svg class="ic" aria-hidden="true"><use href="#i-inbox"/></svg>Inbox</button><button type="button" tabindex="-1" class="dk-nav"><svg class="ic" aria-hidden="true"><use href="#i-cal"/></svg>Schedule</button><button type="button" tabindex="-1" class="dk-nav"><svg class="ic" aria-hidden="true"><use href="#i-bot"/></svg>Assistant<span class="badge">2</span></button><button type="button" tabindex="-1" class="dk-nav" data-go="settings"><svg class="ic" aria-hidden="true"><use href="#i-gear"/></svg>Settings</button><div class="dk-bax"><span class="bot"><svg class="ic" aria-hidden="true"><use href="#i-bot"/></svg></span><span><b>Baxter</b><small>On, 5 channels</small></span></div><div class="dk-user"><svg class="app" viewBox="0 0 100 100" aria-hidden="true"><use href="#rd-app"/></svg>info@riveradental.com</div></aside><div class="dk-main" style="display:flex;flex-direction:column"><div class="dk-top"><div><div class="dk-h6">Inbox</div><p>Baxter is handling 1 conversation.</p></div><button type="button" tabindex="-1" class="dk-bell" aria-label="Notifications"><svg class="ic" aria-hidden="true"><use href="#i-bell"/></svg></button></div><div class="dk-scr"><div class="dk-inbox"><div class="dk-list"><div class="dk-search"><svg class="ic" aria-hidden="true"><use href="#i-search"/></svg>Search people and messages</div>
<div class="dk-filters"><span class="on">All<i>11</i></span><span>Needs you<i>1</i></span><span>Handed off<i>1</i></span><span>Booked<i>3</i></span><span>Went quiet<i>4</i></span><span>All channels<i>11</i></span></div><div class="dk-conv sel" data-hrow><span class="dk-av">JD</span><div><b>Jane Doe</b><span>Can I come in Thursday?</span><em class="blue">Baxter replying</em></div><time>now</time></div><div class="dk-conv"><span class="dk-av">MB</span><div><b>Marcus Bell</b><span>Can I talk to someone about my insurance...</span><em class="amber">Needs you</em></div><time>2h</time></div><div class="dk-conv"><span class="dk-av">PN</span><div><b>Priya Nair</b><span>Baxter: See you Thursday at 4:00 PM.</span><em class="green">Booked</em></div><time>1h</time></div><div class="dk-conv"><span class="dk-av">TA</span><div><b>Tom Alvarez</b><span>${mkt("Tom called about a follow-up visit.", "Tom asked about a follow-up visit.")}</span><em class="blue">Baxter replying</em></div><time>2h</time></div><div class="dk-conv"><span class="dk-av">WV</span><div><b>Website visitor</b><span>Do you take Delta Dental?</span><em class="grey">Went quiet</em></div><time>5h</time></div></div><div class="dk-thread"><div class="dk-th-h"><span class="chn"><svg class="ic" aria-hidden="true"><use href="#i-sms"/></svg></span><div><b>Jane Doe</b><small><svg class="ic" aria-hidden="true"><use href="#i-sms"/></svg>${mkt("SMS", "WhatsApp")}</small></div>
<div class="right"><span class="dk-chip blue">Baxter is handling</span><button type="button" tabindex="-1" class="dk-btn">Take over</button></div></div>
<div class="dk-msgs" data-hmsgs><div class="dk-b cust" data-h="0">Can I come in Thursday?<small>3:02 PM</small></div>
<div class="dk-typing" data-h="t"><i></i><i></i><i></i></div>
<div class="dk-b bax" data-h="1">Thursday at 3:00 PM works. Want it?<small>Baxter, 3:02 PM</small></div>
<div class="dk-b cust" data-h="2">Yes please<small>3:03 PM</small></div>
<div class="dk-b bax" data-h="3">You're booked. Reminder coming Wednesday.<small>Baxter, 3:03 PM</small></div></div>
<div class="dk-comp"><div class="via">Baxter is replying via <b>${mkt("SMS", "WhatsApp")}</b></div><div class="row"><span class="inp">Type to take over</span><button type="button" tabindex="-1" class="dk-send" aria-label="Send"><svg class="ic" aria-hidden="true"><use href="#i-send"/></svg></button></div></div></div><div class="dk-contact"><div class="who"><span class="dk-av">JD</span><div><b>Jane Doe</b><span class="dk-chip grey">Patient</span></div></div>
<div class="acts"><button type="button" tabindex="-1" class="dk-btn"><svg class="ic" aria-hidden="true"><use href="#i-phone"/></svgdata-needs-voice>Call</button><button type="button" tabindex="-1" class="dk-btn blue"><svg class="ic" aria-hidden="true"><use href="#i-cal"/></svg>Book</button></div>
<div class="dk-kv"><span class="dk-lbl">Summary*</span><p>Returning patient, overdue for a cleaning. Prefers afternoons.</p></div>
<div class="dk-kv"><span class="dk-lbl">Appointments</span><div data-happt><p style="color:var(--ink-3);font-size:1.25em">Nothing booked yet.</p></div></div></div></div></div></div></div></div></div>
  <div class="cphone"><div class="phone"><div class="screen">
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

<!-- 01 front desk -->
${deskFront({
  flows: deskFlow([["voice", "Phone"], ["sms", "Texts"], ["whatsapp", "WhatsApp"], ["messenger", "Messenger"], ["instagram", "Instagram"], ["webchat", "Web chat"], ["email", "Email"]],
                  { when: "Thu, Nov 12<br>10:30 AM", what: "Furnace tune-up", via: "whatsapp", from: "Maria via WhatsApp, 10:02 PM", remind: "Wed" }, " data-na-only")
    + "\n      " + deskFlow([["whatsapp", "WhatsApp"], ["instagram", "Instagram"], ["messenger", "Messenger"], ["webchat", "Web chat"], ["email", "Email"]],
                  { when: "Thu, Nov 12<br>10:30 AM", what: "AC service", via: "whatsapp", from: "Mariam via WhatsApp, 10:02 PM", remind: "Wed" }, " data-wa-only hidden"),
  lead: `${mkt("Calls, texts, DMs and web chats", "WhatsApp messages, DMs, web chats and emails")} all land at one desk that never closes. It answers in seconds, finds a time that works, and puts the booking straight into your calendar.`,
  checks: [
    ["Books into your real calendar", "Checks your availability and booking rules before it offers a time."],
    ["Follows up so leads don't go cold", "Reminders before the appointment and nudges when someone goes quiet, never during your quiet hours."],
    [mkt("One assistant, 7 channels", "One assistant, 5 channels"), "Same answers and the same tone on every channel, Instagram and Messenger DMs included, set up once. Leads from your Facebook lead forms come straight in too."],
  ],
})}

<!-- the front desk phone -->
<section class="sec">
  <div class="wrap">
    <div class="voice-band" style="--c:#a98cf0" data-needs-voice>
      <div>
        <p class="voice-k">AI receptionist · Included in Pro</p>
        <h2 class="h-sec">Even the front<br>desk phone.</h2>
        <p class="lead" style="margin-top:18px">A receptionist that sounds human picks up the calls you can't, answers questions, books the job, and warm-transfers to you when it matters. No more voicemail.</p>
        ${voiceChips}
        <a class="btn btn-voice btn-lg" href="voice.html">Meet the AI Receptionist</a>
        <p class="fine">The AI Receptionist runs on US and Canadian phone numbers only.</p>
      </div>
      ${((d) => `<a class="voice-film" ${demoAttrs("na", d, d[1])}>${demoThumb("na", d)}<span class="demo-k">Voice AI · ${d[4]}</span><b>Meet your AI Receptionist</b><span class="demo-biz">${d[3]}</span></a>`)(NA_DEMOS.find((d) => d[0].startsWith("15-")))}
    </div>
  </div>
</section>

<!-- 02 help desk -->
${deskHelp("The same assistant handles support after the sale. It answers from your own guides and policies, and hands anything tricky to a team member with the whole conversation summarized.", [
  supportCard("na", NA_DEMOS.find((d) => d[0].startsWith("11-")), {
    kick: "Tech support", h: "Fixes it at 11 PM, no ticket queue.", biz: "FixPoint Electronics", ch: "webchat", via: "Web chat",
    msgs: [["in", "My soundbar won't connect to the TV anymore."],
           ["out", "Let's fix that. Hold the Bluetooth button for 5 seconds until the light blinks blue, then pick “FP-200” on your TV."],
           ["in", "That did it, thank you!"]],
    end: "Resolved. No one on your team needed.",
    p: "Step-by-step fixes from your own guides.", attr: " data-na-only" }),
  supportCard("na", NA_DEMOS.find((d) => d[0].startsWith("12-")), {
    kick: "Customer support", h: "Answers the questions you get every day.", biz: "Northwood Home", ch: "email", via: "Email",
    msgs: [["in", "Can I still return a lamp I bought three weeks ago?"],
           ["out", "Yes, returns are accepted within 30 days with the receipt. Want me to have a team member start the return for you?"],
           ["in", "Yes please."]],
    end: "Handed to your team, with a summary.", hand: true,
    p: "Everyday questions answered. The rest goes to your team.", attr: " data-na-only" }),
])}

<!-- 03 at your desk: the films (North American cut, so a WhatsApp-market visitor does not see it) -->
${deskFilms("na", NA_DEMOS, " data-na-only")}

<!-- 04 no desk -->
${deskNoDesk("Under a sink or mid-manicure, your front desk goes wherever you do.", [
  { biz: "Pipeline Plumbing", logo: "drop", glow: "#4d86ff", kick: "Plumbers", label: "The LeadQ inbox on a plumber's phone",
    cap: "Booked a water-heater job and flagged tonight's emergency while the owner was on another call.",
    rows: [{ need: true, name: "Burst pipe, Oak St.", text: "Wants someone tonight. Asked for you." },
           { name: "Dave", ch: ["voice", "whatsapp"], text: "Water heater quote, booked for Fri 9 AM", pill: "Booked" },
           { name: "Lena", ch: ["sms", "instagram"], text: "“Do you do drain cleaning?” Answered." },
           { name: "Marcus", ch: "webchat", text: "Asked about pricing. Follow-up sent." },
           { name: "Rosa", ch: "email", text: "“Tankless heaters too?” Answered." }] },
  { biz: "Glossy Nail Studio", logo: "polish", glow: "#f27eb4", kick: "Nail salons", label: "The LeadQ inbox on a nail salon owner's phone",
    cap: "Filled Saturday and handled a reschedule over Instagram and WhatsApp, without putting the brush down.",
    rows: [{ name: "Priya", ch: "instagram", text: "Gel fill, Saturday 11 AM with Jess", pill: "Booked" },
           { name: "Amanda", ch: "whatsapp", text: "Moved her appointment to Tue 3 PM", pill: "Rebooked" },
           { name: "Chloe", ch: "messenger", text: "“Do you take walk-ins?” Answered." },
           { name: "Tara", ch: ["sms", "email"], text: "Reminder sent for tomorrow 2 PM" },
           { name: "Mei", ch: "webchat", text: "Asked about gift cards. Answered." }] },
])}

<!-- faq: plans and credits live on the pricing page, not here -->
<section class="sec">
  <div class="wrap">
    <div class="sec-head"><h2 class="h-sec">Questions, answered.</h2></div>
    ${faqHtml(homeFaq)}
    <p class="faq-more">Plans and credits are on the <a href="pricing.html">pricing page</a>.</p>
  </div>
</section>

<!-- final call -->
<section class="horizon">
  <div class="wrap">
    <h2>Your next lead isn't going to wait.</h2>
    <p class="lead">Set up your assistant in minutes, from any browser.</p>
    <div class="ctas"><a class="btn btn-primary btn-lg" href="${SIGNUP}">Try it Free</a></div>
    <p class="fine">7-day free trial. No contracts, cancel anytime.</p>
  </div>
</section>

${demoPlayer}
<!-- the film, opened by any [data-video] button. Without <dialog> or JS those buttons keep
     their href and the page behaves as it did before. -->
<dialog class="vmodal" aria-label="See LeadQ work">
  <div class="vmodal-in">
    <button class="vmodal-x" type="button" aria-label="Close video">${I.x}</button>
    <video class="vmodal-v" controls playsinline preload="none" poster="img/video-poster.jpg" width="1920" height="1080">
      <source src="${MEDIA}leadq-video.mp4" type="video/mp4">
    </video>
  </div>
</dialog>`,
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
    </div>
    ${plans}
    <p class="plans-note">Create your account, then subscribe inside the app. No contracts, cancel anytime.</p>

    <div class="cmp-wrap">
      <table class="cmp">
        <caption>Compare plans</caption>
        <thead><tr><th scope="col"><span class="sr-only">Feature</span></th><th scope="col" data-plan="starter">Starter</th><th scope="col" data-plan="growth" class="hot" data-plan-name="growth">Growth</th><th scope="col">Pro</th></tr></thead>
        <tbody>
          <tr><th scope="row">Credits a month</th><td class="mono" data-cell="starter.credits">20,000</td><td data-plan="growth" class="hot mono" data-cell="growth.credits">45,000</td><td class="mono" data-cell="pro.credits">120,000</td></tr>
          <tr><th scope="row">Seats</th><td data-cell="starter.seats">1</td><td data-plan="growth" class="hot" data-cell="growth.seats">3</td><td data-cell="pro.seats">10</td></tr>
          <tr data-na-only><th scope="row">Phone numbers</th><td>${no}</td><td data-plan="growth" class="hot">1</td><td>2</td></tr>
          <tr><th scope="row">Channels</th><td data-cell="starter.channels">1</td><td data-plan="growth" class="hot" data-cell="growth.channels">3</td><td data-pro-channels>All</td></tr>
          <tr><th scope="row">Assistant, FAQ and lead capture</th><td>${yes}</td><td data-plan="growth" class="hot">${yes}</td><td>${yes}</td></tr>
          <tr><th scope="row">Booking, calendar and reminders</th><td>${yes}</td><td data-plan="growth" class="hot">${yes}</td><td>${yes}</td></tr>
          <tr><th scope="row">Follow-ups, custom fields, profiles</th><td>${yes}</td><td data-plan="growth" class="hot">${yes}</td><td>${yes}</td></tr>
          <tr><th scope="row">Contact Summary</th><td>${no}</td><td data-plan="growth" class="hot">${no}</td><td>${yes}</td></tr>
          <tr><th scope="row">Insights and reporting</th><td>${no}</td><td data-plan="growth" class="hot">${no}</td><td>${yes}</td></tr>
          <tr><th scope="row">Claude connector</th><td>${no}</td><td data-plan="growth" class="hot">${no}</td><td>${yes}</td></tr>
          <tr><th scope="row">Priority support</th><td>${no}</td><td data-plan="growth" class="hot">${no}</td><td>${yes}</td></tr>
          <tr><th scope="row">Calendar sync with Google and Outlook</th><td>${yes}</td><td data-plan="growth" class="hot">${yes}</td><td>${yes}</td></tr>
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
        <h2>Add-ons. This is the whole menu.</h2>
        <table>
          <tr><td>Extra phone number<small>Monthly</small></td><td data-addon="number">$8 USD/mo</td></tr>
          <tr><td>Extra seat<small>Monthly</small></td><td data-addon="seat">$15 USD/mo</td></tr>
          <tr><td>Extra business or location<small>Separate Pro plan, monthly. With Pro</small></td><td data-addon="workspace">$299 USD/mo</td></tr>
          <tr><td>SMS activation, A2P<small>One-time, US only. Waived with Pro</small></td><td data-addon="a2p">$99 USD once</td></tr>
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
    <div class="ctas"><a class="btn btn-primary btn-lg" href="${SIGNUP}">Try it Free</a></div>
  </div>
</section>`,
});

/* ======================================================= ENTERPRISE */
/* The form posts to the app (leadq-app api/enquiry.ts), which emails the team inbox with the
   visitor as the reply-to. site.js shows the thank-you only once the app says it was sent. The
   hidden "website" field is for bots: people never see it, so anything in it is not a person. */
page({
  file: "enterprise.html",
  title: "Enterprise | LeadQ",
  desc: "LeadQ for more locations, bigger teams and higher volume. Tell us about your business and we'll build a plan around it.",
  canonical: "https://www.leadq.co/enterprise.html",
  // They came here to fill in the form, so the demo chat waits to be opened rather than opening beside it.
  widget: WIDGET.replace(' data-autoopen="4"', ""),
  bodyAttr: 'style="--c:#4d86ff;--c2:#2fc6e8"',
  navHtml: nav(null),
  main: `
<section class="lit-hero">
  <div class="wrap">
    <div class="ent-top">
      <h1 class="h-hero">LeadQ for Enterprise.</h1>
      <p class="lead">More locations, bigger teams, higher volume. Tell us a little about your business and we'll build a plan around it.</p>
    </div>
    <div class="ent-card">
      <form class="ent-form" data-enquiry>
        <label>Name<input name="name" autocomplete="name" maxlength="120" required></label>
        <label>Business name<input name="business" autocomplete="organization" maxlength="160" required></label>
        <label>Email<input name="email" type="email" autocomplete="email" maxlength="200" required></label>
        <label>Tell us a little about your business and needs<textarea name="about" rows="5" maxlength="4000" required></textarea></label>
        <div class="ent-hp" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>
        <p class="ent-err" data-enquiry-err role="alert" hidden>That didn't send. Try again in a moment.</p>
        <button class="btn btn-primary btn-lg btn-block" type="submit">Send</button>
      </form>
      <div class="ent-done" data-enquiry-done role="status" tabindex="-1" hidden>
        <span class="ent-tick" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg></span>
        <h2>Thanks<span data-enquiry-first></span>.</h2>
        <p>Someone will get back to you shortly.</p>
      </div>
    </div>
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
        <h1 class="h-hero">The same assistant. Now it picks up.</h1>
        <p class="lead">It answers every inbound call in your assistant's persona and voice, books live against your real calendar, and hands off to you on your rules. No more voicemail.</p>
        ${voiceChips}
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
    <p class="fine" style="text-align:center">Voice runs on US and Canadian phone numbers only, and comes with the Pro plan.</p>
  </div>
</section>

<section data-needs-voice class="sec">
  <div class="wrap picker">
    <div>
      <h2 class="h-sec">Choose a voice your callers will trust.</h2>
      <p class="lead" style="margin-top:18px">Nearly 40 voices across American, British and French accents, standard and premium. Preview any of them in the app, set the speaking pace, and you're done.</p>
    </div>
    ${voicePicker}
  </div>
</section>

<section data-needs-voice class="sec">
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

<section data-needs-voice class="sec">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="h-sec">Not a second robot.</h2>
      <p class="lead">It's the same assistant. It just answers the phone too. Change your hours once and the phone knows. Add a service and it can quote the duration on a call that same afternoon.</p>
    </div>
    <div class="twin">
      <div class="card">
        <div class="twin-h"><b>WhatsApp</b>Monday, 6:12 PM</div>
        <div class="thread">
          <div class="bub in">Do you do evening appointments?</div>
          <div class="bub out">We're open until 7:00 PM on Thursdays. Want me to look at this week?</div>
          <div class="bub in">I'll call tomorrow to sort it</div>
        </div>
      </div>
      <div class="card">
        <div class="twin-h"><b>Phone call</b>Tuesday, 9:04 AM</div>
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

<section data-needs-voice class="sec">
  <div class="wrap">
    <div class="priceblock">
      <div>
        <h2 class="h-sec">Stop sending callers to voicemail.</h2>
        <p class="lead" style="margin-top:18px">The AI Receptionist comes with Pro and runs from the same monthly credit pool as your texts. A call uses about 220 credits a minute, since it costs more than a message. Right now it answers your calls. Outbound calling is on the roadmap.</p>
        <div class="ctas"><a class="btn btn-voice btn-lg" href="${SIGNUP}&plan=pro">Get Pro</a><a class="btn btn-ghost btn-lg" href="pricing.html">See all pricing</a></div>
        <p class="fine">The AI Receptionist runs on US and Canadian phone numbers only.</p>
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
/* Use cases (North America): each tile plays that industry's film, like ae-use-cases.html, and the
   other businesses follow on film. Visitors the site treats as a WhatsApp market keep the original
   tiles that open the industry pages (those films show SMS and the phone line), and the industry
   pages stay linked from this page either way. */
const naFilm = (n) => NA_DEMOS.find((d) => d[0].startsWith(n + "-"));
const NA_TILES = [
  ["04", "#2dd4bf", "dental", "A patient in a modern dental clinic", "Dental and clinics", "Fill chairs, cut no-shows"],
  ["01", "#f27eb4", "salon", "A stylist working in a hair salon", "Salons", "Reply while your hands are full"],
  ["15", "#f5a524", "home", "A technician on a home services job", "Home services", "Book jobs from the field"],
  ["03", "#7dd3fc", "realestate", "A modern home exterior for sale", "Real estate", "Answer leads in seconds"],
];
const NA_MORE = [
  ["00", "Heating and cooling", "Answered at 10 PM, booked by morning"],
  ["02", "Restaurants", "Reservations in your own voice"],
  ["05", "Car rental", "Every inquiry, qualified"],
  ["06", "Fitness", "Classes and PT sessions, filled"],
  ["07", "Interiors and design", "The right designer, every time"],
  ["08", "Retail", "Instagram and WhatsApp sales, answered"],
  ["09", "Education", "From inquiry to enrollment"],
  ["11", "Tech support", "Troubleshooting, step by step"],
  ["12", "Customer support", "Support that never sleeps"],
  ["13", "Car dealers", "“Is it still available?”"],
];
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
      <h1 class="h-hero" data-uc-h>Built for how clinics actually work.</h1>
      <p class="lead" data-uc-p>It answers every ${mkt("call", "message")}, books the chair, and reminds them the day before. Even while you're with a patient.</p>
      <div class="tabs" role="group" aria-label="Industry">
        <button type="button" data-industry="dental" aria-pressed="true">Dental and clinics</button>
        <button type="button" data-industry="salon" aria-pressed="false">Salons</button>
        <button type="button" data-industry="home" aria-pressed="false">Home services</button>
        <button type="button" data-industry="realestate" aria-pressed="false">Real estate</button>
      </div>
      <div class="ctas"><a class="btn btn-primary btn-lg" href="${SIGNUP}">Try it Free</a><a class="btn btn-ghost btn-lg" href="pricing.html">See pricing</a></div>
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
    <div class="uc-tiles" data-na-only>
${NA_TILES.map(([n, c, img, alt, h, sub]) => `      <a class="uc-tile" ${demoAttrs("na", naFilm(n), h)} style="--c:${c}"><div class="ph fade-up">${picture(img, alt)}</div><h3>${h}</h3><p class="sub">${sub}</p><span class="go">Watch the film <em aria-hidden="true">+</em></span></a>`).join("\n")}
    </div>
    <div class="uc-tiles" data-wa-only hidden>
      <a class="uc-tile" href="for-dental.html" style="--c:#2dd4bf"><div class="ph fade-up">${picture("dental", "A patient in a modern dental clinic")}</div><h3>Dental and clinics</h3><p class="sub">Fill chairs, cut no-shows</p><span class="go">Explore <em aria-hidden="true">+</em></span></a>
      <a class="uc-tile" href="for-salons.html" style="--c:#f27eb4"><div class="ph fade-up">${picture("salon", "A stylist working in a hair salon")}</div><h3>Salons</h3><p class="sub">Reply while your hands are full</p><span class="go">Explore <em aria-hidden="true">+</em></span></a>
      <a class="uc-tile" href="for-home-services.html" style="--c:#f5a524"><div class="ph fade-up">${picture("home", "A technician on a home services job")}</div><h3>Home services</h3><p class="sub">Book jobs from the field</p><span class="go">Explore <em aria-hidden="true">+</em></span></a>
      <a class="uc-tile" href="for-real-estate.html" style="--c:#7dd3fc"><div class="ph fade-up">${picture("realestate", "A modern home exterior for sale")}</div><h3>Real estate</h3><p class="sub">Answer leads in seconds</p><span class="go">Explore <em aria-hidden="true">+</em></span></a>
    </div>
    <div data-na-only>
    <h3 class="demo-sub">More businesses, on film</h3>
    <ol class="demo-grid">
${NA_MORE.map(([n, k, t]) => demoCard("na", naFilm(n), k, t)).join("\n")}
    </ol>
    <p class="fine demo-note">All businesses shown are fictional. The app is real.</p>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head"><h2 class="h-sec">The same problems, in every trade.</h2></div>
    <div class="ww">
      <div class="without"><h3>Without LeadQ</h3><ul><li>${mkt("The phone rings while you're with a customer", "Messages arrive while you're with a customer")}</li><li>Messages sit unread until tonight</li><li>New leads book with whoever answers first</li></ul></div>
      <div class="with"><h3>With LeadQ</h3><ul><li>${mkt("Every call and message answered in seconds", "Every message answered in seconds")}</li><li>Booked straight into your calendar, reminders sent</li><li>Follow-ups go out while you work</li></ul></div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="h-sec">If you book appointments, LeadQ is for you.</h2>
      <p class="lead">It learns any business the same way. These are just the ones we hear from most.</p>
    </div>
    <div class="chips" role="group" aria-label="Trades LeadQ works with"><div class="chips-run"><span>Dental</span><span>Med spas</span><span>Chiro and physio</span><span>Salons</span><span>Barbershops</span><span>HVAC</span><span>Plumbing</span><span>Electrical</span><span>Cleaning</span><span>Real estate</span><span>Fitness studios</span><span>Auto shops</span><span aria-hidden="true">Dental</span><span aria-hidden="true">Med spas</span><span aria-hidden="true">Chiro and physio</span><span aria-hidden="true">Salons</span><span aria-hidden="true">Barbershops</span><span aria-hidden="true">HVAC</span><span aria-hidden="true">Plumbing</span><span aria-hidden="true">Electrical</span><span aria-hidden="true">Cleaning</span><span aria-hidden="true">Real estate</span><span aria-hidden="true">Fitness studios</span><span aria-hidden="true">Auto shops</span></div></div>
  </div>
</section>

<section class="horizon">
  <div class="wrap">
    <h2>See it with your own bookings.</h2>
    <p class="lead">Set it up in your browser in minutes. It learns your business, then gets to work.</p>
    <div class="ctas"><a class="btn btn-primary btn-lg" href="${SIGNUP}">Try it Free</a><a class="btn btn-ghost btn-lg" href="pricing.html">See pricing</a></div>
  </div>
</section>

${demoPlayer}`,
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
      <h1 class="h-hero">${mkt(v.h1, v.h1Wa)}</h1>
      <p class="lead">${mkt(v.body, v.bodyWa)}</p>
      <div class="ctas"><a class="btn btn-primary btn-lg" href="${SIGNUP}">Try it Free</a><a class="btn btn-ghost btn-lg" href="pricing.html">See pricing</a></div>
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

<section class="sec">
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

<section class="sec">
  <div class="wrap">
    <div class="sec-head"><h2 class="h-sec">${v.faqTitle}</h2></div>
    ${faqHtml(v.faq)}
  </div>
</section>

<section class="horizon">
  <div class="wrap">
    <h2>${v.close}</h2>
    <p class="lead">${v.closeBody}</p>
    <div class="ctas"><a class="btn btn-primary btn-lg" href="${SIGNUP}">Try it Free</a><a class="btn btn-ghost btn-lg" href="pricing.html">See pricing</a></div>
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

<section class="sec">
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
    <div class="ctas" style="justify-content:center;margin-top:36px"><a class="btn btn-primary btn-lg" href="${SIGNUP}">Try it Free</a><a class="btn btn-ghost btn-lg" href="use-cases.html">See it for your industry</a></div>
  </div>
</section>`,
});

/* ======================================================= LEGAL (text carried over unchanged from HEAD) */
const slug = (s) => s.toLowerCase().replace(/&amp;/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
// The legal copy is lifted verbatim from the last pre-redesign commit. Pinning the commit
// matters: once the redesign is merged, HEAD holds the rebuilt page, and re-reading HEAD
// would parse this generator's own output instead of the original text.
const LEGAL_SRC = "7210f5b";

function legal(file, title, updatedFallback, desc, opts = {}) {
  const src = execSync(`git show ${LEGAL_SRC}:${file}`, { cwd: R, encoding: "utf8" });
  const intro = src.match(/<p class="policy-intro">([\s\S]*?)<\/p>/)[1];
  const updated = opts.updated || (src.match(/<p class="page-hero-sub">([\s\S]*?)<\/p>/) || [, updatedFallback])[1];
  const sections = [...src.matchAll(/<div class="policy-section">([\s\S]*?)<\/div>/g)].map((m) => {
    const inner = m[1].trim().replace(/ class="terms-list"/g, "").replace(/var\(--font-mono\)/g, "var(--mono)");
    const h = inner.match(/<h2>([\s\S]*?)<\/h2>/)[1];
    return `<section id="${slug(h)}">\n        ${inner}\n      </section>`;
  });
  // Sections written after the pinned commit. Each names the section it goes in front of, and a
  // heading that has moved or been renamed in the source is an error, not a silent append.
  for (const add of opts.add || []) {
    const at = sections.findIndex((s) => s.includes(`<h2>${add.before}</h2>`));
    if (at < 0) throw new Error(`${file}: no section "${add.before}" to insert "${add.h}" before`);
    sections.splice(at, 0, `<section id="${slug(add.h)}">\n        <h2>${add.h}</h2>\n        ${add.body}\n      </section>`);
  }
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
/* Facebook and Instagram, added 2026-10-02 for Meta's access verification and App Review, which
   check that the policy covers the data the app receives. Every claim here was checked against
   the system, not written from the plan: disconnect runs fb_delete, which deletes the stored page
   and user tokens; account closure purges contacts and messages; the inbox can delete a thread.
   The retention section's anchor is what Meta's "data deletion instructions URL" field points at. */
legal("privacy-policy.html", "Privacy Policy", "Last updated: September 2026", "LeadQ's privacy policy outlining how we collect, use, and protect your personal information.", {
  updated: "Last updated: October 2026",
  add: [
    {
      before: "Data Security",
      h: "Facebook and Instagram Data",
      body: `<p>When you connect a Facebook Page or an Instagram professional account to LeadQ, you log in with Facebook and choose what to connect. Depending on what you turn on, we receive: submissions to your Page's Facebook lead forms (the details the person entered, such as name, email and phone number); messages that customers send to your Page on Messenger or to your Instagram account, with the sender's public name; and the Page or account name and the access token needed to keep it connected.</p>
        <p style="margin-top:1rem;">We use this data only to provide LeadQ to the business that connected it: adding leads to your contacts, letting your assistant reply to your customers on your behalf, and showing you every conversation in your LeadQ dashboard. Messages are processed by our AI provider as described in the section on our use of AI above. We do not sell this data, use it for advertising, or use it to train AI models.</p>`,
    },
    {
      before: "Data Security",
      h: "Retention and Deletion of Facebook and Instagram Data",
      body: `<p>We keep the access token only while your Page or account stays connected. You can disconnect at any time from your LeadQ dashboard, which stops our access and deletes the stored token. Leads and conversations stay in your LeadQ account until you delete them or close your account, at which point we delete them from our systems. You can also remove LeadQ from your Facebook settings under Business Integrations, or ask us to delete your data by emailing <a href="mailto:info@leadq.co">info@leadq.co</a>.</p>`,
    },
  ],
});
legal("terms-of-service.html", "Terms of Service", "Last updated: 2026", "LeadQ's terms of service governing the use of SMS and other services provided by LeadQ INC.");

/* ======================================================= UAE DISTRIBUTOR (ae.html)
   The UAE landing page, marketed by our distributor there. It is deliberately NOT the home
   page with the prices taken out:

   - No prices anywhere. The distributor sets its own retail, so a tier card here would
     contradict whatever they quote. "Book a demo" replaces every "Try it Free".
   - No links to pricing.html or to signup. A landing page that leaks into the self-serve funnel
     sells LeadQ's price to the distributor's lead, so every link on this page is an anchor
     inside it or a legal page.
   - It DECLARES its market rather than detecting one, so it reads the same wherever it is
     opened. It names only the three channels a UAE workspace actually has, so nothing here
     has to be hidden by the market switcher and nothing promises what cannot be sold.
   - The chat is the LeadQ UAE workspace, so booking a demo puts it on the distributor's own
     calendar. Nothing here knows or cares which calendar that is.

   Not in sitemap.xml and noindex on purpose: it would otherwise compete with the real home page
   for UAE search traffic while showing no prices, and the arrangement is not exclusive, so
   LeadQ's own direct UAE visitors should still land on the normal site. */
const AE_NAV = [["ae.html#how", "How it works"], ["ae.html#demos", "Watch it work"], ["ae-use-cases.html", "Use cases", "use-cases"], ["ae.html#faq", "Questions"]];
const aeLinks = (current) => AE_NAV.map(([h, t, k]) => `<a href="${h}"${k && k === current ? ' aria-current="page"' : ""}>${t}</a>`).join("");
const AE_NAV_LINKS = aeLinks();
const aeNavFor = (current) => `<header class="nav">
  <div class="nav-pill">
    <a class="brand" href="ae.html" aria-label="LeadQ">${wordmark()}</a>
    <nav class="nav-links" aria-label="Main">${aeLinks(current)}</nav>
    <div class="nav-actions">
      <a class="btn btn-ghost btn-sm login" href="${APP}">Log in</a>
      <a class="btn btn-primary btn-sm" href="#demo" data-open-chat>Book a demo</a>
      <button class="nav-menu" type="button" aria-label="Menu" aria-expanded="false" aria-controls="nav-sheet">${I.menu}</button>
    </div>
    <div class="nav-sheet" id="nav-sheet" hidden>${aeLinks(current)}<a href="${APP}">Log in</a></div>
  </div>
</header>`;
const aeNav = `<header class="nav">
  <div class="nav-pill">
    <a class="brand" href="ae.html" aria-label="LeadQ">${wordmark()}</a>
    <nav class="nav-links" aria-label="Main">${AE_NAV_LINKS}</nav>
    <div class="nav-actions">
      <a class="btn btn-ghost btn-sm login" href="${APP}">Log in</a>
      <a class="btn btn-primary btn-sm" href="#demo" data-open-chat>Book a demo</a>
      <button class="nav-menu" type="button" aria-label="Menu" aria-expanded="false" aria-controls="nav-sheet">${I.menu}</button>
    </div>
    <div class="nav-sheet" id="nav-sheet" hidden>${AE_NAV_LINKS}<a href="${APP}">Log in</a></div>
  </div>
</header>`;

const aeFooter = `<footer class="footer">
  <div class="wrap">
    <div class="footer-top">
      <div>
        <a class="brand" href="ae.html" aria-label="LeadQ">${wordmark()}</a>
        <p class="footer-tag">Always on. Always You.</p>
      </div>
      <nav class="footer-links" aria-label="Footer">
        ${AE_NAV_LINKS}<a href="privacy-policy.html">Privacy</a><a href="terms-of-service.html">Terms</a>
      </nav>
    </div>
    <div class="footer-legal">&copy; 2026 LeadQ Inc.</div>
  </div>
</footer>`;

const aeFaq = [
  ["Which channels does it answer?",
   "WhatsApp, web chat on your website, and email. One assistant across all three, so it knows the whole conversation wherever it started."],
  ["Can I keep my current WhatsApp number?",
   "Usually yes. It moves onto the WhatsApp Business Platform, which means it stops working in the WhatsApp app on a phone and starts working through LeadQ instead. We take you through Meta's business verification, which is the part most people get stuck on."],
  ["Does it book into my calendar?",
   "Yes. Google Calendar or Outlook, or the booking system you already use. It offers times you are genuinely free, writes the appointment, and sends the reminder the day before."],
  ["What happens when it cannot answer something?",
   "It hands the conversation over to you or your team. You decide what it should never answer on its own, and those conversations arrive in your inbox marked as needing you, with everything the customer already said."],
  /* Backed by the product, not aspirational: DEFAULT_LANG_NOTE in leadq-app/index.html is
     seeded into every workspace's knowledge base, so this is the shipped default behaviour
     rather than something the client has to teach it. */
  ["Does it answer in my customers' language?",
   "Yes. It replies in whatever language the customer writes in and stays in it, and if they switch language mid-conversation it switches with them."],
  ["What does it cost?",
   "Cost will depend on your exact needs. Book a demo to learn more."],
];


/* The demo library: one overview and a short film per feature, made for the UAE from the real app
   with invented businesses. Every business named here is fictional; none is a customer. Each film
   ends on the distributor's own contact card, which is why they live on this page and not on the
   home page. The files sit in demos/ae/ beside a poster frame chosen from inside each film. */
const AE_DEMOS = [
  ["00-overview", "Overview", "LeadQ in one minute", "Frostline AC Services · Dubai", "1:02"],
  ["01-set-up-in-minutes", "Set up in minutes", "Go live in an afternoon", "Noor Beauty Lounge · Jumeirah", "0:53"],
  ["02-persona", "Persona", "Sounds like you", "Saffron & Sea · Dubai Marina", "1:01"],
  ["03-knowledge-base", "Knowledge base", "Answers it can stand behind", "Palm Key Properties · Business Bay", "1:05"],
  ["04-services-hours", "Services & hours", "Bookable, around the clock", "Bright Smile Dental · JLT", "0:50"],
  ["05-inbox-contacts", "Inbox & contacts", "Every lead, qualified", "Desert Drive Car Rental · Al Quoz", "0:50"],
  ["06-schedule", "Schedule", "Every booking, in one place", "Pulse Fitness · Business Bay", "0:42"],
  ["07-team-hand-overs", "Team & hand-overs", "The right person, every time", "Majlis Interiors · Al Barsha", "0:46"],
  ["08-channels", "Channels", "Wherever customers message", "Oud & Amber · Dubai Mall", "0:52"],
  ["09-insights", "Insights", "Proof it’s working", "BrightPath Learning Centre · Al Barsha", "0:46"],
  ["10-account-claude", "Account & Claude", "Change it by just asking", "Frostline AC Services · Dubai", "0:45"],
  ["11-tech-support", "Tech support", "Help, the moment they need it", "SwiftFix Electronics · Deira", "0:53"],
  ["12-customer-support", "Customer support", "Support that never sleeps", "Dunes Home · online across the UAE", "1:01"],
  ["13-inventory", "Inventory", "“Is it still available?”", "Marina Motors · Al Quoz", "0:56"],
  ["14-what-leadq-does", "Why LeadQ", "What it does for your business", "Time back, lower costs, more revenue", "1:03"],
];
const aeDemoPlayer = demoPlayer;

page({
  file: "ae.html",
  title: "LeadQ for the UAE | WhatsApp answered and booked, automatically",
  desc: "An AI assistant that answers WhatsApp, web chat and email for UAE businesses and books the appointment, day and night.",
  ogDesc: "One AI assistant answers WhatsApp, web chat and email, and books the appointment while you work.",
  canonical: "https://www.leadq.co/ae.html",
  robots: "noindex,follow",
  bodyAttr: 'style="--c:#4d86ff;--c2:#38d3ff"',
  htmlAttr: 'data-market="UAE"',
  widget: AE_WIDGET,
  navHtml: aeNav,
  footerHtml: aeFooter,
  jsonld: [faqLd(aeFaq)],
  main: `
<section class="lit-hero">
  <div class="wrap">
    <div class="sec-head hero-head">
      <h1 class="h-hero">Stop <span class="ko">missing.</span><br>Start <span class="hi">booking.</span></h1>
      <p class="lead">Here, business happens on WhatsApp. LeadQ answers WhatsApp, web chat and email in seconds, then books the appointment. At midnight, on a weekend, or while you are with a customer.</p>
      <div class="ctas">
        <a class="btn btn-primary btn-lg" href="#demo" data-open-chat>Book a demo</a>
        <a class="btn btn-ghost btn-lg btn-play" href="#how" data-video>${I.play}What is LeadQ?</a>
      </div>
    </div>
  </div>
</section>

${deskFront({
  flows: deskFlow([["whatsapp", "WhatsApp"], ["instagram", "Instagram"], ["messenger", "Messenger"], ["webchat", "Web chat"], ["email", "Email"]],
                  { when: "Thu, Nov 12<br>10:30 AM", what: "AC service", via: "whatsapp", from: "Mariam via WhatsApp, 11:40 PM", remind: "Wed" }),
  lead: "WhatsApp messages, DMs, web chats and emails all land at one desk that never closes. It answers in seconds, finds a time that works, and puts the booking straight into your calendar.",
  checks: [
    ["Books into your real calendar", "Google Calendar or Outlook. It offers times you are genuinely free and writes the appointment straight in."],
    ["Follows up so leads don't go cold", "A reminder the day before, and a nudge when someone goes quiet, never during your quiet hours."],
    ["One assistant, 5 channels", "Same answers and the same tone on every channel, in whatever language your customer writes in."],
  ],
})}

${deskHelp("The same assistant handles support after the sale. It answers from your own guides and policies, and hands anything tricky to a team member with the whole conversation summarised.", [
  supportCard("ae", AE_DEMOS.find((d) => d[0].startsWith("11-")), {
    kick: "Tech support", h: "Fixes it at 11 PM, no ticket queue.", biz: "SwiftFix Electronics", ch: "webchat", via: "Web chat",
    msgs: [["in", "My soundbar won't connect to the TV anymore."],
           ["out", "Let's fix that. Hold the Bluetooth button for 5 seconds until the light blinks blue, then pick “SF-200” on your TV."],
           ["in", "That did it, thank you!"]],
    end: "Resolved. No one on your team needed.",
    p: "Step-by-step fixes from your own guides." }),
  supportCard("ae", AE_DEMOS.find((d) => d[0].startsWith("12-")), {
    kick: "Customer support", h: "Answers the questions you get every day.", biz: "Dunes Home", ch: "whatsapp", via: "WhatsApp",
    msgs: [["in", "Can I still return a lamp I bought three weeks ago?"],
           ["out", "Yes, returns are accepted within 30 days with the receipt. Shall I ask the team to arrange a collection?"],
           ["in", "Yes please."]],
    end: "Handed to your team, with a summary.", hand: true,
    p: "Everyday questions answered. The rest goes to your team." }),
])}

${deskFilms("ae", AE_DEMOS)}

${deskNoDesk("Up a ladder or mid-blow-dry, your front desk goes wherever you do.", [
  { biz: "Frostline AC Services", logo: "snow", glow: "#38bdf8", kick: "AC and maintenance", label: "The LeadQ inbox on an AC company owner's phone",
    cap: "Booked an AC service and flagged a same-day breakdown while the team was out on a job.",
    rows: [{ need: true, name: "AC not cooling, Al Barsha", text: "Wants someone today. Asked for you." },
           { name: "Ahmed", ch: "whatsapp", text: "AC service, booked for Sat 9 AM", pill: "Booked" },
           { name: "Rajesh", ch: "webchat", text: "“Do you do duct cleaning?” Answered." },
           { name: "Fatima", ch: "instagram", text: "Yearly contract? Follow-up sent." },
           { name: "Omar", ch: "email", text: "“Office units too?” Answered." }] },
  { biz: "Noor Beauty Lounge", logo: "crescent", glow: "#f27eb4", kick: "Salons and spas", label: "The LeadQ inbox on a beauty lounge owner's phone",
    cap: "Filled Saturday and handled a reschedule over Instagram and WhatsApp, without putting the brush down.",
    rows: [{ name: "Layla", ch: "instagram", text: "Blow-dry, Saturday 11 AM with Leila", pill: "Booked" },
           { name: "Aisha", ch: "whatsapp", text: "Moved her appointment to Tue 3 PM", pill: "Rebooked" },
           { name: "Sophie", ch: "messenger", text: "“Do you take walk-ins?” Answered." },
           { name: "Mariam", ch: "whatsapp", text: "Reminder sent for tomorrow 2 PM" },
           { name: "Hessa", ch: "webchat", text: "Bridal packages? Follow-up sent." }] },
])}

<section class="lit-hero midway" style="--c:#2fc6e8;--c2:#4d86ff">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="h-sec">Set up with you. Supported after.</h2>
      <p class="lead" style="margin-top:18px">You are not handed a login and left to work it out. Your assistant is built around how your business actually runs, your team is shown how to use it, and priority support stays with you once you are live.</p>
      <div class="ctas"><a class="btn btn-primary btn-lg" href="#demo" data-open-chat>Book a demo</a></div>
    </div>
  </div>
</section>

<section class="sec" id="faq">
  <div class="wrap">
    <div class="sec-head"><h2 class="h-sec">Questions, answered.</h2></div>
    ${faqHtml(aeFaq)}
  </div>
</section>

<section class="horizon" id="demo">
  <div class="wrap">
    <h2>See it answer your own questions.</h2>
    <p class="lead">Ask our assistant anything, the way your customers would. It books the demo itself, straight onto the calendar.</p>
    <div class="ctas"><a class="btn btn-primary btn-lg" href="#demo" data-open-chat>Book a demo</a></div>
  </div>
</section>

<!-- The hero's "What is LeadQ?" button plays the UAE cut of the LeadQ film (leadq-video-ae.mp4); the home page's
     names SMS and the phone line. initVideo() binds whatever [data-video] and .vmodal it finds, and with
     JS off the button keeps its href. Keep this film: the demo library below does not replace it. -->
<dialog class="vmodal" aria-label="See LeadQ work">
  <div class="vmodal-in">
    <button class="vmodal-x" type="button" aria-label="Close video">${I.x}</button>
    <video class="vmodal-v" controls playsinline preload="none" poster="img/video-poster-ae.jpg" width="1920" height="1080">
      <source src="${MEDIA}leadq-video-ae.mp4" type="video/mp4">
    </video>
  </div>
</dialog>

<!-- Every card in #demos opens this player. -->
${aeDemoPlayer}`,
});


/* ======================================================= UAE USE CASES (ae-use-cases.html)
   The same page as use-cases.html (industry switcher, phone, tiles, the before/after, the trades),
   under ae.html's rules: no prices, no signup or pricing links, WhatsApp-market wording only,
   "Book a demo" as the call to action, noindex and out of the sitemap. The hero's switcher reads
   INDUSTRIES_AE in site.js (data-set="ae"), and each tile plays that industry's UAE film instead
   of opening a North American industry page. */
const aeFilm = (n) => AE_DEMOS.find((d) => d[0].startsWith(n + "-"));
const AE_TILES = [
  ["04", "#2dd4bf", "dental", "A patient in a modern dental clinic", "Dental and clinics", "Fill chairs, cut no-shows"],
  ["01", "#f27eb4", "salon", "A stylist working in a hair salon", "Salons", "Reply while your hands are full"],
  ["00", "#f5a524", "home", "A technician on a home services job", "Home services", "Book jobs from the field"],
  ["03", "#7dd3fc", "realestate", "A modern home exterior for sale", "Real estate", "Answer leads in seconds"],
];
const AE_MORE = [
  ["02", "Restaurants", "Reservations in your own voice"],
  ["05", "Car rental", "Every enquiry, qualified"],
  ["06", "Fitness", "Classes and PT sessions, filled"],
  ["07", "Interiors and design", "The right designer, every time"],
  ["08", "Retail", "Instagram and WhatsApp sales, answered"],
  ["09", "Education", "From enquiry to enrolment"],
  ["11", "Tech support", "Troubleshooting, step by step"],
  ["12", "Customer support", "Support that never sleeps"],
  ["13", "Car dealers", "“Is it still available?”"],
];
const AE_TRADES = ["Dental", "Clinics", "Salons and spas", "Barbers", "AC and maintenance", "Cleaning", "Real estate", "Car rental", "Car dealers", "Restaurants", "Fitness studios", "Tutoring centres", "Interiors", "Retail"];
page({
  file: "ae-use-cases.html",
  title: "Use cases | LeadQ for UAE clinics, salons, trades and agents",
  desc: "See how the LeadQ assistant works for your business in the UAE. Pick your industry and watch it answer WhatsApp, web chat and email, and book the appointment.",
  ogDesc: "Pick your industry and watch LeadQ answer and book, on WhatsApp, web chat and email.",
  canonical: "https://www.leadq.co/ae-use-cases.html",
  robots: "noindex,follow",
  bodyAttr: 'style="--c:#2dd4bf"',
  htmlAttr: 'data-market="UAE"',
  widget: AE_WIDGET,
  navHtml: aeNavFor("use-cases"),
  footerHtml: aeFooter,
  main: `
<section class="lit-hero uc-hero photo-host" data-industry-hero data-set="ae">
  <div class="ph">${picture("dental", "A patient in a modern dental clinic", true)}</div>
  <div class="wrap">
    <div>
      <h1 class="h-hero" data-uc-h>Built for how clinics actually work.</h1>
      <p class="lead" data-uc-p>It answers every WhatsApp, books the chair, and reminds them the day before. Even while you're with a patient.</p>
      <div class="tabs" role="group" aria-label="Industry">
        <button type="button" data-industry="dental" aria-pressed="true">Dental and clinics</button>
        <button type="button" data-industry="salon" aria-pressed="false">Salons</button>
        <button type="button" data-industry="home" aria-pressed="false">Home services</button>
        <button type="button" data-industry="realestate" aria-pressed="false">Real estate</button>
      </div>
      <div class="ctas"><a class="btn btn-primary btn-lg" href="#demo" data-open-chat>Book a demo</a><a class="btn btn-ghost btn-lg" href="ae.html#demos">Watch it work</a></div>
    </div>
    ${phone({
      label: "The Schedule tab in the LeadQ app, filled with this industry's bookings",
      tab: "schedule",
      header: scheduleHeader,
      body: scheduleBody([["10:00", "AM", "Mariam Al Hashimi", "Consultation, Dr. Rania", "Booked, reminder sent"], ["2:30", "PM", "James Carter", "Cleaning, Dr. Omar"], ["4:00", "PM", "Priya Nair", "New patient, Dr. Rania"]], { rowCls: "uc-appt" }),
    })}
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head"><h2 class="h-sec">See it set up for your world.</h2></div>
    <div class="uc-tiles">
${AE_TILES.map(([n, c, img, alt, h, sub]) => `      <a class="uc-tile" ${demoAttrs("ae", aeFilm(n), h)} style="--c:${c}"><div class="ph fade-up">${picture(img, alt)}</div><h3>${h}</h3><p class="sub">${sub}</p><span class="go">Watch the film <em aria-hidden="true">+</em></span></a>`).join("\n")}
    </div>
    <h3 class="demo-sub">More businesses, on film</h3>
    <ol class="demo-grid">
${AE_MORE.map(([n, k, t]) => demoCard("ae", aeFilm(n), k, t)).join("\n")}
    </ol>
    <p class="fine demo-note">All businesses shown are fictional. The app is real.</p>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head"><h2 class="h-sec">The same problems, in every trade.</h2></div>
    <div class="ww">
      <div class="without"><h3>Without LeadQ</h3><ul><li>Messages arrive while you're with a customer</li><li>Messages sit unread until tonight</li><li>New leads book with whoever answers first</li></ul></div>
      <div class="with"><h3>With LeadQ</h3><ul><li>Every message answered in seconds</li><li>Booked straight into your calendar, reminders sent</li><li>Follow-ups go out while you work</li></ul></div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="h-sec">If you book appointments, LeadQ is for you.</h2>
      <p class="lead">It learns any business the same way. These are just the ones we hear from most.</p>
    </div>
    <div class="chips" role="group" aria-label="Trades LeadQ works with"><div class="chips-run">${AE_TRADES.map((t) => `<span>${t}</span>`).join("")}${AE_TRADES.map((t) => `<span aria-hidden="true">${t}</span>`).join("")}</div></div>
  </div>
</section>

<section class="horizon">
  <div class="wrap">
    <h2>See it with your own bookings.</h2>
    <p class="lead">Book a short demo and we'll show you LeadQ answering and booking for a business like yours.</p>
    <div class="ctas"><a class="btn btn-primary btn-lg" href="#demo" data-open-chat>Book a demo</a><a class="btn btn-ghost btn-lg" href="ae.html#demos">Watch it work</a></div>
  </div>
</section>

<!-- The tiles and cards on this page open this player. -->
${demoPlayer}`,
});

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
const urls = [["", "1.0"], ["use-cases.html", "0.9"], ["pricing.html", "0.9"], ["enterprise.html", "0.6"], ["voice.html", "0.8"], ["about.html", "0.5"], ["for-dental.html", "0.8"], ["for-salons.html", "0.8"], ["for-home-services.html", "0.8"], ["for-real-estate.html", "0.8"]];
fs.writeFileSync(path.join(R, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, p]) => `  <url><loc>https://www.leadq.co/${u}</loc><lastmod>${today}</lastmod><priority>${p}</priority></url>`).join("\n")}
</urlset>
`);
console.log("wrote sitemap.xml");
