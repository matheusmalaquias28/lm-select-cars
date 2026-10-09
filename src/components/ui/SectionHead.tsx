import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: ReactNode;
  aside?: ReactNode;
  id?: string;
  className?: string;
};

/** Cabeçalho de seção: rótulo + título largo à esquerda, apoio à direita. */
export function SectionHead({ eyebrow, title, aside, id, className = "" }: Props) {
  return (
    <div className={`grid gap-8 lg:grid-cols-12 lg:items-end ${className}`}>
      <div className="lg:col-span-7">
        <p data-reveal="fade" className="eyebrow mb-6 flex items-center gap-4 text-mute">
          <span aria-hidden className="h-px w-8 bg-chrome/60" />
          {eyebrow}
        </p>
        <h2 id={id} data-split className="font-wide text-[clamp(1.9rem,4.6vw,4.75rem)] leading-[0.98] font-light tracking-[-0.025em] uppercase">
          {title}
        </h2>
      </div>
      {aside && (
        <div data-reveal className="text-bone-2 lg:col-span-4 lg:col-start-9">
          {aside}
        </div>
      )}
    </div>
  );
}
