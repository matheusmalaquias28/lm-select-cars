import { Suspense, type ReactNode } from "react";

/** Coluna de apoio à esquerda, formulário à direita. */
export function FormShell({ aside, children }: { aside: ReactNode; children: ReactNode }) {
  return (
    <section className="wrap grid gap-16 py-16 md:py-24 lg:grid-cols-12 lg:gap-0">
      <div className="lg:col-span-4">{aside}</div>
      <div data-reveal className="lg:col-span-7 lg:col-start-6">
        <Suspense fallback={<div aria-busy="true" className="h-[32rem] animate-pulse border border-line bg-ink-2" />}>{children}</Suspense>
      </div>
    </section>
  );
}

export function Steps({ title, steps }: { title: string; steps: { t: string; d: string }[] }) {
  return (
    <div>
      <p className="eyebrow mb-8 flex items-center gap-4 text-mute">
        <span aria-hidden className="h-px w-8 bg-chrome/60" />
        {title}
      </p>
      <ol data-reveal="stagger" className="border-t border-line">
        {steps.map((s, i) => (
          <li key={s.t} className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-line py-6">
            <span className="eyebrow pt-1 text-faint tabular">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <p className="font-wide text-base tracking-[0.02em] uppercase">{s.t}</p>
              <p className="mt-2 text-sm leading-relaxed text-mute">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
