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
// The hero used to have to SAY "desktop or your phone" because it only showed a phone. It now
// shows both screens playing one booking, so the picture carries it and the fine print is short
// again. What matters is that both screens are actually there.
ok("the hero shows the desktop app", /id="heroDk"/.test(home))
ok("and the customer's phone beside it", /class="cphone"/.test(home) && /data-hphone/.test(home))
// One function resolves the SAME step id on both screens, which is what makes it one timeline
// rather than two loops that drift apart.
ok("driven by one timeline, not two", /function els\(k\)\{ return \[ph\.querySelector.*dk\.querySelector/.test(read("app-mockup.js")))
ok("the fine print stays short", /Set it up in minutes\. No AI knowledge needed\./.test(home))
ok("the app section says where it runs", /Runs in your browser\. Log in from any computer/.test(home))
// 01 rule 10: do NOT promise a mobile app. The note says where it runs instead.
ok("it does not promise a mobile app", !/mobile app|download the app|app store/i.test(home))
ok("setup no longer claims to be phone-first", /Live in minutes, from any browser/.test(home))

// ── the desktop app is actually shown, not just described ────────────────────
// The markup is static in the page and the driver only animates it. Covered in depth by
// app-mockup.test.mjs, which pins it to the brief's reference implementation.
ok("the page carries the desktop app", /id="tourDk"/.test(home))
ok("and loads the driver that animates it", /<script src="app-mockup\.js" defer><\/script>/.test(home))
ok("the app sits in a browser window", /class="appwin"/.test(home))
ok("with a real address bar", /<span>app\.leadq\.co<\/span>/.test(home))
ok("and you can click through three screens", /data-tab="settings"/.test(home))

// ── nothing still references the artwork the tour replaced ───────────────────
const css = read("styles.css")
for (const dead of ["sheet-phones", 'class="desk"'])
  ok(`no leftover markup: ${dead}`, !home.includes(dead))
ok("no rule targets the removed second phone", !/sheet-phones \.phone:nth-child\(2\)/.test(css))

console.log(bad ? `\n${bad} FAILED` : "\nOK site claims match the product")
process.exit(bad ? 1 : 0)
