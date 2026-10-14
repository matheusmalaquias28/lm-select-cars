"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight } from "@/components/Icons";
import { onIntroDone } from "@/lib/intro";

export type HeroSlide = {
  slug: string;
  brand: string;
  model: string;
  version: string;
  year: string;
  km: string;
  price: string;
  power: string | null;
  transmission: string;
  image: { src: string; w: number; h: number };
  cover: string | null;
  /** Foto vertical própria para celular (abaixo de md) */
  mobileSrc: string | null;
  /** Foto própria para tablet/desktop (a partir de md) */
  desktopSrc: string | null;
  focus: string;
};

const DURATION = 7;

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const root = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const prev = useRef(0);
  const busy = useRef(false);
  const progress = useRef<gsap.core.Tween | null>(null);
  const kenBurns = useRef<gsap.core.Tween | null>(null);
  const started = useRef(false);

  const go = useCallback(
    (to: number) => {
      if (busy.current) return;
      setIndex(((to % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  const runProgress = useCallback(
    (i: number) => {
      const el = root.current;
      if (!el) return;
      progress.current?.kill();
      gsap.set(el.querySelectorAll("[data-bar]"), { scaleX: 0 });
      const bar = el.querySelector(`[data-bar="${i}"]`);
      progress.current = gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: DURATION, ease: "none", onComplete: () => go(i + 1) });
      const img = el.querySelector(`[data-slide="${i}"] img`);
      kenBurns.current?.kill();
      if (img) kenBurns.current = gsap.to(img, { scale: 1, duration: DURATION + 2, ease: "none" });
    },
    [go],
  );

  // Entrada: espera o preloader entregar a logo ao header
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ctx: gsap.Context | undefined;
    const off = onIntroDone(() => {
      ctx = gsap.context(() => {
        if (reduce) {
          gsap.set("[data-intro]", { opacity: 1 });
          started.current = true;
          return;
        }
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .set("[data-intro]", { opacity: 1 })
          .fromTo('[data-slide="0"] img', { scale: 1.22 }, { scale: 1.06, duration: 2.4 }, 0)
          .fromTo("[data-hero-shade]", { opacity: 1 }, { opacity: 0, duration: 1.6, ease: "power2.out" }, 0)
          .from('[data-copy="0"] [data-line]', { yPercent: 110, duration: 1.5, stagger: 0.08 }, 0.3)
          .from("[data-hero-ui] > *", { y: 20, opacity: 0, duration: 1.2, stagger: 0.06 }, 0.8)
          .add(() => {
            started.current = true;
            runProgress(0);
          }, 0.9);
      }, el);
    });
    return () => {
      off();
      ctx?.revert();
      progress.current?.kill();
      kenBurns.current?.kill();
    };
  }, [runProgress]);

  // Troca de slide
  useEffect(() => {
    const el = root.current;
    const from = prev.current;
    if (!el || from === index) return;
    prev.current = index;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = (s: string) => el.querySelectorAll(s);
    const next = el.querySelector<HTMLElement>(`[data-slide="${index}"]`);
    const old = el.querySelector<HTMLElement>(`[data-slide="${from}"]`);
    if (!next || !old) return;

    busy.current = true;
    const dir = index > from || (from === slides.length - 1 && index === 0) ? 1 : -1;
    gsap.set(q("[data-slide]"), { zIndex: 0 });
    gsap.set(old, { zIndex: 1, visibility: "visible" });
    gsap.set(next, { zIndex: 2, visibility: "visible" });
    gsap.set(q(`[data-copy]`), { visibility: "hidden" });
    gsap.set(q(`[data-copy="${from}"], [data-copy="${index}"]`), { visibility: "visible" });

    const tl = gsap.timeline({
      defaults: { ease: "expo.inOut" },
      onComplete: () => {
        gsap.set(old, { visibility: "hidden" });
        gsap.set(q(`[data-copy="${from}"]`), { visibility: "hidden" });
        busy.current = false;
        if (started.current) runProgress(index);
      },
    });
    if (reduce) {
      tl.fromTo(next, { opacity: 0 }, { opacity: 1, duration: 0.4 }).set(q(`[data-copy="${index}"] [data-line]`), { yPercent: 0 });
      return;
    }
    tl.fromTo(
      next,
      { clipPath: dir > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0%)", duration: 1.5 },
      0,
    )
      .fromTo(next.querySelector("img"), { scale: 1.28, xPercent: 8 * dir }, { scale: 1.06, xPercent: 0, duration: 1.9, ease: "expo.out" }, 0.1)
      .to(old.querySelector("img"), { xPercent: -10 * dir, duration: 1.5 }, 0)
      .to(q(`[data-copy="${from}"] [data-line]`), { yPercent: -110, duration: 0.7, ease: "power3.in", stagger: 0.03 }, 0)
      .fromTo(q(`[data-copy="${index}"] [data-line]`), { yPercent: 110 }, { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: 0.07 }, 0.6)
      .set(old.querySelector("img"), { xPercent: 0 });
  }, [index, slides.length, runProgress]);

  // Gesto de arrastar no celular
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let x0 = 0;
    let y0 = 0;
    const down = (e: PointerEvent) => ((x0 = e.clientX), (y0 = e.clientY));
    const up = (e: PointerEvent) => {
      const dx = e.clientX - x0;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(e.clientY - y0) * 1.5) go(prev.current + (dx < 0 ? 1 : -1));
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
    };
  }, [go]);

  const current = slides[index];

  return (
    <section
      ref={root}
      aria-roledescription="carrossel"
      aria-label="Veículos em destaque"
      className="relative h-[100svh] min-h-[620px] w-full touch-pan-y overflow-hidden bg-ink select-none"
    >
      {/* imagens */}
      {slides.map((s, i) => (
        <div
          key={s.slug}
          data-slide={i}
          className="absolute inset-0 overflow-hidden"
          style={{ visibility: i === 0 ? "visible" : "hidden", zIndex: i === 0 ? 1 : 0 }}
          aria-hidden={i !== index}
        >
          <picture>
            {s.mobileSrc && <source media="(max-width: 767px)" srcSet={s.mobileSrc} />}
            {s.desktopSrc && <source media="(min-width: 768px)" srcSet={s.desktopSrc} />}
            <Image
              src={s.image.src}
              alt={`${s.brand} ${s.model} ${s.year}`}
              fill
              priority={i === 0}
              sizes="100vw"
              quality={90}
              placeholder={s.cover ? "blur" : "empty"}
              blurDataURL={s.cover ?? undefined}
              className="scale-[1.06] object-cover will-change-transform"
              style={{ objectPosition: s.focus }}
            />
          </picture>
        </div>
      ))}

      {/* sombras para leitura */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] bg-linear-to-t from-ink via-ink/35 to-ink/20" />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] hidden bg-linear-to-r from-ink/70 via-ink/10 to-transparent md:block" />
      <div data-hero-shade aria-hidden className="pointer-events-none absolute inset-0 z-[4] bg-ink opacity-0" />

      {/* textos */}
      <div className="wrap pointer-events-none absolute inset-x-0 bottom-0 z-[5] pb-[calc(7.5rem+env(safe-area-inset-bottom))] md:pb-36">
        <div className="relative">
          {slides.map((s, i) => (
            <div
              key={s.slug}
              data-copy={i}
              data-intro={i === 0 ? "" : undefined}
              className={i === 0 ? "relative" : "absolute inset-x-0 bottom-0"}
              style={{ visibility: i === 0 ? "visible" : "hidden" }}
              aria-hidden={i !== index}
            >
              <p className="eyebrow mb-5 flex items-center gap-3 overflow-hidden text-bone-2 md:mb-7">
                <span data-line className="inline-block">
                  {s.brand} <span className="mx-2 text-faint">/</span> {s.year}
                </span>
              </p>
              <h2 className="font-wide text-[clamp(2.4rem,8.6vw,10rem)] leading-[0.88] font-light tracking-[-0.03em] uppercase">
                {s.model.split(" ").reduce<string[][]>((acc, w) => {
                  // quebra em no máximo 2 linhas equilibradas
                  const last = acc[acc.length - 1];
                  if (!last || (acc.length < 2 && last.join(" ").length + w.length > 11)) acc.push([w]);
                  else last.push(w);
                  return acc;
                }, []).map((line) => (
                  <span key={line.join(" ")} className="-mt-[0.16em] block overflow-hidden pt-[0.16em] pb-[0.04em]">
                    <span data-line className="block">
                      {line.join(" ")}
                    </span>
                  </span>
                ))}
              </h2>
              <div className="mt-6 grid gap-6 md:mt-10 md:grid-cols-12 md:items-end">
                <p className="overflow-hidden text-base text-bone-2 md:col-span-4 md:text-lg">
                  <span data-line className="block">
                    {s.version}
                  </span>
                </p>
                <dl className="hidden overflow-hidden md:col-span-4 md:col-start-6 md:flex md:gap-10 lg:gap-14">
                  {[
                    ["Quilometragem", s.km],
                    ["Câmbio", s.transmission],
                    ...(s.power ? [["Potência", s.power]] : []),
                  ].map(([k, v]) => (
                    <div key={k} data-line>
                      <dt className="eyebrow text-faint">{k}</dt>
                      <dd className="mt-2 text-sm text-bone tabular">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="overflow-hidden md:col-span-3 md:col-start-10 md:text-right">
                  <span data-line className="block font-semiwide text-2xl font-light tracking-[-0.01em] tabular md:text-3xl">
                    {s.price}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* navegação */}
      <div
        data-hero-ui
        data-intro=""
        className="wrap absolute inset-x-0 bottom-0 z-[6] flex items-center gap-4 pb-[max(1.75rem,env(safe-area-inset-bottom))] md:gap-8 md:pb-10"
      >
        <Link
          href={`/estoque/${current.slug}`}
          className="group flex h-12 shrink-0 items-center gap-3 bg-bone px-5 text-ink transition-colors duration-500 hover:bg-chrome-hi md:px-7"
        >
          <span className="eyebrow">Ver veículo</span>
          <ArrowRight className="size-4 transition-transform duration-500 ease-expo group-hover:translate-x-1" />
        </Link>

        <ol className="flex flex-1 items-center gap-2 md:gap-4" aria-label="Escolher destaque">
          {slides.map((s, i) => (
            <li key={s.slug} className="flex-1">
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`${s.brand} ${s.model}`}
                aria-current={i === index}
                className="group block w-full py-4 text-left"
              >
                <span className={`eyebrow mb-3 hidden truncate transition-colors duration-500 xl:block ${i === index ? "text-bone" : "text-faint group-hover:text-bone-2"}`}>
                  {String(i + 1).padStart(2, "0")} <span className="ml-2">{s.model}</span>
                </span>
                <span className="relative block h-px w-full bg-line-strong">
                  <span data-bar={i} className="absolute inset-0 block origin-left scale-x-0 bg-bone" />
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div className="flex shrink-0 items-center">
          <button type="button" onClick={() => go(index - 1)} aria-label="Destaque anterior" className="grid size-12 place-items-center text-bone-2 transition-colors hover:text-bone">
            <ArrowLeft className="size-5" />
          </button>
          <button type="button" onClick={() => go(index + 1)} aria-label="Próximo destaque" className="grid size-12 place-items-center text-bone-2 transition-colors hover:text-bone">
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Destaque {index + 1} de {slides.length}: {current.brand} {current.model}, {current.price}
      </p>
    </section>
  );
}
