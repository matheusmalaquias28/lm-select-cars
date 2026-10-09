"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { getLenis, scrollToTarget, setLenis } from "@/lib/scroll";
import { onIntroDone } from "@/lib/intro";

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Rolagem suave (uma instância para o app inteiro). */
export function SmoothScroll() {
  useEffect(() => {
    if (reduced()) return;
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(500, 33);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}

/**
 * Animações por atributo. Renderizar no fim de cada página (roda depois que ela hidrata).
 * - data-split                 título revelado linha a linha, com máscara
 * - data-reveal="up|fade|img|stagger|line"
 * - data-parallax="0.15"
 * - data-delay="0.2"
 * Elementos com data-intro são animados pelo próprio componente.
 */
export function PageMotion() {
  useEffect(() => {
    const lenis = getLenis();
    if (window.location.hash) window.setTimeout(() => scrollToTarget(window.location.hash, -90), 300);
    else if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    if (reduced()) return;

    let cancelled = false;
    const ctx = gsap.context(() => {});
    const splits: SplitText[] = [];

    const run = () =>
      ctx.add(() => {
        document.querySelectorAll<HTMLElement>("[data-split]:not([data-intro])").forEach((el) => {
          const split = new SplitText(el, { type: "lines", mask: "lines", linesClass: "split-line" });
          splits.push(split);
          gsap.set(el, { visibility: "visible" });
          gsap.from(split.lines, {
            yPercent: 105,
            duration: 1.4,
            ease: "expo.out",
            stagger: 0.1,
            delay: Number(el.dataset.delay ?? 0),
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-intro])").forEach((el) => {
          const kind = el.dataset.reveal;
          const delay = Number(el.dataset.delay ?? 0);
          const st = { trigger: el, start: "top 90%", once: true };
          if (kind === "img") {
            gsap.set(el, { opacity: 1 });
            gsap.fromTo(
              el,
              { clipPath: "inset(10% 6% 10% 6%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.out", delay, scrollTrigger: st },
            );
            const img = el.querySelector("img");
            if (img) gsap.from(img, { scale: 1.18, duration: 2, ease: "expo.out", delay, scrollTrigger: st });
          } else if (kind === "stagger") {
            gsap.set(el, { opacity: 1 });
            gsap.from(el.children, { y: 28, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.07, delay, scrollTrigger: st });
          } else if (kind === "line") {
            gsap.set(el, { opacity: 1 });
            gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, transformOrigin: "0 50%", duration: 1.6, ease: "expo.out", delay, scrollTrigger: st });
          } else if (kind === "fade") {
            gsap.to(el, { opacity: 1, duration: 1.4, ease: "power2.out", delay, scrollTrigger: st });
          } else {
            gsap.fromTo(el, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3, ease: "expo.out", delay, scrollTrigger: st });
          }
        });

        document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
          const amount = Number(el.dataset.parallax || 0.15);
          gsap.fromTo(
            el,
            { yPercent: -amount * 50 },
            {
              yPercent: amount * 50,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });

    // Espera fontes e a saída do preloader: assim as primeiras revelações acontecem à vista
    const off = onIntroDone(() =>
      document.fonts.ready.then(() => {
        if (cancelled) return;
        run();
        ScrollTrigger.refresh();
      }),
    );

    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 600);
    window.addEventListener("load", refresh);

    return () => {
      off();
      window.clearTimeout(t);
      window.removeEventListener("load", refresh);
      cancelled = true;
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, []);

  return null;
}
