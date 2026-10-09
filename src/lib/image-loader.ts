/**
 * Loader do next/image para as fotos do estoque.
 * O CDN da Revenda Mais (CloudFront) já publica cada foto em vários tamanhos
 * (S, M, G, W, O no nome do arquivo). Usar esses tamanhos evita gastar a cota de
 * otimização de imagens da Vercel e mantém o cache longo do próprio CDN.
 * Fotos verticais chegam com o sufixo "?o=p" (ver lib/stock.ts): os tamanhos delas são menores na largura.
 */
const LANDSCAPE: [string, number][] = [
  ["S", 195],
  ["M", 485],
  ["G", 640],
  ["W", 1620],
];
const PORTRAIT: [string, number][] = [
  ["S", 131],
  ["M", 243],
  ["G", 321],
  ["W", 721],
];

export default function loader({ src, width }: { src: string; width: number; quality?: number }) {
  const m = src.match(/^https:\/\/(?:s3\.carro57\.com\.br|cdn\.revendamais\.com\.br)(\/FC\/.+?)_[A-Z]_([0-9a-f]+\.jpe?g)(\?o=p)?$/);
  if (!m) return src;
  const steps = m[3] ? PORTRAIT : LANDSCAPE;
  const size = steps.find(([, w]) => w >= width)?.[0] ?? "O";
  return `https://cdn.revendamais.com.br${m[1]}_${size}_${m[2]}`;
}
