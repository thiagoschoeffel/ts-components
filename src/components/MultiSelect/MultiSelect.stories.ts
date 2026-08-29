import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { VNodeChild } from 'vue'
import { ref, watch } from 'vue'
import MultiSelect, { type MultiSelectOption, type MultiSelectProps } from './MultiSelect.vue'

const sizes = ['small', 'medium', 'large'] as const
const teamOptions: MultiSelectOption[] = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engenharia' },
  { value: 'product', label: 'Produto' },
  { value: 'support', label: 'Atendimento' },
  { value: 'legacy', label: 'Time legado', disabled: true }
]

interface MultiSelectStoryArgs extends MultiSelectProps {
  value?: VNodeChild | ((props: { options: MultiSelectOption[] }) => unknown)
  option?: VNodeChild | ((props: { option: MultiSelectOption }) => unknown)
  'onUpdate:modelValue'?: (values: string[]) => void
  'onUpdate:open'?: (open: boolean) => void
}

const meta = {
  title: 'Components/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Campo de seleção múltipla baseado no Select do Reka UI, com portal, typeahead, navegação por teclado e integração com formulários.

Use \`v-model\` com um array de strings. A lista permanece aberta enquanto as opções são marcadas ou desmarcadas.

\`\`\`vue
<MultiSelect
  v-model="teams"
  label="Times responsáveis"
  :options="[
    { value: 'design', label: 'Design' },
    { value: 'engineering', label: 'Engenharia' }
  ]"
/>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    modelValue: {
      control: 'check',
      options: teamOptions.filter(option => !option.disabled).map(option => option.value),
      description: 'Valores das opções selecionadas. Use com v-model.',
      table: { defaultValue: { summary: '[]' } }
    },
    options: {
      control: false,
      description: 'Lista de opções exibidas no seletor.',
      table: {
        type: { summary: 'MultiSelectOption[]' },
        detail: '{ value: string; label: string; disabled?: boolean }[]'
      }
    },
    placeholder: {
      control: 'text',
      description: 'Texto exibido quando não há opções selecionadas.',
      table: { defaultValue: { summary: 'Selecione uma ou mais opções' } }
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
    name: { control: 'text', description: 'Nome enviado com o formulário para cada valor selecionado.' },
    autocomplete: { control: 'text', description: 'Sugestão de preenchimento automático do navegador.' },
    required: {
      control: 'boolean',
      description: 'Exige ao menos uma opção selecionada.',
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
      description: 'Personaliza os valores selecionados. Recebe options.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    option: {
      control: false,
      description: 'Personaliza cada opção. Recebe option.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Evento emitido quando os valores selecionados mudam.'
    },
    'onUpdate:open': {
      action: 'update:open',
      description: 'Evento emitido ao abrir ou fechar a lista.'
    }
  },
  args: {
    modelValue: ['design', 'engineering'],
    options: teamOptions,
    placeholder: 'Selecione os times',
    label: 'Times responsáveis',
    description: 'Você pode selecionar mais de um time.',
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
  render: (args: MultiSelectStoryArgs) => ({
    components: { MultiSelect },
    setup() {
      const value = ref([...(args.modelValue ?? [])])
      const open = ref(args.open)
      watch(() => args.modelValue, nextValue => value.value = [...(nextValue ?? [])])
      watch(() => args.open, nextOpen => open.value = nextOpen)
      return { args, open, value }
    },
    template: `
      <MultiSelect
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
} as Meta<MultiSelectStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sizes: Story = {
  render: () => ({
    components: { MultiSelect },
    setup: () => ({ sizes, teamOptions }),
    template: `
      <div class="flex flex-col gap-5">
        <MultiSelect
          v-for="size in sizes"
          :key="size"
          :model-value="['design', 'engineering']"
          :size="size"
          :label="size"
          :options="teamOptions" />
      </div>
    `
  })
}

export const States: Story = {
  render: () => ({
    components: { MultiSelect },
    setup: () => ({ emptyValue: ref<string[]>([]), teamOptions }),
    template: `
      <div class="flex flex-col gap-5">
        <MultiSelect v-model="emptyValue" label="Sem seleção" :options="teamOptions" />
        <MultiSelect label="Desabilitado" :model-value="['product']" disabled :options="teamOptions" />
        <MultiSelect
          label="Com erro"
          :model-value="[]"
          error="Selecione ao menos um time para continuar."
          :options="teamOptions" />
      </div>
    `
  })
}

export const CustomValue: Story = {
  render: () => ({
    components: { MultiSelect },
    setup: () => ({ teamOptions }),
    template: `
      <MultiSelect
        :model-value="['design', 'engineering']"
        label="Resumo personalizado"
        default-open
        :options="teamOptions">
        <template #value="{ options }">
          {{ options.length }} times selecionados
        </template>
        <template #option="{ option }">
          <span class="font-medium">{{ option.label }}</span>
        </template>
      </MultiSelect>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Os slots value e option permitem resumir os valores escolhidos e personalizar a apresentação de cada item.'
      }
    }
  }
}
