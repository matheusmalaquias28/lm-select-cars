"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Close, Expand } from "@/components/Icons";
import { lockScroll } from "@/lib/scroll";

type Photo = { src: string; w: number; h: number };

/**
 * Faixa de fotos de ponta a ponta: cada foto mantém a proporção original
 * (o estoque mistura fotos verticais e horizontais), rolagem com snap,
 * arraste no desktop e tela cheia com teclado.
 */
export function Gallery({ photos, alt, cover }: { photos: Photo[]; alt: string; cover: string | null }) {
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [box, setBox] = useState<number | null>(null);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });

  // índice atual = foto mais próxima da borda esquerda
  const onScroll = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    const items = [...el.children] as HTMLElement[];
    const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    let best = 0;
    let dist = Infinity;
    items.forEach((it, i) => {
      const d = Math.abs(it.offsetLeft - pad - el.scrollLeft);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    if (el.scrollLeft >= max - 2) best = items.length - 1;
    setCurrent(best);
  }, []);

  const goTo = (i: number) => {
    const el = track.current;
    const item = el?.children[Math.max(0, Math.min(photos.length - 1, i))] as HTMLElement | undefined;
    if (!el || !item) return;
    const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    el.scrollTo({ left: item.offsetLeft - pad, behavior: "smooth" });
  };

  // arrastar com o mouse
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !track.current) return;
    drag.current = { down: true, x: e.clientX, left: track.current.scrollLeft, moved: false };
    track.current.style.scrollSnapType = "none";
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.down || !track.current) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) d.moved = true;
    track.current.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    const el = track.current;
    if (!drag.current.down || !el) return;
    drag.current.down = false;
    el.style.scrollSnapType = "";
    goTo(current);
  };

  // tela cheia
  useEffect(() => {
    if (box === null) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBox(null);
      if (e.key === "ArrowRight") setBox((b) => (b === null ? b : (b + 1) % photos.length));
      if (e.key === "ArrowLeft") setBox((b) => (b === null ? b : (b - 1 + photos.length) % photos.length));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [box, photos.length]);

  const swipe = useRef(0);

  return (
    <div className="relative">
      <div
        ref={track}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className="no-scrollbar flex snap-x snap-mandatory gap-1.5 overflow-x-auto overscroll-x-contain px-(--gutter) [scroll-padding-inline:var(--gutter)] md:gap-2 md:cursor-grab md:active:cursor-grabbing"
        role="region"
        aria-roledescription="galeria"
        aria-label={`Fotos: ${alt}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
          e.preventDefault();
          goTo(current + (e.key === "ArrowRight" ? 1 : -1));
        }}
      >
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => !drag.current.moved && setBox(i)}
            className="group relative h-[clamp(300px,64svh,780px)] shrink-0 snap-start overflow-hidden bg-ink-2"
            style={{ aspectRatio: `${p.w} / ${p.h}` }}
            aria-label={`Ampliar foto ${i + 1} de ${photos.length}`}
          >
            <Image
              src={p.src}
              alt={i === 0 ? alt : ""}
              fill
              draggable={false}
              priority={i < 2}
              placeholder={i === 0 && cover ? "blur" : "empty"}
              blurDataURL={i === 0 ? (cover ?? undefined) : undefined}
              sizes={p.w >= p.h ? "(min-width: 1024px) 66vw, 92vw" : "(min-width: 1024px) 34vw, 70vw"}
              quality={85}
              className="object-cover transition-transform duration-[1.4s] ease-expo group-hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      {/* controles */}
      <div className="wrap mt-5 flex items-center gap-6">
        <p className="font-semiwide text-sm tabular" aria-live="polite">
          {String(current + 1).padStart(2, "0")} <span className="text-faint">/ {String(photos.length).padStart(2, "0")}</span>
        </p>
        <div className="relative h-px flex-1 bg-line-strong" aria-hidden>
          <div className="absolute inset-y-0 left-0 bg-bone transition-[width] duration-300" style={{ width: `${Math.max(6, progress * 100)}%` }} />
        </div>
        <div className="flex items-center">
          <button type="button" onClick={() => goTo(current - 1)} disabled={current === 0} aria-label="Foto anterior" className="grid size-11 place-items-center text-bone-2 transition-colors hover:text-bone disabled:opacity-30">
            <ArrowLeft className="size-5" />
          </button>
          <button type="button" onClick={() => goTo(current + 1)} disabled={current >= photos.length - 1} aria-label="Próxima foto" className="grid size-11 place-items-center text-bone-2 transition-colors hover:text-bone disabled:opacity-30">
            <ArrowRight className="size-5" />
          </button>
          <button type="button" onClick={() => setBox(current)} className="ml-2 hidden h-11 items-center gap-2.5 border border-line-strong px-4 transition-colors hover:border-chrome sm:flex">
            <Expand className="size-4" />
            <span className="eyebrow">Tela cheia</span>
          </button>
        </div>
      </div>

      {box !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Fotos em tela cheia"
          className="fixed inset-0 z-[95] flex flex-col bg-ink"
          onPointerDown={(e) => (swipe.current = e.clientX)}
          onPointerUp={(e) => {
            const dx = e.clientX - swipe.current;
            if (Math.abs(dx) > 60) setBox((b) => (b === null ? b : (b + (dx < 0 ? 1 : -1) + photos.length) % photos.length));
          }}
        >
          <div className="wrap flex h-16 shrink-0 items-center justify-between">
            <p className="font-semiwide text-sm tabular">
              {String(box + 1).padStart(2, "0")} <span className="text-faint">/ {String(photos.length).padStart(2, "0")}</span>
            </p>
            <button type="button" autoFocus onClick={() => setBox(null)} className="-mr-2 flex h-11 items-center gap-3 px-2" aria-label="Fechar">
              <span className="eyebrow hidden text-bone-2 sm:inline">Fechar</span>
              <Close className="size-6" />
            </button>
          </div>
          <div className="relative flex-1">
            <Image key={photos[box].src} src={photos[box].src} alt={`${alt}, foto ${box + 1}`} fill sizes="100vw" quality={90} className="object-contain" />
            <button type="button" onClick={() => setBox((box - 1 + photos.length) % photos.length)} aria-label="Foto anterior" className="absolute top-1/2 left-2 grid size-14 -translate-y-1/2 place-items-center bg-ink/60 md:left-6">
              <ArrowLeft className="size-6" />
            </button>
            <button type="button" onClick={() => setBox((box + 1) % photos.length)} aria-label="Próxima foto" className="absolute top-1/2 right-2 grid size-14 -translate-y-1/2 place-items-center bg-ink/60 md:right-6">
              <ArrowRight className="size-6" />
            </button>
          </div>
          <div className="no-scrollbar flex h-24 shrink-0 gap-1.5 overflow-x-auto px-(--gutter) py-3" data-lenis-prevent>
            {photos.map((p, i) => (
              <button
                key={p.src}
                type="button"
                onClick={() => setBox(i)}
                aria-label={`Foto ${i + 1}`}
                aria-current={i === box}
                className={`relative h-full shrink-0 overflow-hidden transition-opacity ${i === box ? "opacity-100 outline outline-1 outline-bone" : "opacity-45 hover:opacity-80"}`}
                style={{ aspectRatio: `${p.w} / ${p.h}` }}
              >
                <Image src={p.src} alt="" fill sizes="120px" quality={70} className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
