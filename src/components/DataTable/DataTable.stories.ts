import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref, watch } from 'vue'
import { EllipsisIcon } from '../../icons'
import Badge from '../Badge/Badge.vue'
import Button from '../Button/Button.vue'
import DataTable from './DataTable.vue'
import Pagination from '../Pagination/Pagination.vue'

const columns = [
  { key: 'order', label: 'Pedido', size: 'small', sortable: true },
  { key: 'customer', label: 'Cliente', size: 'large', sortable: true },
  { key: 'status', label: 'Status', size: 'medium', sortable: true },
  { key: 'channel', label: 'Origem', size: 'medium', sortable: true },
  { key: 'deliveryWindow', label: 'Janela de entrega', size: 'large', sortable: true },
  { key: 'address', label: 'Endereço', size: 'large', sortable: false },
  { key: 'total', label: 'Total', size: 'small', align: 'right', sortable: true }
] as const

const customers = [
  'Marina Oliveira',
  'Rafael Santos',
  'Camila Ferreira',
  'Lucas Almeida',
  'Beatriz Costa',
  'Gustavo Ribeiro'
]

const statuses = ['Confirmado', 'Em produção', 'Embalado', 'Aguardando revisão']
const statusVariants = {
  Confirmado: 'success',
  'Em produção': 'info',
  Embalado: 'neutral',
  'Aguardando revisão': 'warning'
} as const

const rows = Array.from({ length: 18 }, (_, index) => ({
  id: index + 1,
  order: `#${String(index + 1841).padStart(4, '0')}`,
  customer: customers[index % customers.length],
  status: statuses[index % statuses.length],
  channel: index % 3 === 0 ? 'Atendimento' : 'Aplicativo',
  deliveryWindow: index % 2 === 0 ? '18h00 – 19h00' : '19h00 – 20h00',
  address: `Rua das Flores, ${120 + index} · Centro`,
  total: `R$ ${(42 + index * 3.75).toFixed(2).replace('.', ',')}`
}))

const meta = {
  title: 'Components/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Tabela de dados com rolagem nas duas direções, seleção em massa e coluna de ações fixa à direita.

A sombra da coluna de ações aparece somente enquanto existe conteúdo oculto à direita e desaparece quando a rolagem chega ao fim.

A altura é definida por uma classe Tailwind no componente, por exemplo \`class="h-80"\`. Sem uma altura limitada, a tabela cresce conforme o conteúdo e não precisa de rolagem vertical.

\`\`\`vue
<DataTable
  v-model="selectedOrders"
  :columns="columns"
  :rows="orders"
  row-key="id">
  <template #cell-status="{ value }">
    <Badge>{{ value }}</Badge>
  </template>

  <template #actions="{ row }">
    <Button size="small" variant="secondary">Abrir</Button>
  </template>
</DataTable>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    columns: {
      control: false,
      description: 'Definições das colunas, incluindo chave, título, tamanho e alinhamento.',
      table: {
        type: { summary: 'DataTableColumn[]' },
        detail: `{ key: string; label: string; size?: 'small' | 'medium' | 'large' | 'flexible'; align?: 'left' | 'center' | 'right'; sortable?: boolean }[]`
      }
    },
    rows: {
      control: false,
      description: 'Registros exibidos na visualização atual.',
      table: { type: { summary: 'Record<string, unknown>[]' } }
    },
    modelValue: {
      control: false,
      description: 'Chaves dos registros selecionados. Use com v-model.',
      table: { type: { summary: '(string | number)[]' }, defaultValue: { summary: '[]' } }
    },
    rowKey: {
      control: 'text',
      description: 'Propriedade que identifica cada registro de forma única.',
      table: { defaultValue: { summary: 'id' } }
    },
    selectable: {
      control: 'boolean',
      description: 'Exibe a coluna de seleção e o seletor em massa.',
      table: { defaultValue: { summary: 'true' } }
    },
    disabledRowKeys: {
      control: false,
      description: 'Chaves de registros que não podem ser selecionados.',
      table: { type: { summary: '(string | number)[]' }, defaultValue: { summary: '[]' } }
    },
    expandedRowKeys: {
      control: false,
      description: 'Chaves dos registros que exibem uma linha adicional de detalhe.',
      table: { type: { summary: '(string | number)[]' }, defaultValue: { summary: '[]' } }
    },
    sortKey: {
      control: 'select',
      options: [undefined, ...columns.filter(column => column.sortable).map(column => column.key)],
      description: 'Chave da coluna atualmente ordenada.'
    },
    sortDirection: {
      control: 'select',
      options: [undefined, 'asc', 'desc'],
      description: 'Direção da ordenação ativa.'
    },
    sortMode: {
      control: 'select',
      options: ['client', 'manual'],
      description: 'Client ordena os registros localmente; manual delega a ordenação para o consumidor ou API.',
      table: { defaultValue: { summary: 'client' } }
    },
    label: {
      control: 'text',
      description: 'Nome acessível da tabela.'
    },
    actionsLabel: {
      control: 'text',
      description: 'Título da coluna fixa de ações.',
      table: { defaultValue: { summary: 'Ações' } }
    },
    emptyText: {
      control: 'text',
      description: 'Mensagem exibida quando não há registros.'
    },
    scrollbarVisibility: {
      control: 'select',
      options: ['auto', 'always', 'scroll', 'hover', 'glimpse'],
      description: 'Quando as barras de rolagem personalizadas são mostradas.',
      table: { defaultValue: { summary: 'auto' } }
    },
    cell: {
      control: false,
      description: 'Personaliza todas as células. Recebe row, value, column e rowIndex.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    actions: {
      control: false,
      description: 'Conteúdo da coluna fixa de ações. Recebe row e rowIndex.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    'row-detail': {
      control: false,
      description: 'Linha adicional relacionada ao registro. É exibida para as chaves em expandedRowKeys.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    empty: {
      control: false,
      description: 'Substitui o conteúdo do estado vazio.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Evento emitido quando a seleção muda.'
    },
    'onUpdate:sortKey': {
      action: 'update:sortKey',
      description: 'Evento emitido quando a coluna ativa muda.'
    },
    'onUpdate:sortDirection': {
      action: 'update:sortDirection',
      description: 'Evento emitido quando a direção muda.'
    },
    onSort: {
      action: 'sort',
      description: 'Evento com o estado completo da ordenação.'
    }
  },
  args: {
    columns: [...columns],
    rows,
    modelValue: [],
    rowKey: 'id',
    selectable: true,
    disabledRowKeys: [4],
    expandedRowKeys: [],
    sortKey: undefined,
    sortDirection: undefined,
    sortMode: 'client',
    label: 'Pedidos da operação',
    actionsLabel: 'Ações',
    emptyText: 'Nenhum pedido encontrado.',
    scrollbarVisibility: 'auto'
  },
  render: (args) => ({
    components: { Badge, Button, DataTable, EllipsisIcon },
    setup() {
      const selection = ref<(string | number)[]>([1, 2])
      watch(() => args.modelValue, value => selection.value = [...(value ?? [])])
      return { args, selection, statusVariants }
    },
    template: `
      <div class="box-border w-full min-w-0 max-w-full space-y-3 p-4">
        <div class="flex items-baseline justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-slate-700">Pedidos</p>
            <p class="text-xs text-slate-500">Role vertical e horizontalmente para verificar o comportamento fixo das ações.</p>
          </div>
          <p class="shrink-0 text-xs text-slate-500">{{ selection.length }} selecionados</p>
        </div>

        <div class="h-96 min-h-0 min-w-0">
          <DataTable
            v-model="selection"
            :columns="args.columns"
            :rows="args.rows"
            :row-key="args.rowKey"
            :selectable="args.selectable"
          :disabled-row-keys="args.disabledRowKeys"
          :expanded-row-keys="args.expandedRowKeys"
          :sort-key="args.sortKey"
          :sort-direction="args.sortDirection"
          :sort-mode="args.sortMode"
            :label="args.label"
            :actions-label="args.actionsLabel"
            :empty-text="args.emptyText"
            :scrollbar-visibility="args.scrollbarVisibility"
          class="size-full"
          @update:model-value="args['onUpdate:modelValue']"
          @update:sort-key="args['onUpdate:sortKey']"
          @update:sort-direction="args['onUpdate:sortDirection']"
          @sort="args.onSort">
            <template #cell-order="{ value }">
              <span class="font-semibold text-slate-900">{{ value }}</span>
            </template>

            <template #cell-status="{ value }">
              <Badge :variant="statusVariants[value]">{{ value }}</Badge>
            </template>

            <template #actions="{ row }">
              <Button
                variant="secondary"
                size="small"
                icon-only
                :aria-label="\`Abrir ações do pedido \${row.order}\`">
                <template #icon><EllipsisIcon /></template>
              </Button>
            </template>

            <template #row-detail="{ row }">
              <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
                <span class="text-sm font-medium text-slate-700">Informações relacionadas ao {{ row.order }}</span>
                <span class="text-xs text-slate-500">Observação: confirmar o complemento do endereço antes da saída.</span>
              </div>
            </template>
          </DataTable>
        </div>
      </div>
    `
  })
} satisfies Meta<typeof DataTable>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithoutSelection: Story = {
  args: { selectable: false },
  parameters: {
    docs: {
      description: {
        story: 'A coluna de seleção pode ser removida quando a ação em massa não fizer parte do contexto.'
      }
    }
  }
}

export const Empty: Story = {
  args: { rows: [] },
  parameters: {
    docs: {
      description: {
        story: 'O estado vazio ocupa toda a largura disponível e preserva o cabeçalho da tabela.'
      }
    }
  }
}

export const CustomHeight: Story = {
  render: () => ({
    components: { DataTable },
    setup: () => ({ columns: [...columns], rows }),
    template: `
      <div class="box-border w-full min-w-0 space-y-3 p-4">
        <div>
          <p class="text-sm font-medium text-slate-700">Altura compacta</p>
          <p class="text-xs text-slate-500">A classe h-64 limita a área e ativa a rolagem vertical quando necessário.</p>
        </div>
        <DataTable :columns="columns" :rows="rows" class="h-64" />
      </div>
    `
  })
}

export const RelatedRow: Story = {
  args: { expandedRowKeys: [2] },
  parameters: {
    docs: {
      description: {
        story: 'A linha adicional é vinculada pela mesma rowKey e renderizada pelo slot row-detail.'
      }
    }
  }
}

export const WithPagination: Story = {
  render: () => ({
    components: { Button, DataTable, EllipsisIcon, Pagination },
    setup() {
      const page = ref(1)
      const selection = ref<(string | number)[]>([])
      const sortKey = ref<string>()
      const sortDirection = ref<'asc' | 'desc'>()
      const itemsPerPage = 5
      const sortedRows = computed(() => {
        if (!sortKey.value || !sortDirection.value)
          return rows

        const activeKey = sortKey.value
        const directionMultiplier = sortDirection.value === 'asc' ? 1 : -1
        return [...rows].sort((firstRow, secondRow) =>
          String((firstRow as Record<string, unknown>)[activeKey]).localeCompare(String((secondRow as Record<string, unknown>)[activeKey]), 'pt-BR', {
            numeric: true,
            sensitivity: 'base'
          }) * directionMultiplier
        )
      })
      const visibleRows = computed(() => {
        const start = (page.value - 1) * itemsPerPage
        return sortedRows.value.slice(start, start + itemsPerPage)
      })

      return {
        columns: [...columns],
        itemsPerPage,
        page,
        rows,
        selection,
        sortDirection,
        sortKey,
        visibleRows
      }
    },
    template: `
      <div class="box-border w-full min-w-0 space-y-4 p-4">
        <div>
          <p class="text-sm font-medium text-slate-700">Tabela paginada</p>
          <p class="text-xs text-slate-500">A seleção é preservada ao navegar entre as páginas.</p>
        </div>

        <DataTable
          v-model="selection"
          :columns="columns"
          :rows="visibleRows"
          v-model:sort-key="sortKey"
          v-model:sort-direction="sortDirection"
          sort-mode="manual"
          class="h-72">
          <template #actions="{ row }">
            <Button
              variant="secondary"
              size="small"
              icon-only
              :aria-label="\`Abrir ações do pedido \${row.order}\`">
              <template #icon><EllipsisIcon /></template>
            </Button>
          </template>
        </DataTable>

        <div class="flex flex-wrap items-center justify-between gap-4">
          <p class="text-xs text-slate-500">{{ selection.length }} selecionados</p>
          <Pagination
            v-model="page"
            :total="rows.length"
            :items-per-page="itemsPerPage"
            size="small"
            label="Paginação de pedidos" />
        </div>
      </div>
    `
  })
}
