"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ChromeGradient, LOGO_VIEWBOX, MONO_PATHS, WORD_PATHS } from "@/components/brand/Logo";
import { markIntroDone } from "@/lib/intro";
import { lockScroll } from "@/lib/scroll";

const KEY = "lm-intro";

/**
 * Abertura: o monograma sobe, o lettering entra letra a letra, um reflexo cromado
 * atravessa a logo e ela "voa" até o centro do menu, onde passa a morar.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const html = document.documentElement;
    if (!el || html.classList.contains("intro-seen")) {
      markIntroDone();
      return;
    }

    const finish = () => {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      lockScroll(false);
      html.classList.add("intro-seen");
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.to(el, { opacity: 0, duration: 0.4, delay: 0.4, onComplete: () => (markIntroDone(), finish()) });
      return;
    }

    lockScroll(true);
    const counter = { v: 0 };
    const numEl = el.querySelector<HTMLElement>("[data-pl-num]");
    const logo = el.querySelector<HTMLElement>("[data-pl-logo]");
    let cancelled = false;
    const ctx = gsap.context(() => {}, el);

    // Leva a logo do preloader até a posição exata da logo do header (FLIP)
    const flyToHeader = () => {
      const target = document.querySelector<HTMLElement>("[data-header-logo] svg");
      if (!logo || !target) return gsap.timeline();
      const a = logo.getBoundingClientRect();
      const b = target.getBoundingClientRect();
      return gsap.timeline().to(logo, {
        x: b.left + b.width / 2 - (a.left + a.width / 2),
        y: b.top + b.height / 2 - (a.top + a.height / 2),
        scale: b.width / a.width,
        duration: 1.25,
        ease: "expo.inOut",
      });
    };

    const start = () =>
      ctx.add(() => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from("[data-pl-mono] path", { y: 700, duration: 1.5, stagger: 0.12 }, 0.15)
          .from("[data-pl-word] path", { y: 320, duration: 1.2, stagger: 0.045 }, 0.7)
          .fromTo("[data-pl-sheen]", { attr: { x: -1400 } }, { attr: { x: 4400 }, duration: 1.4, ease: "power2.inOut" }, 1.35)
          .to(counter, {
            v: 100,
            duration: 2.4,
            ease: "power2.inOut",
            onUpdate: () => {
              if (numEl) numEl.textContent = String(Math.round(counter.v)).padStart(3, "0");
            },
          }, 0)
          .to("[data-pl-bar]", { scaleX: 1, duration: 2.4, ease: "power2.inOut" }, 0)
          .to("[data-pl-meta]", { opacity: 0, y: 12, duration: 0.5, ease: "power2.in", stagger: 0.05 }, 2.45)
          .add(flyToHeader(), 2.6)
          .to("[data-pl-bg]", { opacity: 0, duration: 1, ease: "power2.inOut" }, 2.85)
          .add(markIntroDone, 3.05)
          .add(() => {
            finish();
            gsap.set(el, { display: "none" });
          }, 3.9);
      });

    // espera as fontes e a página assentar (no celular a hidratação trava a thread principal)
    document.fonts.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => !cancelled && start())));

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, []);

  return (
    <div ref={root} aria-hidden className="preloader fixed inset-0 z-[100]">
      <div data-pl-bg className="absolute inset-0 bg-ink" />

      <div className="absolute inset-0 flex items-center justify-center px-8">
        <div data-pl-logo className="w-[min(78vw,34rem)] will-change-transform">
          <svg viewBox={LOGO_VIEWBOX.full} className="h-auto w-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <ChromeGradient id="lm-pl" />
              <clipPath id="pl-mono-clip">
                <rect x="1000" y="20" width="1960" height="600" />
              </clipPath>
              <clipPath id="pl-word-clip">
                <rect x="0" y="880" width="4000" height="280" />
              </clipPath>
              <clipPath id="pl-all">
                {[...MONO_PATHS, ...WORD_PATHS].map((d) => (
                  <path key={d} d={d} />
                ))}
              </clipPath>
              <linearGradient id="pl-sheen-g" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset="0.5" stopColor="#fff" stopOpacity="0.95" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g fill="url(#lm-pl)">
              <g data-pl-mono clipPath="url(#pl-mono-clip)">
                {MONO_PATHS.map((d) => (
                  <path key={d} d={d} />
                ))}
              </g>
              <g data-pl-word clipPath="url(#pl-word-clip)">
                {WORD_PATHS.map((d) => (
                  <path key={d} d={d} />
                ))}
              </g>
            </g>
            {/* reflexo: faixa clara recortada pelo desenho da logo */}
            <g clipPath="url(#pl-all)">
              <rect data-pl-sheen x="-1400" y="-200" width="700" height="1600" fill="url(#pl-sheen-g)" transform="skewX(-22)" />
            </g>
          </svg>
        </div>
      </div>

      <div className="wrap absolute inset-x-0 bottom-0 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <div className="mb-4 flex items-end justify-between">
          <p data-pl-meta className="eyebrow text-mute">Vila Velha · Espírito Santo</p>
          <p data-pl-meta className="font-wide text-sm font-light tracking-[0.2em] text-bone-2 tabular">
            <span data-pl-num>000</span>
          </p>
        </div>
        <div data-pl-meta className="h-px w-full bg-line">
          <div data-pl-bar className="h-px origin-left scale-x-0 bg-chrome" />
        </div>
      </div>
    </div>
  );
}
