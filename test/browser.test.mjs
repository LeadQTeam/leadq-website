/* Renders the site in Chrome and checks it, rather than reading the CSS and reasoning about it.
 *
 * Static checks pass on pages that are visibly broken. In this repo that happened three times:
 * media-query rules flattened to the top level (the hero window was display:none at every
 * width), a missing phone component (every message rendered at once), and an inverted cascade
 * after selector scoping. Each time both files were individually valid.
 *
 * Drives Chrome over the DevTools Protocol. Node 22+ has a global WebSocket, so there is
 * nothing to install and no package.json. Checks layout at eleven widths, every tour
 * interaction, the hero timeline sampled while it runs, reduced motion, accessibility, and the
 * console, then the five other pages that share styles.css.
 *
 *   node test/browser.test.mjs
 *   node test/browser.test.mjs --shots     # also write PNGs to test/shots
 */
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')

// Chrome, wherever this machine keeps it.
const CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  (process.env.LOCALAPPDATA || '') + '/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
].filter(Boolean)
const CHROME = CANDIDATES.find((p) => { try { return fs.existsSync(p) } catch { return false } })
if (!CHROME) { console.log("SKIP browser checks: no Chrome or Edge found. Set CHROME_PATH to run them."); process.exit(0) }
const PAGE = 'file:///' + path.join(ROOT, 'index.html').split(path.sep).join('/')
const pageUrl = (f) => 'file:///' + path.join(ROOT, f).split(path.sep).join('/')
const PORT = 9333
const SHOTS = process.argv.includes('--shots')
const OUT = path.join(ROOT, 'test', 'shots')

let bad = 0, checks = 0
const ok = (n, c, extra) => { checks++; if (!c) bad++; console.log((c ? '  ok  ' : ' FAIL ') + n + (c || extra === undefined ? '' : '   ' + extra)) }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ── launch ──────────────────────────────────────────────────────────────────
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'lqverify-'))
const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  '--allow-file-access-from-files', '--force-device-scale-factor=1', 'about:blank',
], { stdio: 'ignore' })

const targets = await (async () => {
  for (let i = 0; i < 80; i++) {
    try { const r = await fetch(`http://127.0.0.1:${PORT}/json/list`); if (r.ok) return r.json() } catch {}
    await sleep(250)
  }
  throw new Error('Chrome did not open a debugging port')
})()

class CDP {
  constructor(url) {
    this.ws = new WebSocket(url); this.n = 0; this.pending = new Map()
    this.console = []; this.errors = []
    this.open = new Promise((res) => { this.ws.onopen = res })
    this.ws.onmessage = (e) => {
      const m = JSON.parse(e.data)
      if (m.id && this.pending.has(m.id)) {
        const { res, rej } = this.pending.get(m.id); this.pending.delete(m.id)
        m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)
      } else if (m.method === 'Runtime.exceptionThrown') {
        this.errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text)
      } else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
        this.console.push(m.params.args.map((a) => a.value ?? a.description).join(' '))
      }
    }
  }
  send(method, params = {}) {
    const id = ++this.n
    return new Promise((res, rej) => { this.pending.set(id, { res, rej }); this.ws.send(JSON.stringify({ id, method, params })) })
  }
}

const target = targets.find((t) => t.type === 'page')
const cdp = new CDP(target.webSocketDebuggerUrl)
await cdp.open
await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('DOM.enable')

const view = async (w, h = 900) => cdp.send('Emulation.setDeviceMetricsOverride',
  { width: w, height: h, deviceScaleFactor: 1, mobile: w < 700, screenWidth: w, screenHeight: h })

const evalJs = async (expr) => {
  const r = await cdp.send('Runtime.evaluate', { expression: `(() => { ${expr} })()`, returnByValue: true, awaitPromise: true })
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || 'eval failed')
  return r.result.value
}
const load = async () => {
  await cdp.send('Page.navigate', { url: PAGE })
  for (let i = 0; i < 80; i++) { if (await evalJs('return document.readyState === "complete"')) break; await sleep(100) }
  await sleep(350)  // defer scripts + first paint
}
const shot = async (name) => {
  if (!SHOTS) return
  fs.mkdirSync(OUT, { recursive: true })
  const r = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
  fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(r.data, 'base64'))
}

// ════════════════════════════════════════════════════════════════════════════
console.log('\n═══ A. the page loads clean ═══')
await view(1440, 900)
await load()
ok('no uncaught exceptions', cdp.errors.length === 0, cdp.errors.join(' | '))
ok('no console errors', cdp.console.length === 0, cdp.console.join(' | '))
ok('the hero app rendered', await evalJs('return !!document.getElementById("heroDk")'))
ok('the four desks rendered', await evalJs(`
  return ['#how .flow', '#support .help-card', '#demos .demo-feature', '#on-the-go .phone'].every((s) => !!document.querySelector(s));`))
ok('the icon sprite resolved', await evalJs(`
  const u = document.querySelector('#heroDk use'); if (!u) return false;
  const id = u.getAttribute('href').slice(1); return !!document.getElementById(id);`))
// The home page carries no prices since the four desks layout (2026-11-11). The FAQ points to the
// pricing page, whose plans are checked further down.
ok('no price on the home page', await evalJs(`
  return ![...document.querySelectorAll('main *')].some(e => /\\$\\d/.test(e.textContent) && e.children.length === 0 && e.offsetParent);`))
ok('and the FAQ points to the plans', await evalJs(`return !!document.querySelector('.faq-more a[href="pricing.html"]')`))

// ── B. layout across widths ─────────────────────────────────────────────────
console.log('\n═══ B. layout, measured in the browser ═══')
for (const w of [1440, 1280, 1024, 980, 800, 768, 700, 620, 414, 390, 360]) {
  await view(w)
  await sleep(220)
  const m = await evalJs(`
    const de = document.documentElement;
    const dk  = document.getElementById('heroDk');
    const dkw = dk.closest('.dkw');
    const win = document.querySelector('.pstage .appwin');
    const ph  = document.querySelector('.cphone');
    const flow = [...document.querySelectorAll('#how .flow')].find(f => !f.hidden);
    const card = flow.querySelector('.flow-card').getBoundingClientRect();
    const pills = [...flow.querySelectorAll('.flow-ch li')].map(l => l.getBoundingClientRect());
    const cs = (el) => el ? getComputedStyle(el) : null;
    return {
      pageOverflow: de.scrollWidth - de.clientWidth,
      appFont: parseFloat(cs(dk).fontSize),
      // layout width, not the on-screen box: the hero window is drawn tilted in 3D
      appW: dk.offsetWidth,
      dkwW: Math.round(dkw.clientWidth),
      dkwScrolls: dkw.scrollWidth > dkw.clientWidth + 1,
      heroWin: win ? cs(win).display : 'absent',
      phoneVisible: ph ? cs(ph).display !== 'none' && ph.getBoundingClientRect().width > 0 : false,
      lines: cs(flow.querySelector('.flow-lines')).display,
      pillOnCard: pills.some(p => p.right > card.left && p.left < card.right && p.bottom > card.top && p.top < card.bottom),
      helpCols: cs(document.querySelector('.help-grid')).gridTemplateColumns.split(' ').length,
      offRight: [...document.querySelectorAll('.flow, .help-card, .nodesk-stage, .demo-feature, .voice-band')]
        .filter(e => e.offsetParent && e.getBoundingClientRect().right > de.clientWidth + 1).map(e => e.className),
    };`)
  const tag = `${String(w).padStart(4)}px`
  ok(`${tag} no horizontal page scroll`, m.pageOverflow <= 0, `overflows by ${m.pageOverflow}px`)
  ok(`${tag} the customer's phone is visible`, m.phoneVisible)
  // max-width:700px is inclusive, so the rule applies AT 700.
  if (w <= 700) {
    ok(`${tag} hero window hidden (05 s1)`, m.heroWin === 'none', m.heroWin)
  } else {
    ok(`${tag} hero window shown`, m.heroWin !== 'none', m.heroWin)
    ok(`${tag} app type never below 7px`, m.appFont >= 6.99, `${m.appFont}px`)
    // 03 s4.9: once the app hits its 7px floor it must scroll INSIDE .dkw, not push the page.
    if (m.appW > m.dkwW + 1) ok(`${tag} app scrolls inside its own box`, m.dkwScrolls)
    else ok(`${tag} app fits its box (${m.appW} in ${m.dkwW})`, !m.dkwScrolls)
  }
  ok(`${tag} no desk runs off the right edge`, m.offRight.length === 0, m.offRight.join(' | '))
  ok(`${tag} the booking card never sits on a channel`, !m.pillOnCard)
  // Under 620px the channels wrap above the card, so the drawn lines would point at nothing.
  if (w <= 620) ok(`${tag} the flow stacks without its lines`, m.lines === 'none', m.lines)
  else ok(`${tag} the flow lines are drawn`, m.lines !== 'none', m.lines)
  ok(`${tag} help desk in ${w <= 860 ? 'one column' : 'two columns'}`, m.helpCols === (w <= 860 ? 1 : 2), String(m.helpCols))
  if ([1440, 768, 390].includes(w)) await shot('width-' + w)
}

// ── C. the four desks respond ───────────────────────────────────────────────
// The clickable app tour was retired for the four desks layout on 2026-11-11. What responds now
// is the films peek, the film links in each desk, and the voice chips.
console.log('\n═══ C. the four desks respond ═══')
await view(1440, 1100)
await load()
const films = async () => evalJs(`
  const b = document.querySelector('.films-peek'), inner = document.getElementById(b.getAttribute('aria-controls'));
  const thumb = inner.querySelector('.demo-thumb');
  return { btnShown: !b.hidden && b.offsetParent !== null, label: b.textContent.trim(), exp: b.getAttribute('aria-expanded'),
           h: inner.clientHeight, full: inner.scrollHeight, inert: [...inner.querySelectorAll('.demo-grid')].every(r => r.inert),
           thumbTop: thumb.getBoundingClientRect().top - inner.getBoundingClientRect().top, thumbH: thumb.offsetHeight,
           cards: inner.querySelectorAll('a[data-demo]').length, total: document.querySelectorAll('#demos a[data-demo]').length };`)
const f0 = await films()
ok('the films peek appears once JS runs', f0.btnShown)
ok('and says how many films it holds', f0.label === `${f0.cards} more films` && f0.cards === 10 && f0.total === 15, `${f0.label} / ${f0.cards} of ${f0.total}`)
// Only the top of the next row shows: the thumbnails start inside the box and most of them is cut.
ok('the feature films show only their top edge', f0.h < f0.full / 2 && f0.thumbTop < f0.h && f0.h - f0.thumbTop < f0.thumbH * 0.6,
   `box ${f0.h} of ${f0.full}, thumb at ${f0.thumbTop}, ${f0.thumbH} tall`)
ok('and cannot be tabbed to while faded', f0.inert && f0.exp === 'false')
await evalJs(`document.querySelector('.films-peek').click(); return 1`)
await sleep(900)
const f1 = await films()
ok('clicking reveals them all', f1.h >= f1.full - 1 && f1.exp === 'true' && !f1.btnShown && !f1.inert, `${f1.h}/${f1.full} ${f1.exp} ${f1.btnShown} ${f1.inert}`)

// Each desk's film link opens the shared player on that film, not on the first one in the page.
const opened = await evalJs(`
  const out = [];
  for (const a of document.querySelectorAll('.help-card .watch, .voice-film')) {
    a.click(); const d = document.querySelector('.dmodal');
    out.push({ open: d.open, t: d.querySelector('.dmodal-t').textContent, want: a.dataset.title }); d.close();
  }
  return out;`)
ok('the help desk and voice films open in the player', opened.length === 3 && opened.every((o) => o.open && o.t === o.want), JSON.stringify(opened))

// Each voice chip plays that voice's sample from the app. play() is stubbed: a headless click is
// not a user gesture, so the real one would be refused and this would test the browser's policy.
const voices = await evalJs(`return [...document.querySelectorAll('.vchips [data-voice]')].map(b => b.dataset.voice)`)
const silent = voices.filter((v) => !fs.existsSync(path.join(ROOT, v)) || fs.statSync(path.join(ROOT, v)).size < 20000)
ok(`every voice chip has its sample (${voices.length})`, voices.length === 4 && silent.length === 0, silent.join(' '))
const chipState = () => evalJs(`return [...document.querySelectorAll('.vchips [data-voice]')].map(b => b.textContent.replace('Hear', '').trim() + ':' + b.getAttribute('aria-pressed'))`)
await evalJs(`window.__played = []; HTMLMediaElement.prototype.play = function () { window.__played.push(this.src.split('/').pop()); return Promise.resolve() };
  HTMLMediaElement.prototype.pause = function () {}; document.querySelectorAll('.vchips [data-voice]')[1].click(); return 1`)
let vc = await chipState()
ok('a chip plays its own voice', vc.filter((c) => c.endsWith(':true')).join() === 'Noah:true' && (await evalJs('return window.__played.join()')) === 'noah.mp3', vc.join(' '))
await evalJs(`document.querySelectorAll('.vchips [data-voice]')[2].click(); return 1`)
vc = await chipState()
ok('one voice at a time', vc.filter((c) => c.endsWith(':true')).join() === 'Mia:true', vc.join(' '))
await evalJs(`document.querySelectorAll('.vchips [data-voice]')[2].click(); return 1`)
vc = await chipState()
ok('pressing the playing voice stops it', vc.every((c) => c.endsWith(':false')), vc.join(' '))

const posters = await evalJs(`return [...document.querySelectorAll('.demo-thumb img')].map(i => i.getAttribute('src'))`)
const missing = posters.filter((p) => !fs.existsSync(path.join(ROOT, p)))
ok(`every film poster is a real file (${posters.length})`, posters.length === 16 && missing.length === 0, missing.join(' '))

// A WhatsApp-market visitor on the home page gets the five-channel Front Desk instead.
await cdp.send('Page.navigate', { url: PAGE + '?market=UAE' })
for (let i = 0; i < 80; i++) { if (await evalJs('return document.readyState === "complete"')) break; await sleep(100) }
await sleep(400)
const wa = await evalJs(`
  const flows = [...document.querySelectorAll('#how .flow')].filter(f => f.offsetParent);
  return { n: flows.length, pills: flows[0] ? [...flows[0].querySelectorAll('.flow-ch li')].map(l => l.textContent.trim()) : [],
           films: !!document.getElementById('demos').offsetParent, voice: !!document.querySelector('.voice-band').offsetParent,
           links: [...document.querySelectorAll('.help-card .watch')].filter(a => a.offsetParent).length };`)
ok('a WhatsApp-market visitor sees one Front Desk', wa.n === 1, String(wa.n))
ok('with its five channels', wa.pills.join() === 'WhatsApp,Instagram,Messenger,Web chat,Email', wa.pills.join())
ok('and no North American films or voice band', !wa.films && !wa.voice && wa.links === 0, JSON.stringify(wa))

// ae.html is the UAE edition of the same layout, under the distributor page's own rules.
await cdp.send('Page.navigate', { url: pageUrl('ae.html') })
for (let i = 0; i < 80; i++) { if (await evalJs('return document.readyState === "complete"')) break; await sleep(100) }
await sleep(400)
const ae = await evalJs(`
  return { desks: ['#how .flow', '#support .help-card', '#demos .demo-feature', '#on-the-go .phone'].every(s => !!document.querySelector(s)),
           pills: [...document.querySelectorAll('#how .flow-ch li')].map(l => l.textContent.trim()),
           cut: [...document.querySelectorAll('main a[data-demo]')].every(a => a.dataset.demo.includes('/demos/ae/')),
           btn: (document.querySelector('.films-peek') || {}).textContent,
           price: [...document.querySelectorAll('main *')].some(e => /\\$\\d|\\bAED\\b|\\bUSD\\b|\\bCAD\\b/.test(e.textContent) && e.children.length === 0),
           signup: !!document.querySelector('main a[href*="signup"], main a[href*="pricing"]'),
           demo: document.querySelectorAll('main a[data-open-chat]').length,
           nav: [...document.querySelectorAll('.nav-links a')].map(a => a.getAttribute('href')) };`)
ok('ae.html: all four desks', ae.desks)
ok('ae.html: five channels, WhatsApp first', ae.pills.join() === 'WhatsApp,Instagram,Messenger,Web chat,Email', ae.pills.join())
ok('ae.html: every film is the UAE cut', ae.cut)
ok('ae.html: the films peek counts the UAE feature films', (ae.btn || '').trim() === '10 more films', ae.btn)
ok('ae.html: still no price, signup or pricing link', !ae.price && !ae.signup, `${ae.price} ${ae.signup}`)
ok('ae.html: still books demos', ae.demo >= 3, String(ae.demo))
ok('ae.html: every nav link lands on something', await evalJs(`
  return [...document.querySelectorAll('.nav-links a')].every(a => { const h = a.getAttribute('href');
    return !h.startsWith('ae.html#') || !!document.getElementById(h.split('#')[1]); });`), ae.nav.join(' '))

// ── D. the hero timeline ────────────────────────────────────────────────────
console.log('\n═══ D. the hero timeline, sampled while it runs ═══')
await view(1440, 1000)
await load()
const frame = async () => evalJs(`
  const ph = document.querySelector('[data-hphone]'), dk = document.getElementById('heroDk');
  const shown = (root) => [...root.querySelectorAll('[data-h]')].filter(e => e.classList.contains('show')).map(e => e.dataset.h);
  const order = (root) => [...root.querySelectorAll('[data-h]')].map(e => e.dataset.h);
  const chip = dk.querySelector('[data-hrow] em');
  return { phone: shown(ph), desk: shown(dk), phoneOrder: order(ph), deskOrder: order(dk),
           chip: chip.textContent.trim(), chipClass: chip.className,
           appt: dk.querySelector('[data-happt]').textContent.trim().slice(0, 40),
           preview: dk.querySelector('[data-hrow] span:not(.dk-av)').textContent.trim(),
           avatar: dk.querySelector('[data-hrow] .dk-av').textContent.trim() };`)

/* Sampled against a baseline taken the moment the document is complete, not after load()'s
 * settle — otherwise every sample is ~350ms late and the first one lands after the first
 * message has already appeared. Targets sit mid-step, away from transitions, so a few tens of
 * milliseconds of jitter cannot flip a result. */
await cdp.send('Page.navigate', { url: PAGE })
for (let i = 0; i < 80; i++) { if (await evalJs('return document.readyState === "complete"')) break; await sleep(50) }
const t0 = Date.now()
const seen = []
for (const at of [250, 900, 2000, 3400, 5000, 5900, 7200, 9000]) {
  await sleep(Math.max(0, t0 + at - Date.now()))
  const f = await frame(); f.t = at; seen.push(f)
}

const at = (t) => seen.find((f) => f.t === t)
// The booking is the claim the page makes, so what matters is that it is NOT made up front.
ok('the booking has not happened before the conversation', !at(250).phone.includes('3') && !/Booked/.test(at(250).chip),
   `${JSON.stringify(at(250).phone)} ${at(250).chip}`)
ok('the first message lands on BOTH screens', at(900).phone.includes('0') && at(900).desk.includes('0'))
ok('and the list preview follows it', /Can I come in Thursday/.test(at(900).preview), at(900).preview)
ok('typing appears next, on both', at(2000).phone.includes('t') && at(2000).desk.includes('t'))
// The bug you spotted: the dots must sit AFTER the message being answered, not above it.
const idx = (o, k) => o.indexOf(k)
ok('dots sit after message 0, not above it',
   idx(at(2000).phoneOrder, 't') === idx(at(2000).phoneOrder, '0') + 1 &&
   idx(at(2000).deskOrder, 't') === idx(at(2000).deskOrder, '0') + 1,
   `phone ${at(2000).phoneOrder.join('>')}  desk ${at(2000).deskOrder.join('>')}`)
ok("Baxter's reply replaces the dots", at(3400).phone.includes('1') && !at(3400).phone.includes('t'))
ok('the customer says yes', at(5000).phone.includes('2'))
ok('and the preview follows again', /Yes please/.test(at(5000).preview), at(5000).preview)
ok('dots return, now AFTER message 2',
   idx(at(5900).phoneOrder, 't') === idx(at(5900).phoneOrder, '2') + 1 &&
   idx(at(5900).deskOrder, 't') === idx(at(5900).deskOrder, '2') + 1,
   `phone ${at(5900).phoneOrder.join('>')}  desk ${at(5900).deskOrder.join('>')}`)
ok('the booking confirmation arrives', at(7200).phone.includes('3') && at(7200).desk.includes('3'))
ok('the avatar is not used as a text field', at(7200).avatar === 'JD', at(7200).avatar)
ok('the row chip turns green', /Booked/.test(at(7200).chip) && /green/.test(at(7200).chipClass), `${at(7200).chip} ${at(7200).chipClass}`)
ok('and the appointment appears on the contact', /Thu, 3:00 PM/.test(at(7200).appt), at(7200).appt)
ok('both screens stay in step throughout',
   seen.every((f) => JSON.stringify(f.phone.filter((k) => k !== 't')) === JSON.stringify(f.desk.filter((k) => k !== 't'))),
   seen.map((f) => `${f.t}:${f.phone}/${f.desk}`).join(' '))
await shot('hero-booked')

/* It loops. The cycle is 600 + 1100 + 1300 + 1600 + 900 + 1300 + 4200 = 11000ms, so sampling a
 * little past that lands early in the next pass. The signal that it reset is that the booking is
 * undone — exact message counts are a timing race, the cleared booking is not. */
await sleep(Math.max(0, t0 + 11000 + 900 - Date.now()))
const after = await frame()
ok('the timeline loops and clears the booking', !after.phone.includes('3') && !/Booked/.test(after.chip),
   `${JSON.stringify(after.phone)} ${after.chip}`)
ok('and the contact panel goes back to nothing booked', /Nothing booked yet/.test(after.appt), after.appt)

// ── E. reduced motion ───────────────────────────────────────────────────────
console.log('\n═══ E. reduced motion ═══')
await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
await load()
await sleep(500)
const rm = await frame()
ok('the whole conversation is shown at once', ['0', '1', '2', '3'].every((k) => rm.phone.includes(k)), JSON.stringify(rm.phone))
ok('with the booking already made', /Booked/.test(rm.chip) && /Thu, 3:00 PM/.test(rm.appt), `${rm.chip} ${rm.appt}`)
ok('and no typing dots left running', !rm.phone.includes('t'))
await cdp.send('Emulation.setEmulatedMedia', { features: [] })

// ── F. accessibility ────────────────────────────────────────────────────────
console.log('\n═══ F. accessibility ═══')
await load()
const a11y = await evalJs(`
  const chips = [...document.querySelectorAll('.vchips button')];
  const b = document.querySelector('.films-peek');
  const deco = [...document.querySelectorAll('.flow svg, .checks svg, .help-card svg')];
  return {
    chipsPressed: chips.length === 4 && chips.every(c => c.tagName === 'BUTTON' && c.hasAttribute('aria-pressed')),
    chipsLabelled: !!document.querySelector('.vchips').getAttribute('aria-label'),
    filmsBtn: b.tagName === 'BUTTON' && b.hasAttribute('aria-expanded') && !!document.getElementById(b.getAttribute('aria-controls')),
    decorativeHidden: deco.length > 20 && deco.every(s => s.getAttribute('aria-hidden') === 'true' || s.closest('[aria-hidden="true"]')),
    phonesLabelled: [...document.querySelectorAll('#on-the-go .phone')].every(p => p.getAttribute('role') === 'img' && !!p.getAttribute('aria-label')),
    oneH1: document.querySelectorAll('h1').length,
  };`)
ok('the voice chips are real buttons with aria-pressed', a11y.chipsPressed)
ok('and their group is labelled', a11y.chipsLabelled)
ok('the films peek says what it opens and whether it is open', a11y.filmsBtn)
ok('decorative icons are hidden from screen readers', a11y.decorativeHidden)
ok('the phone pictures are labelled', a11y.phonesLabelled)
ok('exactly one h1', a11y.oneH1 === 1, String(a11y.oneH1))

// ── G. light mode ───────────────────────────────────────────────────────────
// 01 rule 1: light mode must keep working. It is reached AUTOMATICALLY via
// prefers-color-scheme, not just a toggle, so this is what a light-OS visitor sees.
//
// The mockup is a picture of a DARK product. The reference sets color:var(--ink) and
// background:var(--app) throughout, and light mode redefines those, so the app rendered dark
// text on its own dark chrome: sidebar labels, headings, every conversation name gone, and the
// phone screen white. Nothing caught it, because every rule was individually valid.
console.log('\n═══ G. light mode ═══')
const CONTRAST = `
(() => {
  const lum = (c) => { const p = (c.match(/[\\d.]+/g) || []).slice(0, 3).map(Number).map((v) => {
      v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) });
    return 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2] };
  const ratio = (a, b) => { const L1 = lum(a), L2 = lum(b);
    return +(((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)).toFixed(2)) };
  const bgOf = (el) => { let e = el; while (e) { const c = getComputedStyle(e).backgroundColor;
      if (c && !/rgba\\(0, 0, 0, 0\\)|transparent/.test(c)) return c; e = e.parentElement }
    return 'rgb(255, 255, 255)' };
  const probes = [['phone name', '.cphone .ctop b'], ['app heading', '#heroDk .dk-top .dk-h6'],
    ['sidebar nav', '#heroDk .dk-nav'], ['contact summary', '#heroDk .dk-contact p'],
    ['hero headline', '.hero-head h1'], ['hero body', '.hero-head .lead']];
  return probes.map(([label, sel]) => { const el = document.querySelector(sel);
    return { label, r: el ? ratio(getComputedStyle(el).color, bgOf(el)) : null } });
})()`
const readContrast = async (theme) => {
  await load()
  await evalJs(`document.documentElement.setAttribute('data-theme', '${theme}'); return 1`)
  await sleep(300)
  return cdp.send('Runtime.evaluate', { expression: CONTRAST, returnByValue: true }).then((r) => r.result.value)
}
const dark = await readContrast('dark')
const light = await readContrast('light')
for (const row of light) {
  const d = dark.find((x) => x.label === row.label)
  ok(`light: ${row.label} is legible`, row.r !== null && row.r >= 3, `${row.r}:1`)
  // The app pins its own palette, so its text must measure the SAME in both themes. If a value
  // moves, a theme token has leaked back in.
  if (['phone name', 'app heading', 'sidebar nav', 'contact summary'].includes(row.label))
    ok(`light: ${row.label} is pinned, not theme-driven`, row.r === d.r, `dark ${d.r} vs light ${row.r}`)
}
// The page furniture SHOULD follow the theme, or light mode is not really light.
const heroDark = dark.find((x) => x.label === 'hero body').r
const heroLight = light.find((x) => x.label === 'hero body').r
ok('the page itself does follow the theme', heroDark !== heroLight, `${heroDark} vs ${heroLight}`)
ok('and the app still looks dark on a light page', await evalJs(`
  document.documentElement.setAttribute('data-theme', 'light');
  const bg = getComputedStyle(document.getElementById('heroDk')).backgroundColor;
  const [r, g, b] = bg.match(/\\d+/g).map(Number);
  return (r + g + b) / 3 < 60;`))
await evalJs(`document.documentElement.removeAttribute('data-theme'); return 1`)

// ── H. the other pages still work ───────────────────────────────────────────
console.log('\n═══ G. the pages that share styles.css ═══')
for (const p of ['voice.html', 'use-cases.html', 'for-dental.html', 'pricing.html', 'about.html', 'ae.html', 'enterprise.html']) {
  cdp.errors.length = 0; cdp.console.length = 0
  await view(1280, 900)
  await cdp.send('Page.navigate', { url: pageUrl(p) })
  for (let i = 0; i < 80; i++) { if (await evalJs('return document.readyState === "complete"')) break; await sleep(100) }
  await sleep(300)
  const r = await evalJs(`
    const de = document.documentElement;
    const ph = document.querySelector('.phone');
    return { overflow: de.scrollWidth - de.clientWidth,
             phoneW: ph ? Math.round(ph.getBoundingClientRect().width) : null,
             phonePos: ph ? getComputedStyle(ph).position : null };`)
  ok(`${p}: no horizontal scroll`, r.overflow <= 0, `${r.overflow}px`)
  ok(`${p}: no uncaught errors`, cdp.errors.length === 0, cdp.errors.join(' | '))
  // The hero phone rules were scoped to .cphone precisely so these keep their own component.
  if (r.phoneW !== null) ok(`${p}: its .phone is untouched (${r.phoneW}px, ${r.phonePos})`, r.phoneW > 200 && r.phonePos !== 'absolute')
}

/* ═══ H. the UAE view ═══
   The UAE has no SMS and, more importantly, no AI voice at all: voice agents are not permitted
   on its networks, so advertising one there is not a rough edge, it is a claim we must not make.
   ?market=UAE is the same override a real visitor gets from their timezone, so this exercises
   the real path. Rendered rather than grepped, because whether an element is VISIBLE is the
   whole question and the source says nothing about it. */
console.log('\n═══ H. the UAE view ═══')
/* ae.html is the distributor page. It is already a UAE page, so ?market=UAE changes nothing on
   it, but it belongs here more than anywhere: it is the one page written entirely by hand for
   that market, so it is the one most able to grow a claim the market cannot buy. */
const uaePages = ['index.html', 'pricing.html', 'voice.html', 'for-dental.html', 'about.html', 'ae.html']
for (const p of uaePages) {
  cdp.errors.length = 0
  await view(1280, 900)
  await cdp.send('Page.navigate', { url: pageUrl(p) + '?market=UAE' })
  for (let i = 0; i < 80; i++) { if (await evalJs('return document.readyState === "complete"')) break; await sleep(100) }
  await sleep(500)
  const r = await evalJs(`
    const vis = (el) => { let q = el; while (q) { if (q.hidden || getComputedStyle(q).display === 'none') return false; q = q.parentElement } return true };
    const out = [];
    const walk = (el) => { for (const c of el.childNodes) {
      if (c.nodeType === 3) { const t = c.textContent.trim();
        if (t && /\\bSMS\\b|AI Receptionist|voice receptionist|voicemail|inbound call/i.test(t) && vis(c.parentElement)) {
          let q = c.parentElement, chain = [];
          for (let i = 0; i < 4 && q; i++) { chain.push(q.tagName.toLowerCase() + (q.className ? '.' + String(q.className).split(' ')[0] : '')); q = q.parentElement }
          out.push(t.slice(0, 45) + ' [' + chain.join(' < ') + ']'); } }
      else if (c.nodeType === 1 && c.tagName !== 'SCRIPT' && c.tagName !== 'STYLE') walk(c); } };
    walk(document.body);
    return { bad: [...new Set(out)],
             nav: [...document.querySelectorAll('.nav-links a')].filter(vis).map(a => a.textContent.trim()),
             overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };`)
  /* One place is allowed to name SMS and voice, because it says they are ABSENT: the panel on
     voice.html explaining why there is nothing to sell. Saying a thing is not offered is the
     opposite of advertising it. (The market note under the pricing headline used to be the
     other one; it was removed on 2026-10-03, so no pricing text may name SMS any more.) */
  const allowed = r.bad.filter((t) => !/note-card/.test(t))
  ok(`${p}: no SMS or voice claim is visible`, allowed.length === 0, allowed.join(' | '))
  ok(`${p}: no Voice AI link in the nav`, !r.nav.includes('Voice AI'), r.nav.join(' | '))
  ok(`${p}: no horizontal scroll`, r.overflow <= 0, `${r.overflow}px`)
  ok(`${p}: no uncaught errors`, cdp.errors.length === 0, cdp.errors.join(' | '))
}

// The plans themselves, which is what a customer is actually buying.
await cdp.send('Page.navigate', { url: pageUrl('pricing.html') + '?market=UAE' })
for (let i = 0; i < 80; i++) { if (await evalJs('return document.readyState === "complete"')) break; await sleep(100) }
await sleep(500)
const uaePlans = await evalJs(`
  const vis = (el) => { let q = el; while (q) { if (q.hidden || getComputedStyle(q).display === 'none') return false; q = q.parentElement } return true };
  const cards = [...document.querySelectorAll('.plan')].filter(vis).map((c) => ({
    name: c.querySelector('h3').textContent.trim(),
    price: c.querySelector('.amt').innerText.replace(/\\s+/g, ' ').trim(),
    feats: [...c.querySelectorAll('li')].filter(vis).map((l) => l.textContent.trim()).join(' | ') }));
  const orbit = [...document.querySelectorAll('.orbit')].filter(vis);
  return { cards, chips: orbit.length ? [...orbit[0].querySelectorAll('.chan')].map((c) => c.textContent.trim()) : [] };`)
ok('UAE shows two plans', uaePlans.cards.length === 2, uaePlans.cards.map((c) => c.name).join(','))
ok('Starter is AED 549', /549 AED/.test(uaePlans.cards[0]?.price || ''), uaePlans.cards[0]?.price)
ok('Pro is AED 999', /999 AED/.test(uaePlans.cards[1]?.price || ''), uaePlans.cards[1]?.price)
ok('Starter grants 15,000 credits, matching the app', /15,000 credits/.test(uaePlans.cards[0]?.feats || ''))
ok('Starter carries 3 seats, matching the app', /3 seats/.test(uaePlans.cards[0]?.feats || ''))
ok('Pro grants 45,000 credits, matching the app', /45,000 credits/.test(uaePlans.cards[1]?.feats || ''))
ok('and Pro names only the channels that exist there',
  /WhatsApp, web chat, email, Instagram and Messenger/.test(uaePlans.cards[1]?.feats || ''), uaePlans.cards[1]?.feats)

// North America must be untouched by all of the above.
await cdp.send('Page.navigate', { url: pageUrl('pricing.html') + '?market=US' })
for (let i = 0; i < 80; i++) { if (await evalJs('return document.readyState === "complete"')) break; await sleep(100) }
await sleep(500)
const usPlans = await evalJs(`
  const vis = (el) => { let q = el; while (q) { if (q.hidden || getComputedStyle(q).display === 'none') return false; q = q.parentElement } return true };
  return { n: [...document.querySelectorAll('.plan')].filter(vis).length,
           voice: [...document.querySelectorAll('li')].filter(vis).some((l) => /AI voice receptionist/.test(l.textContent)),
           nav: [...document.querySelectorAll('.nav-links a')].filter(vis).map((a) => a.textContent.trim()) };`)
ok('the US still shows three plans', usPlans.n === 3, String(usPlans.n))
ok('the US still sells the AI voice receptionist', usPlans.voice)
ok('and still has the Voice AI link', usPlans.nav.includes('Voice AI'), usPlans.nav.join(' | '))

/* ═══ I. Enterprise ═══
   A row under the plan cards on home and pricing, and enterprise.html with the form. The form
   posts to the app (leadq-app api/enquiry.ts), which is stubbed here: what matters on this side
   is that it is thanked ONLY when the app says it was sent, and says so when it was not. */
console.log('\n═══ I. Enterprise ═══')
const entRow = async (url, w) => {
  await view(w, 900)
  await cdp.send('Page.navigate', { url })
  for (let i = 0; i < 80; i++) { if (await evalJs('return document.readyState === "complete"')) break; await sleep(100) }
  await sleep(400)
  return evalJs(`
    const row = document.querySelector('.ent-row'), plans = document.querySelector('.plans');
    const a = row && row.querySelector('a');
    return { row: !!row, rowW: row ? Math.round(row.getBoundingClientRect().width) : 0,
             plansW: plans ? Math.round(plans.getBoundingClientRect().width) : 0,
             href: a ? a.getAttribute('href') : '', text: a ? a.textContent.trim() : '',
             overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };`)
}
for (const [p, w] of [['pricing.html', 1280], ['pricing.html?market=UAE', 1280], ['pricing.html', 390]]) {
  const r = await entRow(pageUrl(p.split('?')[0]) + (p.includes('?') ? '?' + p.split('?')[1] : ''), w)
  ok(`${p} at ${w}: an Enterprise row, as wide as the plans (${r.rowW} vs ${r.plansW})`, r.row && Math.abs(r.rowW - r.plansW) <= 1)
  ok(`${p} at ${w}: its Contact us goes to the form`, r.text === 'Contact us' && r.href === 'enterprise.html', `${r.text} -> ${r.href}`)
  ok(`${p} at ${w}: no horizontal scroll`, r.overflow <= 0, `${r.overflow}px`)
}

const entLoad = async (w, reply) => {
  cdp.errors.length = 0; cdp.console.length = 0
  await view(w, 900)
  await cdp.send('Page.navigate', { url: pageUrl('enterprise.html') })
  for (let i = 0; i < 80; i++) { if (await evalJs('return document.readyState === "complete"')) break; await sleep(100) }
  await sleep(400)
  await evalJs(`window.__sent = []; window.fetch = async (u, o) => { window.__sent.push({ u, body: JSON.parse(o.body) });
    return ${reply}; }; return 1`)
}
const entFill = (name) => evalJs(`
  const f = document.querySelector('[data-enquiry]'), set = (n, v) => { f.elements[n].value = v };
  set('name', ${JSON.stringify(name)}); set('business', 'Reyes Dental Group'); set('email', 'dana@reyesdental.com');
  set('about', 'Six clinics.'); f.requestSubmit(); return 1`)
const entState = () => evalJs(`
  const f = document.querySelector('[data-enquiry]'), d = document.querySelector('[data-enquiry-done]');
  const b = f.querySelector('button[type=submit]');
  return { form: !f.hidden, done: !d.hidden, title: d.querySelector('h2').textContent, line: d.querySelector('p').textContent,
           err: !f.querySelector('[data-enquiry-err]').hidden, btn: b.textContent, disabled: b.disabled,
           sent: window.__sent, focus: document.activeElement === d,
           fields: [...f.querySelectorAll('label')].filter((l) => !l.closest('.ent-hp')).map((l) => l.firstChild.textContent.trim()),
           hpW: Math.round(f.querySelector('.ent-hp').getBoundingClientRect().width),
           overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
           autoopen: !!document.querySelector('script[data-leadq][data-autoopen]') };`)

await entLoad(390, `{ ok: true, status: 200, json: async () => ({ ok: true }) }`)
let e0 = await entState()
ok('enterprise.html: the four fields, in order', e0.fields.join(' | ') === 'Name | Business name | Email | Tell us a little about your business and needs', e0.fields.join(' | '))
ok('enterprise.html: the bot field takes no space', e0.hpW <= 1, `${e0.hpW}px`)
ok('enterprise.html: no horizontal scroll on a phone', e0.overflow <= 0, `${e0.overflow}px`)
ok('enterprise.html: the demo chat does not open over the form', !e0.autoopen)
await evalJs(`document.querySelector('[data-enquiry]').requestSubmit(); return 1`)
await sleep(200)
ok('an empty form is not sent', (await entState()).sent.length === 0)
await entFill('Dana Reyes')
await sleep(300)
let e1 = await entState()
ok('a complete form is sent to the app', e1.sent.length === 1 && e1.sent[0].u === 'https://app.leadq.co/api/enquiry', JSON.stringify(e1.sent.map((s) => s.u)))
ok('with every field, the market, and an empty bot field', (() => { const b = e1.sent[0]?.body || {};
  return b.name === 'Dana Reyes' && b.business === 'Reyes Dental Group' && b.email === 'dana@reyesdental.com' && b.about === 'Six clinics.' && b.market === 'US' && b.website === '' })(),
  JSON.stringify(e1.sent[0]?.body))
ok('then thanks them by first name', e1.done && !e1.form && e1.title === 'Thanks, Dana.', e1.title)
ok('and says someone will get back to them', e1.line === 'Someone will get back to you shortly.', e1.line)
ok('and moves focus to the thank-you', e1.focus)
ok('enterprise.html: no uncaught errors', cdp.errors.length === 0, cdp.errors.join(' | '))

await entLoad(1280, `{ ok: false, status: 502, json: async () => ({ ok: false, error: 'send' }) }`)
await entFill('Dana Reyes')
await sleep(300)
let e2 = await entState()
ok('a failed send is never thanked', !e2.done && e2.form, `done=${e2.done}`)
ok('it says it did not send', e2.err)
ok('and the button is back to try again', !e2.disabled && e2.btn === 'Send', `${e2.btn} ${e2.disabled}`)

await entLoad(1280, `Promise.reject(new TypeError('Failed to fetch'))`)
await entFill('Dana Reyes')
await sleep(300)
let e3 = await entState()
ok('no connection at all is a failure too', !e3.done && e3.err && !e3.disabled)

/* Another business on its own Pro plan, in the add-ons menu at each market's own price. The app
   charges EXTRA_WS_PRICES (leadq-app api/_lib/prices.ts); its test checks site.js against that. */
for (const [mk, want] of [['US', '$299 USD/mo'], ['CA', '$379 CAD/mo'], ['UAE', '749 AED/mo']]) {
  await cdp.send('Page.navigate', { url: pageUrl('pricing.html') + '?market=' + mk })
  for (let i = 0; i < 80; i++) { if (await evalJs('return document.readyState === "complete"')) break; await sleep(100) }
  await sleep(400)
  const x = await evalJs(`const c = document.querySelector('[data-addon="workspace"]'), tr = c && c.closest('tr');
    return { price: c ? c.textContent.trim() : '', shown: !!tr && !tr.hidden, name: tr ? tr.firstElementChild.firstChild.textContent.trim() : '' };`)
  ok(`${mk}: an extra business or location is ${want}`, x.shown && x.price === want && x.name === 'Extra business or location', JSON.stringify(x))
  /* Booking (founder, 2026-11-07) and follow-ups (2026-11-09) are on every plan: Starter says so
     once, on its card and in the comparison, in every market. */
  const st = await evalJs(`const vis = (el) => { let q = el; while (q) { if (q.hidden || getComputedStyle(q).display === 'none') return false; q = q.parentElement } return true };
    const card = document.querySelector('.plan[data-plan="starter"]');
    const lines = [...card.querySelectorAll('li')].filter(vis).map((l) => l.textContent.trim());
    const cell = (name) => { const tr = [...document.querySelectorAll('.cmp tr')].find((r) => r.querySelector('th') && r.querySelector('th').textContent.trim() === name);
      return tr ? [...tr.querySelectorAll('td')[0].querySelectorAll('span')].filter(vis).map((s) => s.className).join(',') || tr.querySelectorAll('td')[0].textContent.trim() : '' };
    return { book: lines.filter((l) => l === 'Booking, calendar and reminders').length, sync: lines.includes('Calendar sync with Google and Outlook'),
      fu: lines.filter((l) => l === 'Follow-ups, custom fields, profiles').length, tFu: cell('Follow-ups, custom fields, profiles'), tBook: cell('Booking, calendar and reminders'), tSync: cell('Calendar sync with Google and Outlook') };`)
  ok(`${mk}: Starter books, with calendar sync, said once`, st.book === 1 && st.sync && /yes/.test(st.tBook) && /yes/.test(st.tSync), JSON.stringify(st))
  ok(`${mk}: Starter has follow-ups, custom fields and profiles, said once`, st.fu === 1 && /yes/.test(st.tFu), JSON.stringify(st))
}

console.log(`\n${bad ? bad + ' FAILED' : 'ALL PASS'}  (${checks} checks)`)
chrome.kill()
try { fs.rmSync(profile, { recursive: true, force: true }) } catch {}
process.exit(bad ? 1 : 0)
