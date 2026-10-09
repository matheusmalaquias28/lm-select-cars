import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/Icons";
import { brl, kmFmt, type Car } from "@/lib/stock";

/** Um carro por vez, como numa vitrine de joalheria: foto grande + ficha técnica. */
export function Spotlight({ car, photo = 0 }: { car: Car; photo?: number }) {
  const img = car.photos[photo] ?? car.photos[0];
  const specs = [
    ["Potência", car.power],
    ["0 a 100 km/h", car.accel],
    ["Torque", car.torque],
    ["Autonomia", car.range],
    ["Ano", car.year],
    ["Quilometragem", kmFmt(car.km)],
  ].filter((s): s is [string, string] => Boolean(s[1])).slice(0, 6);

  return (
    <section aria-labelledby="destaque-titulo" className="relative border-t border-line">
      <div className="grid lg:min-h-[92svh] lg:grid-cols-12">
        <div className="relative min-h-[62svh] overflow-hidden lg:col-span-7 lg:min-h-0">
          <div data-parallax="0.14" className="absolute inset-x-0 -inset-y-[8%]">
            <Image src={img.src} alt={`${car.title} ${car.yearModel}`} fill sizes="(min-width: 1024px) 58vw, 100vw" quality={90} className="object-cover" />
          </div>
          <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink/60 to-transparent lg:bg-linear-to-r lg:from-transparent lg:via-transparent lg:to-ink/40" />
        </div>

        <div className="flex flex-col justify-between gap-14 px-(--gutter) py-16 lg:col-span-5 lg:py-24 lg:pl-[clamp(2rem,5vw,6rem)]">
          <div>
            <p data-reveal="fade" className="eyebrow flex items-center gap-4 text-mute">
              <span aria-hidden className="h-px w-8 bg-chrome/60" />
              Em destaque
            </p>
            <p data-reveal className="eyebrow mt-12 text-bone-2">{car.brand}</p>
            <h2 id="destaque-titulo" data-split className="mt-4 font-wide text-[clamp(2.2rem,4.4vw,4.5rem)] leading-[0.95] font-light tracking-[-0.025em] uppercase">
              {car.model}
            </h2>
            <p data-reveal className="mt-4 text-lg text-mute">{car.version}</p>

            {car.highlights.length > 0 && (
              <ul data-reveal="stagger" className="mt-10 flex flex-wrap gap-2">
                {car.highlights.slice(0, 4).map((h) => (
                  <li key={h} className="border border-line px-3 py-1.5 text-[13px] text-bone-2">
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <dl data-reveal="stagger" className="grid grid-cols-2 border-t border-line">
              {specs.map(([k, v], i) => (
                <div key={k} className={`border-b border-line py-5 ${i % 2 ? "pl-6" : "border-r pr-6"}`}>
                  <dt className="eyebrow text-faint">{k}</dt>
                  <dd className="mt-2.5 font-semiwide text-2xl font-light tracking-[-0.01em] tabular">{v}</dd>
                </div>
              ))}
            </dl>
            <div data-reveal className="mt-10 flex flex-wrap items-center justify-between gap-6">
              <p className="font-semiwide text-3xl font-light tabular">{brl(car.price)}</p>
              <Link
                href={`/estoque/${car.slug}`}
                className="group flex h-12 items-center gap-3 border border-line-strong px-6 transition-colors duration-500 hover:border-bone hover:bg-bone hover:text-ink"
              >
                <span className="eyebrow">Ficha completa</span>
                <ArrowRight className="size-4 transition-transform duration-500 ease-expo group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
