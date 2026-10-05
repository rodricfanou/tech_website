import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const LOGO_FILE = resolve("public/logos/novaris-full-optimized.png");
const WIDTH = 1200;
const HEIGHT = 627;
const OUT_DIR = "public/og";

const CHROME_ARGS = [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--allow-file-access-from-files",
  "--force-device-scale-factor=1",
  "--virtual-time-budget=4000",
];

function render(html) {
  const tmp = mkdtempSync(join(tmpdir(), "og-render-"));
  const file = join(tmp, "page.html");
  writeFileSync(file, html);
  try {
    return execFileSync(
      CHROME,
      [...CHROME_ARGS, "--dump-dom", `file://${file}`],
      {
        encoding: "utf8",
        maxBuffer: 64 * 1024 * 1024,
        stdio: ["ignore", "pipe", "ignore"],
      },
    );
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

function report(dom) {
  const m = dom.match(/data-report="([^"]*)"/);
  if (!m) throw new Error("no data-report in dumped DOM");
  return JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&"));
}

let logoCache = null;

function trimmedLogo() {
  if (logoCache) return logoCache;
  const src = "file://" + LOGO_FILE;
  const dom = render(`<!DOCTYPE html><html><body><script>
const img = new Image();
img.onload = () => {
  const c = document.createElement("canvas");
  c.width = img.naturalWidth; c.height = img.naturalHeight;
  const g = c.getContext("2d");
  g.drawImage(img, 0, 0);
  const d = g.getImageData(0, 0, c.width, c.height).data;
  let x0 = c.width, y0 = c.height, x1 = -1, y1 = -1;
  for (let y = 0; y < c.height; y++) {
    for (let x = 0; x < c.width; x++) {
      if (d[(y * c.width + x) * 4 + 3] > 40) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) { document.body.setAttribute("data-report", JSON.stringify({ error: "no opaque pixels" })); return; }
  const w = x1 - x0 + 1, h = y1 - y0 + 1;
  const o = document.createElement("canvas");
  o.width = w; o.height = h;
  o.getContext("2d").drawImage(img, x0, y0, w, h, 0, 0, w, h);
  document.body.setAttribute("data-report", JSON.stringify({ source: [img.naturalWidth, img.naturalHeight], w, h, data: o.toDataURL("image/png") }));
};
img.onerror = () => document.body.setAttribute("data-report", JSON.stringify({ error: "load failed" }));
img.src = "${src}";
</script></body></html>`);
  const r = report(dom);
  if (r.error) throw new Error(`logo trim: ${r.error}`);
  console.log(`logo ${r.source.join("x")} -> trimmed ${r.w}x${r.h}`);
  logoCache = r.data;
  return logoCache;
}

const SHELL = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; }
  body {
    background: oklch(0.14 0.03 265);
    color: oklch(0.98 0.01 265);
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
    display: flex;
    position: relative;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
  }
  .glow {
    position: absolute;
    width: 900px; height: 900px;
    top: -420px; right: -260px;
    background: radial-gradient(circle, oklch(0.72 0.19 285 / 0.28) 0%, transparent 62%);
  }
  .glow-two {
    position: absolute;
    width: 760px; height: 760px;
    bottom: -420px; left: -220px;
    background: radial-gradient(circle, oklch(0.78 0.16 210 / 0.22) 0%, transparent 62%);
  }
  .layer {
    position: relative; z-index: 2;
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    justify-content: space-between;
    padding: 64px 72px;
  }
  .logo-row { display: flex; align-items: center; gap: 16px; }
  .logo { height: 40px; width: auto; display: block; }
  .brand { font-size: 25px; font-weight: 700; letter-spacing: 0.02em; color: oklch(0.96 0.01 265); }
  .eyebrow {
    font-size: 21px; font-weight: 700; letter-spacing: 0.16em;
    text-transform: uppercase; color: oklch(0.78 0.16 210);
  }
  h1 {
    font-size: 74px; line-height: 1.06; font-weight: 800; letter-spacing: -0.025em;
    background: linear-gradient(135deg, oklch(0.78 0.16 210), oklch(0.72 0.19 285));
    -webkit-background-clip: text; background-clip: text; color: transparent;
    max-width: 1010px;
  }
  h1.plain { background: none; -webkit-background-clip: border-box; background-clip: border-box; color: oklch(0.98 0.01 265); }
  .subhead { font-size: 27px; line-height: 1.45; color: oklch(0.74 0.02 265); max-width: 880px; font-weight: 400; }
  .footer { display: flex; align-items: center; justify-content: space-between; }
  .url { font-size: 22px; color: oklch(0.7 0.02 265); font-weight: 500; }
  .badge { font-size: 21px; font-weight: 700; color: oklch(0.78 0.16 210); letter-spacing: 0.04em; }
`;

function page({ eyebrow, headline, gradient, subhead, url, badge }) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><style>${SHELL}</style></head>
<body>
  <div class="glow"></div><div class="glow-two"></div>
  <div class="layer">
    <div class="logo-row">
      <img class="logo" src="${trimmedLogo()}" alt="">
      <span class="brand">Novaris Nexus Tech</span>
    </div>
    <div>
      ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ""}
      <h1${gradient === false ? ' class="plain"' : ""}>${headline}</h1>
    </div>
    <p class="subhead">${subhead}</p>
    <div class="footer"><span class="url">${url}</span>${badge ? `<span class="badge">${badge}</span>` : ""}</div>
  </div>
</body></html>`;
}

const IMAGES = [
  {
    file: "ai-audit.png",
    html: () =>
      page({
        eyebrow: "Free 5-minute AI audit",
        headline: "How many jobs are missed calls costing you?",
        subhead:
          "Answer a few questions and see where AI can cut repetitive work and recover lost opportunities in your business.",
        url: "novarisnexustech.com/ai-audit",
        badge: "AI Opportunity Summary",
      }),
  },
  {
    file: "default.png",
    html: () =>
      page({
        eyebrow: "Novaris Nexus Tech",
        headline: "AI consulting, advisory, speaking and training",
        gradient: false,
        subhead:
          "Helping organisations navigate AI, internet infrastructure and data systems at scale.",
        url: "novarisnexustech.com",
      }),
  },
];

mkdirSync(OUT_DIR, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), "og-"));

try {
  for (const { file, html } of IMAGES) {
    const source = join(tmp, file.replace(".png", ".html"));
    const out = resolve(OUT_DIR, file);
    writeFileSync(source, html());
    execFileSync(
      CHROME,
      [
        ...CHROME_ARGS,
        `--window-size=${WIDTH},${HEIGHT}`,
        `--screenshot=${out}`,
        `file://${source}`,
      ],
      { stdio: "ignore" },
    );
    const info = execFileSync(
      "sips",
      ["-g", "pixelWidth", "-g", "pixelHeight", out],
      { encoding: "utf8" },
    );
    const w = info.match(/pixelWidth: (\d+)/)?.[1];
    const h = info.match(/pixelHeight: (\d+)/)?.[1];
    if (w !== String(WIDTH) || h !== String(HEIGHT)) {
      throw new Error(
        `${file} rendered ${w}x${h}, expected ${WIDTH}x${HEIGHT}`,
      );
    }
    console.log(`ok  ${file}  ${w}x${h}`);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
