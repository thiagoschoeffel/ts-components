# TS Components — regras do projeto

## Implementação

- Use Vue 3, TypeScript estrito e Tailwind; prefira APIs tipadas, slots para conteúdo visual e Reka UI para primitives acessíveis.
- Exporte novos componentes, tipos e ícones por `src/index.ts`; ícones disponíveis pertencem a `src/icons.ts`.
- Preserve os tamanhos `small`, `medium` e `large`. Controles combináveis, especialmente `Input` e `Button`, devem compartilhar as alturas de `src/components/controlSize.ts`.
- Estados opcionais devem ter defaults explícitos e coerentes. Labels e títulos só são obrigatórios quando necessários para compreensão ou acessibilidade.
- Nos aplicativos do workspace, todo `Textarea` deve usar `rich-text`; a exibição correspondente deve sanitizar novamente o HTML e preservar a formatação. Texto simples fica restrito a busca, validação e outros usos não visuais justificados.
- Componentes precisam permanecer estáveis em aplicações com Module Federation. Não dependa da ordem de injeção dos bundles CSS nem combine utilitários conflitantes de mesma especificidade, como `px-*` com `pl-*`/`pr-*`; componha os lados explicitamente quando slots alterarem o espaçamento.
- Ao corrigir um problema estrutural em um componente compartilhado, faça a correção na biblioteca em vez de espalhar overrides nos consumidores. Depois, publique uma versão patch e mantenha host e módulos na mesma versão.

## Linguagem visual

- Siga o visual compacto inspirado no macOS: `rounded-lg`, bordas slate, fundo branco e sombra discreta.
- Texto interativo neutro: `text-slate-400`; hover/ativo: `text-slate-800`; desabilitado: `text-slate-200`; hover de fundo: `bg-slate-50`.
- Em ações semânticas coloridas, texto, ícone e atalho usam a mesma cor; o hover usa preferencialmente a variação `50` da cor.
- Componentes anexados devem parecer uma única peça: mesma altura, borda central única e cantos arredondados apenas nas extremidades externas.
- Conteúdo agrupado e itens de listas visuais usam `Card`; não recrie cards com `div` de fundo cinza quando o componente já atende ao caso.
- `Badge` usa `success` para ativo/positivo, `danger` para inativo, `neutral` para contagens e informação sem estado, `warning` para atenção e `info` para contexto.
- Campos monetários usam o slot `leading` com `R$`, mantendo espaço suficiente entre o prefixo e o valor em todos os tamanhos.

## Storybook e documentação

- Todo componente ou comportamento novo deve ter uma story visual e documentação em português com descrição, default real e controle adequado.
- Booleanos usam controle boolean e informam seu default; slots, callbacks e objetos não editáveis não devem exibir controles artificiais como “Set object”.
- Componentes com slots de ícone devem oferecer seletores na story. Use `src/iconControls.ts`, nunca listas manuais, para incluir automaticamente toda a galeria.
- Exemplos devem ficar centralizados, ser responsivos e representar estados plausíveis; skeletons não devem sugerir seleção ou dados ativos.
- O Autodocs nunca deve abrir automaticamente dialogs, drawers, popovers, menus, selects, calendários ou qualquer outra superfície sobreposta. A documentação deve exibir o componente fechado com um gatilho acionável; stories de regressão que precisam iniciar abertos permanecem acessíveis individualmente no Canvas e usam `parameters: { docs: { disable: true } }` para não serem renderizados na página de documentação.
- Stories de controles com slots `leading`, `trailing`, `action` ou botão de limpeza devem cobrir as combinações relevantes, pois conflitos de padding aparecem principalmente quando esses estados coexistem.

## Validação

- Execute `npm run typecheck` após alterações e `npm run build-storybook` quando mudar stories ou apresentação.
- Para mudanças visuais, confira a story em `http://localhost:6006`; execute `npm run build` antes de concluir mudanças na API pública.
- Para correções relacionadas a CSS compartilhado, valide também em um consumidor real após navegar entre dois módulos e voltar; conferir apenas a entrada inicial não reproduz problemas de ordem de carregamento.
