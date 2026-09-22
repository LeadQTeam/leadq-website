// The site must describe the product that exists.
//
// It used to sell a phone app: "Set it up from your phone", "Every booking, in your pocket",
// "Add LeadQ to your phone like any app", and every screenshot on the site was a phone. There
// is no native mobile app, and the thing people will actually use it on is a computer. Selling
// an app that has not been built is the kind of promise that comes back at signup.
//
// So: lead with the browser, say the phone works too, and say the mobile app is coming.
//
//   node test/claims.test.mjs
import { readFileSync, readdirSync } from "node:fs"
import path from "node:path"

const ROOT = path.resolve(new URL(".", import.meta.url).pathname.replace(/^[/]([A-Za-z]:)/, "$1"), "..")
const pages = readdirSync(ROOT).filter((f) => f.endsWith(".html"))
const read = (f) => readFileSync(path.join(ROOT, f), "utf8")

let bad = 0
const ok = (n, c, extra) => { if (!c) bad++; console.log((c ? "  ok  " : " FAIL ") + n + (c || !extra ? "" : "  " + extra)) }

// ── no page tells people to set it up from a phone ───────────────────────────
for (const f of pages) {
  const h = read(f)
  for (const claim of ["from your phone in minutes", "Minutes from your phone", "in your pocket",
                       "Add LeadQ to your phone like any app", "from your phone."])
    ok(`${f}: does not promise a phone app (${claim.slice(0, 28)})`, !h.includes(claim))
}

// ── but "your phone line" is the VOICE channel, not the device. It must survive ──
// A careless find-and-replace across these files would quietly stop selling voice.
const VOICE = { "index.html": 4, "about.html": 2, "for-real-estate.html": 2, "for-home-services.html": 2 }
for (const [f, n] of Object.entries(VOICE))
  ok(`${f}: still sells the phone line (the voice channel)`, (read(f).match(/your phone line/g) || []).length === n,
     `expected ${n}`)

// ── the home page says where it runs, and what is still coming ───────────────
const home = read("index.html")
ok("the hero says browser, desktop and phone", /in your browser, on desktop or your phone/.test(home))
ok("the app section names all three screens", /Desktop, tablet or phone/.test(home))
ok("and says the native app is not here yet", /native mobile app is on the way/.test(home))
ok("setup no longer claims to be phone-first", /Live in minutes, from any browser/.test(home))

// ── the artwork shows a desktop, not only phones ─────────────────────────────
ok("there is a browser window on the page", /<div class="desk"/.test(home))
ok("with a real address bar", /class="desk-url">app\.leadq\.co</.test(home))
ok("and a phone beside it, so it reads as one product on two screens",
   /class="phone"/.test(home.slice(home.indexOf('class="sheet-phones"'))))

// ── every class the new markup uses is actually styled ───────────────────────
// A typo here is invisible: the element just renders unstyled in the middle of the section.
const css = read("styles.css")
const used = new Set()
for (const m of home.matchAll(/class="([^"]+)"/g))
  for (const k of m[1].split(/\s+/)) if (/^(dk-|desk)/.test(k)) used.add(k)
ok("the new markup uses classes", used.size > 0)
const missing = [...used].filter((k) => !css.includes("." + k))
ok("every browser-window class has a rule", missing.length === 0, missing.join(", "))

// ── and nothing still positions a phone that no longer exists ────────────────
ok("no rule targets the removed second phone", !/sheet-phones \.phone:nth-child\(2\)/.test(css))

console.log(bad ? `\n${bad} FAILED` : "\nOK site claims match the product")
process.exit(bad ? 1 : 0)
