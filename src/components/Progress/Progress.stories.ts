import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Progress from './Progress.vue'

const variants = ['neutral', 'info', 'success', 'warning', 'danger'] as const
const sizes = ['small', 'medium', 'large'] as const

const meta = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Representa visualmente um estado de avanço ou capacidade, com semântica acessível provida pelo Reka UI.

\`\`\`vue
<Progress :value="71" :max="90" label="Capacidade utilizada" />
\`\`\`
        `
      }
    }
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Valor atual do progresso.',
      table: { defaultValue: { summary: 'required' } }
    },
    max: {
      control: { type: 'number', min: 1 },
      description: 'Valor que representa o progresso completo.',
      table: { defaultValue: { summary: '100' } }
    },
    variant: {
      control: 'select',
      options: variants,
      description: 'Cor semântica da porção preenchida.',
      table: { defaultValue: { summary: 'info' } }
    },
    size: {
      control: 'select',
      options: sizes,
      description: 'Altura da barra de progresso.',
      table: { defaultValue: { summary: 'medium' } }
    },
    label: {
      control: 'text',
      description: 'Descrição acessível do indicador.',
      table: { defaultValue: { summary: 'Progresso' } }
    }
  },
  args: {
    value: 71,
    max: 90,
    variant: 'info',
    size: 'medium',
    label: 'Capacidade utilizada'
  },
  render: (args) => ({
    components: { Progress },
    setup: () => ({ args }),
    template: `
      <div class="w-80 space-y-2">
        <div class="flex items-baseline justify-between">
          <span class="text-sm font-medium text-slate-700">Progresso</span>
          <span class="text-xs text-slate-500">{{ args.value }} de {{ args.max }}</span>
        </div>
        <Progress v-bind="args" />
      </div>
    `
  })
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: () => ({
    components: { Progress },
    setup: () => ({ variants }),
    template: `
      <div class="w-80 space-y-4">
        <div v-for="variant in variants" :key="variant" class="space-y-1.5">
          <div class="flex items-baseline justify-between">
            <span class="text-sm font-medium capitalize text-slate-700">{{ variant }}</span>
            <span class="text-xs text-slate-500">71%</span>
          </div>
          <Progress :value="71" :variant="variant" :label="variant" />
        </div>
      </div>
    `
  })
}

export const Sizes: Story = {
  render: () => ({
    components: { Progress },
    setup: () => ({ sizes }),
    template: `
      <div class="w-80 space-y-4">
        <div v-for="size in sizes" :key="size" class="space-y-1.5">
          <span class="text-sm font-medium capitalize text-slate-700">{{ size }}</span>
          <Progress :value="71" :size="size" :label="size" />
        </div>
      </div>
    `
  })
}
