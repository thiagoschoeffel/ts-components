import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import Button from '../Button/Button.vue'
import AlertDialog, { type AlertDialogProps } from './AlertDialog.vue'

interface AlertDialogStoryArgs extends AlertDialogProps {
  trigger?: unknown
  header?: unknown
  default?: unknown
  footer?: unknown
  'onUpdate:open'?: (open: boolean) => void
  onConfirm?: () => void
  onCancel?: () => void
}

const meta = {
  title: 'Components/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Diálogo modal em formato de card para confirmar ações relevantes. Header, conteúdo e footer podem ser personalizados por slots; sem personalização, o componente exibe título, descrição e ações padrão.

Ao substituir o footer, use os callbacks \`cancel\` e \`confirm\` fornecidos pelo slot para fechar o diálogo e emitir os eventos correspondentes.
        `
      }
    }
  },
  argTypes: {
    open: { control: 'boolean', description: 'Estado controlado de abertura.', table: { defaultValue: { summary: 'undefined' } } },
    defaultOpen: { control: 'boolean', description: 'Estado inicial no modo não controlado.', table: { defaultValue: { summary: 'false' } } },
    title: { control: 'text', description: 'Título visível e acessível.' },
    description: { control: 'text', description: 'Explicação da decisão.' },
    cancelLabel: { control: 'text', description: 'Texto da ação segura.', table: { defaultValue: { summary: 'Cancelar' } } },
    confirmLabel: { control: 'text', description: 'Texto da ação de confirmação.', table: { defaultValue: { summary: 'Confirmar' } } },
    confirmVariant: { control: 'select', options: ['primary', 'success', 'warning', 'danger'], description: 'Ênfase semântica da confirmação.', table: { defaultValue: { summary: 'danger' } } },
    size: { control: 'select', options: ['small', 'medium', 'large'], description: 'Largura máxima.', table: { defaultValue: { summary: 'small' } } },
    loading: { control: 'boolean', description: 'Indica confirmação em andamento.', table: { defaultValue: { summary: 'false' } } },
    confirmDisabled: { control: 'boolean', description: 'Desabilita a confirmação.', table: { defaultValue: { summary: 'false' } } },
    trigger: { control: false, description: 'Elemento que abre o diálogo.', table: { category: 'Slots', type: { summary: 'Vue slot' } } },
    header: { control: false, description: 'Header personalizado. Recebe `title` e `description`.', table: { category: 'Slots', type: { summary: 'Vue slot' } } },
    default: { control: false, description: 'Conteúdo principal, exibido depois da descrição.', table: { category: 'Slots', type: { summary: 'Vue slot' } } },
    footer: { control: false, description: 'Footer personalizado. Recebe `cancel`, `confirm`, `loading` e `confirmDisabled`.', table: { category: 'Slots', type: { summary: 'Vue slot' } } },
    'onUpdate:open': { action: 'update:open' },
    onConfirm: { action: 'confirm' },
    onCancel: { action: 'cancel' }
  },
  args: { title: 'Deseja sair?', description: 'As alterações não salvas serão perdidas.', cancelLabel: 'Continuar editando', confirmLabel: 'Sair sem salvar', confirmVariant: 'danger', size: 'small', defaultOpen: false, loading: false, confirmDisabled: false },
  render: (args: AlertDialogStoryArgs) => ({
    components: { AlertDialog, Button },
    setup() { const open = ref(args.open); return { args, open } },
    template: `<AlertDialog v-model:open="open" v-bind="args"><template #trigger><Button variant="secondary">Abrir confirmação</Button></template></AlertDialog>`
  })
} satisfies Meta<AlertDialogStoryArgs>

export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {}

export const CustomRegions: Story = {
  args: {
    title: 'Confirmar envio do pedido',
    description: undefined
  },
  render: (args: AlertDialogStoryArgs) => ({
    components: { AlertDialog, Button },
    setup() { return { args } },
    template: `
      <AlertDialog v-bind="args">
        <template #trigger>
          <Button variant="secondary">Revisar pedido</Button>
        </template>

        <template #header="{ title }">
          <div>
            <p class="font-semibold text-slate-900">{{ title }}</p>
            <p class="mt-1 text-xs text-slate-500">Pedido #1048</p>
          </div>
        </template>

        <div class="space-y-2">
          <p>O pedido será enviado para separação e não poderá mais ser editado.</p>
          <p class="font-medium text-slate-700">3 itens · Total de R$ 248,90</p>
        </div>

        <template #footer="{ cancel, confirm, loading, confirmDisabled }">
          <div class="flex flex-wrap justify-between gap-3">
            <Button variant="secondary" @click="cancel">Voltar</Button>
            <Button
              variant="success"
              :loading="loading"
              :disabled="confirmDisabled"
              @click="confirm">
              Enviar pedido
            </Button>
          </div>
        </template>
      </AlertDialog>
    `
  })
}
