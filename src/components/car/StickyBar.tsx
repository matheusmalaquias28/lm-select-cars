"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Barra fixa do celular: só aparece depois que a seção `after` sai da tela por cima. */
export function StickyBar({ after, children }: { after: string; children: ReactNode }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = document.getElementById(after);
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, [after]);

  return (
    <div
      inert={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 pb-[env(safe-area-inset-bottom)] transition-transform duration-500 ease-expo lg:hidden ${show ? "translate-y-0" : "translate-y-full"}`}
    >
      {children}
    </div>
  );
}
