import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { CheckIcon, TriangleAlertIcon } from '../../icons'
import Button from '../Button/Button.vue'
import Alert, { type AlertProps } from './Alert.vue'

interface AlertStoryArgs extends AlertProps {
  icon?: unknown
  default?: unknown
  actions?: unknown
  onClose?: () => void
}

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Mensagem semântica para feedback, orientação, avisos e erros contextuais.' } } },
  argTypes: {
    variants: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'], description: 'Intenção semântica e esquema de cores.', table: { defaultValue: { summary: 'info' } } },
    title: { control: 'text', description: 'Título opcional da mensagem.' },
    description: { control: 'text', description: 'Texto usado quando o slot padrão não é fornecido.' },
    size: { control: 'select', options: ['small', 'medium'], description: 'Espaçamento e tipografia.', table: { defaultValue: { summary: 'medium' } } },
    closable: { control: 'boolean', description: 'Exibe a ação para dispensar a mensagem.', table: { defaultValue: { summary: 'false' } } },
    closeLabel: { control: 'text', description: 'Nome acessível da ação de fechar.', table: { defaultValue: { summary: 'Fechar alerta' } } },
    icon: { control: false, description: 'Ícone decorativo antes da mensagem.', table: { category: 'Slots', type: { summary: 'Vue slot' } } },
    default: { control: false, description: 'Conteúdo principal da mensagem.', table: { category: 'Slots', type: { summary: 'Vue slot' } } },
    actions: { control: false, description: 'Ações exibidas abaixo da mensagem.', table: { category: 'Slots', type: { summary: 'Vue slot' } } },
    onClose: { action: 'close', description: 'Evento emitido ao acionar o botão de fechar.' }
  },
  args: { variants: 'info', title: 'Informação importante', description: 'Confira os dados antes de continuar.', size: 'medium', closable: true, closeLabel: 'Fechar alerta' },
  decorators: [() => ({ template: '<div class="w-[min(32rem,90vw)]"><story /></div>' })]
} satisfies Meta<AlertStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const SemanticVariants: Story = {
  render: () => ({
    components: { Alert, Button, CheckIcon, TriangleAlertIcon },
    template: `<div class="space-y-3">
      <Alert closable variants="neutral" title="Atualização disponível" description="Há novos dados para consultar." />
      <Alert closable variants="info" title="Informação importante" description="Confira os dados antes de continuar." />
      <Alert closable variants="success" title="Pedido salvo" description="As alterações já estão disponíveis."><template #icon><CheckIcon /></template></Alert>
      <Alert closable variants="warning" title="Restrição alimentar" description="Este item precisa ser revisado."><template #icon><TriangleAlertIcon /></template><template #actions><Button size="small" variant="secondary">Revisar item</Button></template></Alert>
      <Alert closable variants="danger" description="Selecione um cliente para continuar." />
    </div>`
  })
}
