"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, SoundOff, SoundOn } from "@/components/Icons";

/**
 * Vídeo vertical do showroom: toca sem som enquanto está na tela e pausa fora dela.
 * Com "reduzir movimento" ativo, só toca quando a pessoa aperta o play.
 */
export function ShowroomVideo({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const wanted = useRef(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) wanted.current = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && wanted.current) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    wanted.current = v.paused;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <div className={`relative overflow-hidden bg-ink-2 ${className}`}>
      <video
        ref={ref}
        src="/video/showroom-lm.mp4"
        poster="/video/showroom-lm-poster.jpg"
        muted={muted}
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-label="Tour pelo showroom da LM Select Cars em Vila Velha"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute right-3 bottom-3 flex gap-2">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}
          className="grid size-10 place-items-center bg-ink/60 text-bone backdrop-blur-sm transition-colors hover:bg-ink/80"
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Ativar som" : "Desativar som"}
          aria-pressed={!muted}
          className="grid size-10 place-items-center bg-ink/60 text-bone backdrop-blur-sm transition-colors hover:bg-ink/80"
        >
          {muted ? <SoundOff className="size-4" /> : <SoundOn className="size-4" />}
        </button>
      </div>
    </div>
  );
}
