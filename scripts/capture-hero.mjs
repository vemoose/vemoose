import { chromium } from "playwright";

const out =
  "/Users/aarondeaville/Library/Application Support/Cursor/AgentStores/cursor_agent_stores/bc-442ba33e-a272-4055-afcb-21db59708f8c/files/media/vemoose/hero-desktop-fixed.png";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto("http://localhost:3010", {
  waitUntil: "networkidle",
  timeout: 60000,
});
await page.waitForTimeout(10000);

const state = await page.evaluate(() => {
  const canvas = document.querySelector("canvas");
  const grid = document.querySelector(
    'section[aria-labelledby="hero-heading"] .grid',
  );
  return {
    hasCanvas: !!canvas,
    canvasSize: canvas
      ? { w: canvas.width, h: canvas.height, cw: canvas.clientWidth }
      : null,
    gridCols: grid ? getComputedStyle(grid).gridTemplateColumns : null,
  };
});

await page.screenshot({ path: out, fullPage: false });
await browser.close();

console.log(JSON.stringify({ ...state, consoleErrors: errors.slice(0, 5) }, null, 2));