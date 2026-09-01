/* Home hero phone — three real LeadQ app screens that auto-advance and respond to the toggle:
   Messaging (a live booking conversation), Settings (the app scrolling its features),
   Voice AI (choosing a receptionist voice). Rebuilt faithfully from the app's own UI. */

const SVG = {
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  msg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg>',
  persona: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2M20 14h2M15 13v2M9 13v2"/></svg>',
  kb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  svc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41 12 22l-9-9V3h10l7.59 7.59a2 2 0 0 1 0 2.82z"/><path d="M7 7h.01"/></svg>',
  hours: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  team: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  chan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
};

const CONV = [
  ["in", "Hi! Do you have any openings this week?", "2:12"],
  ["out", "Hi Jane! I can do Thursday at 2:00 or 3:00 PM. Which works best?", "2:12"],
  ["in", "Thursday at 3 works.", "2:13"],
  ["out", "Perfect, you're booked for Thursday at 3:00 PM. I'll send a reminder the day before. 🎉", "2:13"],
];

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
const bubble = (m) => `<div class="ap-bubble ${m[0]}">${esc(m[1])}<span class="t">${m[2]}</span></div>`;
const $ = (id) => document.getElementById(id);

let timers = [];
let mode = null;
const REDUCED = window.matchMedia && matchMedia("(prefers-reduced-motion:reduce)").matches;
const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

function chrome(opts) {
  $("ap-header").innerHTML = opts.header;
  $("ap-aibar").hidden = !opts.aibar;
  $("ap-composer").hidden = !opts.composer;
  document.querySelectorAll(".ap-tab").forEach((t) => t.classList.toggle("on", t.dataset.tab === opts.tab));
  document.querySelectorAll("[data-mode]").forEach((b) => b.classList.toggle("on", b.dataset.mode === mode));
}

/* ---- messaging ---- */
function playMessaging(advance) {
  clearTimers(); mode = "messaging";
  chrome({
    header: `<span class="ap-back">${SVG.back}</span><span class="ap-av">J</span>` +
      `<span><span class="ap-hname">Jane Doe</span><span class="ap-hsub"><span class="ch">WhatsApp</span> · View contact</span></span>`,
    aibar: true, composer: true, tab: "inbox",
  });
  const body = $("ap-body");
  body.innerHTML = '<div class="ap-chat" id="ap-chat"><div class="ap-day">Today</div></div>';
  const chat = $("ap-chat");
  const scroll = () => { body.scrollTop = body.scrollHeight; };
  const done = () => { if (advance) timers.push(setTimeout(() => { if (mode === "messaging") playSettings(true); }, 3200)); };

  if (REDUCED) { chat.insertAdjacentHTML("beforeend", CONV.map(bubble).join("")); scroll(); done(); return; }
  let t = 400;
  CONV.forEach((m) => {
    if (m[0] === "out") {
      timers.push(setTimeout(() => { if (mode !== "messaging") return; chat.insertAdjacentHTML("beforeend", '<div class="ap-typing" id="ap-typing"><span></span><span></span><span></span></div>'); scroll(); }, t)); t += 950;
      timers.push(setTimeout(() => { if (mode !== "messaging") return; const ty = $("ap-typing"); if (ty) ty.remove(); chat.insertAdjacentHTML("beforeend", bubble(m)); scroll(); }, t)); t += 550;
    } else {
      timers.push(setTimeout(() => { if (mode !== "messaging") return; chat.insertAdjacentHTML("beforeend", bubble(m)); scroll(); }, t)); t += 850;
    }
  });
  timers.push(setTimeout(done, t));
}

/* ---- settings / dashboard ---- */
function chRow(glyph, name, detail) {
  return `<div class="ap-row"><span class="ap-row-ic">${glyph}</span><span class="ap-row-tx"><span class="ap-row-t"><span class="ap-dot"></span>${name}</span><span class="ap-row-s">${detail}</span></span><span class="ap-act">PAUSE</span></div>`;
}
function setRow(icon, t, s) {
  return `<div class="ap-row"><span class="ap-row-ic">${icon}</span><span class="ap-row-tx"><span class="ap-row-t">${t}</span><span class="ap-row-s">${s}</span></span><span class="ap-cv">${SVG.chev}</span></div>`;
}
function playSettings(advance) {
  clearTimers(); mode = "settings";
  chrome({
    header: `<span class="ap-wsav">R</span><span><span class="ap-hname">Rivera Dental</span><span class="ap-hsub">Assistant</span></span><span class="ap-bell">${SVG.bell}</span>`,
    aibar: false, composer: false, tab: "assistant",
  });
  const body = $("ap-body");
  body.innerHTML =
    '<div class="ap-dash">' +
    '<div class="ap-seclabel" style="padding-top:8px">Today</div>' +
    '<div class="ap-today">' +
      '<div class="ap-tstat"><span class="ap-tstat-v">7</span><span class="ap-tstat-l">Conversations</span></div>' +
      '<div class="ap-tstat"><span class="ap-tstat-v">3</span><span class="ap-tstat-l">Booked</span></div>' +
      '<div class="ap-tstat"><span class="ap-tstat-v dim">2</span><span class="ap-tstat-l">Waiting</span></div>' +
    '</div>' +
    '<div class="ap-seclabel">Connected channels</div><div class="ap-list">' +
      chRow(SVG.msg, "WhatsApp", "+1 (555) 123-4567") +
      chRow(SVG.msg, "SMS", "+1 (555) 940-2210") +
      chRow(SVG.phone, "Voice", "+1 (555) 771-0064") +
    '</div>' +
    '<div class="ap-seclabel">Assistant</div><div class="ap-list">' +
      setRow(SVG.persona, "Persona", "Baxter · Warm and consultative") +
      setRow(SVG.kb, "Knowledge base", "Business info · 4 Q&amp;As") +
      setRow(SVG.svc, "Services", "5 active") +
    '</div>' +
    '<div class="ap-seclabel">Operations</div><div class="ap-list">' +
      setRow(SVG.hours, "Business hours", "Mon to Fri, 9 to 5") +
      setRow(SVG.team, "Users", "Just you") +
      setRow(SVG.chan, "Channels", "3 of 5 connected") +
    '</div></div>';
  body.scrollTop = 0;
  const next = () => { if (advance) timers.push(setTimeout(() => { if (mode === "settings") playVoice(true); }, 1200)); };
  if (REDUCED) { timers.push(setTimeout(next, 2600)); return; }
  const max = () => body.scrollHeight - body.clientHeight;
  const step = max() / 55;
  let y = 0;
  const scroll = () => {
    if (mode !== "settings") return;
    y += step; body.scrollTop = y;
    if (y < max()) timers.push(setTimeout(scroll, 62));
    else next();
  };
  timers.push(setTimeout(scroll, 800));
}

/* ---- voice picker ---- */
const vtile = (name, sel) => `<span class="ap-vtile${sel ? " sel" : ""}"><span class="ap-vtile-nm">${name}</span><span class="ap-vtile-play">${SVG.play}</span></span>`;
function playVoice(advance) {
  clearTimers(); mode = "voice";
  chrome({
    header: `<span class="ap-back">${SVG.back}</span><span class="ap-hname" style="font-size:16px">Choose a voice</span>`,
    aibar: false, composer: false, tab: "assistant",
  });
  const body = $("ap-body");
  body.innerHTML =
    '<div class="ap-voice">' +
    '<div class="ap-vgroup" style="margin-top:6px">Language / accent</div>' +
    '<div class="ap-vflags"><span class="ap-vflag sel">American</span><span class="ap-vflag">British</span><span class="ap-vflag">French</span></div>' +
    '<div class="ap-vgroup">Standard voices</div>' +
    '<div class="ap-vgrid">' + vtile("Ava", true) + vtile("Noah") + vtile("Mia") + '</div>' +
    '<div class="ap-vgroup">Premium voices</div>' +
    '<div class="ap-vgrid">' + vtile("Sarah") + vtile("Brian") + vtile("Alice") + '</div>' +
    '<div class="ap-vgroup">Speaking pace</div>' +
    '<div class="ap-pace"><span>Slower</span><span class="sel">Natural</span><span>Brisk</span></div>' +
    '</div>';
  body.scrollTop = 0;
  const tiles = body.querySelectorAll(".ap-vtile");
  const next = () => { if (advance) timers.push(setTimeout(() => { if (mode === "voice") playMessaging(true); }, 1400)); };
  if (REDUCED) { timers.push(setTimeout(next, 2600)); return; }
  let i = 0, steps = 0;
  const cyc = () => {
    if (mode !== "voice") return;
    tiles.forEach((t, j) => t.classList.toggle("sel", j === i));
    i = (i + 1) % tiles.length; steps++;
    if (steps < 9) timers.push(setTimeout(cyc, 1150));
    else next();
  };
  timers.push(setTimeout(cyc, 900));
}

const PLAY = { messaging: playMessaging, settings: playSettings, voice: playVoice };

/* pricing preview — market switch (mirrors the full pricing page) */
const PRICES = {
  US: { cur: "$", pos: "pre", starter: 59, growth: 149, pro: 399 },
  CA: { cur: "$", pos: "pre", starter: 79, growth: 199, pro: 499 },
  UAE: { cur: "AED", pos: "post", starter: 199, growth: 549, pro: 1299 },
};
const price = (m, n) => (m.pos === "pre" ? `${m.cur}${n.toLocaleString()}` : `${n.toLocaleString()} ${m.cur}`);
function applyPrice(mk) {
  const m = PRICES[mk]; if (!m) return;
  ["starter", "growth", "pro"].forEach((t) => { const el = $(`pp-${t}`); if (el) el.innerHTML = `${price(m, m[t])}<small>/mo</small>`; });
  document.querySelectorAll("[data-pm]").forEach((b) => b.classList.toggle("on", b.dataset.pm === mk));
}
function detectMkt() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (/Dubai|Abu_Dhabi/.test(tz)) return "UAE";
    if (/Toronto|Vancouver|Edmonton|Winnipeg|Halifax|Regina|St_Johns/.test(tz)) return "CA";
  } catch (e) {}
  return "US";
}

document.addEventListener("DOMContentLoaded", () => {
  const nt = document.querySelector(".nav-toggle"), nl = document.querySelector(".nav-links");
  if (nt && nl) nt.addEventListener("click", () => nl.classList.toggle("open"));
  document.querySelectorAll("[data-mode]").forEach((b) =>
    b.addEventListener("click", () => PLAY[b.dataset.mode](true)));
  document.querySelectorAll("[data-pm]").forEach((b) => b.addEventListener("click", () => applyPrice(b.dataset.pm)));
  applyPrice(detectMkt());
  playMessaging(true);
});
