"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Logo } from "@/components/brand/Logo";
import { Close, Instagram, Phone, WhatsApp } from "@/components/Icons";
import { lockScroll } from "@/lib/scroll";
import { nav, site, whatsappLink } from "@/lib/site";

/** Menu lateral em tela cheia: painel entra pela esquerda, links em cascata. */
export function MobileMenu({ open, onClose, stockCount }: { open: boolean; onClose: () => void; stockCount: number }) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .set(el, { visibility: "visible" })
        .fromTo("[data-m-scrim]", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" }, 0)
        .fromTo("[data-m-panel]", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1, ease: "expo.inOut" }, 0)
        .fromTo("[data-m-rule]", { scaleX: 0 }, { scaleX: 1, duration: 1.2, stagger: 0.06, transformOrigin: "0 50%" }, 0.45)
        .fromTo("[data-m-link]", { xPercent: -14, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1.1, stagger: 0.07 }, 0.5)
        .fromTo("[data-m-foot]", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.06 }, 0.75)
        .fromTo("[data-m-mark]", { opacity: 0, x: 60 }, { opacity: 0.05, x: 0, duration: 1.8 }, 0.4);
    }, el);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    lockScroll(open);
    if (open) {
      t.timeScale(1).play();
      root.current?.querySelector<HTMLElement>("[data-m-close]")?.focus();
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
    t.timeScale(1.8).reverse();
  }, [open, onClose]);

  return (
    <div
      ref={root}
      id="menu-mobile"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      inert={!open}
      className="invisible fixed inset-0 z-[80] lg:hidden"
    >
      <div data-m-scrim className="absolute inset-0 bg-ink/70" onClick={onClose} />

      <div data-m-panel className="absolute inset-0 flex flex-col overflow-hidden bg-ink-2" style={{ clipPath: "inset(0 100% 0 0)" }}>
        {/* monograma gigante ao fundo */}
        <div data-m-mark aria-hidden className="pointer-events-none absolute -right-[18%] bottom-[16%] w-[110%] text-bone opacity-0">
          <Logo variant="mono" tone="current" className="h-auto w-full" />
        </div>

        <div className="wrap relative flex h-(--header-h) shrink-0 items-center justify-between">
          <button data-m-close type="button" onClick={onClose} className="-ml-2 flex h-11 items-center gap-3 px-2">
            <Close className="size-6" />
            <span className="eyebrow text-bone-2">Fechar</span>
          </button>
          <Logo gid="lm-menu" className="h-auto w-[6.5rem]" />
        </div>

        <nav aria-label="Menu principal" className="wrap relative mt-6 flex-1 overflow-y-auto" data-lenis-prevent>
          <ul>
            {[{ href: "/", label: "Início" }, ...nav].map((l, i) => (
              <li key={l.href} className="relative">
                <span data-m-rule aria-hidden className="absolute inset-x-0 top-0 h-px bg-line" />
                <Link
                  data-m-link
                  href={l.href}
                  onClick={onClose}
                  className="flex items-baseline justify-between gap-4 py-[clamp(0.9rem,2.6vh,1.4rem)] font-wide text-[clamp(1.5rem,7.4vw,2.6rem)] leading-none font-light tracking-[-0.01em] uppercase"
                >
                  <span>{l.label}</span>
                  <span className="eyebrow text-faint tabular">
                    {l.href === "/estoque" ? `${stockCount} veículos` : String(i + 1).padStart(2, "0")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="wrap relative grid shrink-0 grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <a data-m-foot href={whatsappLink("Olá! Vim pelo site da LM Select Cars.")} target="_blank" rel="noopener" className="col-span-2 flex h-14 items-center justify-center gap-3 bg-bone text-ink">
            <WhatsApp className="size-5" />
            <span className="eyebrow">Falar com um consultor</span>
          </a>
          <a data-m-foot href={site.phone.href} className="flex items-center gap-2.5 text-sm text-bone-2">
            <Phone className="size-4 text-mute" />
            {site.phone.label}
          </a>
          <a data-m-foot href={site.instagram.href} target="_blank" rel="noopener" className="flex items-center gap-2.5 text-sm text-bone-2">
            <Instagram className="size-4 text-mute" />
            {site.instagram.label}
          </a>
          <p data-m-foot className="col-span-2 text-xs leading-relaxed text-mute">
            {site.address.street}, {site.address.district}, {site.address.city}/{site.address.state}
          </p>
        </div>
      </div>
    </div>
  );
}
