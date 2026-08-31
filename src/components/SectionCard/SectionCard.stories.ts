import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Input from '../Input/Input.vue'
import SectionCard, { type SectionCardProps } from './SectionCard.vue'

interface SectionCardStoryArgs extends SectionCardProps {
  header?: unknown
  default?: unknown
  footer?: unknown
}

const meta = {
  title: 'Components/SectionCard',
  component: SectionCard,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Card para agrupar etapas ou seções de formulários com título, descrição e estado desabilitado.' } } },
  argTypes: {
    title: { control: 'text', description: 'Título compacto opcional.' },
    description: { control: 'text', description: 'Texto de apoio da seção.' },
    disabled: { control: 'boolean', description: 'Desabilita semanticamente o conteúdo.', table: { defaultValue: { summary: 'false' } } },
    header: { control: false, description: 'Cabeçalho personalizado.', table: { category: 'Slots', type: { summary: 'Vue slot' } } },
    default: { control: false, description: 'Conteúdo principal.', table: { category: 'Slots', type: { summary: 'Vue slot' } } },
    footer: { control: false, description: 'Rodapé separado.', table: { category: 'Slots', type: { summary: 'Vue slot' } } }
  },
  args: { title: 'Cliente', description: 'Informe os dados necessários para continuar.', disabled: false },
  decorators: [() => ({ template: '<div class="w-[min(36rem,90vw)]"><story /></div>' })],
  render: (args: SectionCardStoryArgs) => ({ components: { SectionCard, Input }, setup: () => ({ args }), template: '<SectionCard v-bind="args"><Input label="Nome" placeholder="Nome do cliente" /></SectionCard>' })
} satisfies Meta<SectionCardStoryArgs>

export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {}
export const Disabled: Story = { args: { title: 'Entrega', description: 'Selecione um cliente para configurar a entrega.', disabled: true } }
