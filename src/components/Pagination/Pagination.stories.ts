import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import Pagination from './Pagination.vue'

const sizes = ['small', 'medium', 'large'] as const

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Navegação paginada baseada no Reka UI, com limites acessíveis, reticências automáticas e aparência inspirada no macOS.

\`\`\`vue
<Pagination
  v-model="page"
  :total="120"
  :items-per-page="10"
/>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    modelValue: {
      control: { type: 'number', min: 1 },
      description: 'Página atual, iniciando em 1.',
      table: { defaultValue: { summary: '1' } }
    },
    total: {
      control: { type: 'number', min: 0 },
      description: 'Quantidade total de registros.'
    },
    itemsPerPage: {
      control: { type: 'number', min: 1 },
      description: 'Quantidade de registros representada por página.',
      table: { defaultValue: { summary: '10' } }
    },
    siblingCount: {
      control: { type: 'range', min: 0, max: 3, step: 1 },
      description: 'Quantidade de páginas vizinhas à página atual.',
      table: { defaultValue: { summary: '1' } }
    },
    showEdges: {
      control: 'boolean',
      description: 'Mantém a primeira e a última páginas visíveis.',
      table: { defaultValue: { summary: 'true' } }
    },
    size: {
      control: 'select',
      options: sizes,
      description: 'Tamanho dos controles de navegação.',
      table: { defaultValue: { summary: 'medium' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita toda a navegação.',
      table: { defaultValue: { summary: 'false' } }
    },
    label: {
      control: 'text',
      description: 'Nome acessível da região de navegação.',
      table: { defaultValue: { summary: 'Paginação' } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Evento emitido quando a página atual muda.'
    }
  },
  args: {
    modelValue: 6,
    total: 120,
    itemsPerPage: 10,
    siblingCount: 1,
    showEdges: true,
    size: 'medium',
    disabled: false,
    label: 'Paginação de pedidos'
  },
  render: (args) => ({
    components: { Pagination },
    setup() {
      const page = ref(args.modelValue)
      watch(() => args.modelValue, value => page.value = value)
      return { args, page }
    },
    template: `
      <div class="space-y-4">
        <div>
          <p class="text-sm font-medium text-slate-700">Página {{ page }}</p>
          <p class="text-xs text-slate-500">{{ args.total }} registros, {{ args.itemsPerPage }} por página.</p>
        </div>
        <Pagination
          v-model="page"
          :total="args.total"
          :items-per-page="args.itemsPerPage"
          :sibling-count="args.siblingCount"
          :show-edges="args.showEdges"
          :size="args.size"
          :disabled="args.disabled"
          :label="args.label"
          @update:model-value="args['onUpdate:modelValue']" />
      </div>
    `
  })
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sizes: Story = {
  render: () => ({
    components: { Pagination },
    setup: () => ({ sizes }),
    template: `
      <div class="flex flex-col gap-8">
        <div v-for="size in sizes" :key="size" class="space-y-3">
          <p class="text-sm font-medium capitalize text-slate-700">{{ size }}</p>
          <Pagination :model-value="5" :total="100" :size="size" />
        </div>
      </div>
    `
  })
}

export const Boundaries: Story = {
  render: () => ({
    components: { Pagination },
    template: `
      <div class="space-y-8">
        <div class="space-y-3">
          <p class="text-sm font-medium text-slate-700">Primeira página</p>
          <p class="text-xs text-slate-500">O controle anterior fica indisponível.</p>
          <Pagination :model-value="1" :total="100" />
        </div>
        <div class="space-y-3">
          <p class="text-sm font-medium text-slate-700">Última página</p>
          <p class="text-xs text-slate-500">O controle seguinte fica indisponível.</p>
          <Pagination :model-value="10" :total="100" />
        </div>
      </div>
    `
  })
}

export const Disabled: Story = {
  render: () => ({
    components: { Pagination },
    template: `
      <div class="space-y-3">
        <p class="text-sm font-medium text-slate-700">Desabilitada</p>
        <p class="text-xs text-slate-500">Todos os controles permanecem visíveis, sem interação.</p>
        <Pagination :model-value="5" :total="100" disabled />
      </div>
    `
  })
}
