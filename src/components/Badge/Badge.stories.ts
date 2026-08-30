import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Badge from './Badge.vue'

const variants = ['neutral', 'info', 'success', 'warning', 'danger'] as const
const sizes = ['small', 'medium', 'large'] as const

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Indicador compacto para estados, quantidades ou classificações.

\`\`\`vue
<Badge variant="warning">3 pendências</Badge>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    default: {
      control: false,
      description: 'Conteúdo exibido dentro do badge.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    variant: {
      control: 'select',
      options: variants,
      description: 'Cor e ênfase semântica do badge.',
      table: { defaultValue: { summary: 'neutral' } }
    },
    size: {
      control: 'select',
      options: sizes,
      description: 'Tamanho do badge.',
      table: { defaultValue: { summary: 'small' } }
    }
  },
  args: {
    variant: 'warning',
    size: 'medium'
  },
  render: (args) => ({
    components: { Badge },
    setup: () => ({ args }),
    template: '<Badge v-bind="args">3 pendências</Badge>'
  })
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: () => ({
    components: { Badge },
    setup: () => ({ variants }),
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Badge v-for="variant in variants" :key="variant" :variant="variant">
          {{ variant }}
        </Badge>
      </div>
    `
  })
}

export const Sizes: Story = {
  render: () => ({
    components: { Badge },
    setup: () => ({ sizes }),
    template: `
      <div class="flex items-center gap-3">
        <Badge v-for="size in sizes" :key="size" :size="size" variant="warning">
          3 pendências
        </Badge>
      </div>
    `
  })
}
