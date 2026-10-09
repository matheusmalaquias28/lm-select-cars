# Design

Grafite + cromo. A interface recua para o carro aparecer: fundo escuro de galeria, linhas finas, tipografia estendida que ecoa o lettering SELECT CARS da logo.

## Cor (OKLCH, neutros frios, matiz 255)

| Token | Valor | Uso |
|---|---|---|
| `ink` | `oklch(0.145 0.004 255)` | fundo |
| `ink-2` / `ink-3` / `ink-4` | 0.175 / 0.215 / 0.27 | superfícies, hover, skeleton |
| `line` / `line-strong` | bone a 11% / 22% | todas as divisórias (1px) |
| `bone` | `oklch(0.95 0.004 255)` | texto principal, botão primário |
| `bone-2` | 0.86 | texto de apoio |
| `mute` | 0.71 | texto secundário |
| `faint` | 0.56 | rótulos pequenos, contadores |
| `chrome` / `chrome-hi` | 0.83 / 0.97 | foco, estados ativos, traço dos rótulos |

Estratégia: restrita. Sem cor de destaque; a cor vem das fotos. O prata aparece só na logo (gradiente da marca) e em linhas/estados.

## Tipografia

- **Saira** (eixo de largura): títulos em `font-stretch: 125%` (`font-wide`), peso 300, caixa alta, tracking negativo. Preços e números em 112% (`font-semiwide`). Rótulos `eyebrow`: 11px, 125%, tracking 0.24em.
- **Hanken Grotesk**: corpo e campos.
- Escala fluida com `clamp()`; títulos de seção 1.9 a 4.75rem, hero até 10rem.

## Layout

- Largura total com respiro lateral `--gutter` (16px a 72px). Nada de container centralizado.
- Grades de 12 colunas; cards em 1/2/3/4/5 colunas conforme a largura.
- Grades com divisória usam `gap-px` sobre `bg-line` (células em `bg-ink`).
- Cantos retos em tudo (botões, cards, campos).

## Componentes

- **Header**: 3 colunas, logo cromada no centro (encolhe para 74% ao rolar), some ao descer e volta ao subir.
- **Menu mobile**: painel em tela cheia que abre por recorte da esquerda, links grandes em cascata, monograma gigante ao fundo.
- **Preloader**: monograma sobe, lettering entra letra a letra, reflexo cromado atravessa e a logo voa até o header. Uma vez por sessão.
- **Card de veículo**: borda de 1px, foto 4:3 (segunda foto no hover com mouse), marca, modelo, versão, ano/km/câmbio em linha, preço e seta.
- **Botões**: primário `bg-bone text-ink`, secundário borda `line-strong`; rótulo sempre `eyebrow`.
- **Campos**: só linha inferior (`field`), rótulo `eyebrow` acima.

## Movimento

Lento e preciso: `expo.out` / `expo.inOut`, 1.2 a 1.6s, deslocamentos de 28px. Títulos revelados por linha com máscara (`data-split`), imagens por recorte (`data-reveal="img"`). Lenis para rolagem suave. Tudo desligado com `prefers-reduced-motion`.
