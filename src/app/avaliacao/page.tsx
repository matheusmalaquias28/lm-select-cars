import type { Metadata } from "next";
import { FormShell, Steps } from "@/components/forms/FormShell";
import { LeadForm } from "@/components/forms/LeadForm";
import { PageMotion } from "@/components/motion/Motion";
import { PageHero } from "@/components/ui/PageHero";
import { brl, cars } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Avaliação do seu veículo",
  description: "Venda ou troque seu carro na LM Select Cars. Envie os dados e receba uma avaliação justa e transparente pelo WhatsApp.",
  alternates: { canonical: "/avaliacao" },
};

const vehicles = cars.map((c) => ({ slug: c.slug, label: `${c.title} ${c.version} ${c.yearModel} (${brl(c.price)})` }));

export default function AvaliacaoPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Avaliação" }]}
        title={
          <>
            Avaliamos
            <br />
            <span className="text-mute">o seu carro</span>
          </>
        }
        text={<p>Venda direta ou como parte do pagamento de um veículo do nosso estoque. Avaliação justa, transparente e sem compromisso.</p>}
      />
      <FormShell
        aside={
          <Steps
            title="Como funciona"
            steps={[
              { t: "Dados do veículo", d: "Marca, modelo, ano e quilometragem. Quanto mais detalhes, mais precisa a proposta." },
              { t: "Fotos pelo WhatsApp", d: "Na conversa, envie fotos da frente, traseira, laterais, interior e painel ligado." },
              { t: "Proposta", d: "Um consultor retorna com a avaliação e agenda a vistoria presencial." },
            ]}
          />
        }
      >
        <LeadForm
          intro="Olá! Gostaria de uma avaliação do meu veículo."
          submitLabel="Pedir avaliação"
          vehicles={vehicles}
          vehicleLabel="Quero trocar pelo"
          fields={[
            { name: "marca", label: "Marca", required: true, placeholder: "Ex.: BMW", half: true },
            { name: "modelo", label: "Modelo e versão", required: true, placeholder: "Ex.: X1 sDrive20i M Sport", half: true },
            { name: "ano", label: "Ano / modelo", required: true, placeholder: "2022/2023", inputMode: "numeric", half: true },
            { name: "km", label: "Quilometragem", required: true, placeholder: "35.000 km", inputMode: "numeric", half: true },
            { name: "cor", label: "Cor", placeholder: "Branco", half: true },
            { name: "dono", label: "Único dono?", type: "select", options: ["Sim", "Não"], half: true },
            { name: "revisoes", label: "Revisões", type: "select", options: ["Todas na concessionária", "Parte na concessionária", "Fora da concessionária"], half: true },
            { name: "objetivo", label: "Objetivo", type: "select", options: ["Trocar por um carro da LM", "Vender", "Ainda avaliando"], required: true, half: true },
            { name: "nome", label: "Nome", required: true, placeholder: "Seu nome", half: true },
            { name: "telefone", label: "WhatsApp", type: "tel", required: true, placeholder: "(27) 99999-9999", half: true },
            { name: "obs", label: "Observações", type: "textarea", placeholder: "Opcionais, estado de conservação, pneus, etc." },
          ]}
        />
      </FormShell>
      <PageMotion />
    </>
  );
}
