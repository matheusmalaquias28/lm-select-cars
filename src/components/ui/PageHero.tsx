import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  crumbs: { label: string; href?: string }[];
  title: ReactNode;
  text?: ReactNode;
  children?: ReactNode;
};

/** Abertura das páginas internas: trilha, título largo e apoio à direita. */
export function PageHero({ crumbs, title, text, children }: Props) {
  return (
    <header className="wrap border-b border-line pt-[calc(var(--header-h)+3.5rem)] pb-12 md:pt-[calc(var(--header-h)+6rem)] md:pb-16">
      <nav aria-label="Trilha de navegação" data-reveal="fade">
        <ol className="eyebrow flex flex-wrap items-center gap-3 text-faint">
          <li>
            <Link href="/" className="transition-colors hover:text-bone">
              Início
            </Link>
          </li>
          {crumbs.map((c) => (
            <li key={c.label} className="flex items-center gap-3">
              <span aria-hidden className="h-px w-4 bg-line-strong" />
              {c.href ? (
                <Link href={c.href} className="transition-colors hover:text-bone">
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-bone-2">
                  {c.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-12 lg:items-end">
        <h1 data-split className="font-wide text-[clamp(2.4rem,7vw,7.5rem)] leading-[0.92] font-light tracking-[-0.03em] uppercase lg:col-span-8">
          {title}
        </h1>
        {text && (
          <div data-reveal className="max-w-md leading-relaxed text-bone-2 lg:col-span-4 lg:justify-self-end">
            {text}
          </div>
        )}
      </div>
      {children}
    </header>
  );
}
