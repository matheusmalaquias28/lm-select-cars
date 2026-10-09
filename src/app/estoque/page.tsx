import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { CarCard } from "@/components/stock/CarCard";
import { StockExplorer } from "@/components/stock/StockExplorer";
import { PageMotion } from "@/components/motion/Motion";
import { brands, cars, slim } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Estoque",
  description: `${cars.length} veículos premium e seminovos de ${brands.length} marcas em Vila Velha/ES: Porsche, Mercedes-Benz, BMW, Toyota e mais. Filtre por marca, preço, ano e carroceria.`,
  alternates: { canonical: "/estoque" },
};

/** Grade estática (sem filtros) usada no HTML pré-renderizado. */
function StaticGrid({ cards }: { cards: Record<string, React.ReactNode> }) {
  return (
    <div>
      <div className="hidden h-[10.5rem] border-b border-line lg:block 2xl:h-[5.25rem]" />
      <div className="wrap border-b border-line py-5">
        <p className="font-semiwide text-lg tabular">
          {cars.length} <span className="text-mute">veículos</span>
        </p>
      </div>
      <div className="wrap py-10 md:py-14">
        <ul className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 2xl:gap-x-6">
          {cars.map((c) => (
            <li key={c.id}>{cards[c.id]}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function EstoquePage() {
  const cards = Object.fromEntries(cars.map((c, i) => [c.id, <CarCard key={c.id} car={c} priority={i < 4} />]));

  return (
    <>
      <PageHero
        crumbs={[{ label: "Estoque" }]}
        title={
          <>
            Estoque
            <br />
            <span className="text-mute">selecionado</span>
          </>
        }
        text={
          <p>
            {cars.length} veículos de {brands.length} marcas, todos com procedência verificada. Filtre, compare e fale direto com um consultor
            pelo WhatsApp.
          </p>
        }
      />
      <Suspense fallback={<StaticGrid cards={cards} />}>
        <StockExplorer list={slim} cards={cards} brands={brands} />
      </Suspense>
      <PageMotion />
    </>
  );
}
