import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/Icons";
import { brl, num, type Car } from "@/lib/stock";

const SIZES = "(min-width: 1920px) 22vw, (min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

export function CarCard({ car, priority = false }: { car: Car; priority?: boolean }) {
  const [a, b] = car.photos;
  return (
    <article className="group relative">
      <Link
        href={`/estoque/${car.slug}`}
        className="block border border-line transition-colors duration-700 ease-expo hover:border-line-strong focus-visible:border-chrome"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-ink-2">
          <Image
            src={a.src}
            alt={`${car.title} ${car.version} ${car.yearModel}, ${car.color.toLowerCase()}`}
            fill
            sizes={SIZES}
            quality={80}
            priority={priority}
            placeholder={car.cover ? "blur" : "empty"}
            blurDataURL={car.cover ?? undefined}
            className="object-cover transition-transform duration-[1.6s] ease-expo group-hover:scale-[1.035]"
          />
          {b && (
            <Image
              src={b.src}
              alt=""
              fill
              sizes={SIZES}
              quality={80}
              loading="lazy"
              className="hidden object-cover opacity-0 transition-opacity duration-700 ease-expo pointer-fine:block group-hover:opacity-100"
            />
          )}
          {/* leve vinheta para o card assentar no fundo escuro */}
          <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink/35 via-transparent to-transparent" />
          {car.badges.length > 0 && (
            <ul className="absolute top-4 left-4 flex flex-wrap gap-1.5">
              {car.badges.map((t) => (
                <li key={t} className="eyebrow bg-ink/85 px-2.5 py-1.5 text-[0.625rem] text-bone-2">
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="px-5 pt-5 pb-6 md:px-6">
          <p className="eyebrow text-mute">{car.brand}</p>
          <h3 className="mt-2.5 font-wide text-lg leading-[1.15] font-normal tracking-[-0.005em] uppercase md:text-xl">{car.model}</h3>
          <p className="mt-1.5 truncate text-sm text-mute">{car.version}</p>

          <dl className="mt-5 grid grid-cols-3 border-t border-line pt-4 text-[13px] leading-tight">
            <div>
              <dt className="sr-only">Ano</dt>
              <dd className="text-bone-2 tabular">{car.year}</dd>
            </div>
            <div className="border-l border-line pl-3">
              <dt className="sr-only">Quilometragem</dt>
              <dd className="text-bone-2 tabular">{num(car.km)} km</dd>
            </div>
            <div className="border-l border-line pl-3">
              <dt className="sr-only">Câmbio</dt>
              <dd className="truncate text-bone-2">{car.transmission}</dd>
            </div>
          </dl>

          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="font-semiwide text-[1.35rem] leading-none font-normal tracking-[-0.01em] tabular">{brl(car.price)}</p>
            <span
              aria-hidden
              className="grid size-10 shrink-0 place-items-center border border-line text-bone-2 transition-all duration-700 ease-expo group-hover:border-bone group-hover:bg-bone group-hover:text-ink"
            >
              <ArrowRight className="size-4" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
