import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'
import {
  getIconComponent,
  iconControlOptions,
  type IconControlName
} from '../../iconControls'
import Chips from './Chips.vue'

const sizes = ['small', 'medium', 'large'] as const
const variants = ['primary', 'secondary'] as const

interface ChipsStoryArgs {
  variant: (typeof variants)[number]
  size: (typeof sizes)[number]
  ariaLabel?: string
  disabled: boolean
  leadingIconName: IconControlName
  removeIconName: IconControlName
  default?: unknown
  leading?: unknown
  removeIcon?: unknown
  onRemove?: (event: MouseEvent) => void
}

const meta: Meta<ChipsStoryArgs> = {
  title: 'Components/Chips',
  component: Chips,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Chip removível com aparência de badge e sem relevo. Ao ser acionado, emite \`remove\` para que o filtro correspondente seja removido.

\`\`\`vue
<Chips variant="primary" aria-label="Remover filtro de origem: Loja virtual" @remove="clearOrigin">
  Origem: Loja virtual
</Chips>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: variants,
      description: 'Define a cor e a ênfase visual do chip no padrão dos badges.',
      table: { defaultValue: { summary: 'secondary' } }
    },
    size: {
      control: 'select',
      options: sizes,
      description: 'Controla a altura e a tipografia do chip.',
      table: { defaultValue: { summary: 'small' } }
    },
    ariaLabel: {
      control: 'text',
      description: 'Nome acessível do botão que remove o filtro.',
      table: { defaultValue: { summary: 'Remover filtro' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Impede a remoção do filtro.',
      table: { defaultValue: { summary: 'false' } }
    },
    default: {
      control: false,
      description: 'Descrição visível do filtro aplicado.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    leading: {
      control: false,
      description: 'Ícone opcional antes da descrição.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    removeIcon: {
      control: false,
      description: 'Ícone que substitui o `XIcon` usado por padrão.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    leadingIconName: {
      control: 'select',
      options: iconControlOptions,
      description: 'Controle exclusivo do Storybook para o slot `leading`.',
      table: { category: 'Storybook' }
    },
    removeIconName: {
      control: 'select',
      options: iconControlOptions,
      description: 'Controle exclusivo do Storybook para o slot `removeIcon`.',
      table: { category: 'Storybook' }
    },
    onRemove: {
      action: 'remove',
      description: 'Emitido ao acionar o chip.',
      table: { category: 'Eventos', type: { summary: '(event: MouseEvent) => void' } }
    }
  },
  args: {
    variant: 'secondary',
    size: 'small',
    ariaLabel: 'Remover filtro de origem: Loja virtual',
    disabled: false,
    leadingIconName: 'Nenhum',
    removeIconName: 'Nenhum'
  },
  render: (args) => ({
    components: { Chips },
    setup: () => ({
      args,
      leadingIcon: computed(() => getIconComponent(args.leadingIconName)),
      removeIcon: computed(() => getIconComponent(args.removeIconName))
    }),
    template: `
      <Chips
        :variant="args.variant"
        :size="args.size"
        :aria-label="args.ariaLabel"
        :disabled="args.disabled"
        @remove="args.onRemove">
        <template v-if="leadingIcon" #leading><component :is="leadingIcon" /></template>
        Origem: Loja virtual
        <template v-if="removeIcon" #removeIcon><component :is="removeIcon" /></template>
      </Chips>
    `
  })
}

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: () => ({
    components: { Chips },
    setup: () => ({ variants }),
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Chips
          v-for="variant in variants"
          :key="variant"
          :variant="variant"
          :aria-label="'Remover filtro ' + variant">
          {{ variant === 'primary' ? 'Canal: WhatsApp' : 'Origem: Loja virtual' }}
        </Chips>
      </div>
    `
  })
}

export const ActiveFilters: Story = {
  render: () => ({
    components: { Chips },
    setup() {
      const filters = ref(['Origem: Loja virtual', 'Janela: Manhã', 'Status: Pendente'])

      return { filters }
    },
    template: `
      <div class="flex flex-wrap gap-2" aria-label="Filtros ativos">
        <Chips
          v-for="(filter, index) in filters"
          :key="filter"
          :aria-label="'Remover filtro: ' + filter"
          @remove="filters.splice(index, 1)">
          {{ filter }}
        </Chips>
        <span v-if="!filters.length" class="text-sm text-slate-500">Nenhum filtro ativo.</span>
      </div>
    `
  })
}

export const Sizes: Story = {
  render: () => ({
    components: { Chips },
    setup: () => ({ sizes }),
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Chips v-for="size in sizes" :key="size" :size="size" :aria-label="'Remover filtro ' + size">
          Origem: Loja virtual
        </Chips>
      </div>
    `
  })
}
