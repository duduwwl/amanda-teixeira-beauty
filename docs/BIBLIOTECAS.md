# Bibliotecas de componentes avaliadas

| Biblioteca | Decisão | Motivo |
| --- | --- | --- |
| **Fancy Components — Sticky Footer** | Técnica adaptada | O original esconde o rodapé atrás da página (sticky + z-index). Isso cobre texto durante a rolagem e foi reprovado pelo inspetor de design. Adaptação: o conteúdo do rodapé sobe de dentro dele mesmo com *scroll-driven animation* (`.footer-reveal`), mesmo efeito de "revelar", sem cobrir nada e sem JavaScript. |
| **Motion Primitives** | Padrões adaptados, sem copiar blocos | InView → `useReveal` (um IntersectionObserver para a página); revelação com máscara (`data-reveal="mask"`); Accordion → `<details>` nativo com chevron próprio (acessível sem JS). |
| **Motion (Framer Motion)** | Usada só na agenda | `AnimatePresence` nas transições entre etapas. Fora da landing para não pesar no primeiro carregamento. |
| **Watermelon UI** | Não usada | Instalação via shadcn CLI e blocos genéricos (heroes, pricing) que contrariam a direção autoral; o calendário e os controles precisavam da lógica da agenda e foram escritos sob medida. |
| **Canvas UI** | Não usada | Efeitos (Blaze, Shatter, VHS) dependem de recurso experimental do Chrome atrás de flag e não combinam com "sofisticação discreta"; licença MIT + Commons Clause. |
| **Lucide** | Removida | O design final não tem ícones decorativos; chevrons são desenhados em CSS. |
