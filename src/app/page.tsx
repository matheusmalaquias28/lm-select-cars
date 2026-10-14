import Image from "next/image";
import Link from "next/link";
import { HeroSlider, type HeroSlide } from "@/components/home/HeroSlider";
import { QuickSearch } from "@/components/home/QuickSearch";
import { Spotlight } from "@/components/home/Spotlight";
import { CarCard } from "@/components/stock/CarCard";
import { SectionHead } from "@/components/ui/SectionHead";
import { ShowroomVideo } from "@/components/ui/ShowroomVideo";
import { PageMotion } from "@/components/motion/Motion";
import { ArrowRight, ArrowUpRight, Clock, Phone, Pin, WhatsApp } from "@/components/Icons";
import { conditions, site, whatsappLink } from "@/lib/site";
import { brands, brl, cars, featured, heroSlides, kmFmt, slim, spotlight } from "@/lib/stock";

const photo = (id: string, i: number) => {
  const car = cars.find((c) => c.id === id);
  return car?.photos[i] ?? car?.photos[0] ?? cars[0].photos[0];
};

export default function Home() {
  const slides: HeroSlide[] = heroSlides.map(({ car, image, mobileSrc, desktopSrc, focus }) => ({
    slug: car.slug,
    brand: car.brand,
    model: car.model,
    version: car.version,
    year: car.year,
    km: kmFmt(car.km),
    price: brl(car.price),
    power: car.power,
    transmission: car.transmission,
    image,
    cover: image === car.photos[0] ? car.cover : null,
    mobileSrc,
    desktopSrc,
    focus,
  }));

  const showroom = photo("7537789", 1);
  const panelTrade = photo("7803588", 7);
  const panelFinance = photo("6926385", 19);

  return (
    <>
      <h1 className="sr-only">LM Select Cars: veículos premium e seminovos selecionados em Vila Velha, ES</h1>
      <HeroSlider slides={slides} />
      <QuickSearch list={slim} brands={brands} />

      {/* Seleção */}
      <section aria-labelledby="selecao-titulo" className="wrap py-24 md:py-32 lg:py-40">
        <SectionHead
          id="selecao-titulo"
          eyebrow="Seleção LM"
          title={
            <>
              Curadoria,
              <br />
              <span className="text-mute">não volume</span>
            </>
          }
          aside={
            <>
              <p className="max-w-md leading-relaxed">
                Cada carro passa por uma avaliação de procedência, histórico e estado antes de entrar no estoque. O que está aqui, a gente
                assina embaixo.
              </p>
              <Link href="/estoque" className="group mt-8 inline-flex items-center gap-3 text-bone">
                <span className="eyebrow hairline-hover pb-1">Ver os {cars.length} veículos</span>
                <ArrowRight className="size-4 transition-transform duration-500 ease-expo group-hover:translate-x-1" />
              </Link>
            </>
          }
        />
        <div data-reveal="stagger" className="mt-16 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-x-6">
          {featured.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      <Spotlight car={spotlight} photo={2} />

      {/* Sobre */}
      <section aria-labelledby="sobre-titulo" className="wrap border-t border-line py-24 md:py-32 lg:py-40">
        <p data-reveal="fade" className="eyebrow mb-10 flex items-center gap-4 text-mute">
          <span aria-hidden className="h-px w-8 bg-chrome/60" />
          Mais de 17 anos de mercado
        </p>
        <h2 id="sobre-titulo" data-split className="max-w-[22ch] font-wide text-[clamp(1.6rem,3.5vw,3.5rem)] leading-[1.08] font-light tracking-[-0.02em] uppercase">
          Não vendemos apenas automóveis. <span className="text-mute">Entregamos procedência, distinção e um investimento seguro.</span>
        </h2>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-0">
          <div data-reveal="fade" className="grid grid-cols-5 gap-1.5 md:gap-2 lg:col-span-7">
            <figure className="relative col-span-3 overflow-hidden bg-ink-2">
              <Image src={showroom.src} alt="Showroom da LM Select Cars com um Mercedes-AMG EQS 53" fill sizes="(min-width: 1024px) 35vw, 60vw" quality={85} className="object-cover" />
            </figure>
            <ShowroomVideo className="col-span-2 aspect-[9/16]" />
          </div>
          <div className="flex flex-col justify-between gap-12 lg:col-span-4 lg:col-start-9">
            <div data-reveal className="space-y-5 leading-relaxed text-bone-2">
              <p>
                A LM Select Cars nasceu do desejo de transformar a compra de um automóvel em uma experiência única. São mais de {site.since} anos
                de mercado construídos sobre credibilidade, transparência e excelência.
              </p>
              <p className="text-mute">
                Do primeiro contato à entrega da chave, o atendimento é pessoal: quem conversa com você conhece o carro, o histórico e as
                condições.
              </p>
            </div>
            <dl data-reveal="stagger" className="border-t border-line">
              {[
                ["Mercado", `Mais de ${site.since} anos`],
                ["Google", `${site.google.rating} · ${site.google.reviews} avaliações`],
                ["Estoque", `${cars.length} veículos, ${brands.length} marcas`],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-6 border-b border-line py-4">
                  <dt className="eyebrow text-faint">{k}</dt>
                  <dd className="text-right text-bone tabular">{v}</dd>
                </div>
              ))}
            </dl>
            <Link href="/sobre" data-reveal className="group inline-flex items-center gap-3 self-start">
              <span className="eyebrow hairline-hover pb-1">Conheça a LM</span>
              <ArrowRight className="size-4 transition-transform duration-500 ease-expo group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Condições */}
      <section aria-labelledby="condicoes-titulo" className="border-t border-line">
        <div className="wrap py-24 md:py-32">
          <SectionHead
            id="condicoes-titulo"
            eyebrow="Condições"
            title={
              <>
                Do jeito que
                <br />
                <span className="text-mute">fizer sentido</span>
              </>
            }
            aside={<p className="max-w-md leading-relaxed">Troca, financiamento, consórcio ou cartão. Montamos a proposta com você, sem pressa e sem letras miúdas.</p>}
          />
          <ol data-reveal className="mt-16 grid gap-px border-y border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {conditions.map((c, i) => (
              <li key={c.title} className="bg-ink">
                <Link href={c.href} className="group flex h-full flex-col justify-between gap-10 p-6 transition-colors duration-700 hover:bg-ink-2 md:p-8 lg:p-10">
                  <span className="eyebrow text-faint tabular">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="flex items-center justify-between gap-4">
                      <span className="font-wide text-lg tracking-[0.01em] uppercase md:text-xl">{c.title}</span>
                      <ArrowUpRight className="size-4 shrink-0 text-faint transition-all duration-500 ease-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-bone" />
                    </span>
                    <span className="mt-3 block text-sm leading-relaxed text-mute">{c.text}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Avaliação e financiamento */}
      <section aria-label="Avaliação e financiamento" className="grid border-t border-line md:grid-cols-2">
        {[
          {
            href: "/avaliacao",
            eyebrow: "Venda ou troque",
            title: "Avaliamos o seu carro",
            text: "Envie os dados e fotos pelo WhatsApp e receba uma proposta justa, para venda direta ou como parte do pagamento.",
            img: panelTrade,
            alt: "Detalhe do farol de um Porsche Cayenne",
          },
          {
            href: "/financiamento",
            eyebrow: "Crédito",
            title: "Simule o financiamento",
            text: "Entrada, prazo e parcelas do seu jeito, com financiamento facilitado e aprovação rápida.",
            img: panelFinance,
            alt: "Volante e painel de um Porsche 911",
          },
        ].map((p, i) => (
          <Link
            key={p.href}
            href={p.href}
            className={`group relative flex min-h-[78svh] flex-col justify-end overflow-hidden p-(--gutter) pb-12 md:min-h-[88svh] md:pb-16 ${i === 0 ? "md:border-r md:border-line" : ""}`}
          >
            <Image src={p.img.src} alt={p.alt} fill sizes="(min-width: 768px) 50vw, 100vw" quality={80} className="object-cover transition-transform duration-[2s] ease-expo group-hover:scale-[1.04]" />
            <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink via-ink/60 to-ink/20" />
            <div className="relative max-w-md">
              <p className="eyebrow text-bone-2">{p.eyebrow}</p>
              <h2 className="mt-5 font-wide text-[clamp(1.8rem,3.4vw,3.25rem)] leading-[1] font-light tracking-[-0.02em] uppercase">{p.title}</h2>
              <p className="mt-5 leading-relaxed text-bone-2">{p.text}</p>
              <span className="mt-10 inline-flex h-12 items-center gap-3 border border-bone/40 px-6 transition-colors duration-500 group-hover:border-bone group-hover:bg-bone group-hover:text-ink">
                <span className="eyebrow">Começar</span>
                <ArrowRight className="size-4" />
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* Visita */}
      <section aria-labelledby="visita-titulo" className="wrap grid gap-14 border-t border-line py-24 md:py-32 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p data-reveal="fade" className="eyebrow mb-6 flex items-center gap-4 text-mute">
            <span aria-hidden className="h-px w-8 bg-chrome/60" />
            Showroom
          </p>
          <h2 id="visita-titulo" data-split className="font-wide text-[clamp(1.9rem,4vw,4rem)] leading-[0.98] font-light tracking-[-0.025em] uppercase">
            Vila Velha,
            <br />
            <span className="text-mute">Espírito Santo</span>
          </h2>
          <ul data-reveal="stagger" className="mt-12 border-t border-line">
            <li className="flex gap-5 border-b border-line py-5">
              <Pin className="mt-0.5 size-5 shrink-0 text-mute" />
              <address className="leading-relaxed text-bone-2 not-italic">
                {site.address.street}
                <br />
                {site.address.district}, {site.address.city}/{site.address.state}
                <br />
                CEP {site.address.cep}
              </address>
            </li>
            <li className="flex gap-5 border-b border-line py-5">
              <Clock className="mt-0.5 size-5 shrink-0 text-mute" />
              <dl className="w-full space-y-1 text-bone-2">
                {site.hours.map((h) => (
                  <div key={h.days} className="flex justify-between gap-6">
                    <dt>{h.days}</dt>
                    <dd className="tabular">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </li>
            <li className="flex gap-5 border-b border-line py-5">
              <Phone className="mt-0.5 size-5 shrink-0 text-mute" />
              <a href={site.phone.href} className="hairline-hover text-bone-2 hover:text-bone">
                {site.phone.label}
              </a>
            </li>
          </ul>
          <div data-reveal className="mt-10 flex flex-wrap gap-3">
            <a
              href={whatsappLink("Olá! Gostaria de agendar uma visita ao showroom.")}
              target="_blank"
              rel="noopener"
              className="flex h-12 items-center gap-3 bg-bone px-6 text-ink transition-colors duration-500 hover:bg-chrome-hi"
            >
              <WhatsApp className="size-[18px]" />
              <span className="eyebrow">Agendar visita</span>
            </a>
            <a href={site.maps} target="_blank" rel="noopener" className="group flex h-12 items-center gap-3 border border-line-strong px-6 transition-colors hover:border-chrome">
              <span className="eyebrow">Abrir no Maps</span>
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
        <div data-reveal="img" className="relative min-h-[420px] overflow-hidden border border-line bg-ink-2 lg:col-span-6 lg:col-start-7">
          <iframe
            title="Mapa: LM Select Cars em Vila Velha"
            src={site.mapsEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full [filter:grayscale(1)_invert(0.92)_contrast(0.85)_brightness(0.95)]"
          />
        </div>
      </section>

      <PageMotion />
    </>
  );
}
