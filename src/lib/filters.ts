/**
 * Formatação e filtros do estoque. Sem dados aqui: pode ser importado por
 * componentes de cliente sem levar o JSON do estoque junto.
 */

export type Slim = {
  id: string;
  slug: string;
  brand: string;
  brandKey: string;
  model: string;
  version: string;
  price: number;
  yearModel: number;
  km: number;
  body: string | null;
  fuel: string;
  transmission: string;
  color: string;
};

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const brl = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);

export const num = (v: number) => new Intl.NumberFormat("pt-BR").format(v);

export const kmFmt = (v: number) => `${num(v)} km`;

export type Filters = {
  q?: string;
  marca?: string;
  modelo?: string;
  preco?: PriceKey;
  ano?: number;
  carroceria?: string;
  combustivel?: string;
  cambio?: string;
  km?: number;
  ordem?: SortKey;
};

export const PRICES = {
  "ate-150": { label: "Até R$ 150 mil", min: 0, max: 150_000 },
  "150-300": { label: "R$ 150 a 300 mil", min: 150_000, max: 300_000 },
  "300-600": { label: "R$ 300 a 600 mil", min: 300_000, max: 600_000 },
  "600-1000": { label: "R$ 600 mil a 1 mi", min: 600_000, max: 1_000_000 },
  "acima-1000": { label: "Acima de R$ 1 mi", min: 1_000_000, max: Infinity },
} as const;
export type PriceKey = keyof typeof PRICES;

export const SORTS = {
  destaque: "Maior valor",
  "menor-preco": "Menor valor",
  "mais-novo": "Mais novos",
  "menor-km": "Menor quilometragem",
} as const;
export type SortKey = keyof typeof SORTS;

export const KM_STEPS = [10_000, 30_000, 50_000, 80_000];
export const YEARS_FROM = [2026, 2025, 2024, 2023, 2022, 2020];

export function parseFilters(sp: URLSearchParams): Filters {
  const str = (k: string) => sp.get(k) || undefined;
  const int = (k: string) => {
    const v = Number(sp.get(k));
    return Number.isFinite(v) && v > 0 ? v : undefined;
  };
  const preco = str("preco");
  const ordem = str("ordem");
  return {
    q: str("q"),
    marca: str("marca"),
    modelo: str("modelo"),
    preco: preco && preco in PRICES ? (preco as PriceKey) : undefined,
    ano: int("ano"),
    carroceria: str("carroceria"),
    combustivel: str("combustivel"),
    cambio: str("cambio"),
    km: int("km"),
    ordem: ordem && ordem in SORTS ? (ordem as SortKey) : undefined,
  };
}

export function toSearch(f: Filters) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(f)) if (v !== undefined && v !== "" && v !== null) sp.set(k, String(v));
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/** Aplica os filtros. `except` ignora um filtro (para contar opções da própria lista). */
export function filterCars<T extends Slim>(f: Filters, list: T[], except?: keyof Filters): T[] {
  const on = (k: keyof Filters) => k !== except && f[k] !== undefined;
  const q = on("q") ? slugify(f.q!) : "";
  const range = on("preco") ? PRICES[f.preco!] : null;
  const out = list.filter(
    (c) =>
      (!q || slugify(`${c.brand} ${c.model} ${c.version} ${c.yearModel} ${c.color} ${c.body ?? ""}`).includes(q)) &&
      (!on("marca") || c.brandKey === f.marca) &&
      (!on("modelo") || c.model === f.modelo) &&
      (!range || (c.price >= range.min && c.price < range.max)) &&
      (!on("ano") || c.yearModel >= f.ano!) &&
      (!on("carroceria") || c.body === f.carroceria) &&
      (!on("combustivel") || c.fuel === f.combustivel) &&
      (!on("cambio") || c.transmission === f.cambio) &&
      (!on("km") || c.km <= f.km!),
  );
  const sorters: Record<SortKey, (a: T, b: T) => number> = {
    destaque: (a, b) => b.price - a.price,
    "menor-preco": (a, b) => a.price - b.price,
    "mais-novo": (a, b) => b.yearModel - a.yearModel || a.km - b.km,
    "menor-km": (a, b) => a.km - b.km,
  };
  return out.sort(sorters[f.ordem ?? "destaque"]);
}

/** Valores distintos de um campo, com a contagem respeitando os demais filtros. */
export function facet<T extends Slim>(list: T[], f: Filters, filterKey: keyof Filters, pick: (c: T) => string | null) {
  const pool = filterCars(f, list, filterKey);
  const counts = new Map<string, number>();
  for (const c of pool) {
    const v = pick(c);
    if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return counts;
}
