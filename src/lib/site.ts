export const site = {
  name: "LM Select Cars",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lmselectcars.com.br",
  description:
    "Loja multimarcas premium em Vila Velha/ES. Porsche, Mercedes-Benz, BMW, Toyota e mais, selecionados com procedência, há mais de 17 anos.",
  since: 17,
  /** nota e total no Google Maps (conferido em 09/10/2026) */
  google: { rating: "5,0", reviews: 115 },
  whatsapp: { label: "(27) 99818-7894", number: "5527998187894" },
  phone: { label: "(27) 2180-0205", href: "tel:+552721800205" },
  email: "contato@lmselectcars.com.br",
  consultants: [
    { name: "Erick Rick", label: "(27) 98882-3151", number: "5527988823151" },
    { name: "Bruno Souza", label: "(27) 98150-0110", number: "5527981500110" },
  ],
  address: {
    street: "Av. Prof.ª Francelina Carneiro Setúbal, 1710",
    district: "Itapuã",
    cep: "29101-641",
    city: "Vila Velha",
    state: "ES",
    lat: -20.3498605,
    lng: -40.293821,
  },
  maps: "https://www.google.com/maps/place/LM+Select+Cars/@-20.3498605,-40.293821,17z/data=!4m6!3m5!1s0xb8171e79c50231:0xd71f41102eb48ee1!8m2!3d-20.3498605!4d-40.293821",
  mapsEmbed: "https://www.google.com/maps?q=LM+Select+Cars,+Av.+Prof.%C2%AA+Francelina+Carneiro+Set%C3%BAbal,+1710,+Vila+Velha+-+ES&z=16&output=embed",
  hours: [
    { days: "Segunda a sexta", time: "08h às 18h" },
    { days: "Sábado", time: "08h às 12h" },
  ],
  instagram: { label: "@lmselectcars", href: "https://www.instagram.com/lmselectcars/" },
} as const;

export const nav = [
  { href: "/estoque", label: "Estoque" },
  { href: "/avaliacao", label: "Avaliação" },
  { href: "/financiamento", label: "Financiamento" },
  { href: "/sobre", label: "Sobre nós" },
  { href: "/contato", label: "Contato" },
] as const;

export const whatsappLink = (text?: string, number: string = site.whatsapp.number) =>
  `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

/** Condições comerciais que a loja repete em todos os anúncios. */
export const conditions = [
  { title: "Seu carro na troca", text: "Avaliação justa e transparente do seu veículo atual.", href: "/avaliacao" },
  { title: "Financiamento", text: "Financiamento facilitado, com aprovação rápida.", href: "/financiamento" },
  { title: "Consórcio", text: "Carta contemplada aceita como pagamento.", href: "/contato" },
  { title: "Cartão em até 21x", text: "Parte do valor no cartão de crédito. Consulte as condições.", href: "/contato" },
  { title: "Garantia", text: "Veículos com garantia e procedência verificada.", href: "/sobre" },
  { title: "Condição à vista", text: "Condição especial para pagamento à vista.", href: "/contato" },
] as const;
