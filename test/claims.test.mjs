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
// 01 rule 10 says not to promise a mobile app. Rob overrode that on 2026-09-21: saying it is
// coming shows progress, and the rule is really guarding against app-store badges and download
// links for something that does not exist. So the promise is allowed, the hard claims are not.
ok("it says the mobile app is coming", /The mobile app is coming soon\./.test(home))
ok("but makes no hard claim it exists", !/download the app|app store|get it on|available on the/i.test(home))
ok("setup no longer claims to be phone-first", /Live in minutes, from any browser/.test(home))

// ── Instagram and Messenger are live ─────────────────────────────────────────
// From 2026-10-02 they were "coming soon" (Meta's access verification checks the site shows the
// service). Meta approved App Review in October 2026 and every workspace can connect them, so no
// sentence may still call them coming.
for (const f of pages.filter((f) => !/privacy|terms/.test(f))) {
  const text = read(f).replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ")
  const named = text.split(/(?<=[.!?])\s+/).filter((s) => /Instagram|Messenger/.test(s))
  ok(`${f}: Instagram and Messenger are never "coming soon"`, !named.some((s) => /coming soon/i.test(s)),
     named.filter((s) => /coming soon/i.test(s)).join(" | ").slice(0, 160))
}
ok("the home page sells them", /Instagram and Messenger DMs are answered the same way\./.test(home) && /Plus Instagram and Messenger\./.test(home))
ok("and names the Facebook lead forms that already work", /Leads from your Facebook lead forms come straight in too\./.test(home))
const privacy = read("privacy-policy.html")
ok("the privacy policy covers Facebook and Instagram data", /<h2>Facebook and Instagram Data<\/h2>/.test(privacy))
ok("and says how to delete it, at a stable anchor", /id="retention-and-deletion-of-facebook-and-instagram-data"/.test(privacy))
ok("and keeps everything it carried before", /<h2>Google User Data<\/h2>/.test(privacy) && /<h2>Contact Information<\/h2>/.test(privacy))

// ── the desktop app is actually shown, not just described ────────────────────
// The markup is static in the page and the driver only animates it. Covered in depth by
// app-mockup.test.mjs, which pins it to the brief's reference implementation.
ok("the page carries the desktop app", /id="tourDk"/.test(home))
ok("and loads the driver that animates it", /<script src="app-mockup\.js(\?v=[a-f0-9]+)?" defer><\/script>/.test(home))
ok("the app sits in a browser window", /class="appwin"/.test(home))
ok("with a real address bar", /<span>app\.leadq\.co<\/span>/.test(home))
ok("and you can click through three screens", /data-tab="schedule"/.test(home))

// ── nothing still references the artwork the tour replaced ───────────────────
const css = read("styles.css")
for (const dead of ["sheet-phones", 'class="desk"'])
  ok(`no leftover markup: ${dead}`, !home.includes(dead))
ok("no rule targets the removed second phone", !/sheet-phones \.phone:nth-child\(2\)/.test(css))

// ── the UAE is a different product, not a discount ───────────────────────────
// No SMS, and no voice at all: AI voice agents are not permitted on UAE networks, so nothing
// may advertise one there. These pin the data, since the rendering is proven in browser.test.
const js = read("site.js")
const uae = js.slice(js.indexOf("UAE: {"), js.indexOf("};", js.indexOf("UAE: {")))
/* Starter means Starter everywhere: the Starter AED price was re-priced to 549 on 2026-09-23,
   so the site, the app, Stripe checkout and the invoice all say the same word. It briefly ran
   as the Growth price labelled Starter, which billed correctly but renamed every receipt. */
ok("its entry tier is the starter plan, which is the price customers see named", !uae.includes("planNames"))
ok("no SMS", /hasSMS: false/.test(uae))
ok("no voice, flagged separately from SMS", /hasVoice: false/.test(uae))
ok("Starter is AED 549 and Pro AED 999", /starter: 549/.test(uae) && /pro: 999/.test(uae))
ok("no phone number add-on", /number: null/.test(uae))

/* The pools and seats the SITE promises have to be the ones the APP grants. The app is the
   authority (api/_lib/limits.ts, AE_POOLS); this is its mirror, and a mismatch here is a
   customer being sold something they will not get. */
ok("Starter's pool matches the app's AE_POOLS", /credits: \{ starter: 15000/.test(uae))
ok("the whole pool table matches the app", uae.includes("credits: { starter: 15000, growth: 45000, pro: 45000 }"))
ok("the entry tier is one channel, like the app grants", uae.includes('channels:{ starter: "1", growth: "3"'))
ok("Starter carries Growth's 3 seats, because it is Growth repriced", /seats:   \{ starter: 3/.test(uae))
ok("the credits note is sized on the real pools", /15,000 credits is around 140/.test(uae))

// Both markets have to stay whole: US must keep everything the UAE drops.
const us = js.slice(js.indexOf("US:  {"), js.indexOf("CA:  {"))
ok("the US still has SMS and voice", /hasSMS: true/.test(us) && /hasVoice: true/.test(us))
ok("the US still sells three plans", /plans: \["starter","growth","pro"\]/.test(us))
ok("the US pools are untouched", /credits: \{ starter: 20000, growth: 45000, pro: 120000 \}/.test(us))

// Voice is hidden by its own flag, never by the North America flag, or the UAE would show it
// the moment anything else changed.
const build = read("docs/build-site.js")
ok("the Voice AI nav link is voice-gated", /\["voice\.html", "Voice AI", "voice", "voice"\]/.test(build))
ok("the voice page tells a UAE visitor plainly", /isn't available in the UAE/.test(build))
ok("no voice element is keyed to North America instead", !/voice-strip[^>]*data-na-only/.test(build))

console.log(bad ? `\n${bad} FAILED` : "\nOK site claims match the product")
process.exit(bad ? 1 : 0)
