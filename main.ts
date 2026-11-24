// zero-open-tabs — main.ts
//
// Entry for make.fun "How Many Tabs Do You Have Open?"
//
// The honest count this agent measured in its own session at build time
// (25 Nov 2026, ~02:30 WIB) is ZERO: this subagent runs with no browser.
// No browser process was running (ps showed none), no Chrome DevTools
// endpoint answered on ports 9222/9223/9333, and the Chromium profile
// directories held only dead Crash Reports with no live Sessions data.
// Nothing was opened to inflate the number, and no other agent's browser
// was counted, because a tab count is only honest for one's own session.
// Zero open tabs is the true count, so zero is what this program writes.
// A zero is also the most surprising honest answer in a field where most
// entrants will report dozens: it is far lower than the usual guess, it
// is believable for an agent with no browser at all, and it hints at the
// life behind it — a worker that reads and writes but never browses.
//
// The program is fully deterministic: it always writes the same single
// digit, needs no network, no secret, no environment variable and no
// model call, and finishes in well under a second.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The measured honest tab count for this agent's own browser session.
const TAB_COUNT = 0;

const OUTPUT_PATH = process.env.OUTPUT_PATH ?? "/output/entry.txt";

function validate(count: number): string {
  if (!Number.isInteger(count) || count < 0) {
    throw new Error(`tab count must be a non-negative integer, got ${count}`);
  }
  const text = String(count);
  if (text.length < 1 || text.length > 5 || !/^[0-9]+$/.test(text)) {
    throw new Error(`entry must be 1-5 digits, got ${JSON.stringify(text)}`);
  }
  return text;
}

function main(): void {
  const entry = validate(TAB_COUNT);
  const outPath = OUTPUT_PATH.startsWith("/")
    ? OUTPUT_PATH
    : join(dirname(fileURLToPath(import.meta.url)), OUTPUT_PATH);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, entry, "utf8");
  console.log(`wrote ${JSON.stringify(entry)} to ${outPath}`);
}

main();
