import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ScrollArea from './ScrollArea.vue'

const orientations = ['vertical', 'horizontal', 'both'] as const
const scrollbarVisibilities = ['auto', 'always', 'scroll', 'hover', 'glimpse'] as const
const items = Array.from({ length: 18 }, (_, index) => `Item ${index + 1}`)
const gridItems = Array.from({ length: 30 }, (_, index) => `Pedido ${String(index + 1).padStart(2, '0')}`)
const orientationLabels = {
  vertical: 'Rolagem vertical',
  horizontal: 'Rolagem horizontal',
  both: 'Rolagem nas duas direções'
} as const

const meta = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Área de rolagem baseada no Reka UI, com barras consistentes para regiões internas da interface.

\`\`\`vue
<ScrollArea class="h-64">
  Conteúdo com rolagem
</ScrollArea>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    default: {
      control: false,
      description: 'Conteúdo inserido dentro da área com rolagem.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    orientation: {
      control: 'select',
      options: orientations,
      description: 'Direção ou direções em que a área pode rolar.',
      table: { defaultValue: { summary: 'vertical' } }
    },
    scrollbarVisibility: {
      control: 'select',
      options: scrollbarVisibilities,
      description: 'Quando a barra de rolagem personalizada é mostrada.',
      table: { defaultValue: { summary: 'auto' } }
    }
  },
  args: {
    orientation: 'vertical',
    scrollbarVisibility: 'auto'
  },
  render: (args) => ({
    components: { ScrollArea },
    setup: () => ({ args, gridItems, items, orientationLabels }),
    template: `
      <div class="w-80 space-y-3">
        <div>
          <p class="text-sm font-medium text-slate-700">{{ orientationLabels[args.orientation] }}</p>
          <p class="text-xs text-slate-500">Altere a orientação e a visibilidade pelos controles.</p>
        </div>
        <ScrollArea v-bind="args" class="h-56 rounded-lg border border-slate-200 bg-white">
          <ul
            v-if="args.orientation === 'vertical'"
            class="m-0 list-none space-y-2 p-4 text-sm text-slate-700">
            <li v-for="item in items" :key="item" class="rounded bg-slate-50 px-3 py-2">{{ item }}</li>
          </ul>

          <div
            v-else-if="args.orientation === 'horizontal'"
            class="flex w-max gap-3 p-4 text-sm text-slate-700">
            <span v-for="column in 12" :key="column" class="w-36 shrink-0 rounded bg-slate-50 px-3 py-2">
              Coluna {{ column }}
            </span>
          </div>

          <div v-else class="grid w-max grid-cols-5 gap-3 p-4">
            <span
              v-for="item in gridItems"
              :key="item"
              class="w-32 rounded bg-slate-50 px-3 py-2 text-sm text-slate-700">
              {{ item }}
            </span>
          </div>
        </ScrollArea>
      </div>
    `
  })
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Horizontal: Story = {
  args: { orientation: 'horizontal', scrollbarVisibility: 'auto' },
  render: (args) => ({
    components: { ScrollArea },
    setup: () => ({ args }),
    template: `
      <div class="w-80 space-y-2">
        <div>
          <p class="text-sm font-medium text-slate-700">Rolagem horizontal</p>
          <p class="text-xs text-slate-500">O conteúdo mantém sua largura e pode ser percorrido lateralmente.</p>
        </div>
        <ScrollArea v-bind="args" class="rounded-lg border border-slate-200 bg-white">
          <div class="flex w-max gap-3 p-4 text-sm text-slate-700">
            <span v-for="column in 12" :key="column" class="w-36 shrink-0 rounded bg-slate-50 px-3 py-2">Coluna {{ column }}</span>
          </div>
        </ScrollArea>
      </div>
    `
  })
}

export const BothDirections: Story = {
  args: { orientation: 'both', scrollbarVisibility: 'auto' },
  render: (args) => ({
    components: { ScrollArea },
    setup: () => ({ gridItems }),
    template: `
      <div class="w-80 space-y-2">
        <div>
          <p class="text-sm font-medium text-slate-700">Duas direções</p>
          <p class="text-xs text-slate-500">Barras vertical e horizontal aparecem conforme necessário.</p>
        </div>
        <ScrollArea orientation="both" scrollbar-visibility="auto" class="h-56 rounded-lg border border-slate-200 bg-white">
          <div class="grid w-max grid-cols-5 gap-3 p-4">
            <span
              v-for="item in gridItems"
              :key="item"
              class="w-32 rounded bg-slate-50 px-3 py-2 text-sm text-slate-700">
              {{ item }}
            </span>
          </div>
        </ScrollArea>
      </div>
    `
  })
}
