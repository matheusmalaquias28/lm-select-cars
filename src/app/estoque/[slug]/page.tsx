import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Gallery } from "@/components/car/Gallery";
import { StickyBar } from "@/components/car/StickyBar";
import { CarCard } from "@/components/stock/CarCard";
import { PageMotion } from "@/components/motion/Motion";
import { ArrowRight, ArrowUpRight, Body, Bolt, Calendar, Check, Fuel, Gauge, Gear, Palette, Timer, WhatsApp } from "@/components/Icons";
import { conditions, site, whatsappLink } from "@/lib/site";
import { brl, carWhatsappText, cars, getCar, kmFmt, similarCars } from "@/lib/stock";

export function generateStaticParams() {
  return cars.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/estoque/[slug]">): Promise<Metadata> {
  const car = getCar((await params).slug);
  if (!car) return {};
  const title = `${car.title} ${car.version} ${car.yearModel}`;
  return {
    title,
    description: `${title}, ${kmFmt(car.km)}, ${car.color.toLowerCase()}, ${car.transmission.toLowerCase()}. ${brl(car.price)} na LM Select Cars em Vila Velha/ES.`,
    alternates: { canonical: `/estoque/${car.slug}` },
    openGraph: { title: `${title} | ${brl(car.price)}`, images: [car.photos[0].src] },
  };
}

export default function CarPage({ params }: PageProps<"/estoque/[slug]">) {
  return (
    <Suspense fallback={<CarSkeleton />}>
      <CarContent params={params} />
    </Suspense>
  );
}

function CarSkeleton() {
  return (
    <div aria-busy="true" className="animate-pulse pt-[calc(var(--header-h)+3rem)] pb-24">
      <div className="wrap">
        <div className="h-3 w-56 bg-ink-3" />
        <div className="mt-10 h-[clamp(2.5rem,6vw,6rem)] w-2/3 bg-ink-3" />
      </div>
      <div className="mt-12 flex gap-2 overflow-hidden px-(--gutter)">
        {[0, 1, 2].map((i) => (
          <div key={i} className="aspect-[3/2] h-[clamp(300px,64svh,780px)] shrink-0 bg-ink-3" />
        ))}
      </div>
    </div>
  );
}

async function CarContent({ params }: { params: PageProps<"/estoque/[slug]">["params"] }) {
  const car = getCar((await params).slug);
  if (!car) notFound();

  const url = `${site.url}/estoque/${car.slug}`;
  const message = carWhatsappText(car, url);
  const name = `${car.title} ${car.version} ${car.yearModel}`;

  const sheet = [
    { icon: Calendar, k: "Ano", v: car.year },
    { icon: Gauge, k: "Quilometragem", v: kmFmt(car.km) },
    { icon: Gear, k: "Câmbio", v: car.transmission },
    { icon: Fuel, k: "Combustível", v: car.fuel },
    { icon: Palette, k: "Cor", v: car.color },
    { icon: Body, k: "Carroceria", v: car.body },
    { icon: Bolt, k: "Potência", v: car.power },
    { icon: Timer, k: "0 a 100 km/h", v: car.accel },
    { icon: Bolt, k: "Torque", v: car.torque },
    { icon: Gauge, k: "Autonomia", v: car.range },
  ].filter((s): s is typeof s & { v: string } => Boolean(s.v));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": car.isMoto ? "Vehicle" : "Car",
    name,
    brand: { "@type": "Brand", name: car.brand },
    model: car.model,
    vehicleConfiguration: car.version,
    color: car.color,
    vehicleTransmission: car.transmission,
    fuelType: car.fuel,
    vehicleModelDate: String(car.yearModel),
    productionDate: String(car.yearFab),
    mileageFromOdometer: { "@type": "QuantitativeValue", value: car.km, unitCode: "KMT" },
    itemCondition: "https://schema.org/UsedCondition",
    image: car.photos.slice(0, 8).map((p) => p.src),
    offers: {
      "@type": "Offer",
      url,
      price: car.price,
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      seller: { "@type": "AutoDealer", name: site.name },
    },
  };

  const similar = similarCars(car);

  return (
    <article data-sticky-cta>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* título */}
      <header className="wrap pt-[calc(var(--header-h)+2.5rem)] pb-10 md:pt-[calc(var(--header-h)+4rem)] md:pb-14">
        <nav aria-label="Trilha de navegação" data-reveal="fade">
          <ol className="eyebrow flex items-center gap-2 text-[0.5625rem] tracking-[0.16em] whitespace-nowrap text-faint">
            <li className="shrink-0">
              <Link href="/estoque" className="transition-colors hover:text-bone">
                Estoque
              </Link>
            </li>
            <li className="flex shrink-0 items-center gap-2">
              <span aria-hidden className="h-px w-2.5 bg-line-strong" />
              <Link href={`/estoque?marca=${car.brandKey}`} className="transition-colors hover:text-bone">
                {car.brand}
              </Link>
            </li>
            <li className="flex min-w-0 items-center gap-2">
              <span aria-hidden className="h-px w-2.5 shrink-0 bg-line-strong" />
              <span aria-current="page" className="truncate text-bone-2">
                {car.model}
              </span>
            </li>
          </ol>
        </nav>

        <div className="mt-10">
          <p data-reveal className="eyebrow text-bone-2">
            {car.brand} <span className="mx-2 text-faint">/</span> {car.year}
          </p>
          <h1 data-split className="mt-5 font-wide text-[clamp(2.3rem,6.4vw,6.75rem)] leading-[0.92] font-light tracking-[-0.03em] uppercase">
            {car.model}
          </h1>
          <p data-reveal className="mt-5 text-lg text-mute md:text-xl">{car.version}</p>
        </div>
      </header>

      {/* galeria + valor: primeira seção (a barra fixa só aparece depois dela) */}
      <div id="car-intro">
        <section aria-label="Fotos" data-reveal="fade">
          <Gallery photos={car.photos} alt={name} cover={car.cover} />
        </section>

        <div data-reveal className="wrap mt-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-5 md:mt-12">
          <div>
            <p className="eyebrow text-faint">Valor</p>
            <p className="mt-3 font-semiwide text-[clamp(1.9rem,3vw,2.75rem)] leading-none font-light tracking-[-0.01em] tabular">{brl(car.price)}</p>
          </div>
          {car.badges.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {car.badges.map((b) => (
                <li key={b} className="eyebrow border border-line-strong px-3 py-1.5 text-[0.625rem] text-bone-2">
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* conteúdo */}
      <div className="wrap grid gap-16 py-20 md:py-28 lg:grid-cols-12 lg:gap-0">
        <div className="space-y-20 lg:col-span-7 md:space-y-24">
          {/* ficha técnica */}
          <section aria-labelledby="ficha">
            <h2 id="ficha" className="eyebrow mb-8 flex items-center gap-4 text-mute">
              <span aria-hidden className="h-px w-8 bg-chrome/60" />
              Ficha técnica
            </h2>
            <dl data-reveal className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-3">
              {sheet.map(({ icon: Icon, k, v }) => (
                <div key={k} className="min-w-0 bg-ink px-4 py-5 sm:px-5 sm:py-6 md:px-7 md:py-7">
                  <dt className="eyebrow flex items-center gap-2.5 tracking-[0.14em] text-faint sm:tracking-[0.24em]">
                    <Icon className="hidden size-4 shrink-0 text-mute sm:block" />
                    {k}
                  </dt>
                  <dd className="mt-3 font-semiwide text-xl font-light tracking-[-0.005em] tabular md:text-2xl">{v}</dd>
                </div>
              ))}
              {/* completa a última linha da grade */}
              {Array.from({ length: (3 - (sheet.length % 3)) % 3 }).map((_, i) => (
                <div key={`f${i}`} aria-hidden className="hidden bg-ink md:block" />
              ))}
              {sheet.length % 2 === 1 && <div aria-hidden className="bg-ink md:hidden" />}
            </dl>
          </section>

          {(car.headline || car.about.length > 0 || car.highlights.length > 0) && (
            <section aria-labelledby="sobre-carro">
              <h2 id="sobre-carro" className="eyebrow mb-8 flex items-center gap-4 text-mute">
                <span aria-hidden className="h-px w-8 bg-chrome/60" />
                Sobre este veículo
              </h2>
              {car.headline && (
                <p data-reveal className="font-wide text-2xl leading-snug font-light tracking-[-0.01em] uppercase md:text-3xl">
                  {car.headline}
                </p>
              )}
              {car.about.map((p) => (
                <p key={p} data-reveal className="mt-6 max-w-[65ch] leading-relaxed text-bone-2">
                  {p}
                </p>
              ))}
              {car.highlights.length > 0 && (
                <ul data-reveal="stagger" className="mt-10 grid gap-x-8 sm:grid-cols-2">
                  {car.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 border-b border-line py-4 text-bone-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-chrome" />
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {car.items.length > 0 && (
            <section aria-labelledby="itens">
              <h2 id="itens" className="eyebrow mb-8 flex items-center gap-4 text-mute">
                <span aria-hidden className="h-px w-8 bg-chrome/60" />
                Equipamentos e opcionais
              </h2>
              <ul data-reveal className="grid gap-x-8 sm:grid-cols-2">
                {car.items.map((it) => (
                  <li key={it} className="border-b border-line py-3.5 text-[15px] text-bone-2">
                    {it}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="condicoes">
            <h2 id="condicoes" className="eyebrow mb-8 flex items-center gap-4 text-mute">
              <span aria-hidden className="h-px w-8 bg-chrome/60" />
              Condições
            </h2>
            <ul data-reveal className="grid gap-x-8 sm:grid-cols-2">
              {conditions.map((c) => (
                <li key={c.title} className="border-b border-line">
                  <Link href={c.href === "/avaliacao" || c.href === "/financiamento" ? `${c.href}?veiculo=${car.slug}` : c.href} className="group flex items-center justify-between gap-4 py-4">
                    <span>
                      <span className="block text-bone">{c.title}</span>
                      <span className="mt-1 block text-sm text-mute">{c.text}</span>
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-faint transition-colors group-hover:text-bone" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* painel lateral */}
        <aside aria-label="Contato sobre este veículo" className="lg:col-span-4 lg:col-start-9">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <div data-reveal className="border border-line p-6 md:p-8">
              <p className="eyebrow text-faint">{car.title}</p>
              <p className="mt-4 font-semiwide text-3xl font-light tabular">{brl(car.price)}</p>
              <p className="mt-2 text-sm text-mute">
                {car.year} · {kmFmt(car.km)} · {car.transmission}
              </p>

              <a
                href={whatsappLink(message)}
                target="_blank"
                rel="noopener"
                className="mt-8 flex h-14 items-center justify-center gap-3 bg-bone text-ink transition-colors duration-500 hover:bg-chrome-hi"
              >
                <WhatsApp className="size-5" />
                <span className="eyebrow">Tenho interesse</span>
              </a>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Link href={`/financiamento?veiculo=${car.slug}`} className="flex h-12 items-center justify-center border border-line-strong text-center transition-colors hover:border-chrome">
                  <span className="eyebrow text-[0.625rem]">Simular crédito</span>
                </Link>
                <Link href={`/avaliacao?veiculo=${car.slug}`} className="flex h-12 items-center justify-center border border-line-strong text-center transition-colors hover:border-chrome">
                  <span className="eyebrow text-[0.625rem]">Usar meu carro</span>
                </Link>
              </div>

              <div className="mt-8 border-t border-line pt-6">
                <p className="eyebrow mb-4 text-faint">Fale direto com um consultor</p>
                <ul className="space-y-1">
                  {site.consultants.map((p) => (
                    <li key={p.name}>
                      <a href={whatsappLink(message, p.number)} target="_blank" rel="noopener" className="group flex items-center justify-between gap-4 py-2">
                        <span>
                          <span className="block text-bone">{p.name}</span>
                          <span className="block text-sm text-mute tabular">{p.label}</span>
                        </span>
                        <WhatsApp className="size-[18px] text-faint transition-colors group-hover:text-bone" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-faint">
              Valores e disponibilidade sujeitos a alteração sem aviso. Confirme com um consultor antes de visitar.
            </p>
          </div>
        </aside>
      </div>

      {/* semelhantes */}
      {similar.length > 0 && (
        <section aria-labelledby="semelhantes" className="wrap border-t border-line py-20 md:py-28">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <h2 id="semelhantes" data-split className="font-wide text-[clamp(1.8rem,3.6vw,3.5rem)] leading-none font-light tracking-[-0.02em] uppercase">
              Você também <span className="text-mute">pode gostar</span>
            </h2>
            <Link href="/estoque" className="group inline-flex items-center gap-3">
              <span className="eyebrow hairline-hover pb-1">Todo o estoque</span>
              <ArrowRight className="size-4 transition-transform duration-500 ease-expo group-hover:translate-x-1" />
            </Link>
          </div>
          <div data-reveal="stagger" className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 2xl:gap-x-6">
            {similar.map((c) => (
              <CarCard key={c.id} car={c} />
            ))}
          </div>
        </section>
      )}

      {/* barra fixa no celular */}
      <StickyBar after="car-intro">
        <div className="wrap flex h-[4.5rem] items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-xs text-mute">{car.title}</p>
            <p className="font-semiwide text-lg leading-tight tabular">{brl(car.price)}</p>
          </div>
          <a href={whatsappLink(message)} target="_blank" rel="noopener" className="flex h-12 shrink-0 items-center gap-2.5 bg-bone px-5 text-ink">
            <WhatsApp className="size-[18px]" />
            <span className="eyebrow">Tenho interesse</span>
          </a>
        </div>
      </StickyBar>

      <PageMotion />
    </article>
  );
}
