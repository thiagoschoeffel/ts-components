import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed } from 'vue'
import * as availableIcons from '../../icons'
import Button from './Button.vue'

const variants = ['primary', 'secondary', 'success', 'warning', 'danger'] as const
const sizes = ['small', 'medium', 'large'] as const
const iconOptions = ['Nenhum', ...Object.keys(availableIcons)]

type IconName = keyof typeof availableIcons | 'Nenhum'

interface ButtonStoryArgs {
  variant: (typeof variants)[number]
  size: (typeof sizes)[number]
  type: 'button' | 'submit' | 'reset'
  disabled: boolean
  loading: boolean
  iconOnly: boolean
  iconName: IconName
  trailingIconName: IconName
  default?: unknown
  icon?: unknown
  trailingIcon?: unknown
  onClick?: (event: MouseEvent) => void
}

const meta: Meta<ButtonStoryArgs> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Botão inspirado nos controles do macOS, com variações de cor, tamanho e estado.

\`\`\`vue
<Button variant="primary">
  <template #icon><CheckIcon /></template>
  Salvar
</Button>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    default: {
      control: false,
      description: 'Conteúdo exibido dentro do botão.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    icon: {
      control: false,
      description: 'Ícone exibido antes do texto. Use `<template #icon>`.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    trailingIcon: {
      control: false,
      description: 'Ícone exibido depois do texto. Use `<template #trailingIcon>`.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    iconName: {
      control: 'select',
      options: iconOptions,
      description: 'Controle do Storybook para experimentar um ícone inicial.',
      table: { category: 'Storybook' }
    },
    trailingIconName: {
      control: 'select',
      options: iconOptions,
      description: 'Controle do Storybook para experimentar um ícone final.',
      table: { category: 'Storybook' }
    },
    variant: {
      control: 'select',
      options: variants,
      description: 'Cor e ênfase visual do botão.',
      table: { defaultValue: { summary: 'primary' } }
    },
    size: {
      control: 'select',
      options: sizes,
      description: 'Tamanho do botão.',
      table: { defaultValue: { summary: 'medium' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita a interação.',
      table: { defaultValue: { summary: 'false' } }
    },
    loading: {
      control: 'boolean',
      description: 'Exibe o indicador de progresso e desabilita a interação.',
      table: { defaultValue: { summary: 'false' } }
    },
    iconOnly: {
      control: 'boolean',
      description: 'Aplica dimensões quadradas para uso somente com ícone.',
      table: { defaultValue: { summary: 'false' } }
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Tipo nativo do botão.',
      table: { defaultValue: { summary: 'button' } }
    },
    onClick: {
      action: 'clicked',
      description: 'Evento emitido quando o botão é acionado.'
    }
  },
  args: {
    variant: 'primary',
    size: 'medium',
    type: 'button',
    disabled: false,
    loading: false,
    iconOnly: false,
    iconName: 'Nenhum',
    trailingIconName: 'Nenhum'
  },
  render: (args) => ({
    components: { Button },
    setup() {
      const selectedIcon = computed(() =>
        args.iconName === 'Nenhum' ? null : availableIcons[args.iconName]
      )
      const selectedTrailingIcon = computed(() =>
        args.trailingIconName === 'Nenhum' ? null : availableIcons[args.trailingIconName]
      )

      return { args, selectedIcon, selectedTrailingIcon }
    },
    template: `
      <Button
        :variant="args.variant"
        :size="args.size"
        :type="args.type"
        :disabled="args.disabled"
        :loading="args.loading"
        :icon-only="args.iconOnly"
        :aria-label="args.iconOnly ? 'Ação do botão' : undefined"
        @click="args.onClick">
        <template v-if="selectedIcon" #icon>
          <component :is="selectedIcon" />
        </template>

        <template v-if="!args.iconOnly">Button</template>

        <template v-if="selectedTrailingIcon && !args.iconOnly" #trailingIcon>
          <component :is="selectedTrailingIcon" />
        </template>
      </Button>
    `
  })
}

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Colors: Story = {
  render: () => ({
    components: { Button },
    setup: () => ({ variants }),
    template: `
      <div class="flex flex-wrap gap-3">
        <Button v-for="variant in variants" :key="variant" :variant="variant">
          {{ variant }}
        </Button>
      </div>
    `
  })
}

export const Sizes: Story = {
  render: () => ({
    components: { Button },
    setup: () => ({ sizes }),
    template: `
      <div class="flex items-center gap-3">
        <Button v-for="size in sizes" :key="size" :size="size">
          {{ size }}
        </Button>
      </div>
    `
  })
}

export const States: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap gap-3">
        <Button>Default</Button>
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
      </div>
    `
  })
}

export const WithIcon: Story = {
  args: { iconName: 'CheckIcon' }
}

export const WithTrailingIcon: Story = {
  args: { variant: 'secondary', trailingIconName: 'ArrowRightIcon' }
}

export const IconOnly: Story = {
  args: { variant: 'secondary', iconOnly: true, iconName: 'SettingsIcon' }
}
