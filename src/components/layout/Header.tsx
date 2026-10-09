"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { MobileMenu } from "./MobileMenu";
import { nav, site, whatsappLink } from "@/lib/site";
import { WhatsApp } from "@/components/Icons";

const left = nav.slice(0, 3);
const right = nav.slice(3);

export function Header({ stockCount }: { stockCount: number }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // some ao descer, volta ao subir (nunca no topo)
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > window.innerHeight * 0.6);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  // fecha o menu ao trocar de página (inclusive pelo botão voltar)
  const [path, setPath] = useState(pathname);
  if (path !== pathname) {
    setPath(pathname);
    setOpen(false);
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const linkCls = (href: string) =>
    `eyebrow relative py-2 transition-colors duration-500 hover:text-chrome-hi ${isActive(href) ? "text-chrome-hi" : "text-bone-2"}`;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-expo ${hidden && !open ? "-translate-y-full" : "translate-y-0"}`}
      >
        {/* fundo: degradê sobre a hero, sólido depois de rolar */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 bg-linear-to-b from-ink/80 to-transparent transition-opacity duration-700 ${scrolled ? "opacity-0" : "opacity-100"}`}
        />
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 border-b border-line bg-ink transition-opacity duration-700 ${scrolled ? "opacity-100" : "opacity-0"}`}
        />

        <div className="wrap relative grid h-(--header-h) grid-cols-[1fr_auto_1fr] items-center">
          {/* esquerda */}
          <nav aria-label="Principal" className="hidden items-center gap-9 lg:flex xl:gap-12">
            {left.map((l) => (
              <Link key={l.href} href={l.href} className={linkCls(l.href)} aria-current={isActive(l.href) ? "page" : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="group -ml-2 flex h-11 items-center gap-3 px-2 lg:hidden"
          >
            <span className="flex w-6 flex-col gap-[7px]" aria-hidden>
              <span className="h-px w-full bg-bone" />
              <span className="h-px w-3/5 bg-bone transition-[width] duration-500 group-hover:w-full" />
            </span>
            <span className="eyebrow hidden text-bone-2 sm:inline">Menu</span>
            <span className="sr-only sm:hidden">Abrir menu</span>
          </button>

          {/* centro: logo em destaque */}
          <Link href="/" aria-label="LM Select Cars, página inicial" className="relative block">
            <span
              data-header-logo
              className={`block origin-center transition-transform duration-700 ease-expo ${scrolled ? "scale-[0.74]" : "scale-100"}`}
            >
              <Logo gid="lm-header" className="h-auto w-[7.25rem] sm:w-[8.5rem] lg:w-[11.5rem]" />
            </span>
          </Link>

          {/* direita */}
          <div className="flex items-center justify-end gap-9 xl:gap-12">
            <nav aria-label="Institucional" className="hidden items-center gap-9 lg:flex xl:gap-12">
              {right.map((l) => (
                <Link key={l.href} href={l.href} className={linkCls(l.href)} aria-current={isActive(l.href) ? "page" : undefined}>
                  {l.label}
                </Link>
              ))}
            </nav>
            <a
              href={whatsappLink("Olá! Vim pelo site da LM Select Cars.")}
              target="_blank"
              rel="noopener"
              className="group flex h-11 items-center gap-3 border-line-strong text-bone transition-colors duration-500 hover:border-chrome lg:border lg:px-5"
            >
              <WhatsApp className="size-[18px] text-bone-2 transition-colors group-hover:text-chrome-hi" />
              <span className="eyebrow hidden lg:inline">WhatsApp</span>
              <span className="sr-only lg:hidden">Falar no WhatsApp {site.whatsapp.label}</span>
            </a>
          </div>
        </div>
      </header>

      <MobileMenu open={open} onClose={close} stockCount={stockCount} />
    </>
  );
}
