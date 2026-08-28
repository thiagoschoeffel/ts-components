import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import Checkbox from './Checkbox.vue'

const sizes = ['small', 'medium', 'large'] as const
const states = [false, true, 'indeterminate'] as const

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Campo de seleção baseado no Reka UI, com rótulo, descrição, estado indeterminado e acabamento inspirado no macOS.

\`\`\`vue
<Checkbox
  v-model="accepted"
  label="Aceito os termos"
  description="Você pode alterar esta escolha depois."
/>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    modelValue: {
      control: 'select',
      options: states,
      description: 'Estado atual: desmarcado, marcado ou indeterminado.',
      table: { defaultValue: { summary: 'false' } }
    },
    label: {
      control: 'text',
      description: 'Rótulo visível associado ao campo.'
    },
    description: {
      control: 'text',
      description: 'Texto complementar exibido abaixo do rótulo.'
    },
    size: {
      control: 'select',
      options: sizes,
      description: 'Tamanho do controle e de seus textos.',
      table: { defaultValue: { summary: 'medium' } }
    },
    id: {
      control: 'text',
      description: 'Identificador usado para associar o controle ao rótulo.'
    },
    name: {
      control: 'text',
      description: 'Nome enviado junto ao formulário.'
    },
    value: {
      control: 'text',
      description: 'Valor enviado quando o campo está marcado.',
      table: { defaultValue: { summary: 'on' } }
    },
    required: {
      control: 'boolean',
      description: 'Indica que o campo é obrigatório.',
      table: { defaultValue: { summary: 'false' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita a interação.',
      table: { defaultValue: { summary: 'false' } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Evento emitido quando o estado muda.'
    }
  },
  args: {
    modelValue: false,
    label: 'Receber notificações',
    description: 'Avisaremos quando houver atualizações importantes.',
    size: 'medium',
    value: 'on',
    required: false,
    disabled: false
  },
  render: (args) => ({
    components: { Checkbox },
    setup() {
      const selected = ref(args.modelValue)
      watch(() => args.modelValue, value => selected.value = value)
      return { args, selected }
    },
    template: `
      <Checkbox
        v-model="selected"
        :label="args.label"
        :description="args.description"
        :size="args.size"
        :id="args.id"
        :name="args.name"
        :value="args.value"
        :required="args.required"
        :disabled="args.disabled"
        @update:model-value="args['onUpdate:modelValue']" />
    `
  })
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const States: Story = {
  render: () => ({
    components: { Checkbox },
    setup: () => ({ states }),
    template: `
      <div class="flex flex-col gap-6">
        <div v-for="state in states" :key="String(state)" class="space-y-3">
          <p class="text-sm font-medium text-slate-700">
            {{ state === true ? 'Marcado' : state === false ? 'Desmarcado' : 'Indeterminado' }}
          </p>
          <Checkbox
            :model-value="state"
            :label="state === 'indeterminate' ? 'Alguns itens selecionados' : 'Opção de exemplo'" />
        </div>
      </div>
    `
  })
}

export const Sizes: Story = {
  render: () => ({
    components: { Checkbox },
    setup: () => ({ sizes }),
    template: `
      <div class="flex flex-col gap-6">
        <div v-for="size in sizes" :key="size" class="space-y-3">
          <p class="text-sm font-medium capitalize text-slate-700">{{ size }}</p>
          <Checkbox :size="size" model-value label="Opção selecionada" />
        </div>
      </div>
    `
  })
}

export const Disabled: Story = {
  render: () => ({
    components: { Checkbox },
    template: `
      <div class="space-y-4">
        <p class="text-sm font-medium text-slate-700">Desabilitado</p>
        <p class="text-xs text-slate-500">O estado continua legível, mas não pode ser alterado.</p>
        <div class="flex flex-wrap gap-x-8 gap-y-4 pt-1">
          <Checkbox disabled label="Desmarcado" />
          <Checkbox disabled model-value label="Marcado" />
        </div>
      </div>
    `
  })
}
