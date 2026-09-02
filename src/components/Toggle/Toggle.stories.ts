import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref, watch } from 'vue'
import {
  getIconComponent,
  iconControlOptions,
  type IconControlName
} from '../../iconControls'
import { BoldIcon, ItalicIcon, UnderlineIcon } from '../../icons'
import Toggle, { type ToggleProps } from './Toggle.vue'

const sizes = ['small', 'medium', 'large'] as const

interface ToggleStoryArgs extends ToggleProps {
  label: string
  iconName: IconControlName
  'onUpdate:modelValue'?: (value: boolean) => void
  default?: unknown
  icon?: unknown
}

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Botão de alternância baseado no Reka UI, com aparência de Button secondary e estado pressionado persistente. É adequado para ações ativáveis, como os controles de formatação de um editor de texto.

\`\`\`vue
<Toggle v-model="bold" aria-label="Negrito" icon-only>
  <template #icon><BoldIcon /></template>
</Toggle>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'Estado pressionado atual. Use com v-model.',
      table: { defaultValue: { summary: 'false' } }
    },
    size: {
      control: 'select',
      options: sizes,
      description: 'Tamanho do controle.',
      table: { defaultValue: { summary: 'medium' } }
    },
    iconOnly: {
      control: 'boolean',
      description: 'Aplica dimensões quadradas para uso somente com ícone.',
      table: { defaultValue: { summary: 'false' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita a interação.',
      table: { defaultValue: { summary: 'false' } }
    },
    name: {
      control: 'text',
      description: 'Nome enviado junto ao formulário.'
    },
    required: {
      control: 'boolean',
      description: 'Marca o controle como obrigatório no formulário.',
      table: { defaultValue: { summary: 'false' } }
    },
    label: {
      control: 'text',
      description: 'Texto usado pela story dentro do componente.',
      table: { category: 'Storybook' }
    },
    iconName: {
      control: 'select',
      options: iconControlOptions,
      description: 'Controle do Storybook para experimentar um ícone.',
      table: { category: 'Storybook' }
    },
    default: {
      control: false,
      description: 'Conteúdo exibido dentro do toggle.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    icon: {
      control: false,
      description: 'Ícone exibido antes do texto. Use `<template #icon>`.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Evento emitido quando o estado pressionado muda.'
    }
  },
  args: {
    modelValue: false,
    size: 'medium',
    iconOnly: false,
    disabled: false,
    required: false,
    label: 'Negrito',
    iconName: 'BoldIcon'
  },
  render: (args) => ({
    components: { Toggle },
    setup() {
      const pressed = ref(args.modelValue)
      const selectedIcon = computed(() => getIconComponent(args.iconName))
      watch(() => args.modelValue, value => pressed.value = value)
      return { args, pressed, selectedIcon }
    },
    template: `
      <Toggle
        v-model="pressed"
        :size="args.size"
        :icon-only="args.iconOnly"
        :disabled="args.disabled"
        :name="args.name"
        :required="args.required"
        :aria-label="args.iconOnly ? args.label : undefined"
        @update:model-value="args['onUpdate:modelValue']">
        <template v-if="selectedIcon" #icon>
          <component :is="selectedIcon" />
        </template>
        <template v-if="!args.iconOnly">{{ args.label }}</template>
      </Toggle>
    `
  })
} satisfies Meta<ToggleStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const States: Story = {
  render: () => ({
    components: { Toggle, BoldIcon },
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Toggle aria-label="Negrito desativado" icon-only>
          <template #icon><BoldIcon /></template>
        </Toggle>
        <Toggle model-value aria-label="Negrito ativado" icon-only>
          <template #icon><BoldIcon /></template>
        </Toggle>
        <Toggle disabled aria-label="Negrito indisponível" icon-only>
          <template #icon><BoldIcon /></template>
        </Toggle>
      </div>
    `
  })
}

export const Sizes: Story = {
  render: () => ({
    components: { Toggle, BoldIcon },
    setup: () => ({ sizes }),
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Toggle v-for="size in sizes" :key="size" :size="size">
          <template #icon><BoldIcon /></template>
          {{ size }}
        </Toggle>
      </div>
    `
  })
}

export const RichTextToolbar: Story = {
  render: () => ({
    components: { Toggle, BoldIcon, ItalicIcon, UnderlineIcon },
    setup() {
      const bold = ref(true)
      const italic = ref(false)
      const underline = ref(false)
      return { bold, italic, underline }
    },
    template: `
      <div class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1.5">
        <Toggle v-model="bold" size="small" icon-only aria-label="Negrito">
          <template #icon><BoldIcon /></template>
        </Toggle>
        <Toggle v-model="italic" size="small" icon-only aria-label="Itálico">
          <template #icon><ItalicIcon /></template>
        </Toggle>
        <Toggle v-model="underline" size="small" icon-only aria-label="Sublinhado">
          <template #icon><UnderlineIcon /></template>
        </Toggle>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo compacto do uso planejado em uma toolbar de texto rico. Cada controle mantém seu próprio estado pressionado.'
      }
    }
  }
}
