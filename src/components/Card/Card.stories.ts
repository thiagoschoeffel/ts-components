import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Card from './Card.vue'

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Card estrutural com slots opcionais para header e footer.

\`\`\`vue
<Card>
  <template #header>Header do card</template>

  Conteúdo do card

  <template #footer>Footer do card</template>
</Card>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    default: {
      control: false,
      description: 'Conteúdo principal inserido diretamente dentro do Card.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    header: {
      control: false,
      description: 'Conteúdo opcional do header. Use `<template #header>`.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    footer: {
      control: false,
      description: 'Conteúdo opcional do footer. Use `<template #footer>`.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    }
  },
  decorators: [
    () => ({
      template: '<div class="w-[min(32rem,90vw)]"><story /></div>'
    })
  ],
  render: () => ({
    components: { Card },
    template: `
      <Card>
        <template #header>
          Header do card
        </template>

        <p>
          O conteúdo principal do card pode receber textos, listas, tabelas ou outros componentes.
        </p>
      </Card>
    `
  })
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const ContentOnly: Story = {
  render: () => ({
    components: { Card },
    template: `
      <Card>
        <p>Card com apenas o conteúdo principal.</p>
      </Card>
    `
  })
}

export const WithCustomHeaderAndFooter: Story = {
  render: () => ({
    components: { Card },
    template: `
      <Card>
        <template #header>
          Header personalizado
        </template>

        Conteúdo do card

        <template #footer>
          Footer personalizado
        </template>
      </Card>
    `
  })
}

export const FooterAlignment: Story = {
  render: () => ({
    components: { Card },
    template: `
      <div class="space-y-3">
        <div>
          <p class="text-sm font-medium text-slate-700">Footers alinhados</p>
          <p class="text-xs text-slate-500">Mesmo com conteúdos de alturas diferentes, o footer permanece na base.</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <Card class="h-full">
            <template #header>Conteúdo curto</template>
            <p>Uma única linha de conteúdo.</p>
            <template #footer>Footer do card</template>
          </Card>

          <Card class="h-full">
            <template #header>Conteúdo longo</template>
            <p>Este conteúdo ocupa mais espaço e demonstra que ambos os footers continuam alinhados na base do grid.</p>
            <template #footer>Footer do card</template>
          </Card>
        </div>
      </div>
    `
  })
}
