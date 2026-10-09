// Gera favicon, apple-icon, imagem de compartilhamento e a logo em SVG a partir dos vetores da marca.
// Uso: node scripts/brand-assets.mjs
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const src = readFileSync(new URL("../src/components/brand/Logo.tsx", import.meta.url), "utf8");
const grab = (name) => {
  const start = src.indexOf(`export const ${name} = [`);
  const body = src.slice(src.indexOf("[", start), src.indexOf("];", start) + 1);
  return JSON.parse(body.replace(/,\s*\]$/, "]"));
};
const MONO = grab("MONO_PATHS");
const WORD = grab("WORD_PATHS");
const grad = `<linearGradient id="c" gradientUnits="userSpaceOnUse" x1="200" y1="0" x2="3700" y2="1200"><stop offset="0" stop-color="#f4f5f7"/><stop offset=".28" stop-color="#a4a8ae"/><stop offset=".5" stop-color="#f1f2f4"/><stop offset=".74" stop-color="#868a91"/><stop offset="1" stop-color="#dadce0"/></linearGradient>`;
const paths = (list, fill) => `<g fill="${fill}">${list.map((d) => `<path d="${d}"/>`).join("")}</g>`;
const INK = "#0c0d0f";

// logo completa (fundo transparente), cromada e branca
const full = (fill, defs = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="25 20 3933 1147">${defs ? `<defs>${defs}</defs>` : ""}${paths([...MONO, ...WORD], fill)}</svg>`;
writeFileSync(new URL("../public/brand/lm-select-cars-cromada.svg", import.meta.url), full("url(#c)", grad));
writeFileSync(new URL("../public/brand/lm-select-cars-branca.svg", import.meta.url), full("#f2f3f5"));
writeFileSync(new URL("../public/brand/lm-select-cars-preta.svg", import.meta.url), full("#0c0d0f"));

// ícone: monograma centralizado num quadrado grafite
const icon = (size) => {
  const pad = 1847 * 0.22;
  const w = 1847 + pad * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${1064 - pad} ${20 + 302.5 - w / 2} ${w} ${w}"><defs>${grad}</defs><rect x="${1064 - pad}" y="${20 + 302.5 - w / 2}" width="${w}" height="${w}" fill="${INK}"/>${paths(MONO, "url(#c)")}</svg>`;
};
writeFileSync(new URL("../src/app/icon.svg", import.meta.url), icon(64));
await sharp(Buffer.from(icon(180))).png().toFile(new URL("../src/app/apple-icon.png", import.meta.url).pathname.slice(1));

// compartilhamento 1200x630: foto do 911 GTS escurecida + logo
const stock = JSON.parse(readFileSync(new URL("../src/data/stock.json", import.meta.url), "utf8"));
const gts = stock.find((c) => c.id === "8512374");
const photo = Buffer.from(await (await fetch(gts.photos[1].src)).arrayBuffer());
const base = await sharp(photo).resize(1200, 630, { fit: "cover", position: "centre" }).modulate({ brightness: 0.55 }).toBuffer();
const shade = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${INK}" stop-opacity=".2"/><stop offset="1" stop-color="${INK}" stop-opacity=".9"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/></svg>`);
const logo = await sharp(Buffer.from(full("url(#c)", grad))).resize({ width: 520 }).png().toBuffer();
const meta = await sharp(logo).metadata();
await sharp(base)
  .composite([
    { input: shade },
    { input: logo, left: Math.round((1200 - meta.width) / 2), top: Math.round((630 - meta.height) / 2) },
  ])
  .jpeg({ quality: 86 })
  .toFile(new URL("../src/app/opengraph-image.jpg", import.meta.url).pathname.slice(1));
console.log("ok");
