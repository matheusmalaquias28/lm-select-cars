// Atualiza o estoque a partir do site atual (Revenda Mais).
// Uso: node scripts/scrape-stock.mjs   (grava src/data/stock.json)
import { writeFileSync } from "node:fs";
import sharp from "sharp";

const BASE = "https://www.lmselectcars.com.br";
const OUT = new URL("../src/data/stock.json", import.meta.url);
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36";

const latin1 = new TextDecoder("latin1");
const get = async (path) => {
  const res = await fetch(BASE + path, { headers: { "user-agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return latin1.decode(await res.arrayBuffer());
};

const decode = (s) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&([a-z])(acute|grave|circ|tilde|cedil|uml);/gi, (_, l, a) =>
      (l + { acute: "́", grave: "̀", circ: "̂", tilde: "̃", cedil: "̧", uml: "̈" }[a]).normalize("NFC"),
    )
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));

const strip = (s) => decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const idOf = (href) => href.match(/-(\d+)\.html$/)[1];

/** Lista paginada é cumulativa: a página N traz os N*20 primeiros. */
async function listIds(filter = "") {
  let prev = -1;
  let ids = new Map();
  for (let page = 1; page < 30; page++) {
    const html = await get(`/multipla/ajaxlistPaged${filter}/page/${page}`);
    ids = new Map(
      [...html.matchAll(/href="(\/(?:carros|motos)\/[^"]+\.html)"/g)].map((m) => [idOf(m[1]), { href: m[1], html }]),
    );
    if (ids.size === prev) break;
    prev = ids.size;
  }
  return ids;
}

const all = await listIds();
console.log("veículos:", all.size);

// Câmbio vem do card da listagem
const listing = [...all.values()][0].html;
const transmissionOf = (id) => {
  const i = listing.indexOf(`-${id}.html" title=`);
  const block = listing.slice(i, i + 6000);
  return strip(block.match(/grey-text10">([^<]+)</)?.[1] ?? "");
};

// Carroceria vem do filtro da própria plataforma
const bodyOf = new Map();
for (const body of ["caminhonete", "conversivel", "coupe", "hatch", "sedan", "suv"]) {
  for (const id of (await listIds(`/carroceria/${body}`)).keys()) bodyOf.set(id, body);
}

async function photoMeta(src) {
  const tiny = Buffer.from(await (await fetch(src.replace("_O_", "_P_"))).arrayBuffer());
  const { width, height } = await sharp(tiny).metadata();
  return { src, w: width, h: height };
}

async function blur(src) {
  const buf = Buffer.from(await (await fetch(src.replace("_O_", "_P_"))).arrayBuffer());
  const out = await sharp(buf).resize(24).blur(1.2).jpeg({ quality: 50 }).toBuffer();
  return `data:image/jpeg;base64,${out.toString("base64")}`;
}

const cars = [];
for (const [id, { href }] of all) {
  const html = await get(href);
  const pick = (re) => strip(html.match(re)?.[1] ?? "");

  const facts = {};
  for (const m of html.matchAll(/<li class="collection-header">\s*([^<]+?)<br\/>\s*<strong[^>]*>([^<]*)<\/strong>/g)) {
    facts[strip(m[1]).toLowerCase()] = strip(m[2]);
  }

  // Galeria principal: termina antes dos relacionados
  const main = html.split("section-relacionados")[0];
  const photos = [
    ...new Set([...main.matchAll(/data-src="(https:\/\/[^"]+?_G_[^"]+?\.jpe?g)"/g)].map((m) => m[1].replace("_G_", "_O_"))),
  ];

  const optBlock = html.match(/veiculo-opcionais[\s\S]*?<div class="interno">([\s\S]*?)<\/span>/)?.[1] ?? "";
  const options = [...optBlock.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => strip(m[1])).filter(Boolean);

  const detailsRaw = html.match(/Detalhes do Ve&iacute;culo<\/h3>\s*<div class="interno">([\s\S]*?)<\/div>/)?.[1] ?? "";
  const details = decode(detailsRaw.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, ""))
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim());

  const [yearFab, yearModel] = (facts["ano"] ?? "").split("/").map(Number);
  const meta = [];
  for (let i = 0; i < photos.length; i += 8) {
    meta.push(...(await Promise.all(photos.slice(i, i + 8).map(photoMeta))));
  }

  cars.push({
    id,
    sourceUrl: BASE + href,
    type: href.startsWith("/motos/") ? "moto" : "carro",
    brand: pick(/<span class="marca">([\s\S]*?)<\/span>/),
    model: pick(/<span class="modelo-first-name">([\s\S]*?)<\/span>/),
    version: pick(/<span class="modelo-last-name">([\s\S]*?)<\/span>/),
    yearFab,
    yearModel,
    km: Number((facts["km"] ?? "0").replace(/\D/g, "")),
    price: Number(pick(/id="valor_veic">([^<]+)</).replace(/\./g, "").replace(",", ".")) || 0,
    fuel: facts["comb."] ?? "",
    color: facts["cor"] ?? "",
    transmission: transmissionOf(id),
    body: bodyOf.get(id) ?? null,
    options,
    details,
    cover: meta[0] ? await blur(meta[0].src) : null,
    photos: meta,
  });
  console.log(id, cars.at(-1).brand, cars.at(-1).model, meta.length, "fotos");
}

writeFileSync(OUT, JSON.stringify(cars, null, 2));
console.log("ok:", cars.length);
