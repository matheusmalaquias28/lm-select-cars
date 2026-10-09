# LM Select Cars

Site da LM Select Cars (Vila Velha/ES), loja multimarcas de veículos premium. Next.js 16 (App Router, Cache Components) + Tailwind v4 + GSAP/Lenis, pronto para a Vercel.

## Rodar

```bash
npm install
npm run dev
```

## Estoque

Não há CMS: o estoque vem do site atual da loja (plataforma Revenda Mais) e fica em `src/data/stock.json`.

```bash
npm run estoque
```

O script lê a listagem paginada, entra em cada anúncio e grava marca, versão, ano, km, preço, câmbio, carroceria, descrição e as fotos (com proporção e um placeholder desfocado da capa). Depois é só fazer commit e deploy.

- Nomes comerciais (o site atual usa abreviações FIPE como `CCROSS`, `SWSRXA4FD`) ficam em `src/data/names.ts`. Carro novo sem entrada ali aparece com o nome original formatado.
- Carrocerias que a plataforma deixa em branco são corrigidas em `BODY_FIX` (`src/lib/stock.ts`).
- Slides da hero, vitrine da home e carro em destaque: `heroSlides`, `featured` e `spotlight` em `src/lib/stock.ts` (por id do anúncio). Se um desses carros for vendido, ele simplesmente some da lista.

As fotos são servidas direto do CDN da Revenda Mais nos tamanhos que ele já publica (`src/lib/image-loader.ts`), sem consumir a otimização de imagens da Vercel.

## Marca

A logo foi redesenhada em vetor a partir do PNG do site atual (`src/components/brand/Logo.tsx`). `npm run marca` regenera favicon, apple-icon, imagem de compartilhamento e os SVGs em `public/brand/` (cromada, branca e preta).

## Contatos e leads

Dados da loja em `src/lib/site.ts`. Formulários (contato, avaliação, financiamento) não têm backend: montam a mensagem e abrem o WhatsApp da loja. Na página de cada veículo, o botão "Tenho interesse" já leva modelo, ano, km, preço e link.

## Deploy

Projeto padrão Next.js na Vercel, sem variáveis obrigatórias. Opcional: `NEXT_PUBLIC_SITE_URL` (padrão `https://www.lmselectcars.com.br`) para URLs canônicas, sitemap e JSON-LD.
"# lm-select-cars" 
