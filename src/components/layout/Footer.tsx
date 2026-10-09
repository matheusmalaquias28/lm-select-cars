import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ArrowUpRight, WhatsApp } from "@/components/Icons";
import { nav, site, whatsappLink } from "@/lib/site";
import { brands } from "@/lib/stock";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink">
      {/* chamada final */}
      <div className="wrap grid gap-10 py-20 md:py-28 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-6 text-mute">Showroom em Vila Velha</p>
          <p className="font-wide text-[clamp(1.75rem,4.2vw,4rem)] leading-[1.02] font-light tracking-[-0.02em] uppercase">
            Venha ver de perto.
            <br />
            <span className="text-mute">O carro certo merece uma visita.</span>
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
          <a
            href={whatsappLink("Olá! Gostaria de agendar uma visita ao showroom da LM Select Cars.")}
            target="_blank"
            rel="noopener"
            className="group flex h-14 items-center justify-center gap-3 bg-bone px-8 text-ink transition-colors duration-500 hover:bg-chrome-hi"
          >
            <WhatsApp className="size-5" />
            <span className="eyebrow">Agendar visita</span>
          </a>
          <a
            href={site.maps}
            target="_blank"
            rel="noopener"
            className="group flex h-14 items-center justify-center gap-3 border border-line-strong px-8 transition-colors duration-500 hover:border-chrome"
          >
            <span className="eyebrow">Como chegar</span>
            <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      <div className="wrap grid gap-12 border-t border-line py-16 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo gid="lm-footer" className="h-auto w-36" />
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-mute">
            Há mais de {site.since} anos selecionando veículos premium com procedência, transparência e atendimento pessoal.
          </p>
        </div>

        <div className="lg:col-span-2">
          <p className="eyebrow mb-6 text-faint">Navegação</p>
          <ul className="space-y-3 text-sm">
            {nav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hairline-hover text-bone-2 transition-colors hover:text-bone">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <p className="eyebrow mb-6 text-faint">Atendimento</p>
          <ul className="space-y-3 text-sm text-bone-2">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener" className="hairline-hover hover:text-bone">
                WhatsApp {site.whatsapp.label}
              </a>
            </li>
            <li>
              <a href={site.phone.href} className="hairline-hover hover:text-bone">
                Telefone {site.phone.label}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hairline-hover hover:text-bone">
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.instagram.href} target="_blank" rel="noopener" className="hairline-hover hover:text-bone">
                Instagram {site.instagram.label}
              </a>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <p className="eyebrow mb-6 text-faint">Endereço</p>
          <address className="text-sm leading-relaxed text-bone-2 not-italic">
            {site.address.street}
            <br />
            {site.address.district}, {site.address.city}/{site.address.state}
                <br />
                CEP {site.address.cep}
          </address>
          <dl className="mt-6 space-y-1.5 text-sm">
            {site.hours.map((h) => (
              <div key={h.days} className="flex justify-between gap-6 border-b border-line pb-1.5">
                <dt className="text-mute">{h.days}</dt>
                <dd className="text-bone-2 tabular">{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="wrap border-t border-line py-8">
        <p className="eyebrow mb-4 text-faint">Marcas no estoque</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-mute">
          {brands.map((b) => (
            <li key={b.key}>
              <Link href={`/estoque?marca=${b.key}`} className="hairline-hover hover:text-bone">
                {b.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="wrap flex flex-col gap-3 border-t border-line py-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 LM Select Cars. Todos os direitos reservados.</p>
        <Link href="/privacidade" className="hairline-hover hover:text-bone-2">
          Política de privacidade
        </Link>
      </div>

      {/* assinatura: logo de ponta a ponta */}
      <div aria-hidden className="wrap pb-6 text-ink-3">
        <Logo tone="current" className="h-auto w-full" title="" />
      </div>
    </footer>
  );
}
