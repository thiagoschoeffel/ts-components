import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import RadioGroup from './RadioGroup.vue'

const sizes = ['small', 'medium', 'large'] as const
const orientations = ['vertical', 'horizontal'] as const
const deliveryOptions = [
  { value: 'standard', label: 'Entrega padrão', description: 'Receba entre 18h e 20h.' },
  { value: 'express', label: 'Entrega expressa', description: 'Receba em até 60 minutos.' },
  { value: 'pickup', label: 'Retirada', description: 'Retire diretamente na unidade.' }
]

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Grupo de seleção única baseado no Reka UI, com navegação por teclado e controles inspirados no macOS.

\`\`\`vue
<RadioGroup
  v-model="delivery"
  label="Forma de entrega"
  :options="[
    { value: 'standard', label: 'Padrão' },
    { value: 'express', label: 'Expressa' }
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
      options: deliveryOptions.map(option => option.value),
      description: 'Valor da opção atualmente selecionada.'
    },
    options: {
      control: false,
      description: 'Lista de opções com value, label, description e disabled.',
      table: {
        type: { summary: 'RadioOption[]' },
        detail: `{ value: string; label: string; description?: string; disabled?: boolean }[]`
      }
    },
    label: {
      control: 'text',
      description: 'Título visível e nome acessível do grupo.'
    },
    description: {
      control: 'text',
      description: 'Texto complementar exibido abaixo do título.'
    },
    orientation: {
      control: 'select',
      options: orientations,
      description: 'Direção em que as opções são organizadas.',
      table: { defaultValue: { summary: 'vertical' } }
    },
    size: {
      control: 'select',
      options: sizes,
      description: 'Tamanho dos controles e textos.',
      table: { defaultValue: { summary: 'medium' } }
    },
    name: {
      control: 'text',
      description: 'Nome enviado junto ao formulário.'
    },
    required: {
      control: 'boolean',
      description: 'Indica que o grupo é obrigatório.',
      table: { defaultValue: { summary: 'false' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita todas as opções.',
      table: { defaultValue: { summary: 'false' } }
    },
    loop: {
      control: 'boolean',
      description: 'Permite continuar a navegação por teclado entre as extremidades.',
      table: { defaultValue: { summary: 'true' } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Evento emitido quando a opção selecionada muda.'
    }
  },
  args: {
    modelValue: 'standard',
    options: deliveryOptions,
    label: 'Forma de entrega',
    description: 'Escolha uma única opção para este pedido.',
    orientation: 'vertical',
    size: 'medium',
    required: false,
    disabled: false,
    loop: true
  },
  render: (args) => ({
    components: { RadioGroup },
    setup() {
      const selected = ref(args.modelValue)
      watch(() => args.modelValue, value => selected.value = value)
      return { args, selected }
    },
    template: `
      <RadioGroup
        v-model="selected"
        :options="args.options"
        :label="args.label"
        :description="args.description"
        :orientation="args.orientation"
        :size="args.size"
        :name="args.name"
        :required="args.required"
        :disabled="args.disabled"
        :loop="args.loop"
        @update:model-value="args['onUpdate:modelValue']" />
    `
  })
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Orientations: Story = {
  render: () => ({
    components: { RadioGroup },
    setup: () => ({ deliveryOptions }),
    template: `
      <div class="space-y-10">
        <div class="space-y-4">
          <div>
            <p class="text-sm font-medium text-slate-700">Vertical</p>
            <p class="text-xs text-slate-500">Ideal quando as opções possuem descrições.</p>
          </div>
          <RadioGroup model-value="standard" :options="deliveryOptions" />
        </div>
        <div class="space-y-4">
          <div>
            <p class="text-sm font-medium text-slate-700">Horizontal</p>
            <p class="text-xs text-slate-500">Adequado para escolhas curtas e relacionadas.</p>
          </div>
          <RadioGroup
            model-value="standard"
            orientation="horizontal"
            :options="deliveryOptions.map(({ value, label }) => ({ value, label }))" />
        </div>
      </div>
    `
  })
}

export const Sizes: Story = {
  render: () => ({
    components: { RadioGroup },
    setup: () => ({ sizes }),
    template: `
      <div class="flex flex-col gap-8">
        <div v-for="size in sizes" :key="size" class="space-y-3">
          <p class="text-sm font-medium capitalize text-slate-700">{{ size }}</p>
          <RadioGroup
            model-value="yes"
            :size="size"
            orientation="horizontal"
            :options="[{ value: 'yes', label: 'Sim' }, { value: 'no', label: 'Não' }]" />
        </div>
      </div>
    `
  })
}

export const OptionDisabled: Story = {
  render: () => ({
    components: { RadioGroup },
    template: `
      <div class="space-y-4">
        <p class="text-sm font-medium text-slate-700">Opção indisponível</p>
        <p class="text-xs text-slate-500">Uma opção pode ser bloqueada sem desabilitar todo o grupo.</p>
        <RadioGroup
          model-value="standard"
          :options="[
            { value: 'standard', label: 'Entrega padrão' },
            { value: 'express', label: 'Entrega expressa', disabled: true },
            { value: 'pickup', label: 'Retirada' }
          ]" />
      </div>
    `
  })
}
