import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { VNodeChild } from 'vue'
import { ref, watch } from 'vue'
import Select, { type SelectOption, type SelectProps } from './Select.vue'

const sizes = ['small', 'medium', 'large'] as const
const statusOptions: SelectOption[] = [
  { value: 'pending', label: 'Pendente' },
  { value: 'processing', label: 'Em produção' },
  { value: 'ready', label: 'Pronto para entrega' },
  { value: 'delivered', label: 'Entregue' },
  { value: 'cancelled', label: 'Cancelado', disabled: true }
]

interface SelectStoryArgs extends SelectProps {
  value?: VNodeChild | ((props: { option: SelectOption }) => unknown)
  option?: VNodeChild | ((props: { option: SelectOption }) => unknown)
  'onUpdate:modelValue'?: (value: string) => void
  'onUpdate:open'?: (open: boolean) => void
}

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Campo de seleção única baseado no Select do Reka UI, com portal, typeahead, navegação por teclado e integração com formulários.

Use \`v-model\` para controlar o valor e forneça opções com valores string únicos.

\`\`\`vue
<Select
  v-model="status"
  label="Status do pedido"
  :options="[
    { value: 'pending', label: 'Pendente' },
    { value: 'ready', label: 'Pronto' }
  ]"
/>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    modelValue: {
      control: 'select',
      options: statusOptions.map(option => option.value),
      description: 'Valor da opção selecionada. Use com v-model.'
    },
    options: {
      control: false,
      description: 'Lista de opções exibidas no seletor.',
      table: {
        type: { summary: 'SelectOption[]' },
        detail: '{ value: string; label: string; disabled?: boolean }[]'
      }
    },
    placeholder: {
      control: 'text',
      description: 'Texto exibido quando não há uma opção selecionada.',
      table: { defaultValue: { summary: 'Selecione uma opção' } }
    },
    label: { control: 'text', description: 'Label visível associado ao campo.' },
    description: { control: 'text', description: 'Texto de apoio exibido abaixo do campo.' },
    error: { control: 'text', description: 'Mensagem de erro que também ativa o estado inválido.' },
    invalid: {
      control: 'boolean',
      description: 'Ativa o estado inválido sem exigir uma mensagem.',
      table: { defaultValue: { summary: 'false' } }
    },
    size: {
      control: 'select',
      options: sizes,
      description: 'Altura e tipografia do campo.',
      table: { defaultValue: { summary: 'medium' } }
    },
    id: { control: 'text', description: 'Identificador do trigger do seletor.' },
    ariaLabel: { control: 'text', description: 'Nome acessível usado na ausência de label visível.' },
    name: { control: 'text', description: 'Nome enviado com o formulário.' },
    autocomplete: { control: 'text', description: 'Sugestão de preenchimento automático do navegador.' },
    required: {
      control: 'boolean',
      description: 'Marca o campo como obrigatório.',
      table: { defaultValue: { summary: 'false' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o campo.',
      table: { defaultValue: { summary: 'false' } }
    },
    open: {
      control: false,
      description: 'Estado controlado de abertura. Use com v-model:open.'
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Estado inicial quando a abertura não é controlada.',
      table: { defaultValue: { summary: 'false' } }
    },
    value: {
      control: false,
      description: 'Personaliza o conteúdo do valor selecionado. Recebe option.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    option: {
      control: false,
      description: 'Personaliza o conteúdo de cada opção. Recebe option.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Evento emitido quando o valor selecionado muda.'
    },
    'onUpdate:open': {
      action: 'update:open',
      description: 'Evento emitido ao abrir ou fechar a lista.'
    }
  },
  args: {
    modelValue: 'processing',
    options: statusOptions,
    placeholder: 'Selecione o status',
    label: 'Status do pedido',
    description: 'O cliente acompanha esse status em tempo real.',
    invalid: false,
    size: 'medium',
    required: false,
    disabled: false,
    open: undefined,
    defaultOpen: false
  },
  decorators: [
    () => ({ template: '<div class="w-80 max-w-[90vw]"><story /></div>' })
  ],
  render: (args: SelectStoryArgs) => ({
    components: { Select },
    setup() {
      const value = ref(args.modelValue)
      const open = ref(args.open)
      watch(() => args.modelValue, nextValue => value.value = nextValue)
      watch(() => args.open, nextOpen => open.value = nextOpen)
      return { args, open, value }
    },
    template: `
      <Select
        v-model="value"
        v-model:open="open"
        :options="args.options"
        :placeholder="args.placeholder"
        :label="args.label"
        :description="args.description"
        :error="args.error"
        :invalid="args.invalid"
        :size="args.size"
        :id="args.id"
        :aria-label="args.ariaLabel"
        :name="args.name"
        :autocomplete="args.autocomplete"
        :required="args.required"
        :disabled="args.disabled"
        :default-open="args.defaultOpen"
        @update:model-value="args['onUpdate:modelValue']"
        @update:open="args['onUpdate:open']" />
    `
  })
} as Meta<SelectStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sizes: Story = {
  render: () => ({
    components: { Select },
    setup: () => ({ sizes, statusOptions }),
    template: `
      <div class="flex flex-col gap-5">
        <Select
          v-for="size in sizes"
          :key="size"
          model-value="processing"
          :size="size"
          :label="size"
          :options="statusOptions" />
      </div>
    `
  })
}

export const States: Story = {
  render: () => ({
    components: { Select },
    setup: () => ({ emptyValue: ref<string>(), statusOptions }),
    template: `
      <div class="flex flex-col gap-5">
        <Select v-model="emptyValue" label="Sem seleção" :options="statusOptions" />
        <Select label="Desabilitado" model-value="ready" disabled :options="statusOptions" />
        <Select
          label="Com erro"
          model-value="pending"
          error="Escolha um status válido para continuar."
          :options="statusOptions" />
      </div>
    `
  })
}

export const CustomOption: Story = {
  render: () => ({
    components: { Select },
    setup: () => ({ statusOptions }),
    template: `
      <div class="flex flex-col gap-5">
        <Select
          model-value="processing"
          label="Conteúdo padrão"
          :options="statusOptions" />

        <Select
          model-value="processing"
          label="Opções personalizadas por slot"
          default-open
          :options="statusOptions">
          <template #value="{ option }">
            <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 font-medium text-blue-700">
              {{ option.label }}
            </span>
          </template>
          <template #option="{ option }">
            <span class="inline-flex items-center gap-2 font-medium">
              <span class="size-2 rounded-full bg-current" />
              {{ option.label }}
            </span>
          </template>
        </Select>
      </div>
    `
  }),
  parameters: {
    docs: {
      disable: true,
      description: {
        story: 'Comparação entre o conteúdo padrão e a personalização por slots: value transforma o valor em badge; option adiciona um marcador a cada item.'
      }
    }
  }
}
