import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed } from 'vue'
import * as availableIcons from '../../icons'
import PageHeader from './PageHeader.vue'

type IconName = keyof typeof availableIcons | 'Nenhum'

interface PageHeaderStoryArgs {
  title: string
  subtitle?: string
  iconName: IconName
  icon?: unknown
}

const meta: Meta<PageHeaderStoryArgs> = {
  title: 'Components/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Cabeçalho padronizado para páginas. O ícone é opcional e deve ser fornecido pelo slot \`icon\`.

\`\`\`vue
<PageHeader title="Pedidos" subtitle="Gerencie os pedidos da operação">
  <template #icon>
    <ClipboardListIcon :size="32" />
  </template>
</PageHeader>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Main heading of the page.'
    },
    subtitle: {
      control: 'text',
      description: 'Supporting text displayed below the heading.'
    },
    iconName: {
      control: 'select',
      options: ['Nenhum', ...Object.keys(availableIcons)],
      description: 'Controle exclusivo do Storybook para experimentar os ícones.',
      table: { category: 'Storybook' }
    },
    icon: {
      control: false,
      description: 'Ícone opcional inserido com `<template #icon>`.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    }
  },
  args: {
    title: 'Pedidos',
    subtitle: 'Acompanhe e gerencie os pedidos da operação.',
    iconName: 'Nenhum'
  },
  render: (args) => ({
    components: { PageHeader },
    setup() {
      const selectedIcon = computed(() =>
        args.iconName === 'Nenhum' ? null : availableIcons[args.iconName]
      )

      return { args, selectedIcon }
    },
    template: `
      <PageHeader :title="args.title" :subtitle="args.subtitle">
        <template v-if="selectedIcon" #icon>
          <component :is="selectedIcon" :size="32" :stroke-width="1.75" />
        </template>
      </PageHeader>
    `
  })
}

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const TitleOnly: Story = {
  args: {
    title: 'Pedidos',
    subtitle: undefined,
    iconName: 'Nenhum'
  }
}

export const WithSubtitle: Story = {}

export const WithIcon: Story = {
  args: {
    iconName: 'ClipboardListIcon'
  }
}
