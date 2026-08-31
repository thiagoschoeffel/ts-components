import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed } from 'vue'
import {
  getIconComponent,
  iconControlOptions,
  type IconControlName
} from '../../iconControls'
import { PlusIcon } from '../../icons'
import Button from '../Button/Button.vue'
import EmptyState, { type EmptyStateProps } from './EmptyState.vue'

interface EmptyStateStoryArgs extends EmptyStateProps {
  iconName: IconControlName
  icon?: unknown
  default?: unknown
  action?: unknown
}

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Estado vazio para listas, resultados e áreas ainda sem conteúdo. Quando fornecido, o ícone é destacado em um círculo de fundo slate.' } } },
  argTypes: {
    title: { control: 'text', description: 'Mensagem principal.' },
    description: { control: 'text', description: 'Orientação ou explicação adicional.' },
    size: { control: 'select', options: ['small', 'medium', 'large'], description: 'Espaçamento interno.', table: { defaultValue: { summary: 'medium' } } },
    bordered: { control: 'boolean', description: 'Exibe borda tracejada.', table: { defaultValue: { summary: 'true' } } },
    iconName: {
      control: 'select',
      options: iconControlOptions,
      description: 'Controle exclusivo do Storybook para experimentar os ícones.',
      table: { category: 'Storybook' }
    },
    icon: { control: false, description: 'Ícone ilustrativo.', table: { category: 'Slots', type: { summary: 'Vue slot' } } },
    default: { control: false, description: 'Conteúdo adicional.', table: { category: 'Slots', type: { summary: 'Vue slot' } } },
    action: { control: false, description: 'Ação de recuperação ou criação.', table: { category: 'Slots', type: { summary: 'Vue slot' } } }
  },
  args: { title: 'Nenhum item adicionado', description: 'Escolha uma oferta para começar.', size: 'medium', bordered: true, iconName: 'PlusIcon' },
  decorators: [() => ({ template: '<div class="w-[min(36rem,90vw)]"><story /></div>' })],
  render: args => ({
    components: { EmptyState },
    setup() {
      const selectedIcon = computed(() => getIconComponent(args.iconName))

      return { args, selectedIcon }
    },
    template: `
      <EmptyState
        :title="args.title"
        :description="args.description"
        :size="args.size"
        :bordered="args.bordered">
        <template v-if="selectedIcon" #icon>
          <component :is="selectedIcon" />
        </template>
      </EmptyState>
    `
  })
} satisfies Meta<EmptyStateStoryArgs>

export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {}
export const WithAction: Story = {
  render: args => ({
    components: { EmptyState, Button, PlusIcon },
    setup() {
      const selectedIcon = computed(() => getIconComponent(args.iconName))

      return { args, selectedIcon }
    },
    template: `
      <EmptyState
        :title="args.title"
        :description="args.description"
        :size="args.size"
        :bordered="args.bordered">
        <template v-if="selectedIcon" #icon>
          <component :is="selectedIcon" />
        </template>
        <template #action>
          <Button size="small">
            <template #icon><PlusIcon /></template>
            Adicionar item
          </Button>
        </template>
      </EmptyState>
    `
  })
}
