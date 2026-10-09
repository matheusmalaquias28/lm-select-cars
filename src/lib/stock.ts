import raw from "@/data/stock.json";
import { NAMES } from "@/data/names";
import { brl, kmFmt, slugify, type Slim } from "@/lib/filters";

export { brl, kmFmt, num } from "@/lib/filters";

type RawCar = (typeof raw)[number];

export type Photo = { src: string; w: number; h: number };

export type Car = {
  id: string;
  slug: string;
  sourceUrl: string;
  isMoto: boolean;
  brand: string;
  brandKey: string;
  model: string;
  version: string;
  title: string;
  yearFab: number;
  yearModel: number;
  year: string;
  km: number;
  price: number;
  fuel: string;
  color: string;
  transmission: string;
  body: string | null;
  headline: string | null;
  highlights: string[];
  items: string[];
  about: string[];
  power: string | null;
  accel: string | null;
  torque: string | null;
  range: string | null;
  badges: string[];
  cover: string | null;
  photos: Photo[];
};

/* ---------- nomes ---------- */

const BRAND_NAMES: Record<string, string> = {
  BMW: "BMW",
  BYD: "BYD",
  "CAOA CHERY": "Caoa Chery",
  KIA: "Kia",
  MINI: "MINI",
  RAM: "RAM",
  "MERCEDES-BENZ": "Mercedes-Benz",
};

const BODY_NAMES: Record<string, string> = {
  suv: "SUV",
  sedan: "Sedã",
  coupe: "Cupê",
  hatch: "Hatch",
  caminhonete: "Picape",
  conversivel: "Conversível",
  moto: "Moto",
};

// Carroceria que a plataforma deixou em branco (ou classificou de forma estranha)
const BODY_FIX: Record<string, string> = {
  "8553431": "suv",
  "8359320": "sedan",
  "8447034": "caminhonete",
  "8525636": "suv",
  "8452607": "suv",
  "8498269": "sedan",
  "7537789": "sedan",
  "8550171": "suv",
  "8533216": "caminhonete",
  "7842675": "suv",
  "8509566": "sedan",
  "8527157": "sedan",
  "8459799": "sedan",
  "8009372": "suv",
  "8509966": "sedan",
  "8390766": "suv",
  "8544398": "moto",
};

const ACRONYMS = new Set(["PPF", "LED", "HD", "AMG", "BMW", "GT", "GTS", "PDK", "PDK8", "BOSE", "MBUX", "TFSI", "SUV", "ABS", "4MATIC", "PCM", "PDLS", "LM", "EV", "HUD", "USB", "ACC", "TGDI", "IPVA"]);

const titleCase = (s: string) =>
  s
    .toLowerCase()
    .split(" ")
    .map((w) => (/\d/.test(w) && w.length <= 4 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");

/** Linhas em CAIXA ALTA viram frase normal, preservando siglas. */
function calm(line: string) {
  const letters = line.replace(/[^A-Za-zÀ-ÿ]/g, "");
  if (letters.length < 4 || letters !== letters.toUpperCase()) return line;
  const lower = line
    .toLowerCase()
    .split(" ")
    .map((w) => (ACRONYMS.has(w.replace(/[^\w]/g, "").toUpperCase()) ? w.toUpperCase() : w))
    .join(" ");
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/* ---------- descrição do anúncio ---------- */

const BOILERPLATE = [
  /selecionado,? com procedência/i,
  /^aceitamos/i,
  /financiamento facilitado/i,
  /cartão de crédito/i,
  /veículos com garantia/i,
  /condição para pagamento/i,
  /entre em contato/i,
  /\(\d{2}\)\s?\d{4,5}-?\d{4}/,
  /instagram/i,
  /^endereço/i,
  /^principais itens/i,
  /disponível para pronta entrega/i,
];

function parseDetails(lines: string[]) {
  const clean = lines
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .filter((l) => !BOILERPLATE.some((re) => re.test(l)));

  const text = clean.join(" ");
  // maior potência citada (elétricos listam cada motor e depois o total)
  const powers = [...text.matchAll(/(\d{2,4})\s?cv\b/gi)].map((m) => Number(m[1]));
  const power = powers.length ? Math.max(...powers) : null;
  const range = text.match(/autonomia\s*(?:de\s*)?([\d.]+)\s?km/i)?.[1];
  const accel = text.match(/0\s?(?:a|à)\s?100\s?km\/h\s?em\s?(?:apenas\s)?(\d+[,.]?\d*)\s?s/i)?.[1];
  const torque = text.match(/(\d{1,3}[,.]?\d?)\s?kgfm/i)?.[1];

  let headline: string | null = null;
  const highlights: string[] = [];
  const items: string[] = [];
  const about: string[] = [];
  const seen = new Set<string>();

  for (const [i, original] of clean.entries()) {
    let line = original.replace(/^pra venda:\s*/i, "").replace(/^\s*[-*•]\s*/, "");
    line = calm(line).replace(/!+$/, "").trim();
    const key = slugify(line);
    if (!line || seen.has(key)) continue;
    seen.add(key);

    // Quilometragem e potência soltas já aparecem na ficha técnica
    if (/^(\d{4}\s)?[\d.]+\s?km$/i.test(line) || /^\d{2,4}\s?cv$/i.test(line) || /^apenas [\d.,]+\s?km/i.test(line)) continue;
    if (/^[\d.]+\s?km\b/i.test(line) && line.length < 14) continue;

    if (i === 0 && !/^[-*]/.test(original) && line.length < 80) {
      headline = line.replace(/\s+-\s+(\d{4})$/, " $1");
      continue;
    }
    if (line.length > 90) about.push(line);
    else if (/^[-*•]/.test(original.trim()) || /(único dono|impecável|garantia|revis|abaixo do 0km|oportunidade|no plástico|praticamente zero)/i.test(line))
      highlights.push(line);
    else items.push(line);
  }

  return {
    headline,
    highlights: highlights.slice(0, 8),
    items,
    about,
    power: power ? `${power} cv` : null,
    range: range ? `${range} km` : null,
    accel: accel ? `${accel.replace(".", ",")} s` : null,
    torque: torque ? `${torque.replace(".", ",")} kgfm` : null,
  };
}

function fuelOf(car: RawCar, name: string) {
  if (/elétric/i.test(name) || /elétrico/i.test(car.fuel)) return "Elétrico";
  if (/hybrid|híbrid|\bdm\b|dm-i|50e/i.test(name)) return "Híbrido";
  if (car.fuel === "OUTROS") return "Outros";
  return titleCase(car.fuel);
}

function badgesOf(car: RawCar, text: string) {
  const b: string[] = [];
  if (car.km <= 1500) b.push("Praticamente 0 km");
  if (/único dono/i.test(text)) b.push("Único dono");
  if (/garantia de fábrica|garantia toyota|garantia .*até 20\d\d/i.test(text)) b.push("Garantia de fábrica");
  if (car.yearModel < 1990) b.push("Clássico");
  return b.slice(0, 2);
}

function build(car: RawCar): Omit<Car, "slug"> {
  const names = NAMES[car.id];
  const brand = BRAND_NAMES[car.brand] ?? titleCase(car.brand);
  const model = names?.model ?? titleCase(car.model);
  const version = names?.version ?? titleCase(car.version);
  const parsed = parseDetails(car.details);
  const bodyKey = BODY_FIX[car.id] ?? car.body ?? (car.type === "moto" ? "moto" : null);
  const text = car.details.join(" ");

  return {
    id: car.id,
    sourceUrl: car.sourceUrl,
    isMoto: car.type === "moto",
    brand,
    brandKey: slugify(brand),
    model,
    version,
    title: `${brand} ${model}`,
    yearFab: car.yearFab,
    yearModel: car.yearModel,
    year: `${car.yearFab}/${car.yearModel}`,
    km: car.km,
    price: car.price,
    fuel: fuelOf(car, `${model} ${version}`),
    color: titleCase(car.color),
    transmission: car.transmission,
    body: bodyKey ? BODY_NAMES[bodyKey] : null,
    ...parsed,
    power: parsed.power ?? (version.match(/(\d{2,4})\s?cv/i) ? `${version.match(/(\d{2,4})\s?cv/i)![1]} cv` : null),
    badges: badgesOf(car, text),
    cover: car.cover,
    // "?o=p" avisa o loader de imagem que a foto é vertical
    photos: (car.photos as Photo[]).map((p) => ({ ...p, src: p.h > p.w ? `${p.src}?o=p` : p.src })),
  };
}

function withSlugs(list: Omit<Car, "slug">[]): Car[] {
  const seen = new Map<string, number>();
  return list.map((c) => {
    let slug = slugify(`${c.brand} ${c.model} ${c.version} ${c.yearModel}`);
    const n = seen.get(slug) ?? 0;
    seen.set(slug, n + 1);
    if (n > 0) slug = `${slug}-${c.id}`;
    return { ...c, slug };
  });
}

/** Estoque ordenado do mais valioso para o mais acessível. */
export const cars: Car[] = withSlugs(raw.map(build)).sort((a, b) => b.price - a.price);

export const getCar = (slug: string) => cars.find((c) => c.slug === slug);
const byId = (id: string) => cars.find((c) => c.id === id);

/** Slides da hero: carro + foto escolhida a dedo (índice na galeria). */
export const heroSlides = [
  { id: "8512374", photo: 1, mobilePhoto: 1, focus: "50% 60%" },
  { id: "7537789", photo: 0, mobilePhoto: 0, focus: "50% 62%" },
  { id: "6926385", photo: 7, mobilePhoto: 0, focus: "50% 64%" },
  { id: "8550171", photo: 1, mobilePhoto: 0, focus: "50% 62%" },
]
  .map((s) => {
    const car = byId(s.id);
    return car ? { car, image: car.photos[s.photo] ?? car.photos[0], mobile: car.photos[s.mobilePhoto] ?? car.photos[0], focus: s.focus } : null;
  })
  .filter((s) => s !== null);

/** Vitrine da home: um de cada perfil, do esportivo ao utilitário. */
export const featured = ["8512374", "7537789", "6926385", "8550171", "8295864", "8515300", "8359320", "8475828"]
  .map(byId)
  .filter((c): c is Car => Boolean(c));

export const spotlight = byId("7537789") ?? cars[0];

export const brands = Object.values(
  cars.reduce<Record<string, { name: string; key: string; count: number }>>((acc, c) => {
    acc[c.brandKey] ??= { name: c.brand, key: c.brandKey, count: 0 };
    acc[c.brandKey].count++;
    return acc;
  }, {}),
).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

export function similarCars(car: Car, n = 4) {
  return cars
    .filter((c) => c.id !== car.id && c.isMoto === car.isMoto)
    .map((c) => ({ c, score: (c.brandKey === car.brandKey ? -0.35 : 0) + (c.body === car.body ? -0.15 : 0) + Math.abs(Math.log(c.price / car.price)) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, n)
    .map((x) => x.c);
}

/* ---------- listas para filtros ---------- */

export const bodies = [...new Set(cars.map((c) => c.body).filter((b): b is string => Boolean(b)))].sort();
export const fuels = [...new Set(cars.map((c) => c.fuel))].sort();
export const transmissions = [...new Set(cars.map((c) => c.transmission))].sort();

/** Versão enxuta para componentes de cliente (busca, filtros). */
export const slim: Slim[] = cars.map((c) => ({
  id: c.id,
  slug: c.slug,
  brand: c.brand,
  brandKey: c.brandKey,
  model: c.model,
  version: c.version,
  price: c.price,
  yearModel: c.yearModel,
  km: c.km,
  body: c.body,
  fuel: c.fuel,
  transmission: c.transmission,
  color: c.color,
}));

export function carWhatsappText(c: Car, url: string) {
  return `Olá! Tenho interesse no ${c.title} ${c.version} ${c.year}, ${kmFmt(c.km)}, anunciado por ${brl(c.price)}. ${url}`;
}
