/* LeadQ site: shared logic.
   One pricing config drives every price on every page, in local currency (never an FX conversion).
   Each feature below only runs when its markup is on the page. */

/* ===== pricing config ===== */
const CREDITS = { starter: 20000, growth: 45000, pro: 120000 }; // same in every market
// approximate, shown with ~. Mirrors the app's own rates (supabase/credits-aggregator.sql):
// a thread is metered once per customer per UTC day, texts are billed both ways, voice is
// a flat rate for every voice, and the WhatsApp reply is the conversation (Meta bills the WABA).
const CREDIT_RATES = { conv: 80, smsOut: 17, smsIn: 8, wa: "included", voiceMin: 220, email: 1 };
const PACK_CREDITS = { small: 10000, standard: 25000, large: 60000, bulk: 150000 };

// naOnly: the app provisions phone numbers, SMS and voice in the US and Canada only
// (leadq-app/index.html, naMarket/smsOffered/voiceOffered), so everything that needs a
// number is hidden everywhere else rather than sold and then blocked in the app.
const MARKETS = {
  US:  { label: "United States", cur: "$",   pos: "pre",  per: "/mo", hasSMS: true,  waFirst: false, naOnly: true,
         plans: ["starter","growth","pro"],
         shown: "Prices for the United States, in US dollars.",
         creditsNote: "So Growth's 45,000 credits is around 550 AI conversations, or any mix of texts, calls and email. WhatsApp's own conversation fees are billed by Meta, on your WhatsApp Business account.",
         tiers: { starter: 59,  growth: 149, pro: 399 },
         addons: { number: 8,    seat: 15, setup: 299,  a2p: 99 },
         packs: { small: 25, standard: 55, large: 120, bulk: 270 },
         note: "US texting needs a one-time A2P activation. It's in the add-ons." },
  CA:  { label: "Canada",        cur: "$",   pos: "pre",  per: "/mo", hasSMS: true,  waFirst: false, naOnly: true,
         plans: ["starter","growth","pro"],
         shown: "Prices for Canada, in Canadian dollars.",
         creditsNote: "So Growth's 45,000 credits is around 550 AI conversations, or any mix of texts, calls and email. WhatsApp's own conversation fees are billed by Meta, on your WhatsApp Business account.",
         tiers: { starter: 79,  growth: 199, pro: 499 },
         addons: { number: 10,   seat: 19, setup: 399,  a2p: null },
         packs: { small: 35, standard: 75, large: 165, bulk: 369 },
         note: "Canada needs no A2P registration." },
  UAE: { label: "UAE",           cur: "AED", pos: "post", per: "/mo", hasSMS: false, waFirst: true,  naOnly: false,
         plans: ["starter","pro"],
         shown: "Prices for the UAE, in dirhams.",
         creditsNote: "So Starter's 20,000 credits is around 250 AI conversations, or any mix of WhatsApp, web chat and email. WhatsApp's own conversation fees are billed by Meta, on your WhatsApp Business account.",
         tiers: { starter: 199, growth: 549, pro: 1299 },
         addons: { number: null, seat: 55, setup: 1099, a2p: null },
         packs: { small: 95, standard: 205, large: 445, bulk: 995 },
         note: "UAE runs WhatsApp-first. No SMS line needed." },
};

const REDUCED = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const num = (n) => Number(n).toLocaleString("en-US");

/* null means "not offered in this market": callers hide the row instead of printing a placeholder */
const money = (m, n) => {
  if (n == null) return null;
  return m.pos === "pre" ? `${m.cur}${num(n)}` : `${num(n)} ${m.cur}`;
};

let MKT = "US";

function detectMarket() {
  try {
    const q = (new URLSearchParams(location.search).get("market") || "").toUpperCase();
    if (MARKETS[q]) return q;
  } catch (e) {}
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (/Dubai|Abu_Dhabi/.test(tz)) return "UAE";
    if (/Toronto|Vancouver|Edmonton|Winnipeg|Halifax|Regina|St_Johns|Montreal|Moncton|Whitehorse|Yellowknife|Iqaluit/.test(tz)) return "CA";
  } catch (e) {}
  return "US";
}

/* fade the old value out, slide the new one in 6px */
function swapText(el, v, animate) {
  if (el.textContent === v) return;
  if (!animate || REDUCED) { el.textContent = v; return; }
  el.classList.add("swap", "out");
  setTimeout(() => {
    el.textContent = v;
    el.classList.remove("out");
    el.classList.add("in");
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove("in")));
  }, 180);
}

function applyMarket(animate) {
  const m = MARKETS[MKT];
  $$("[data-price]").forEach((el) => swapText(el, money(m, m.tiers[el.dataset.price]), animate));
  $$("[data-price-sentence]").forEach((el) => {
    el.textContent = `Plans start at ${money(m, m.tiers[el.dataset.priceSentence])} a month. No receptionist hours to cover.`;
  });
  $$("[data-pack]").forEach((el) => swapText(el, money(m, m.packs[el.dataset.pack]), animate));
  $$("[data-addon]").forEach((el) => {
    const v = m.addons[el.dataset.addon];
    const row = el.closest("tr");
    if (row) row.hidden = v == null;
    if (v == null) return;
    const suffix = el.dataset.addon === "number" || el.dataset.addon === "seat" ? m.per : " once";
    swapText(el, money(m, v) + suffix, animate);
  });
  $$("[data-needs-sms]").forEach((el) => { el.hidden = !m.hasSMS; });
  $$("[data-na-only]").forEach((el) => { el.hidden = !m.naOnly; });
  const sold = m.plans || ["starter", "growth", "pro"];
  $$("[data-plan]").forEach((el) => { el.hidden = !sold.includes(el.dataset.plan); });
  $$(".plans").forEach((el) => { el.dataset.count = String(sold.length); });
  $$("[data-pro-channels]").forEach((el) => { el.textContent = m.hasSMS ? "All channels" : "WhatsApp, web chat and email"; });
  $$("[data-market-label]").forEach((el) => { el.textContent = m.shown; });
  $$("[data-credits-note]").forEach((el) => { el.textContent = m.creditsNote; });
  $$("[data-growth-channels]").forEach((el) => {
    el.textContent = m.hasSMS ? "WhatsApp, SMS and web chat" : "WhatsApp and web chat";
  });
  $$("[data-mkt-note]").forEach((el) => { el.textContent = m.note; });
  $$("[data-cur]").forEach((el) => { el.textContent = m.cur; });
  document.dispatchEvent(new CustomEvent("leadq:market", { detail: MKT }));
}

function initMarket() {
  MKT = detectMarket();
  applyMarket(false);
}

/* ===== nav ===== */
function initNav() {
  const btn = $(".nav-menu"), sheet = $(".nav-sheet");
  if (!btn || !sheet) return;
  const set = (open) => { sheet.hidden = !open; btn.setAttribute("aria-expanded", String(open)); };
  btn.addEventListener("click", () => set(sheet.hidden));
  sheet.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") set(false); });
  document.addEventListener("click", (e) => { if (!e.target.closest(".nav-pill")) set(false); });
}

/* ===== Baxter web chat =====
   The widget (chat.leadqmail.co/w.js) has no public open() API. It renders its launcher in an open
   shadow root on a fixed host <div>. We find that launcher and click it. The dock only appears once
   the launcher is found, so the page never shows a button that can't open the chat, and it sits
   beside the widget's own bubble rather than adding a second one. */
function findChatLauncher() {
  for (const host of document.body.children) {
    const root = host.shadowRoot;
    if (!root) continue;
    const b = root.querySelector('button[aria-label="Open chat"], button.b');
    if (b) return { host, button: b };
  }
  return null;
}

function initChat() {
  const dock = $(".dock");
  const openers = $$("[data-open-chat]");
  let chat = null;

  const isOpen = () => chat && chat.button.getAttribute("aria-expanded") === "true";
  const retireDock = () => {
    if (!dock) return;
    dock.hidden = true;
    try { sessionStorage.setItem("leadq-dock", "1"); } catch (e) {}
  };

  const open = () => {
    if (!chat) chat = findChatLauncher();
    if (!chat) return false;
    if (!isOpen()) chat.button.click(); // the launcher toggles, so never click it closed
    retireDock();
    return true;
  };

  openers.forEach((b) => b.addEventListener("click", (e) => {
    if (open()) e.preventDefault(); // otherwise follow the fallback href
  }));
  if (dock) $(".dock-btn", dock).addEventListener("click", open);

  let tries = 0;
  const poll = setInterval(() => {
    chat = findChatLauncher();
    if (chat) {
      clearInterval(poll);
      if (dock) {
        let dismissed = false;
        try { dismissed = sessionStorage.getItem("leadq-dock") === "1"; } catch (e) {}
        if (!dismissed && !isOpen()) dock.hidden = false;
        // once the chat opens by any route (launcher, auto-open, our buttons) the dock steps aside
        new MutationObserver(() => { if (isOpen()) retireDock(); })
          .observe(chat.button, { attributes: true, attributeFilter: ["aria-expanded"] });
      }
    } else if (++tries > 40) {
      clearInterval(poll);
    }
  }, 250);
}

/* ===== visibility helpers ===== */
const io = (cb, opts) => ("IntersectionObserver" in window ? new IntersectionObserver(cb, opts) : null);

/* adds .in once an element scrolls into view */
function initReveal() {
  const els = $$(".orbit, .steps");
  const obs = io((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); }
  }), { threshold: 0.3 });
  els.forEach((el) => (obs ? obs.observe(el) : el.classList.add("in")));
}

/* pause CSS loops and JS loops while off-screen */
function watchLive(el, onChange) {
  const obs = io((entries) => entries.forEach((e) => {
    el.classList.toggle("paused", !e.isIntersecting);
    if (onChange) onChange(e.isIntersecting);
  }), { threshold: 0.05 });
  if (obs) obs.observe(el); else if (onChange) onChange(true);
}

function initLiveZones() {
  $$("[data-live]").forEach((el) => watchLive(el));
}

/* ===== home: live phone ===== */
function initLiveChat() {
  const chat = $(".live-chat");
  if (!chat) return;
  const items = Array.from(chat.children);
  if (REDUCED) { items.forEach((el) => { if (!el.classList.contains("ap-typing")) el.classList.add("show"); }); return; }

  const delays = { in: 900, out: 500, booked: 700 };
  let timers = [], visible = false, running = false;
  const clear = () => { timers.forEach(clearTimeout); timers = []; };
  const at = (ms, fn) => timers.push(setTimeout(fn, ms));

  function run() {
    clear();
    running = true;
    items.forEach((el) => el.classList.remove("show"));
    let t = 500;
    items.forEach((el) => {
      if (el.classList.contains("ap-typing")) {
        at(t, () => el.classList.add("show")); t += 1300;
        at(t, () => el.classList.remove("show"));
      } else {
        t += el.classList.contains("ap-booked") ? delays.booked : el.classList.contains("out") ? delays.out : delays.in;
        at(t, () => el.classList.add("show"));
      }
    });
    at(t + 3800, () => { if (visible) run(); else running = false; });
  }
  watchLive(chat.closest(".stage") || chat, (v) => { visible = v; if (v && !running) run(); });
}

/* phone tilts toward the cursor, max 8 degrees */
function initTilt() {
  const stage = $(".stage"), tilt = $(".stage-tilt");
  if (!stage || !tilt || REDUCED || !window.matchMedia("(pointer:fine)").matches) return;
  stage.addEventListener("pointermove", (e) => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    tilt.style.transform = `rotateY(${(x * 16).toFixed(2)}deg) rotateX(${(-y * 12).toFixed(2)}deg)`;
  });
  stage.addEventListener("pointerleave", () => { tilt.style.transform = ""; });
}

/* ===== home: calendar that fills itself ===== */
const FILL = [
  { t: "3:00", ap: "PM", name: "Leo Grant", sub: "Checkup, booked by Baxter", stat: "Just booked" },
  { t: "11:15", ap: "AM", name: "Ana Silva", sub: "Whitening, Dr. Rivera", stat: "Just booked" },
  { t: "9:45", ap: "AM", name: "Omar Haddad", sub: "New patient, Sarah", stat: "Just booked" },
  { t: "1:30", ap: "PM", name: "Grace Liu", sub: "Cleaning, Dr. Rivera", stat: "Just booked" },
];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';
const apptInner = (a) =>
  `<span class="ap-appt-time"><span class="ap-appt-t">${esc(a.t)}</span><span class="ap-appt-ap">${esc(a.ap)}</span></span>` +
  `<span class="ap-appt-mid"><span class="ap-appt-nm">${esc(a.name)}</span><span class="ap-appt-sub">${esc(a.sub)}</span>` +
  `<span class="ap-appt-stat"><span class="d"></span>${esc(a.stat || "Booked")}</span></span>`;

function initFill() {
  const slot = $("[data-fill]");
  if (!slot) return;
  let i = 0, timer = null;
  const tick = () => {
    slot.innerHTML = apptInner(FILL[i % FILL.length]);
    slot.classList.remove("is-new");
    void slot.offsetWidth;
    slot.classList.add("is-new");
    i++;
  };
  tick();
  if (REDUCED) return;
  watchLive(slot.closest(".phone") || slot, (v) => {
    clearInterval(timer);
    if (v) timer = setInterval(tick, 6000);
  });
}

/* ===== aria-pressed groups (voice chips, visual selection only) ===== */
function initPressGroups() {
  $$("[data-press-group]").forEach((g) => {
    const bs = $$("button", g);
    bs.forEach((b) => b.addEventListener("click", () => bs.forEach((o) => o.setAttribute("aria-pressed", String(o === b)))));
  });
}

/* voice picker in the phone cycles its selection */
function initVoiceCycle() {
  const tiles = $$("[data-voice-cycle] .ap-vtile");
  if (!tiles.length || REDUCED) return;
  let i = 0, timer = null;
  watchLive(tiles[0].closest(".phone"), (v) => {
    clearInterval(timer);
    if (v) timer = setInterval(() => { i = (i + 1) % tiles.length; tiles.forEach((t, j) => t.classList.toggle("sel", j === i)); }, 1600);
  });
}

/* ===== use cases: industry switch ===== */
const INDUSTRIES = {
  dental: { c: "#2dd4bf", pill: "Dental and clinics", h: "Built for how clinics actually work.",
    p: "It answers every call, books the chair, and reminds them the day before. Even while you're with a patient.",
    img: "dental", alt: "A patient in a modern dental clinic",
    s: [["10:00", "AM", "Marcus Bell", "Consultation, Sarah", "Booked, reminder sent"], ["2:30", "PM", "Jane Doe", "Cleaning, Dr. Rivera", "Booked"], ["4:00", "PM", "Priya Nair", "New patient, Dr. Rivera", "Booked"]] },
  salon: { c: "#f27eb4", pill: "Salons", h: "Built for how salons actually work.",
    p: "It replies to every call and text, books the seat, and confirms the day before. Even mid-cut.",
    img: "salon", alt: "A stylist working in a hair salon",
    s: [["11:00", "AM", "Chloe Tan", "Balayage, Mia", "Booked, reminder sent"], ["1:30", "PM", "Aria West", "Cut and color, Jordan", "Booked"], ["3:00", "PM", "Sam Cole", "Men's cut, Riley", "Booked"]] },
  home: { c: "#f5a524", pill: "Home services", h: "Built for how trades actually work.",
    p: "It picks up every call, books the visit, and captures the job details. Even while you're on a roof.",
    img: "home", alt: "A technician on a home services job",
    s: [["8:00", "AM", "Dana Ruiz", "AC tune-up, Dave", "Booked, reminder sent"], ["11:30", "AM", "Owen Park", "Furnace repair, Miguel", "Booked"], ["2:00", "PM", "Nina Blake", "On-site estimate, Dave", "Booked"]] },
  realestate: { c: "#7dd3fc", pill: "Real estate", h: "Built for how agents actually work.",
    p: "It answers new leads in seconds, books the showing, and qualifies the buyer. Even while you're at a closing.",
    img: "realestate", alt: "A modern home exterior for sale",
    s: [["9:30", "AM", "Liam Ford", "Showing, 14 Oak St", "Booked, reminder sent"], ["12:00", "PM", "Sofia Reyes", "Buyer call, Ana", "Booked"], ["4:30", "PM", "Noah Kim", "Listing visit, 8 Elm Ave", "Booked"]] },
};

function initIndustrySwitch() {
  const hero = $("[data-industry-hero]");
  if (!hero) return;
  const btns = $$("[data-industry]", hero);
  const img = $(".ph img", hero), src = $(".ph source", hero);
  const pill = $("[data-uc-pill]", hero), h = $("[data-uc-h]", hero), p = $("[data-uc-p]", hero);
  const rows = $$(".uc-appt", hero);

  btns.forEach((b) => b.addEventListener("click", () => {
    const k = b.dataset.industry, d = INDUSTRIES[k];
    if (!d || b.getAttribute("aria-pressed") === "true") return;
    btns.forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
    document.body.style.setProperty("--c", d.c);

    const swapPhoto = () => {
      if (src) src.srcset = `img/verticals/${d.img}.webp`;
      img.src = `img/verticals/${d.img}.jpg`;
      img.alt = d.alt;
      img.style.opacity = "1";
    };
    if (REDUCED) swapPhoto();
    else { img.style.opacity = "0"; setTimeout(swapPhoto, 260); }

    pill.textContent = d.pill;
    swapText(h, d.h, true);
    p.textContent = d.p;
    rows.forEach((row, i) => {
      const r = d.s[i];
      row.innerHTML = apptInner({ t: r[0], ap: r[1], name: r[2], sub: r[3], stat: r[4] });
      if (REDUCED) return;
      row.classList.add("pre");
      setTimeout(() => row.classList.remove("pre"), 150 + 120 * i);
    });
  }));
}

/* ===== industry pages: ROI slider ===== */
function initROI() {
  const box = $("[data-roi]");
  if (!box) return;
  const missed = $("[data-roi-missed]", box), val = $("[data-roi-value]", box);
  const missedOut = $("[data-roi-missed-out]", box), valOut = $("[data-roi-value-out]", box), out = $("[data-roi-out]", box);
  const render = () => {
    const m = MARKETS[MKT];
    const miss = parseInt(missed.value, 10), v = parseInt(val.value, 10);
    missedOut.textContent = miss;
    valOut.textContent = money(m, v);
    out.textContent = money(m, Math.round((miss * v * 52) / 12));
  };
  missed.addEventListener("input", render);
  val.addEventListener("input", render);
  document.addEventListener("leadq:market", render);
  render();
}

/* ===== legal: contents rail from the H2s ===== */
function initTOC() {
  const toc = $(".toc"), body = $(".legal-body");
  if (!toc || !body) return;
  const secs = $$("section[id]", body);
  toc.innerHTML = secs.map((s) => `<a href="#${s.id}">${esc($("h2", s).textContent)}</a>`).join("");
  const links = $$("a", toc);
  const mark = (id) => links.forEach((a) => {
    const on = a.getAttribute("href") === `#${id}`;
    a.classList.toggle("cur", on);
    if (on && toc.scrollWidth > toc.clientWidth) a.scrollIntoView({ block: "nearest", inline: "nearest" });
  });
  const obs = io((entries) => {
    const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (hit) mark(hit.target.id);
  }, { rootMargin: "-90px 0px -60% 0px" });
  if (obs) secs.forEach((s) => obs.observe(s));
  if (secs[0]) mark(secs[0].id);
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initMarket();
  initChat();
  initReveal();
  initLiveZones();
  initLiveChat();
  initTilt();
  initFill();
  initPressGroups();
  initVoiceCycle();
  initIndustrySwitch();
  initROI();
  initTOC();
});
