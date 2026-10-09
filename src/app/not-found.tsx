import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ArrowRight } from "@/components/Icons";

export default function NotFound() {
  return (
    <section className="wrap relative flex min-h-[90svh] flex-col justify-end overflow-hidden pt-(--header-h) pb-20">
      <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 w-[120%] -translate-x-1/2 -translate-y-1/2 text-ink-3 md:w-[80%]">
        <Logo variant="mono" tone="current" className="h-auto w-full" title="" />
      </div>
      <div className="relative">
        <p className="eyebrow text-mute">Erro 404</p>
        <h1 className="mt-6 font-wide text-[clamp(2.4rem,7vw,7rem)] leading-[0.92] font-light tracking-[-0.03em] uppercase">
          Este carro
          <br />
          <span className="text-mute">já saiu</span>
        </h1>
        <p className="mt-6 max-w-md leading-relaxed text-bone-2">
          A página não existe mais ou o veículo foi vendido. O estoque muda toda semana: veja o que chegou.
        </p>
        <Link href="/estoque" className="group mt-10 inline-flex h-14 items-center gap-4 bg-bone px-8 text-ink transition-colors duration-500 hover:bg-chrome-hi">
          <span className="eyebrow">Ver estoque</span>
          <ArrowRight className="size-4 transition-transform duration-500 ease-expo group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
