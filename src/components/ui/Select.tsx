"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "@/components/Icons";

export type Option = { value: string; label: string; hint?: string; disabled?: boolean };

type Props = {
  label: string;
  placeholder: string;
  value: string | undefined;
  options: Option[];
  onChange: (value: string | undefined) => void;
  className?: string;
  /** "field" = rótulo pequeno em cima (barra de busca); "inline" = compacto (ordenação) */
  variant?: "field" | "inline";
  align?: "left" | "right";
};

/** Lista suspensa minimalista com teclado (setas, Enter, Esc, letras) e leitor de tela. */
export function Select({ label, placeholder, value, options, onChange, className = "", variant = "field", align = "left" }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const all: Option[] = [{ value: "", label: placeholder }, ...options];
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) list.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const openList = () => {
    setActive(Math.max(0, all.findIndex((o) => o.value === (value ?? ""))));
    setOpen(true);
  };

  const pick = (o: Option) => {
    if (o.disabled) return;
    onChange(o.value || undefined);
    setOpen(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (!open && ["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      openList();
      return;
    }
    if (!open) return;
    const move: Record<string, () => void> = {
      ArrowDown: () => setActive((a) => Math.min(all.length - 1, a + 1)),
      ArrowUp: () => setActive((a) => Math.max(0, a - 1)),
      Home: () => setActive(0),
      End: () => setActive(all.length - 1),
      Enter: () => pick(all[active]),
      " ": () => pick(all[active]),
    };
    if (e.key === "Escape" || e.key === "Tab") setOpen(false);
    else if (move[e.key]) {
      e.preventDefault();
      move[e.key]();
    } else if (e.key.length === 1) {
      const i = all.findIndex((o, idx) => idx > 0 && o.label.toLowerCase().startsWith(e.key.toLowerCase()));
      if (i >= 0) setActive(i);
    }
  };

  return (
    <div ref={root} className={`relative ${className}`}>
      <button
        type="button"
        id={`${id}-btn`}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKey}
        className={
          variant === "field"
            ? "group flex h-full w-full items-center justify-between gap-3 text-left"
            : "group flex h-11 items-center gap-2 text-left"
        }
      >
        <span className="min-w-0">
          {variant === "field" && <span className="eyebrow block text-faint">{label}</span>}
          {variant === "inline" && <span className="sr-only">{label}: </span>}
          <span className={`block truncate ${variant === "field" ? "mt-1.5 text-[15px]" : "text-sm"} ${current ? "text-bone" : "text-bone-2"}`}>
            {current?.label ?? placeholder}
          </span>
        </span>
        <ChevronDown className={`size-4 shrink-0 text-mute transition-transform duration-500 ease-expo ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul
          ref={list}
          id={`${id}-list`}
          role="listbox"
          aria-labelledby={`${id}-btn`}
          data-lenis-prevent
          className={`absolute top-[calc(100%+0.75rem)] z-40 max-h-80 min-w-full overflow-y-auto border border-line-strong bg-ink-2 py-2 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.7)] ${align === "right" ? "right-0" : "left-0"} ${variant === "inline" ? "w-60" : "w-max max-w-[22rem]"}`}
        >
          {all.map((o, i) => {
            const selected = (value ?? "") === o.value;
            return (
              <li
                key={o.value || "_all"}
                id={`${id}-${i}`}
                data-i={i}
                role="option"
                aria-selected={selected}
                aria-disabled={o.disabled || undefined}
                onPointerEnter={() => setActive(i)}
                onClick={() => pick(o)}
                className={`flex cursor-pointer items-center justify-between gap-6 px-4 py-2.5 text-sm transition-colors ${
                  i === active ? "bg-ink-4 text-bone" : "text-bone-2"
                } ${o.disabled ? "cursor-default opacity-35" : ""}`}
              >
                <span className="flex items-center gap-3">
                  <Check className={`size-3.5 ${selected ? "text-chrome-hi" : "opacity-0"}`} />
                  {o.label}
                </span>
                {o.hint && <span className="text-xs text-faint tabular">{o.hint}</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
