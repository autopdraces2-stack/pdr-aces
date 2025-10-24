// scripts/prefix-paths.js
import { promises as fs } from "node:fs";
import { join } from "node:path";

const OUT_DIR = "out";
const PREFIX = "/pdr-aces"; // repo name

const exts = [".html", ".css"];

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      await walk(p);
    } else if (exts.some((ext) => e.name.endsWith(ext))) {
      let txt = await fs.readFile(p, "utf8");

      // 1) src/href="/..."  →  src/href="/pdr-aces/..."
      txt = txt.replace(/(src|href)=["']\/(?!pdr-aces\/)/g, `$1="${PREFIX}/`);

      // 2) url(/...) in CSS  →  url(/pdr-aces/...)
      txt = txt.replace(/url\(\s*\/(?!pdr-aces\/)/g, `url(${PREFIX}/`);

      await fs.writeFile(p, txt);
    }
  }
}
await walk(OUT_DIR);
console.log("Prefixed asset paths with", PREFIX);
