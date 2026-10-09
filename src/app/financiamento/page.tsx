import type { Metadata } from "next";
import { FormShell, Steps } from "@/components/forms/FormShell";
import { LeadForm } from "@/components/forms/LeadForm";
import { PageMotion } from "@/components/motion/Motion";
import { PageHero } from "@/components/ui/PageHero";
import { brl, cars } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Financiamento",
  description: "Simule o financiamento do seu próximo veículo na LM Select Cars: entrada, prazo e parcelas do seu jeito, com aprovação rápida.",
  alternates: { canonical: "/financiamento" },
};

const vehicles = cars.map((c) => ({ slug: c.slug, label: `${c.title} ${c.version} ${c.yearModel} (${brl(c.price)})` }));

export default function FinanciamentoPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Financiamento" }]}
        title={
          <>
            Simule o
            <br />
            <span className="text-mute">financiamento</span>
          </>
        }
        text={
          <p>
            Conte o que você precisa e um consultor monta a simulação com as condições do dia. Também aceitamos consórcio e cartão em até 21x.
          </p>
        }
      />
      <FormShell
        aside={
          <Steps
            title="Como funciona"
            steps={[
              { t: "Envie os dados", d: "Escolha o veículo, a entrada e o prazo. Leva um minuto." },
              { t: "Receba a simulação", d: "Um consultor retorna pelo WhatsApp com as parcelas." },
              { t: "Aprovação", d: "Com a proposta aceita, cuidamos da documentação com o banco." },
            ]}
          />
        }
      >
        <LeadForm
          intro="Olá! Gostaria de simular um financiamento."
          submitLabel="Enviar simulação"
          vehicles={vehicles}
          fields={[
            { name: "nome", label: "Nome", required: true, placeholder: "Seu nome completo" },
            { name: "telefone", label: "WhatsApp", type: "tel", required: true, placeholder: "(27) 99999-9999", half: true },
            { name: "cidade", label: "Cidade", placeholder: "Vila Velha / ES", half: true },
            { name: "entrada", label: "Valor de entrada", placeholder: "R$ 100.000", inputMode: "numeric", half: true },
            { name: "prazo", label: "Prazo", type: "select", options: ["24 meses", "36 meses", "48 meses", "60 meses"], required: true, half: true },
            { name: "troca", label: "Tem carro na troca?", type: "select", options: ["Não", "Sim, quero avaliar"], half: true },
            { name: "renda", label: "Comprovação de renda", type: "select", options: ["Assalariado (CLT)", "Empresário / PJ", "Autônomo / liberal", "Aposentado"], half: true },
            { name: "obs", label: "Observações", type: "textarea", placeholder: "Algo que devemos saber?" },
          ]}
        />
      </FormShell>
      <PageMotion />
    </>
  );
}
