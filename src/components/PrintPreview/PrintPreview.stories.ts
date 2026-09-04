import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PrintPreview from './PrintPreview.vue'

const variants = ['label', 'document'] as const

const meta = {
  title: 'Components/PrintPreview',
  component: PrintPreview,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Padroniza a moldura usada para conferir conteúdos antes da impressão. O componente cuida do título, formato, fundo de bancada, papel, borda, sombra, proporção de etiquetas e rolagem de documentos; o conteúdo imprimível continua pertencendo ao consumidor por meio do slot.

Use \`variant="label"\` para etiquetas 100 × 50 mm e \`variant="document"\` para folhas de rota e outros documentos. Botões, seleção de cópias e estados de impressão devem ficar fora da área do papel.

\`\`\`vue
<PrintPreview variant="label" format="100 × 50 mm">
  <div class="h-full p-5">Conteúdo da etiqueta</div>
</PrintPreview>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: variants,
      description: 'Formato visual do papel: etiqueta 2:1 ou documento rolável.',
      table: { defaultValue: { summary: 'document' } }
    },
    format: {
      control: 'text',
      description: 'Descrição opcional das dimensões físicas.',
      table: { defaultValue: { summary: 'undefined' } }
    },
    title: {
      control: 'text',
      description: 'Título exibido acima da moldura.',
      table: { defaultValue: { summary: 'Pré-visualização' } }
    },
    ariaLabel: {
      control: 'text',
      description: 'Nome acessível da região de pré-visualização.',
      table: { defaultValue: { summary: 'Pré-visualização de impressão' } }
    },
    default: {
      control: false,
      description: 'Conteúdo do papel fornecido pelo consumidor.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    }
  },
  args: {
    variant: 'label',
    format: '100 × 50 mm',
    title: 'Pré-visualização',
    ariaLabel: 'Pré-visualização da etiqueta do pacote'
  },
  decorators: [
    () => ({ template: '<div class="w-[min(42rem,92vw)]"><story /></div>' })
  ],
  render: args => ({
    components: { PrintPreview },
    setup: () => ({ args }),
    template: `
      <PrintPreview v-bind="args">
        <div class="h-full p-[5%]">
          <div class="flex items-baseline justify-between border-b-2 border-slate-900 pb-[2%]">
            <strong class="text-base sm:text-lg">Sabor Santè</strong>
            <span class="text-[8px] font-bold uppercase tracking-wider sm:text-[10px]">Pacote</span>
          </div>
          <h2 class="mt-[3%] text-base font-bold uppercase leading-none sm:text-xl">Maria Silva</h2>
          <p class="mt-[1%] text-xs font-semibold sm:text-sm">Pedido #154</p>
          <p class="mt-[3%] text-[9px] leading-snug sm:text-xs">Rua das Flores, 120 · Centro · São Paulo/SP</p>
          <p class="mt-[1%] text-[9px] font-semibold sm:text-xs">(11) 99876-5432</p>
        </div>
      </PrintPreview>
    `
  })
} satisfies Meta<typeof PrintPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const LabelTemplates: Story = {
  args: { ariaLabel: 'Comparação dos templates de etiqueta' },
  render: args => ({
    components: { PrintPreview },
    setup: () => ({ args }),
    template: `
      <div class="grid gap-6">
        <PrintPreview v-bind="args" aria-label="Etiqueta de produto congelado">
          <div class="h-full p-[5%]">
            <div class="flex items-baseline justify-between border-b-2 border-slate-900 pb-[2%]"><strong class="text-base sm:text-lg">Sabor Santè</strong><span class="text-[8px] font-bold uppercase tracking-wider sm:text-[10px]">Congelado</span></div>
            <h2 class="mt-[3%] text-base font-bold uppercase leading-none sm:text-xl">Chilli</h2>
            <p class="mt-[1%] text-xs font-semibold sm:text-sm">Porção 300 g</p>
            <dl class="mt-[3%] grid grid-cols-2 gap-x-4 gap-y-1 text-[9px] sm:text-xs"><div><dt class="text-slate-500">Fabricação</dt><dd class="font-semibold">26/08/2026</dd></div><div><dt class="text-slate-500">Validade</dt><dd class="font-semibold">24/11/2026</dd></div><div class="col-span-2"><dt class="text-slate-500">Lote</dt><dd class="font-mono font-semibold">LOTE-2026-0826-A</dd></div></dl>
          </div>
        </PrintPreview>

        <PrintPreview v-bind="args" aria-label="Etiqueta de item da produção do dia">
          <div class="h-full p-[5%]">
            <div class="flex items-baseline justify-between border-b-2 border-slate-900 pb-[2%]"><strong class="text-base sm:text-lg">Sabor Santè</strong><span class="text-[8px] font-bold uppercase tracking-wider sm:text-[10px]">Produção do dia</span></div>
            <p class="mt-[2%] text-[9px] font-semibold sm:text-xs">Maria Silva · Pedido #154</p>
            <h2 class="mt-[2%] text-base font-bold uppercase leading-none sm:text-xl">Prato do dia</h2>
            <p class="mt-[1%] text-[9px] sm:text-xs">Tradicional · Estrogonofe de frango</p>
            <p class="mt-[2%] border border-slate-900 px-2 py-1 text-[9px] font-bold sm:text-xs">Sem arroz</p>
          </div>
        </PrintPreview>

        <PrintPreview v-bind="args" aria-label="Etiqueta externa do pacote kraft">
          <div class="h-full p-[5%]">
            <div class="flex items-baseline justify-between border-b-2 border-slate-900 pb-[2%]"><strong class="text-base sm:text-lg">Sabor Santè</strong><span class="text-[8px] font-bold uppercase tracking-wider sm:text-[10px]">Pacote</span></div>
            <h2 class="mt-[3%] text-base font-bold uppercase leading-none sm:text-xl">Maria Silva</h2>
            <p class="mt-[1%] text-xs font-semibold sm:text-sm">Pedido #154</p>
            <p class="mt-[3%] text-[9px] leading-snug sm:text-xs">Rua das Flores, 120 · Centro · São Paulo/SP</p>
            <p class="mt-[1%] text-[9px] font-semibold sm:text-xs">(11) 99876-5432</p>
          </div>
        </PrintPreview>
      </div>
    `
  })
}

export const RouteDocument: Story = {
  args: {
    variant: 'document',
    format: 'A4 · 210 × 297 mm',
    ariaLabel: 'Pré-visualização da folha de rota'
  },
  render: args => ({
    components: { PrintPreview },
    setup: () => ({ args }),
    template: `
      <PrintPreview v-bind="args">
        <article class="p-8">
          <header class="flex items-start justify-between gap-6 border-b-2 border-slate-900 pb-4">
            <div><p class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Sabor Santè · Operação</p><h2 class="mt-1 text-2xl font-bold">Folha de rota #21</h2><p class="mt-1 text-sm text-slate-600">sexta-feira, 4 de setembro de 2026</p></div>
            <span class="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold">Planejada</span>
          </header>
          <dl class="grid grid-cols-2 gap-6 border-b border-slate-300 py-5 text-sm"><div><dt class="text-xs font-semibold uppercase text-slate-500">Entregador</dt><dd class="mt-1 font-semibold">Rafael Santos</dd></div><div><dt class="text-xs font-semibold uppercase text-slate-500">Janela</dt><dd class="mt-1 font-semibold">11:00–12:00</dd></div></dl>
          <ol class="divide-y divide-slate-300"><li v-for="stop in 3" :key="stop" class="py-5"><div class="flex gap-4"><span class="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-slate-900 font-bold">{{ stop }}</span><div><h3 class="font-bold">Cliente {{ stop }}</h3><p class="mt-1 text-sm text-slate-600">Pedido #15{{ stop }} · Rua das Flores, {{ stop * 40 }}</p><p class="mt-2 text-sm">□ Entregue &nbsp; □ Falha &nbsp; Horário: ____:____</p></div></div></li></ol>
        </article>
      </PrintPreview>
    `
  })
}
