import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PageMotion } from "@/components/motion/Motion";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Como a LM Select Cars trata os dados pessoais enviados pelo site.",
  alternates: { canonical: "/privacidade" },
};

const sections = [
  {
    t: "Quais dados coletamos",
    d: "O site não tem cadastro nem armazena formulários. Quando você preenche um formulário (contato, avaliação ou financiamento), os dados são usados apenas para montar uma mensagem que é aberta no seu WhatsApp. O envio só acontece se você confirmar a mensagem no aplicativo.",
  },
  {
    t: "Como usamos",
    d: "As informações recebidas pelo WhatsApp, telefone ou e-mail são usadas exclusivamente para responder ao seu pedido: proposta de compra, avaliação de veículo, simulação de crédito ou agendamento de visita.",
  },
  {
    t: "Compartilhamento",
    d: "Para simulações de financiamento, dados podem ser compartilhados com instituições financeiras parceiras, somente com a sua autorização e para essa finalidade. Não vendemos nem cedemos dados a terceiros.",
  },
  {
    t: "Cookies e mapas",
    d: "O site pode carregar o mapa do Google Maps e recursos técnicos necessários ao funcionamento. Esses serviços seguem as políticas de privacidade dos respectivos fornecedores.",
  },
  {
    t: "Seus direitos",
    d: `Nos termos da Lei Geral de Proteção de Dados (Lei 13.709/2018), você pode pedir acesso, correção ou exclusão dos seus dados a qualquer momento pelo e-mail ${site.email}.`,
  },
];

export default function PrivacidadePage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Privacidade" }]} title={<>Privacidade</>} />
      <section className="wrap py-16 md:py-24">
        <div className="max-w-3xl">
          {sections.map((s, i) => (
            <div key={s.t} data-reveal className="grid gap-4 border-b border-line py-10 md:grid-cols-[4rem_1fr]">
              <span className="eyebrow pt-1 text-faint tabular">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="font-wide text-lg tracking-[0.02em] uppercase">{s.t}</h2>
                <p className="mt-4 leading-relaxed text-bone-2">{s.d}</p>
              </div>
            </div>
          ))}
          <p className="mt-10 text-sm text-faint">Última atualização: outubro de 2026.</p>
        </div>
      </section>
      <PageMotion />
    </>
  );
}
