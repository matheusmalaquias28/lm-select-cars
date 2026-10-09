"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Close, Search, Sliders, WhatsApp } from "@/components/Icons";
import { Select } from "@/components/ui/Select";
import { lockScroll } from "@/lib/scroll";
import { whatsappLink } from "@/lib/site";
import {
  facet,
  filterCars,
  KM_STEPS,
  num,
  parseFilters,
  PRICES,
  SORTS,
  toSearch,
  YEARS_FROM,
  type Filters,
  type PriceKey,
  type Slim,
  type SortKey,
} from "@/lib/filters";

type Props = {
  list: Slim[];
  cards: Record<string, ReactNode>;
  brands: { name: string; key: string; count: number }[];
};

const priceOf = (c: Slim) => (Object.keys(PRICES) as PriceKey[]).find((k) => c.price >= PRICES[k].min && c.price < PRICES[k].max) ?? null;

export function StockExplorer({ list, cards, brands }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const f = useMemo(() => parseFilters(new URLSearchParams(sp.toString())), [sp]);
  const result = useMemo(() => filterCars(f, list), [f, list]);
  const [sheet, setSheet] = useState(false);
  const [q, setQ] = useState(f.q ?? "");

  const set = useCallback(
    (patch: Partial<Filters>) => {
      const next = { ...parseFilters(new URLSearchParams(window.location.search)), ...patch };
      router.replace(`${pathname}${toSearch(next)}`, { scroll: false });
    },
    [router, pathname],
  );
  const clear = () => {
    setQ("");
    router.replace(pathname, { scroll: false });
  };

  // busca por texto com pequeno atraso
  useEffect(() => {
    if ((f.q ?? "") === q) return;
    const t = window.setTimeout(() => set({ q: q || undefined }), 280);
    return () => window.clearTimeout(t);
  }, [q, f.q, set]);

  useEffect(() => {
    lockScroll(sheet);
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheet(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheet]);

  const counts = {
    marca: facet(list, f, "marca", (c) => c.brandKey),
    modelo: facet(list, f, "modelo", (c) => c.model),
    preco: facet(list, f, "preco", priceOf),
    carroceria: facet(list, f, "carroceria", (c) => c.body),
    combustivel: facet(list, f, "combustivel", (c) => c.fuel),
    cambio: facet(list, f, "cambio", (c) => c.transmission),
  };
  const opts = (m: Map<string, number>, label = (v: string) => v) =>
    [...m.keys()].sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true })).map((v) => ({ value: v, label: label(v), hint: String(m.get(v)) }));

  const brandName = (k: string) => brands.find((b) => b.key === k)?.name ?? k;
  const chipLabels: Partial<Record<keyof Filters, string>> = {
    q: f.q && `“${f.q}”`,
    marca: f.marca && brandName(f.marca),
    modelo: f.modelo,
    preco: f.preco && PRICES[f.preco].label,
    ano: f.ano ? `${f.ano} em diante` : undefined,
    carroceria: f.carroceria,
    combustivel: f.combustivel,
    cambio: f.cambio,
    km: f.km ? `Até ${num(f.km)} km` : undefined,
  };
  const chips = (Object.keys(chipLabels) as (keyof Filters)[])
    .filter((k) => chipLabels[k])
    .map((k) => ({ key: k, label: chipLabels[k]! }));

  const fields = (
    <>
      <Select label="Marca" placeholder="Todas" value={f.marca} onChange={(v) => set({ marca: v, modelo: undefined })} options={brands.map((b) => ({ value: b.key, label: b.name, hint: String(counts.marca.get(b.key) ?? 0), disabled: !counts.marca.get(b.key) }))} />
      <Select label="Modelo" placeholder="Todos" value={f.modelo} onChange={(v) => set({ modelo: v })} options={opts(counts.modelo)} />
      <Select
        label="Preço"
        placeholder="Qualquer valor"
        value={f.preco}
        onChange={(v) => set({ preco: v as PriceKey | undefined })}
        options={(Object.keys(PRICES) as PriceKey[]).map((k) => ({ value: k, label: PRICES[k].label, hint: String(counts.preco.get(k) ?? 0), disabled: !counts.preco.get(k) }))}
      />
      <Select label="Ano" placeholder="Qualquer ano" value={f.ano ? String(f.ano) : undefined} onChange={(v) => set({ ano: v ? Number(v) : undefined })} options={YEARS_FROM.map((y) => ({ value: String(y), label: `${y} em diante` }))} />
      <Select label="Carroceria" placeholder="Todas" value={f.carroceria} onChange={(v) => set({ carroceria: v })} options={opts(counts.carroceria)} />
      <Select label="Combustível" placeholder="Todos" value={f.combustivel} onChange={(v) => set({ combustivel: v })} options={opts(counts.combustivel)} />
      <Select label="Câmbio" placeholder="Todos" value={f.cambio} onChange={(v) => set({ cambio: v })} options={opts(counts.cambio)} />
      <Select label="Km" placeholder="Qualquer" value={f.km ? String(f.km) : undefined} onChange={(v) => set({ km: v ? Number(v) : undefined })} options={KM_STEPS.map((k) => ({ value: String(k), label: `Até ${num(k)} km` }))} align="right" />
    </>
  );

  return (
    <div data-sticky-cta>
      {/* barra de filtros (desktop) */}
      <div className="hidden border-b border-line lg:block">
        <div className="grid grid-cols-[minmax(15rem,1.3fr)_repeat(4,minmax(0,1fr))] gap-px bg-line 2xl:grid-cols-[minmax(15rem,1.4fr)_repeat(8,minmax(0,1fr))] [&>*]:min-h-[5.25rem] [&>*]:bg-ink [&>*]:px-6">
          <label className="row-span-2 flex items-center gap-3 pl-(--gutter)! 2xl:row-span-1">
            <Search className="size-4 shrink-0 text-mute" />
            <span className="sr-only">Buscar no estoque</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar marca, modelo, cor"
              className="w-full bg-transparent text-[15px] text-bone outline-none placeholder:text-faint"
            />
          </label>
          {fields}
        </div>
      </div>

      {/* resumo + ordenação */}
      <div className="wrap flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-b border-line py-5">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <p className="font-semiwide text-lg tabular" aria-live="polite">
            {result.length} <span className="text-mute">{result.length === 1 ? "veículo" : "veículos"}</span>
          </p>
          {chips.length > 0 && (
            <ul className="flex flex-wrap items-center gap-2">
              {chips.map((c) => (
                <li key={c.key}>
                  <button
                    type="button"
                    onClick={() => {
                      if (c.key === "q") setQ("");
                      set({ [c.key]: undefined, ...(c.key === "marca" ? { modelo: undefined } : {}) });
                    }}
                    className="flex h-8 items-center gap-2 border border-line-strong pr-2.5 pl-3 text-[13px] text-bone-2 transition-colors hover:border-chrome hover:text-bone"
                  >
                    {c.label}
                    <Close className="size-3.5" aria-label="remover" />
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={clear} className="eyebrow hairline-hover ml-2 pb-0.5 text-mute hover:text-bone">
                  Limpar
                </button>
              </li>
            </ul>
          )}
        </div>
        <Select
          variant="inline"
          align="right"
          label="Ordenar por"
          placeholder={SORTS.destaque}
          value={f.ordem && f.ordem !== "destaque" ? f.ordem : undefined}
          onChange={(v) => set({ ordem: v as SortKey | undefined })}
          options={(Object.keys(SORTS) as SortKey[]).filter((k) => k !== "destaque").map((k) => ({ value: k, label: SORTS[k] }))}
          className="hidden lg:block"
        />
      </div>

      {/* grade */}
      <div className="wrap py-10 md:py-14">
        {result.length > 0 ? (
          <ul className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 2xl:gap-x-6">
            {result.map((c) => (
              <li key={c.id}>{cards[c.id]}</li>
            ))}
          </ul>
        ) : (
          <div className="mx-auto max-w-xl py-20 text-center">
            <p className="font-wide text-2xl font-light uppercase">Nada por aqui</p>
            <p className="mt-4 leading-relaxed text-mute">
              Nenhum veículo do estoque atual combina com esses filtros. Conte o que você procura e avisamos quando chegar.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={clear} className="h-12 border border-line-strong px-6 transition-colors hover:border-chrome">
                <span className="eyebrow">Limpar filtros</span>
              </button>
              <a
                href={whatsappLink(`Olá! Estou procurando um veículo e não encontrei no estoque do site.${f.marca ? ` Marca: ${brandName(f.marca)}.` : ""}${f.preco ? ` Faixa: ${PRICES[f.preco].label}.` : ""}`)}
                target="_blank"
                rel="noopener"
                className="flex h-12 items-center gap-3 bg-bone px-6 text-ink"
              >
                <WhatsApp className="size-[18px]" />
                <span className="eyebrow">Avise-me</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* botão de filtros (celular) */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center pb-[max(1.25rem,env(safe-area-inset-bottom))] lg:hidden">
        <button
          type="button"
          onClick={() => setSheet(true)}
          className="pointer-events-auto flex h-13 items-center gap-3 border border-line-strong bg-ink/95 px-6 shadow-[0_20px_40px_-12px_rgb(0_0_0/0.8)]"
        >
          <Sliders className="size-4" />
          <span className="eyebrow">Filtrar e ordenar</span>
          {chips.length > 0 && <span className="grid size-5 place-items-center bg-bone text-[11px] font-semibold text-ink tabular">{chips.length}</span>}
        </button>
      </div>

      {/* painel de filtros (celular) */}
      {sheet && (
        <div role="dialog" aria-modal="true" aria-label="Filtros" className="fixed inset-0 z-[90] flex flex-col bg-ink lg:hidden">
          <div className="wrap flex h-(--header-h) shrink-0 items-center justify-between border-b border-line">
            <p className="eyebrow">Filtros</p>
            <button type="button" onClick={() => setSheet(false)} className="-mr-2 grid size-11 place-items-center" aria-label="Fechar filtros">
              <Close className="size-6" />
            </button>
          </div>
          <div className="wrap flex-1 overflow-y-auto pb-8" data-lenis-prevent>
            <label className="mt-6 flex h-13 items-center gap-3 border border-line-strong px-4">
              <Search className="size-4 text-mute" />
              <span className="sr-only">Buscar</span>
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar marca, modelo, cor" className="w-full bg-transparent text-base outline-none placeholder:text-faint" />
            </label>
            <ChipGroup title="Ordenar" value={f.ordem ?? "destaque"} onChange={(v) => set({ ordem: v === "destaque" ? undefined : (v as SortKey) })} options={(Object.keys(SORTS) as SortKey[]).map((k) => ({ value: k, label: SORTS[k] }))} required />
            <ChipGroup title="Marca" value={f.marca} onChange={(v) => set({ marca: v, modelo: undefined })} options={brands.map((b) => ({ value: b.key, label: b.name, hint: counts.marca.get(b.key) ?? 0 }))} />
            {f.marca && <ChipGroup title="Modelo" value={f.modelo} onChange={(v) => set({ modelo: v })} options={opts(counts.modelo).map((o) => ({ ...o, hint: Number(o.hint) }))} />}
            <ChipGroup title="Preço" value={f.preco} onChange={(v) => set({ preco: v as PriceKey | undefined })} options={(Object.keys(PRICES) as PriceKey[]).map((k) => ({ value: k, label: PRICES[k].label, hint: counts.preco.get(k) ?? 0 }))} />
            <ChipGroup title="Ano" value={f.ano ? String(f.ano) : undefined} onChange={(v) => set({ ano: v ? Number(v) : undefined })} options={YEARS_FROM.map((y) => ({ value: String(y), label: `${y}+` }))} />
            <ChipGroup title="Carroceria" value={f.carroceria} onChange={(v) => set({ carroceria: v })} options={opts(counts.carroceria).map((o) => ({ ...o, hint: Number(o.hint) }))} />
            <ChipGroup title="Combustível" value={f.combustivel} onChange={(v) => set({ combustivel: v })} options={opts(counts.combustivel).map((o) => ({ ...o, hint: Number(o.hint) }))} />
            <ChipGroup title="Câmbio" value={f.cambio} onChange={(v) => set({ cambio: v })} options={opts(counts.cambio).map((o) => ({ ...o, hint: Number(o.hint) }))} />
            <ChipGroup title="Quilometragem" value={f.km ? String(f.km) : undefined} onChange={(v) => set({ km: v ? Number(v) : undefined })} options={KM_STEPS.map((k) => ({ value: String(k), label: `Até ${num(k / 1000)} mil km` }))} />
          </div>
          <div className="wrap grid shrink-0 grid-cols-[auto_1fr] gap-3 border-t border-line py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <button type="button" onClick={clear} className="h-13 border border-line-strong px-5">
              <span className="eyebrow">Limpar</span>
            </button>
            <button type="button" onClick={() => setSheet(false)} className="h-13 bg-bone text-ink">
              <span className="eyebrow">
                Ver {result.length} {result.length === 1 ? "veículo" : "veículos"}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ChipGroup({
  title,
  value,
  options,
  onChange,
  required = false,
}: {
  title: string;
  value: string | undefined;
  options: { value: string; label: string; hint?: number }[];
  onChange: (v: string | undefined) => void;
  required?: boolean;
}) {
  return (
    <fieldset className="mt-8 border-t border-line pt-6">
      <legend className="eyebrow float-left mb-4 w-full text-faint">{title}</legend>
      <div className="clear-both flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value === o.value;
          const off = o.hint === 0 && !on;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              disabled={off}
              onClick={() => onChange(on && !required ? undefined : o.value)}
              className={`flex h-11 items-center gap-2 border px-4 text-sm transition-colors ${
                on ? "border-bone bg-bone text-ink" : "border-line-strong text-bone-2"
              } ${off ? "opacity-30" : ""}`}
            >
              {o.label}
              {o.hint !== undefined && <span className={`text-xs tabular ${on ? "text-ink/60" : "text-faint"}`}>{o.hint}</span>}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

