# TS Components — regras do projeto

## Implementação

- Use Vue 3, TypeScript estrito e Tailwind; prefira APIs tipadas, slots para conteúdo visual e Reka UI para primitives acessíveis.
- Exporte novos componentes, tipos e ícones por `src/index.ts`; ícones disponíveis pertencem a `src/icons.ts`.
- Preserve os tamanhos `small`, `medium` e `large`. Controles combináveis, especialmente `Input` e `Button`, devem compartilhar as alturas de `src/components/controlSize.ts`.
- Estados opcionais devem ter defaults explícitos e coerentes. Labels e títulos só são obrigatórios quando necessários para compreensão ou acessibilidade.

## Linguagem visual

- Siga o visual compacto inspirado no macOS: `rounded-lg`, bordas slate, fundo branco e sombra discreta.
- Texto interativo neutro: `text-slate-400`; hover/ativo: `text-slate-800`; desabilitado: `text-slate-200`; hover de fundo: `bg-slate-50`.
- Em ações semânticas coloridas, texto, ícone e atalho usam a mesma cor; o hover usa preferencialmente a variação `50` da cor.
- Componentes anexados devem parecer uma única peça: mesma altura, borda central única e cantos arredondados apenas nas extremidades externas.

## Storybook e documentação

- Todo componente ou comportamento novo deve ter uma story visual e documentação em português com descrição, default real e controle adequado.
- Booleanos usam controle boolean e informam seu default; slots, callbacks e objetos não editáveis não devem exibir controles artificiais como “Set object”.
- Componentes com slots de ícone devem oferecer seletores na story. Use `src/iconControls.ts`, nunca listas manuais, para incluir automaticamente toda a galeria.
- Exemplos devem ficar centralizados, ser responsivos e representar estados plausíveis; skeletons não devem sugerir seleção ou dados ativos.

## Validação

- Execute `npm run typecheck` após alterações e `npm run build-storybook` quando mudar stories ou apresentação.
- Para mudanças visuais, confira a story em `http://localhost:6006`; execute `npm run build` antes de concluir mudanças na API pública.
