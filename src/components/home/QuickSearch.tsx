"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight } from "@/components/Icons";
import { Select } from "@/components/ui/Select";
import { facet, filterCars, PRICES, toSearch, type Filters, type PriceKey, type Slim } from "@/lib/filters";

type Props = {
  list: Slim[];
  brands: { name: string; key: string; count: number }[];
};

/** Busca rápida logo abaixo da hero: marca, modelo, faixa de preço e carroceria. */
export function QuickSearch({ list, brands }: Props) {
  const router = useRouter();
  const [f, setF] = useState<Filters>({});
  const set = (patch: Partial<Filters>) => setF((cur) => ({ ...cur, ...patch }));

  const result = useMemo(() => filterCars(f, list), [f, list]);
  const brandCounts = useMemo(() => facet(list, f, "marca", (c) => c.brandKey), [list, f]);
  const modelCounts = useMemo(() => facet(list, f, "modelo", (c) => c.model), [list, f]);
  const priceCounts = useMemo(
    () => facet(list, f, "preco", (c) => (Object.keys(PRICES) as PriceKey[]).find((k) => c.price >= PRICES[k].min && c.price < PRICES[k].max) ?? null),
    [list, f],
  );
  const bodyCounts = useMemo(() => facet(list, f, "carroceria", (c) => c.body), [list, f]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/estoque${toSearch(f)}`);
  };

  const field = "h-[5.25rem] border-line px-5 md:px-7 lg:border-l";

  return (
    <section aria-labelledby="busca-titulo" className="relative z-10 border-b border-line bg-ink">
      <form onSubmit={submit} className="grid grid-cols-2 border-t border-line lg:grid-cols-[minmax(13rem,1.1fr)_repeat(4,minmax(0,1fr))_auto]">
        <div className="col-span-2 flex items-center px-(--gutter) py-6 lg:col-span-1 lg:py-0">
          <h2 id="busca-titulo" className="font-wide text-sm leading-snug font-normal tracking-[0.04em] uppercase">
            Encontre o seu
            <br />
            <span className="text-mute">próximo carro</span>
          </h2>
        </div>
        <Select
          className={`${field} border-t border-r lg:border-t-0 lg:border-r-0`}
          label="Marca"
          placeholder="Todas"
          value={f.marca}
          onChange={(v) => set({ marca: v, modelo: undefined })}
          options={brands.map((b) => ({ value: b.key, label: b.name, hint: String(brandCounts.get(b.key) ?? 0), disabled: !brandCounts.get(b.key) }))}
        />
        <Select
          className={`${field} border-t lg:border-t-0`}
          label="Modelo"
          placeholder="Todos"
          value={f.modelo}
          onChange={(v) => set({ modelo: v })}
          options={[...modelCounts.keys()]
            .sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }))
            .map((m) => ({ value: m, label: m, hint: String(modelCounts.get(m)) }))}
        />
        <Select
          className={`${field} border-t border-r lg:border-t-0 lg:border-r-0`}
          label="Faixa de preço"
          placeholder="Qualquer valor"
          value={f.preco}
          onChange={(v) => set({ preco: v as PriceKey | undefined })}
          options={(Object.keys(PRICES) as PriceKey[]).map((k) => ({
            value: k,
            label: PRICES[k].label,
            hint: String(priceCounts.get(k) ?? 0),
            disabled: !priceCounts.get(k),
          }))}
        />
        <Select
          className={`${field} border-t lg:border-t-0`}
          label="Carroceria"
          placeholder="Todas"
          value={f.carroceria}
          onChange={(v) => set({ carroceria: v })}
          options={[...bodyCounts.keys()].sort().map((b) => ({ value: b, label: b, hint: String(bodyCounts.get(b)) }))}
          align="right"
        />
        <button
          type="submit"
          className="group col-span-2 flex h-[4.5rem] items-center justify-between gap-6 bg-bone px-(--gutter) text-ink transition-colors duration-500 hover:bg-chrome-hi lg:col-span-1 lg:h-auto lg:min-w-[17rem] lg:px-8"
        >
          <span className="eyebrow">
            Ver <span className="tabular">{result.length}</span> {result.length === 1 ? "veículo" : "veículos"}
          </span>
          <ArrowRight className="size-5 transition-transform duration-500 ease-expo group-hover:translate-x-1" />
        </button>
      </form>

      {/* marcas */}
      <div className="flex items-center gap-8 border-t border-line">
        <p className="eyebrow hidden shrink-0 pl-(--gutter) text-faint md:block">Marcas</p>
        <ul className="no-scrollbar flex flex-1 items-center gap-x-8 overflow-x-auto px-(--gutter) py-5 md:gap-x-10 md:pl-0" data-lenis-prevent>
          {brands.map((b) => (
            <li key={b.key} className="shrink-0">
              <Link href={`/estoque?marca=${b.key}`} className="group flex items-start gap-1.5 font-wide text-[0.8125rem] tracking-[0.12em] text-bone-2 uppercase transition-colors duration-500 hover:text-bone">
                <span className="hairline-hover">{b.name}</span>
                <sup className="text-[0.625rem] tracking-normal text-faint tabular">{b.count}</sup>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
