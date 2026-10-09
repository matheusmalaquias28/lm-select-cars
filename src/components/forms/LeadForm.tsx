"use client";

import { useId, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, ChevronDown, WhatsApp } from "@/components/Icons";
import { whatsappLink } from "@/lib/site";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "tel" | "email" | "number" | "select" | "textarea";
  options?: string[];
  required?: boolean;
  placeholder?: string;
  half?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
};

type Props = {
  fields: Field[];
  /** primeira linha da mensagem no WhatsApp */
  intro: string;
  submitLabel: string;
  /** lista de veículos do estoque para o campo "veículo de interesse" */
  vehicles?: { slug: string; label: string }[];
  vehicleLabel?: string;
};

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

/** Formulário que monta a mensagem e abre o WhatsApp da loja (sem backend). */
export function LeadForm({ fields, intro, submitLabel, vehicles, vehicleLabel = "Veículo de interesse" }: Props) {
  const uid = useId();
  const sp = useSearchParams();
  const preset = vehicles?.find((v) => v.slug === sp.get("veiculo"))?.label ?? "";
  const [sent, setSent] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const lines = [intro, ""];
    if (vehicles) {
      const v = String(data.get("veiculo") ?? "").trim();
      if (v) lines.push(`${vehicleLabel}: ${v}`);
    }
    for (const f of fields) {
      const v = String(data.get(f.name) ?? "").trim();
      if (v) lines.push(f.type === "textarea" ? `\n${v}` : `${f.label}: ${v}`);
    }
    const href = whatsappLink(lines.join("\n"));
    setSent(href);
    window.open(href, "_blank", "noopener");
  };

  if (sent) {
    return (
      <div role="status" className="border border-line p-8 md:p-12">
        <p className="eyebrow text-faint">Mensagem pronta</p>
        <p className="mt-5 font-wide text-2xl leading-snug font-light uppercase md:text-3xl">Abrimos o WhatsApp com seus dados.</p>
        <p className="mt-4 max-w-md leading-relaxed text-mute">
          É só enviar a mensagem por lá. Um consultor responde em horário comercial. Se a conversa não abriu, use o botão abaixo.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href={sent} target="_blank" rel="noopener" className="flex h-12 items-center gap-3 bg-bone px-6 text-ink">
            <WhatsApp className="size-[18px]" />
            <span className="eyebrow">Abrir WhatsApp</span>
          </a>
          <button type="button" onClick={() => setSent(null)} className="h-12 border border-line-strong px-6 transition-colors hover:border-chrome">
            <span className="eyebrow">Editar dados</span>
          </button>
        </div>
      </div>
    );
  }

  const label = (f: { name: string; label: string; required?: boolean }) => (
    <label htmlFor={`${uid}-${f.name}`} className="eyebrow block text-faint">
      {f.label}
      {f.required ? <span aria-hidden> *</span> : <span className="ml-2 tracking-normal normal-case text-faint/70">(opcional)</span>}
    </label>
  );

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-2 gap-x-8 gap-y-9">
      {vehicles && (
        <div className="col-span-2">
          {label({ name: "veiculo", label: vehicleLabel })}
          <div className="relative">
            <select id={`${uid}-veiculo`} name="veiculo" defaultValue={preset} className="field appearance-none pr-8">
              <option value="">Ainda não sei / quero ajuda para escolher</option>
              {vehicles.map((v) => (
                <option key={v.slug} value={v.label} className="bg-ink-2">
                  {v.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-0 size-4 -translate-y-1/2 text-mute" />
          </div>
        </div>
      )}

      {fields.map((f) => (
        <div key={f.name} className={f.half ? "col-span-2 sm:col-span-1" : "col-span-2"}>
          {label(f)}
          {f.type === "select" ? (
            <div className="relative">
              <select id={`${uid}-${f.name}`} name={f.name} required={f.required} defaultValue="" className="field appearance-none pr-8">
                <option value="" disabled={f.required}>
                  {f.placeholder ?? "Selecione"}
                </option>
                {f.options?.map((o) => (
                  <option key={o} value={o} className="bg-ink-2">
                    {o}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-0 size-4 -translate-y-1/2 text-mute" />
            </div>
          ) : f.type === "textarea" ? (
            <textarea id={`${uid}-${f.name}`} name={f.name} required={f.required} placeholder={f.placeholder} rows={4} className="field resize-none" />
          ) : (
            <input
              id={`${uid}-${f.name}`}
              name={f.name}
              type={f.type ?? "text"}
              required={f.required}
              placeholder={f.placeholder}
              inputMode={f.type === "tel" ? "tel" : f.inputMode}
              autoComplete={f.type === "tel" ? "tel" : f.name === "nome" ? "name" : f.type === "email" ? "email" : "off"}
              onChange={f.type === "tel" ? (e) => (e.currentTarget.value = maskPhone(e.currentTarget.value)) : undefined}
              className="field"
            />
          )}
        </div>
      ))}

      <div className="col-span-2 mt-2 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs leading-relaxed text-faint">
          Ao enviar, abrimos uma conversa no WhatsApp com esses dados. Nada é armazenado no site.
        </p>
        <button type="submit" className="group flex h-14 shrink-0 items-center justify-between gap-6 bg-bone px-7 text-ink transition-colors duration-500 hover:bg-chrome-hi">
          <span className="eyebrow">{submitLabel}</span>
          <ArrowRight className="size-4 transition-transform duration-500 ease-expo group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  );
}
