import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import Button from '../Button/Button.vue'
import Input from '../Input/Input.vue'
import Dialog, { type DialogProps } from './Dialog.vue'

interface DialogStoryArgs extends DialogProps {
  trigger?: unknown
  header?: unknown
  default?: unknown
  footer?: unknown
  'onUpdate:open'?: (open: boolean) => void
}

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Diálogo baseado no Reka UI para exibir formulários e conteúdos que exigem foco temporário. Oferece gerenciamento de foco, fechamento por Escape ou clique externo e retorno de foco ao gatilho.

\`\`\`vue
<Dialog title="Adicionar link" description="Informe o endereço de destino.">
  <template #trigger><Button>Abrir</Button></template>
  <Input label="Endereço" type="url" />
</Dialog>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    open: { control: 'boolean', description: 'Estado controlado de abertura.', table: { defaultValue: { summary: 'undefined' } } },
    defaultOpen: { control: 'boolean', description: 'Estado inicial no modo não controlado.', table: { defaultValue: { summary: 'false' } } },
    title: { control: 'text', description: 'Título visível e acessível.' },
    description: { control: 'text', description: 'Texto complementar exibido abaixo do título.' },
    size: { control: 'select', options: ['small', 'medium', 'large'], description: 'Largura máxima.', table: { defaultValue: { summary: 'medium' } } },
    modal: { control: 'boolean', description: 'Bloqueia a interação com o conteúdo externo.', table: { defaultValue: { summary: 'true' } } },
    unmountOnHide: { control: 'boolean', description: 'Remove o conteúdo do DOM quando fechado.', table: { defaultValue: { summary: 'true' } } },
    showClose: { control: 'boolean', description: 'Exibe o botão de fechar no header.', table: { defaultValue: { summary: 'true' } } },
    closeLabel: { control: 'text', description: 'Nome acessível do botão de fechar.', table: { defaultValue: { summary: 'Fechar diálogo' } } },
    trigger: { control: false, description: 'Elemento que abre o diálogo.', table: { category: 'Slots', type: { summary: 'Vue slot' } } },
    header: { control: false, description: 'Header personalizado.', table: { category: 'Slots', type: { summary: 'Vue slot' } } },
    default: { control: false, description: 'Conteúdo principal. Recebe `close`.', table: { category: 'Slots', type: { summary: 'Vue slot' } } },
    footer: { control: false, description: 'Rodapé do diálogo. Recebe `close`.', table: { category: 'Slots', type: { summary: 'Vue slot' } } },
    'onUpdate:open': { action: 'update:open', description: 'Evento emitido ao abrir ou fechar.' }
  },
  args: {
    open: undefined,
    defaultOpen: false,
    title: 'Adicionar link',
    description: 'Informe o endereço para o qual o texto selecionado deve apontar.',
    size: 'small',
    modal: true,
    unmountOnHide: true,
    showClose: true,
    closeLabel: 'Fechar diálogo'
  },
  render: (args: DialogStoryArgs) => ({
    components: { Button, Dialog, Input },
    setup() {
      const open = ref(args.open)
      const href = ref('https://example.com')
      watch(() => args.open, value => open.value = value)
      return { args, href, open }
    },
    template: `
      <Dialog
        v-model:open="open"
        :default-open="args.defaultOpen"
        :title="args.title"
        :description="args.description"
        :size="args.size"
        :modal="args.modal"
        :unmount-on-hide="args.unmountOnHide"
        :show-close="args.showClose"
        :close-label="args.closeLabel"
        @update:open="args['onUpdate:open']">
        <template #trigger><Button variant="secondary">Abrir diálogo</Button></template>
        <Input v-model="href" label="Endereço" type="url" />
        <template #footer="{ close }">
          <div class="flex justify-end gap-3">
            <Button variant="secondary" @click="close">Cancelar</Button>
            <Button @click="close">Salvar</Button>
          </div>
        </template>
      </Dialog>
    `
  })
} satisfies Meta<DialogStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Open: Story = {
  args: { open: true }
}
