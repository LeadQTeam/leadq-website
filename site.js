/* LeadQ site — shared logic.
   ONE pricing config drives every price (playbook: "numbers are anchors to validate").
   Market switch implements the playbook's rule: price in local currency, never an FX conversion. */

const MARKETS = {
  US: {
    label: "United States", cur: "$", pos: "pre", per: "/mo", hasSMS: true, waFirst: false,
    tiers: { starter: 59, growth: 149, pro: 399, agency: 499 },
    included: { starter: 250, growth: 1000, pro: 5000 },
    voice: 99, voiceOver: 0.25,
    usage: { conv: 0.05, sms: 0.04, wa: 0.10 }, number: "1 incl., $8/mo",
    addons: { number: 8, pack: 29, seat: 15, setup: 299, a2p: 99 },
  },
  CA: {
    label: "Canada", cur: "$", pos: "pre", per: "/mo", hasSMS: true, waFirst: false,
    tiers: { starter: 79, growth: 199, pro: 499, agency: 649 },
    included: { starter: 250, growth: 1000, pro: 5000 },
    voice: 129, voiceOver: 0.30,
    usage: { conv: 0.07, sms: 0.05, wa: 0.12 }, number: "1 incl., $10/mo",
    addons: { number: 10, pack: 39, seat: 19, setup: 399, a2p: null },
  },
  UAE: {
    label: "UAE", cur: "AED", pos: "post", per: "/mo", hasSMS: false, waFirst: true,
    tiers: { starter: 199, growth: 549, pro: 1299, agency: 1799 },
    included: { starter: 250, growth: 1000, pro: 5000 },
    voice: 349, voiceOver: 0.90,
    usage: { conv: 0.20, sms: null, wa: 0.40 }, number: "WhatsApp-based",
    addons: { number: null, pack: 109, seat: 55, setup: 1099, a2p: null },
  },
};

const money = (m, n) => {
  if (n == null) return "—";
  const s = Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 });
  return m.pos === "pre" ? `${m.cur}${s}` : `${s} ${m.cur}`;
};

let MKT = "US";
const setText = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t; };

function detectMarket() {
  try {
    const saved = localStorage.getItem("leadq-market");
    if (saved && MARKETS[saved]) return saved;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (/Dubai|Abu_Dhabi/.test(tz)) return "UAE";
    if (/Toronto|Vancouver|Edmonton|Winnipeg|Halifax|Regina|St_Johns/.test(tz)) return "CA";
  } catch (e) {}
  return "US";
}

function applyMarket() {
  const m = MARKETS[MKT];
  document.querySelectorAll("[data-market-chip]").forEach((c) =>
    c.classList.toggle("on", c.dataset.marketChip === MKT));

  ["starter", "growth", "pro"].forEach((t) => {
    setText(`price-${t}`, money(m, m.tiers[t]));
  });

  // usage (overage rates the customer pays)
  setText("u-conv", money(m, m.usage.conv));
  setText("u-wa", money(m, m.usage.wa));
  setText("u-voice", money(m, m.voiceOver));
  setText("u-number", m.number);
  const smsRow = document.getElementById("row-sms");
  if (smsRow) smsRow.hidden = !m.hasSMS;
  if (m.hasSMS) setText("u-sms", money(m, m.usage.sms));

  // add-ons
  const setAddon = (id, v, suffix) => {
    const el = document.getElementById(id);
    if (el) el.textContent = v == null ? "—" : money(m, v) + (suffix || "");
  };
  setAddon("a-number", m.addons.number, m.per);
  setAddon("a-pack", m.addons.pack, m.per);
  setAddon("a-seat", m.addons.seat, m.per);
  setAddon("a-setup", m.addons.setup, " once");
  const a2pRow = document.getElementById("row-a2p");
  if (a2pRow) a2pRow.hidden = m.addons.a2p == null;
  if (m.addons.a2p != null) setAddon("a-a2p", m.addons.a2p, " once");

  // voice module (included in Pro; only the per-minute overage varies by market)
  setText("voice-over", money(m, m.voiceOver));

  const waHint = document.getElementById("wa-first-hint");
  if (waHint) waHint.hidden = !m.waFirst;
}

function initNav() {
  const t = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (t && links) t.addEventListener("click", () => links.classList.toggle("open"));
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  MKT = detectMarket();
  document.querySelectorAll("[data-market-chip]").forEach((c) =>
    c.addEventListener("click", () => {
      MKT = c.dataset.marketChip;
      try { localStorage.setItem("leadq-market", MKT); } catch (e) {}
      applyMarket();
    }));
  applyMarket();
});
