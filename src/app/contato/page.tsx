import type { Metadata } from "next";
import { FormShell } from "@/components/forms/FormShell";
import { LeadForm } from "@/components/forms/LeadForm";
import { PageMotion } from "@/components/motion/Motion";
import { PageHero } from "@/components/ui/PageHero";
import { ArrowUpRight, Clock, Instagram, Mail, Phone, Pin, WhatsApp } from "@/components/Icons";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato",
  description: `Fale com a LM Select Cars: WhatsApp ${site.whatsapp.label}, telefone ${site.phone.label}. ${site.address.street}, ${site.address.city}/${site.address.state}.`,
  alternates: { canonical: "/contato" },
};

export default function ContatoPage() {
  const rows = [
    { icon: WhatsApp, k: "WhatsApp", v: site.whatsapp.label, href: whatsappLink("Olá! Vim pelo site da LM Select Cars.") },
    { icon: Phone, k: "Telefone", v: site.phone.label, href: site.phone.href },
    { icon: Mail, k: "E-mail", v: site.email, href: `mailto:${site.email}` },
    { icon: Instagram, k: "Instagram", v: site.instagram.label, href: site.instagram.href },
  ];

  return (
    <>
      <PageHero
        crumbs={[{ label: "Contato" }]}
        title={
          <>
            Fale com
            <br />
            <span className="text-mute">a LM</span>
          </>
        }
        text={<p>Compra, venda, troca ou financiamento. Responda por aqui ou chame direto no WhatsApp: quem atende conhece cada carro do estoque.</p>}
      />
      <FormShell
        aside={
          <div className="space-y-14">
            <ul data-reveal="stagger" className="border-t border-line">
              {rows.map(({ icon: Icon, k, v, href }) => (
                <li key={k}>
                  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="group flex items-center gap-5 border-b border-line py-5">
                    <Icon className="size-5 shrink-0 text-mute" />
                    <span className="flex-1">
                      <span className="eyebrow block text-faint">{k}</span>
                      <span className="mt-1 block text-bone">{v}</span>
                    </span>
                    <ArrowUpRight className="size-4 text-faint transition-colors group-hover:text-bone" />
                  </a>
                </li>
              ))}
            </ul>

            <div data-reveal>
              <p className="eyebrow mb-5 text-faint">Consultores</p>
              <ul className="border-t border-line">
                {site.consultants.map((c) => (
                  <li key={c.name}>
                    <a href={whatsappLink("Olá! Vim pelo site da LM Select Cars.", c.number)} target="_blank" rel="noopener" className="group flex items-center justify-between gap-4 border-b border-line py-4">
                      <span className="text-bone">{c.name}</span>
                      <span className="text-sm text-mute tabular transition-colors group-hover:text-bone">{c.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div data-reveal className="space-y-6">
              <div className="flex gap-5">
                <Pin className="mt-0.5 size-5 shrink-0 text-mute" />
                <address className="leading-relaxed text-bone-2 not-italic">
                  {site.address.street}
                  <br />
                  {site.address.district}, {site.address.city}/{site.address.state}
                <br />
                CEP {site.address.cep}
                </address>
              </div>
              <div className="flex gap-5">
                <Clock className="mt-0.5 size-5 shrink-0 text-mute" />
                <dl className="w-full space-y-1 text-bone-2">
                  {site.hours.map((h) => (
                    <div key={h.days} className="flex justify-between gap-6">
                      <dt>{h.days}</dt>
                      <dd className="tabular">{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        }
      >
        <LeadForm
          intro="Olá! Vim pelo site da LM Select Cars."
          submitLabel="Enviar mensagem"
          fields={[
            { name: "nome", label: "Nome", required: true, placeholder: "Seu nome", half: true },
            { name: "telefone", label: "WhatsApp", type: "tel", required: true, placeholder: "(27) 99999-9999", half: true },
            { name: "assunto", label: "Assunto", type: "select", required: true, options: ["Comprar um veículo", "Vender ou trocar meu carro", "Financiamento", "Consórcio ou cartão", "Outro assunto"] },
            { name: "mensagem", label: "Mensagem", type: "textarea", required: true, placeholder: "Como podemos ajudar?" },
          ]}
        />
      </FormShell>

      <section aria-label="Mapa" className="relative h-[60svh] min-h-[380px] border-t border-line bg-ink-2">
        <iframe
          title="Mapa: LM Select Cars em Vila Velha"
          src={site.mapsEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full [filter:grayscale(1)_invert(0.92)_contrast(0.85)_brightness(0.95)]"
        />
      </section>
      <PageMotion />
    </>
  );
}
