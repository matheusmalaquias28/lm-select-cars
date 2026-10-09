import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageMotion } from "@/components/motion/Motion";
import { PageHero } from "@/components/ui/PageHero";
import { ArrowRight } from "@/components/Icons";
import { site } from "@/lib/site";
import { brands, cars } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Sobre nós",
  description: `Há mais de ${site.since} anos a LM Select Cars seleciona veículos premium com procedência, transparência e atendimento pessoal em Vila Velha/ES.`,
  alternates: { canonical: "/sobre" },
};

const photo = (id: string, i: number) => cars.find((c) => c.id === id)?.photos[i] ?? cars[0].photos[0];

const values = [
  {
    t: "Curadoria",
    d: "Cada veículo passa por um processo rigoroso de seleção antes de entrar no portfólio. Só fica o que é exclusivo e confiável no segmento premium.",
  },
  {
    t: "Transparência",
    d: "Procedência, histórico e quilometragem apresentados com clareza. Negociação sem surpresa, do primeiro contato à entrega.",
  },
  {
    t: "Atendimento pessoal",
    d: "Você conversa com quem conhece o carro. Atendimento próximo, no seu tempo, antes e depois da compra.",
  },
];

export default function SobrePage() {
  const a = photo("6926385", 8);
  const b = photo("7803588", 0);
  const c = photo("8550171", 1);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Sobre nós" }]}
        title={
          <>
            Sobre
            <br />
            <span className="text-mute">a LM Select</span>
          </>
        }
        text={<p>Mais de {site.since} anos transformando a compra de um automóvel em uma experiência única.</p>}
      />

      <section className="wrap grid gap-14 py-20 md:py-28 lg:grid-cols-12">
        <figure data-reveal="img" className="relative aspect-[3/4] overflow-hidden bg-ink-2 lg:col-span-5">
          <Image src={a.src} alt="Porsche 911 Carrera Cabriolet no showroom da LM Select Cars" fill sizes="(min-width: 1024px) 40vw, 100vw" quality={85} className="object-cover" />
        </figure>
        <div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7">
          <p data-split className="font-wide text-[clamp(1.5rem,2.8vw,2.6rem)] leading-[1.12] font-light tracking-[-0.015em] uppercase">
            Não vendemos apenas automóveis: entregamos status, distinção e a certeza de um investimento seguro.
          </p>
          <div data-reveal className="mt-12 max-w-[60ch] space-y-5 leading-relaxed text-bone-2">
            <p>
              A LM Select Cars nasceu do desejo de transformar a compra de um automóvel em uma experiência única e memorável. Com mais de{" "}
              {site.since} anos de experiência no mercado automotivo, consolidamos nossa história com base em credibilidade, transparência e
              excelência.
            </p>
            <p>
              Cada veículo do portfólio é selecionado criteriosamente, num processo de curadoria que reflete o compromisso de oferecer apenas o
              que há de mais exclusivo e confiável no segmento premium. Da procedência à apresentação, cada detalhe importa.
            </p>
            <p className="text-mute">
              Somos reconhecidos por clientes e parceiros que valorizam qualidade, seriedade e atendimento personalizado. Prova disso são as
              nossas 5 estrelas no Google Avaliações.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="valores" className="border-t border-line">
        <div className="wrap py-20 md:py-28">
          <h2 id="valores" className="eyebrow mb-12 flex items-center gap-4 text-mute">
            <span aria-hidden className="h-px w-8 bg-chrome/60" />
            O que nos guia
          </h2>
          <ol data-reveal className="grid gap-px border-y border-line bg-line md:grid-cols-3">
            {values.map((v, i) => (
              <li key={v.t} className="bg-ink py-10 md:px-8 md:first:pl-0 lg:py-14">
                <span className="eyebrow text-faint tabular">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-10 font-wide text-2xl font-light tracking-[-0.01em] uppercase">{v.t}</p>
                <p className="mt-4 max-w-sm leading-relaxed text-mute">{v.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-label="Showroom" className="grid gap-1.5 md:grid-cols-2 md:gap-2">
        {[b, c].map((p, i) => (
          <figure key={p.src} data-reveal="img" className="relative aspect-[4/3] overflow-hidden bg-ink-2">
            <Image src={p.src} alt={i === 0 ? "Porsche Cayenne no showroom da LM Select Cars" : "Porsche Cayenne Coupé E-Hybrid no showroom"} fill sizes="(min-width: 768px) 50vw, 100vw" quality={85} className="object-cover" />
          </figure>
        ))}
      </section>

      <section className="wrap flex flex-col items-start justify-between gap-10 py-20 md:flex-row md:items-end md:py-28">
        <div>
          <p data-reveal="fade" className="eyebrow mb-6 text-mute">
            {cars.length} veículos · {brands.length} marcas
          </p>
          <h2 data-split className="font-wide text-[clamp(1.9rem,4.4vw,4.5rem)] leading-[0.98] font-light tracking-[-0.025em] uppercase">
            Conheça o
            <br />
            <span className="text-mute">estoque</span>
          </h2>
        </div>
        <Link href="/estoque" data-reveal className="group flex h-14 items-center gap-4 bg-bone px-8 text-ink transition-colors duration-500 hover:bg-chrome-hi">
          <span className="eyebrow">Ver veículos</span>
          <ArrowRight className="size-4 transition-transform duration-500 ease-expo group-hover:translate-x-1" />
        </Link>
      </section>
      <PageMotion />
    </>
  );
}
