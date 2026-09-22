// The desktop mockup must stay the brief's implementation, not a rewrite of it.
//
// I built this by hand three times and got the sizing wrong every time. The cause: in this
// system `1em` is a LAYOUT unit — the root is 110em wide with font-size clamped to
// container/110, so 1em is one 110th of the window, not the body size. Every hand-picked type
// scale was therefore wrong, and it is wrong in a way that looks like a judgement call rather
// than a bug, so it survives review.
//
// The fix was to stop deriving it: the CSS, the DOM and the driver are lifted from the brief's
// visual-reference.html. This test pins them to that file, so a future "tidy up" has to
// disagree with the brief on purpose rather than by accident.
//
//   node test/app-mockup.test.mjs
import { readFileSync, existsSync } from "node:fs"
import path from "node:path"

const ROOT = path.resolve(new URL(".", import.meta.url).pathname.replace(/^[/]([A-Za-z]:)/, "$1"), "..")
const html = readFileSync(ROOT + "/index.html", "utf8")
const css = readFileSync(ROOT + "/styles.css", "utf8")
const js = readFileSync(ROOT + "/app-mockup.js", "utf8")

let bad = 0
const ok = (n, c, extra) => { if (!c) bad++; console.log((c ? "  ok  " : " FAIL ") + n + (c || !extra ? "" : "  " + extra)) }

// ── the sizing rule, exactly as the brief states it ──────────────────────────
ok("the root scales against its container", /font-size:clamp\(7px,calc\(100cqw \/ 110\),11px\)/.test(css))
ok("and is 110em by 66em", /width:110em/.test(css) && /height:66em/.test(css))
ok("the wrapper is a container, or cqw means nothing", /container-type:inline-size/.test(css))
ok("the sidebar is 19em, not a rounder number I preferred", /grid-template-columns:19em minmax\(0,1fr\)/.test(css))

// The type scale is the part I kept getting wrong. These are the reference's values.
for (const [what, sel, size] of [
  ["page title", ".dk-top h6", "2.1em"],
  ["stat number", ".dk-stat .n b", "3.4em"],
  ["conversation name", ".dk-row .t b", "1.3em"],
  ["nav item", ".dk-nav", "1.4em"],
  ["nav badge", ".dk-nav .badge", ".72em"],
]) {
  const m = css.match(new RegExp(sel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*\\{([^}]*)\\}"))
  const got = m && (m[1].match(/font-size:([^;}]+)/) || [])[1]
  ok(`${what} is ${size}`, got === size, `got ${got}`)
}

// ── the driver drives markup that is already there ───────────────────────────
// It builds no app SHELL, so the DOM and the stylesheet cannot drift apart. It does inject the
// appointment card and the caption items, which is what the reference does too.
ok("the app shell is static in the page", ["dk-side", "dk-list", "dk-thread", "dk-contact", "dk-stats"].every((c) => html.includes(c)))
  // The driver only ever rewrites the captions, the appointment card and the composer label.
ok("the driver rewrites only small parts", (js.match(/\.innerHTML\s*=/g) || []).length <= 4,
   `found ${(js.match(/\.innerHTML\s*=/g) || []).length}`)
for (const hook of ["id=\"heroDk\"", "id=\"tourDk\"", "id=\"tourSeg\"", "data-hphone", "data-hrow",
                    "data-happt", "data-cap-title", "data-caps", "data-scr", "data-go"])
  ok(`the page carries ${hook}`, html.includes(hook))

// `reduce` is declared in the reference's outer wrapper, which is not part of the extract.
// Without it the hero throws on its first frame and the stage renders empty.
ok("the hero's reduced-motion flag is declared", /var reduce\s*=/.test(js))
ok("and the hero actually reads it", /if\(reduce\)/.test(js))

// ── the three screens and the interactions ───────────────────────────────────
ok("all three screens are in the DOM", ["home", "inbox", "settings"].every((s) => html.includes(`data-scr="${s}"`)))
ok("switching hides the others rather than re-rendering", /s\.hidden = s\.dataset\.scr!==key/.test(js))
ok("the tour has three tabs", ["home", "inbox", "settings"].every((s) => html.includes(`data-tab="${s}"`)))
ok("channel switches update the count", /data-chcount/.test(js) && /of 5, replying on/.test(js))
ok("hand back flips the chip, the composer and the list row", /data-ho-chip/.test(js) && /data-ho-via/.test(js) && /dk-conv\.sel em/.test(js))

// ── the hero timeline, at the brief's intervals ──────────────────────────────
// 05 section 1: 0.6s, +1.1, +1.3, +1.6, +0.9, +1.3, hold 4.2, reset.
const gaps = [...js.matchAll(/t\+=(\d+)/g)].map((m) => Number(m[1]))
ok("the timeline uses the brief's intervals", JSON.stringify(gaps) === JSON.stringify([1100, 1300, 1600, 900, 1300, 4200]), JSON.stringify(gaps))
ok("it starts at 600ms", /var t=600/.test(js))
ok("and loops", /setTimeout\(run, t\)/.test(js))
ok("the booking lands on the last message", /on\('3',true\); booked\(\)/.test(js))

// ── the typing dots sit at the BOTTOM of the thread ──────────────────────────
// One typing bubble per screen, fixed in the markup after the first message, but the timeline
// plays it twice. The second time it rendered above the messages already sent. The brief's own
// reference has the same bug, so this is a deliberate departure from it.
ok("the dots are repositioned before being shown", /function typing\(after\)/.test(js))
ok("by inserting after the message being answered", /insertBefore\(dots, prev\.nextSibling\)/.test(js))
ok("the first pass follows message 0", /typing\('0'\)/.test(js))
ok("the second follows message 2, not message 0", /typing\('2'\)/.test(js))
// The only place that reveals the dots is typing(), which positions them first. A bare
// on('t', true) anywhere else would put them back in the wrong slot.
ok("nothing reveals the dots without placing them first",
   (js.match(/on\('t',\s*true\)/g) || []).length === 1 && /\}\s*\n\s*var steps/.test(js.slice(js.indexOf("function typing"))))

// ── the stage, which is the part that looked wrong ───────────────────────────
ok("the window tilts on the window itself", /\.pstage \.appwin\{transform:rotateX\(9deg\) rotateY\(-9deg\) rotateZ\(1deg\)/.test(css))
ok("and settles on hover", /\.pstage:hover \.appwin\{transform:rotateX\(4deg\) rotateY\(-4deg\)\}/.test(css))
ok("the phone is a sibling with its own rotation, not inside the 3D group",
   /\.cphone\{position:absolute;left:0;bottom:0;width:clamp\(170px,21%,236px\)/.test(css))
ok("the phone shows a customer's thread, not the LeadQ app", /cphone .chat .msg.cust/.test(css.replace(/\s+/g, " ")) || /msg cust/.test(html))

// ── the customer's phone ─────────────────────────────────────────────────────
// It is built from the site's shared phone component, so its rules use bare names (.phone,
// .screen, .chat, .msg). Those were missing at first, which left the hero phone falling back to
// the site's own .phone rule: every message rendered at once and the status bar ran together.
ok("the phone frame is styled", /\.cphone \.phone\{position:absolute;width:268px/.test(css))
ok("messages start hidden", /\.cphone \.msg\{[^}]*opacity:0/.test(css))
ok("and are revealed one at a time", /\.cphone \.msg\.show\{opacity:1/.test(css))
ok("the driver is what reveals them", /classList\.toggle\('show', v\)/.test(js))
// Scoping raised these to .cphone so they cannot reach the six other pages that use .phone.
ok("no bare .phone/.chat/.msg rule leaked in", !/(^|\n)\.(phone|chat|msg|status|island|screen|ctop|ccomp)\{/.test(css.slice(css.indexOf("══ Desktop app mockup"))))
ok("the site's own .phone component survives for the other pages", /(^|\n)\.phone\{--pw:280px/.test(css))
// Equal specificity after scoping, so source order is the only thing separating them.
ok("the phone's own override still beats the frame",
   css.indexOf(".cphone .phone{position:relative") > css.indexOf(".cphone .phone{position:absolute"))

// ── responsive rules must stay inside their media query ──────────────────────
// The extractor once matched innermost braces and could not see @media nesting, so it emitted
// the contents of @media (max-width:700px){ .pstage .appwin{display:none} } at the top level.
// The hero's desktop window was then hidden at EVERY width and the phone took the small-screen
// treatment on desktop. Both files were individually valid; only the nesting was wrong.
const mockCss = css.slice(css.indexOf("══ Desktop app mockup"))
const topLevel = mockCss.replace(/@media[^{]*\{(?:[^{}]|\{[^{}]*\})*\}/g, "")
ok("the window is not hidden at the top level", !/\.pstage \.appwin\{display:none\}/.test(topLevel))
ok("the phone is not re-centred at the top level", !/\.cphone\{position:relative;margin:0 auto/.test(topLevel))
ok("the small-screen rules exist, inside a media query", /@media \(max-width:700px\)/.test(mockCss))
ok("05 section 1: under 700px the window goes and the phone stays",
   /@media \(max-width:700px\)\{[^@]*\.pstage \.appwin\{display:none\}/.test(mockCss))

// ── mobile ───────────────────────────────────────────────────────────────────
// 09: no horizontal scroll at 360px. 03 section 4.9: under ~760px the app scrolls sideways with
// a hint, and never shrinks below 7px type. 05 section 1: under 700px the hero drops the window.
//
// The arithmetic rather than an eyeball: the root is 110em and font-size is clamp(7px, wrap/110,
// 11px), so the app is 110 x that. Below a 7px floor it stops shrinking and must scroll INSIDE
// .dkw, or it would push the page sideways instead.
const mock = css.slice(css.indexOf("══ Desktop app mockup"))
const appWidth = (vw) => 110 * Math.max(7, Math.min(11, Math.min(1180, vw - 40) / 110))
ok("the app fits without scrolling on a laptop", appWidth(1440) <= 1180)
ok("it stops shrinking at 7px type", appWidth(360) === 770, `${appWidth(360)}`)
ok("so below ~765px it must scroll inside its own box", appWidth(700) > 700 - 40)
ok("and .dkw is that box", /\.dkw\{[^}]*overflow-x:auto/.test(mock))
ok("with a container-type, or 100cqw has nothing to measure", /\.dkw\{[^}]*container-type:inline-size/.test(mock))
ok("the swipe hint appears exactly when it starts scrolling", /@media \(max-width:700px\)\{[^@]*\.scroll-hint\{display:block\}/.test(mock))
// The page itself must not scroll sideways. The hero's wordmark is nowrap at clamp(120px,22vw,300px),
// which is wider than a phone; the section clips it rather than letting it push the page out.
ok("the hero clips its oversized wordmark", /\.lit-hero\{[^}]*overflow:hidden/.test(css))
ok("nothing in the mockup is a fixed width wider than a phone",
   ![...mock.matchAll(/[^{}@]+\{([^{}]*)\}/g)].some((r) => {
     const w = (r[1].match(/(?:^|;)(?:min-)?width:(\d+)px/) || [])[1]
     return w && Number(w) > 360
   }))
// The tour keeps its window at every width (it scrolls); only the HERO drops one.
// Anchored, or ".pstage .appwin{display:none}" matches as a substring of itself.
ok("only the hero window is hidden on small screens",
   !/(^|[{},;])\.appwin\{display:none\}/.test(mock) && /\.pstage \.appwin\{display:none\}/.test(mock))

// ── nothing of my hand-rolled version survives ───────────────────────────────
for (const dead of ["class=\"lqa", "lqa-side", "hstage", "appwin-url", "data-app="])
  ok(`my rewrite is gone: ${dead}`, !html.includes(dead) && !css.includes(dead))

// ── it still cannot take the pricing code down ───────────────────────────────
ok("the mockup is its own file", /<script src="app-mockup\.js" defer><\/script>/.test(html))
ok("and loads after site.js", html.indexOf("site.js") < html.indexOf("app-mockup.js"))
ok("it does not reach into site.js internals", !/\bMKT\b|applyMarket|detectMarket/.test(js))

console.log(bad ? `\n${bad} FAILED` : "\nOK desktop app mockup matches the brief")
process.exit(bad ? 1 : 0)
