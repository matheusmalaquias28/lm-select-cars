"use client";

import { useEffect, useState } from "react";
import { WhatsApp } from "@/components/Icons";
import { whatsappLink } from "@/lib/site";

/** Aparece depois da primeira dobra, para não disputar espaço com a hero. */
export function WhatsAppFloat() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={whatsappLink("Olá! Vim pelo site da LM Select Cars.")}
      target="_blank"
      rel="noopener"
      aria-label="Falar no WhatsApp"
      tabIndex={show ? 0 : -1}
      className={`wa-float fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 grid size-14 place-items-center border border-line-strong bg-ink/90 text-bone transition-[opacity,translate,border-color] duration-700 ease-expo hover:border-chrome ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <WhatsApp className="size-[22px]" />
    </a>
  );
}
