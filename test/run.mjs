/* Every check for this site, in one command:  node test/run.mjs
 *
 * The static suites read the files. The browser suite renders them in Chrome and measures the
 * result, because three separate bugs in this repo passed every static check while the page was
 * visibly broken. Run both.
 */
import { spawnSync } from "node:child_process"
import path from "node:path"

const HERE = import.meta.dirname
const suites = ["claims.test.mjs", "app-mockup.test.mjs", "browser.test.mjs"]
let failed = []

for (const s of suites) {
  console.log(`\n${"═".repeat(64)}\n  ${s}\n${"═".repeat(64)}`)
  const r = spawnSync(process.execPath, [path.join(HERE, s)], { stdio: "inherit" })
  if (r.status !== 0) failed.push(s)
}

console.log(`\n${"═".repeat(64)}`)
console.log(failed.length ? `FAILED: ${failed.join(", ")}` : `All suites pass.`)
process.exit(failed.length ? 1 : 0)
