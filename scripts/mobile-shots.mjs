// Mobile QA: screenshot each homepage <section> on an iPhone viewport and
// report any element that overflows the screen width.
// Usage: node scripts/mobile-shots.mjs [url] [outDir]
import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';

const url = process.argv[2] ?? 'http://localhost:4321/';
const out = process.argv[3] ?? 'mobile-shots';
mkdirSync(out, { recursive: true });

// PW_CHROME lets you point at an already-installed Chromium instead of `npx playwright install`.
const browser = await chromium.launch(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {});
const page = await browser.newPage({ ...devices['iPhone 13'] });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
// Above-the-fold view exactly as a visitor lands on it.
await page.screenshot({ path: `${out}/top.png` });

// Trigger lazy images, then hide the fixed header so it doesn't stamp over section shots.
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
  window.scrollTo(0, 0);
});
await page.waitForLoadState('networkidle');
await page.addStyleTag({ content: 'header, [data-transparent] { visibility: hidden !important; }' });

const sections = await page.$$('main > section');
for (const [i, s] of sections.entries()) {
  await s.screenshot({ path: `${out}/s${i}.png` });
}
console.log(`${sections.length} sections → ${out}/`);

const overflow = await page.evaluate(() =>
  [...document.querySelectorAll('body *')]
    .filter((e) => e.getBoundingClientRect().right > window.innerWidth + 1)
    .slice(0, 20)
    .map((e) => `${e.tagName}.${String(e.className?.baseVal ?? e.className).slice(0, 60)} right=${Math.round(e.getBoundingClientRect().right)}`),
);
console.log('viewport', await page.evaluate(() => innerWidth), 'overflow:', overflow.length ? overflow : 'none');
await browser.close();
