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
ok('the tour app rendered', await evalJs('return !!document.getElementById("tourDk")'))
ok('the icon sprite resolved', await evalJs(`
  const u = document.querySelector('#heroDk use'); if (!u) return false;
  const id = u.getAttribute('href').slice(1); return !!document.getElementById(id);`))
ok('pricing still works (site.js untouched)', await evalJs(`
  const el = [...document.querySelectorAll('*')].find(e => /\\$\\d/.test(e.textContent) && e.children.length === 0);
  return !!el;`))

// ── B. layout across widths ─────────────────────────────────────────────────
console.log('\n═══ B. layout, measured in the browser ═══')
for (const w of [1440, 1280, 1024, 980, 800, 768, 700, 620, 414, 390, 360]) {
  await view(w)
  await sleep(220)
  const m = await evalJs(`
    const de = document.documentElement;
    const dkw = document.querySelector('#tourDk').closest('.dkw');
    const dk  = document.getElementById('tourDk');
    const win = document.querySelector('.pstage .appwin');
    const hint = document.querySelector('.scroll-hint');
    const ph  = document.querySelector('.cphone');
    const cs = (el) => el ? getComputedStyle(el) : null;
    return {
      pageOverflow: de.scrollWidth - de.clientWidth,
      appFont: parseFloat(cs(dk).fontSize),
      appW: Math.round(dk.getBoundingClientRect().width),
      dkwW: Math.round(dkw.clientWidth),
      dkwScrolls: dkw.scrollWidth > dkw.clientWidth + 1,
      heroWin: win ? cs(win).display : 'absent',
      hint: hint ? cs(hint).display : 'absent',
      phoneVisible: ph ? cs(ph).display !== 'none' && ph.getBoundingClientRect().width > 0 : false,
    };`)
  const tag = `${String(w).padStart(4)}px`
  ok(`${tag} no horizontal page scroll`, m.pageOverflow <= 0, `overflows by ${m.pageOverflow}px`)
  ok(`${tag} app type never below 7px`, m.appFont >= 6.99, `${m.appFont}px`)
  ok(`${tag} the customer's phone is visible`, m.phoneVisible)
  // max-width:700px is inclusive, so the rule applies AT 700.
  if (w <= 700) {
    ok(`${tag} hero window hidden (05 s1)`, m.heroWin === 'none', m.heroWin)
    ok(`${tag} swipe hint shown`, m.hint === 'block', m.hint)
  } else {
    ok(`${tag} hero window shown`, m.heroWin !== 'none', m.heroWin)
    ok(`${tag} swipe hint hidden`, m.hint === 'none', m.hint)
  }
  // 03 s4.9: once the app hits its 7px floor it must scroll INSIDE .dkw, not push the page.
  if (m.appW > m.dkwW + 1) ok(`${tag} app scrolls inside its own box`, m.dkwScrolls)
  else ok(`${tag} app fits its box (${m.appW} in ${m.dkwW})`, !m.dkwScrolls)
  if ([1440, 768, 390].includes(w)) await shot('width-' + w)
}

// ── C. tour interactions ────────────────────────────────────────────────────
console.log('\n═══ C. the tour actually responds ═══')
await view(1440, 1100)
await load()
const screenState = async () => evalJs(`
  const dk = document.getElementById('tourDk');
  const vis = [...dk.querySelectorAll('[data-scr]')].filter(s => !s.hidden).map(s => s.dataset.scr);
  return { visible: vis, title: document.querySelector('[data-cap-title]').textContent.trim(),
           caps: document.querySelectorAll('[data-caps] .it').length,
           tabs: [...document.querySelectorAll('#tourSeg button')].map(b => b.dataset.tab + ':' + b.getAttribute('aria-pressed')),
           navOn: [...dk.querySelectorAll('.dk-side .dk-nav.on')].map(n => n.dataset.go || n.textContent.trim()) };`)

let s = await screenState()
ok('starts on Home, alone', s.visible.length === 1 && s.visible[0] === 'home', JSON.stringify(s.visible))
ok('with its caption and three points', /five seconds/.test(s.title) && s.caps === 3, `${s.title} / ${s.caps}`)

for (const [tab, phrase] of [['inbox', 'hand it back'], ['settings', 'Connect a channel'], ['home', 'five seconds']]) {
  await evalJs(`document.querySelector('#tourSeg [data-tab="${tab}"]').click(); return 1`)
  await sleep(120)
  s = await screenState()
  ok(`tab ${tab}: only that screen is visible`, s.visible.length === 1 && s.visible[0] === tab, JSON.stringify(s.visible))
  ok(`tab ${tab}: caption follows`, s.title.includes(phrase), s.title)
  ok(`tab ${tab}: aria-pressed is right`, s.tabs.filter((t) => t.endsWith(':true')).join() === tab + ':true', s.tabs.join(' '))
  ok(`tab ${tab}: the app's own sidebar highlights it`, s.navOn.length === 1 && s.navOn[0] === tab, JSON.stringify(s.navOn))
}

// the sidebar itself switches screens
await evalJs(`document.querySelector('#tourDk .dk-side [data-go="settings"]').click(); return 1`)
await sleep(120)
s = await screenState()
ok('the app sidebar switches screens too', s.visible[0] === 'settings', JSON.stringify(s.visible))
ok('and the tabs above stay in sync', s.tabs.find((t) => t.startsWith('settings')).endsWith(':true'))

// channel switches on the Settings screen
const chState = async () => evalJs(`
  const dk = document.getElementById('tourDk');
  const vis = [...dk.querySelectorAll('[data-scr]')].find(x => !x.hidden);
  const tg = [...vis.querySelectorAll('[data-chtg]')];
  const count = vis.querySelector('[data-chcount]');
  return { n: tg.length, on: tg.filter(t => t.getAttribute('aria-pressed') === 'true').length,
           dimmed: tg.filter(t => t.closest('.dk-chrow')?.classList.contains('off')).length,
           count: count ? count.textContent.trim() : null };`)
let c0 = await chState()
ok('settings lists five channel switches', c0.n === 5, String(c0.n))
ok('all on to begin with', c0.on === 5 && c0.count === '5 of 5, replying on all', `${c0.on} / ${c0.count}`)
await evalJs(`const v=[...document.getElementById('tourDk').querySelectorAll('[data-scr]')].find(x=>!x.hidden);
  v.querySelectorAll('[data-chtg]')[0].click(); return 1`)
await sleep(120)
let c1 = await chState()
ok('switching one off updates aria-pressed', c1.on === 4, String(c1.on))
ok('and the count text', c1.count === '4 of 5, replying on 4', c1.count)
ok('and dims that row', c1.dimmed === 1, String(c1.dimmed))
await evalJs(`const v=[...document.getElementById('tourDk').querySelectorAll('[data-scr]')].find(x=>!x.hidden);
  v.querySelectorAll('[data-chtg]')[0].click(); return 1`)
await sleep(120)
let c2 = await chState()
ok('switching back restores it', c2.on === 5 && c2.count === '5 of 5, replying on all' && c2.dimmed === 0, `${c2.on}/${c2.count}/${c2.dimmed}`)

// master switch on Home
await evalJs(`document.querySelector('#tourSeg [data-tab="home"]').click(); return 1`)
await sleep(120)
const master = async () => evalJs(`
  const dk = document.getElementById('tourDk');
  const m = dk.querySelector('[data-master]');
  return { pressed: m.getAttribute('aria-pressed'),
           label: dk.querySelector('[data-master-label]').textContent.trim(),
           sub: dk.querySelector('[data-master-sub]').textContent.trim() };`)
let m0 = await master()
ok('master switch starts on', m0.pressed === 'true' && /Baxter is on/.test(m0.label), `${m0.pressed} ${m0.label}`)
await evalJs(`document.getElementById('tourDk').querySelector('[data-master]').click(); return 1`)
await sleep(120)
let m1 = await master()
ok('pausing changes the heading', /Baxter is paused/.test(m1.label), m1.label)
ok('and explains what that means', /You answer everything/.test(m1.sub), m1.sub)
await evalJs(`document.getElementById('tourDk').querySelector('[data-master]').click(); return 1`)
await sleep(120)
ok('and it comes back on', /Baxter is on/.test((await master()).label))

// hand back, on the Inbox screen
await evalJs(`document.querySelector('#tourSeg [data-tab="inbox"]').click(); return 1`)
await sleep(120)
const ho = async () => evalJs(`
  const dk = document.getElementById('tourDk');
  return { btn: dk.querySelector('[data-ho]').textContent.trim(),
           chip: dk.querySelector('[data-ho-chip]').textContent.trim(),
           via: dk.querySelector('[data-ho-via]').textContent.trim(),
           row: dk.querySelector('.dk-conv.sel em').textContent.trim() };`)
let h0 = await ho()
ok('inbox starts taken over', h0.btn === 'Hand back' && /Taken over/.test(h0.chip), `${h0.btn} / ${h0.chip}`)
await evalJs(`document.getElementById('tourDk').querySelector('[data-ho]').click(); return 1`)
await sleep(120)
let h1 = await ho()
ok('handing back flips the button', h1.btn === 'Take over', h1.btn)
ok('the thread chip', /Baxter is handling/.test(h1.chip), h1.chip)
ok('the composer label', /Baxter is replying via/.test(h1.via), h1.via)
ok('and the row in the list', /Baxter replying/.test(h1.row), h1.row)
await evalJs(`document.getElementById('tourDk').querySelector('[data-ho]').click(); return 1`)
await sleep(120)
let h2 = await ho()
ok('taking over again reverses all four', h2.btn === 'Hand back' && /Taken over/.test(h2.chip) && /Replying as you/.test(h2.via) && /Taken over/.test(h2.row))
await shot('tour-inbox')

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
  const dk = document.getElementById('tourDk');
  const tg = [...dk.querySelectorAll('.tg')];
  const tabs = [...document.querySelectorAll('#tourSeg button')];
  return {
    switchesAreButtons: tg.every(t => t.tagName === 'BUTTON'),
    switchesPressed: tg.every(t => t.hasAttribute('aria-pressed')),
    switchesLabelled: tg.every(t => (t.getAttribute('aria-label') || t.textContent).trim().length > 0),
    tabsPressed: tabs.every(t => t.hasAttribute('aria-pressed')),
    segLabelled: !!document.getElementById('tourSeg').getAttribute('aria-label'),
    decorativeHidden: [...document.querySelectorAll('#tourDk svg')].every(s => s.getAttribute('aria-hidden') === 'true' || s.closest('[aria-hidden="true"]')),
    oneH1: document.querySelectorAll('h1').length,
  };`)
ok('switches are real buttons', a11y.switchesAreButtons)
ok('with aria-pressed', a11y.switchesPressed)
ok('and a label', a11y.switchesLabelled)
ok('tabs report their state', a11y.tabsPressed)
ok('the tab group is labelled', a11y.segLabelled)
ok('decorative icons are hidden from screen readers', a11y.decorativeHidden)
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
for (const p of ['voice.html', 'use-cases.html', 'for-dental.html', 'pricing.html', 'about.html']) {
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

console.log(`\n${bad ? bad + ' FAILED' : 'ALL PASS'}  (${checks} checks)`)
chrome.kill()
try { fs.rmSync(profile, { recursive: true, force: true }) } catch {}
process.exit(bad ? 1 : 0)
