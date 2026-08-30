<script lang="ts">
export type DataTableKey = string | number
export type DataTableRow = Record<string, unknown>
export type DataTableColumnSize = 'small' | 'medium' | 'large' | 'flexible'
export type DataTableColumnAlign = 'left' | 'center' | 'right'
export type DataTableSortDirection = 'asc' | 'desc'
export type DataTableSortMode = 'client' | 'manual'

export interface DataTableColumn {
  key: string
  label: string
  size?: DataTableColumnSize
  align?: DataTableColumnAlign
  sortable?: boolean
}
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import {
  ArrowDownWideNarrowIcon,
  ArrowUpNarrowWideIcon,
  CornerDownRightIcon
} from '../../icons'
import Checkbox from '../Checkbox/Checkbox.vue'
import ScrollArea from '../ScrollArea/ScrollArea.vue'

const props = withDefaults(
  defineProps<{
    /** Column definitions rendered from left to right. */
    columns: DataTableColumn[]
    /** Records displayed in the current table view. */
    rows: DataTableRow[]
    /** Keys of the selected records. Supports v-model. */
    modelValue?: DataTableKey[]
    /** Property that uniquely identifies each record. */
    rowKey?: string
    /** Enables the checkbox selection column. */
    selectable?: boolean
    /** Record keys that cannot be selected. */
    disabledRowKeys?: DataTableKey[]
    /** Record keys whose related detail row is visible. */
    expandedRowKeys?: DataTableKey[]
    /** Key of the column currently used for sorting. */
    sortKey?: string
    /** Direction applied to the active sort column. */
    sortDirection?: DataTableSortDirection
    /** Client sorts the supplied rows; manual only emits sorting changes. */
    sortMode?: DataTableSortMode
    /** Accessible name for the table. */
    label?: string
    /** Header displayed above the sticky actions column. */
    actionsLabel?: string
    /** Message displayed when there are no records. */
    emptyText?: string
    /** Replaces the records with skeleton rows while data is being fetched. */
    loading?: boolean
    /** Number of skeleton rows displayed during loading. */
    loadingRows?: number
    /** Controls when the custom scrollbars are shown. */
    scrollbarVisibility?: 'auto' | 'always' | 'scroll' | 'hover' | 'glimpse'
  }>(),
  {
    modelValue: () => [],
    rowKey: 'id',
    selectable: true,
    disabledRowKeys: () => [],
    expandedRowKeys: () => [],
    sortKey: undefined,
    sortDirection: undefined,
    sortMode: 'client',
    label: 'Tabela de dados',
    actionsLabel: 'Ações',
    emptyText: 'Nenhum registro encontrado.',
    loading: false,
    loadingRows: 6,
    scrollbarVisibility: 'auto'
  }
)

const emit = defineEmits<{
  /** Emitted when the selected record keys change. */
  'update:modelValue': [keys: DataTableKey[]]
  /** Emitted when the active sort column changes. */
  'update:sortKey': [key: string | undefined]
  /** Emitted when the sort direction changes. */
  'update:sortDirection': [direction: DataTableSortDirection | undefined]
  /** Emitted with the complete sorting state after a sortable column is activated. */
  sort: [state: { key?: string; direction?: DataTableSortDirection }]
}>()

type CellSlotProps = {
  row: DataTableRow
  value: unknown
  column: DataTableColumn
  rowIndex: number
}

type DataTableSlots = {
  cell?: (props: CellSlotProps) => unknown
  actions?: (props: { row: DataTableRow; rowIndex: number }) => unknown
  empty?: () => unknown
  'row-detail'?: (props: { row: DataTableRow; rowIndex: number }) => unknown
}

defineSlots<DataTableSlots>()

const slots = useSlots()
const rootElement = ref<HTMLElement | null>(null)
const hasContentAfterActions = ref(false)
const hasVerticalOverflow = ref(false)
let resizeObserver: ResizeObserver | undefined

const hasActions = computed(() => Boolean(slots.actions))
const hasRowDetail = computed(() => Boolean(slots['row-detail']))
const disabledKeys = computed(() => new Set(props.disabledRowKeys))
const expandedKeys = computed(() => new Set(props.expandedRowKeys))
const activeSortKey = ref<string | undefined>(props.sortKey)
const activeSortDirection = ref<DataTableSortDirection | undefined>(props.sortDirection)
const skeletonRows = computed(() => Math.max(1, Math.floor(props.loadingRows)))

watch(() => props.sortKey, value => activeSortKey.value = value)
watch(() => props.sortDirection, value => activeSortDirection.value = value)

const displayedRows = computed(() => {
  if (
    props.sortMode === 'manual'
    || !activeSortKey.value
    || !activeSortDirection.value
  ) {
    return props.rows
  }

  const columnKey = activeSortKey.value
  const directionMultiplier = activeSortDirection.value === 'asc' ? 1 : -1

  return [...props.rows].sort((firstRow, secondRow) => {
    const firstValue = firstRow[columnKey]
    const secondValue = secondRow[columnKey]

    if (firstValue == null && secondValue == null)
      return 0
    if (firstValue == null)
      return 1
    if (secondValue == null)
      return -1
    if (typeof firstValue === 'number' && typeof secondValue === 'number')
      return (firstValue - secondValue) * directionMultiplier

    return String(firstValue).localeCompare(String(secondValue), 'pt-BR', {
      numeric: true,
      sensitivity: 'base'
    }) * directionMultiplier
  })
})

function getRowKey(row: DataTableRow): DataTableKey {
  const key = row[props.rowKey]
  return typeof key === 'number' || typeof key === 'string' ? key : String(key ?? '')
}

function hasColumnSlot(columnKey: string) {
  return Boolean(slots[`cell-${columnKey}`])
}

function getColumnSlotName(columnKey: string): keyof DataTableSlots {
  return `cell-${columnKey}` as keyof DataTableSlots
}

const selectableKeys = computed(() =>
  props.rows
    .map(getRowKey)
    .filter(key => !disabledKeys.value.has(key))
)

const selectedKeys = computed(() => new Set(props.modelValue))
const selectedVisibleCount = computed(() =>
  selectableKeys.value.filter(key => selectedKeys.value.has(key)).length
)

const bulkSelectionState = computed<boolean | 'indeterminate'>(() => {
  if (selectableKeys.value.length === 0 || selectedVisibleCount.value === 0)
    return false
  if (selectedVisibleCount.value === selectableKeys.value.length)
    return true
  return 'indeterminate'
})

const columnSizeClasses: Record<DataTableColumnSize, string> = {
  small: 'min-w-28',
  medium: 'min-w-44',
  large: 'min-w-64',
  flexible: 'min-w-52 w-full'
}

const alignClasses: Record<DataTableColumnAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
}

const justifyClasses: Record<DataTableColumnAlign, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end'
}

function isSortedBy(columnKey: string, direction?: DataTableSortDirection) {
  return activeSortKey.value === columnKey
    && (!direction || activeSortDirection.value === direction)
}

function getSortAriaValue(column: DataTableColumn) {
  if (!column.sortable || activeSortKey.value !== column.key)
    return column.sortable ? 'none' : undefined
  return activeSortDirection.value === 'desc' ? 'descending' : 'ascending'
}

function getSortActionLabel(column: DataTableColumn) {
  if (!isSortedBy(column.key))
    return `Ordenar ${column.label} do menor para o maior`
  if (activeSortDirection.value === 'asc')
    return `Ordenar ${column.label} do maior para o menor`
  return `Remover ordenação de ${column.label}`
}

function toggleSort(column: DataTableColumn) {
  if (props.loading)
    return

  let nextKey: string | undefined = column.key
  let nextDirection: DataTableSortDirection | undefined = 'asc'

  if (isSortedBy(column.key, 'asc')) {
    nextDirection = 'desc'
  }
  else if (isSortedBy(column.key, 'desc')) {
    nextKey = undefined
    nextDirection = undefined
  }

  activeSortKey.value = nextKey
  activeSortDirection.value = nextDirection
  emit('update:sortKey', nextKey)
  emit('update:sortDirection', nextDirection)
  emit('sort', { key: nextKey, direction: nextDirection })
}

function isRowDisabled(row: DataTableRow) {
  return disabledKeys.value.has(getRowKey(row))
}

function toggleRow(row: DataTableRow, checked: boolean | 'indeterminate') {
  const key = getRowKey(row)
  if (disabledKeys.value.has(key))
    return

  const nextSelection = new Set(props.modelValue)
  if (checked === true)
    nextSelection.add(key)
  else
    nextSelection.delete(key)
  emit('update:modelValue', [...nextSelection])
}

function toggleAll(checked: boolean | 'indeterminate') {
  const nextSelection = new Set(props.modelValue)
  for (const key of selectableKeys.value) {
    if (checked === true)
      nextSelection.add(key)
    else
      nextSelection.delete(key)
  }
  emit('update:modelValue', [...nextSelection])
}

function updateStickyShadow(viewport?: HTMLElement | null) {
  const scrollViewport = viewport
    ?? rootElement.value?.querySelector<HTMLElement>('[data-reka-scroll-area-viewport]')

  if (!scrollViewport) {
    hasContentAfterActions.value = false
    hasVerticalOverflow.value = false
    return
  }

  const remainingScroll = scrollViewport.scrollWidth - scrollViewport.clientWidth - scrollViewport.scrollLeft
  hasContentAfterActions.value = remainingScroll > 1
  hasVerticalOverflow.value = scrollViewport.scrollHeight - scrollViewport.clientHeight > 1
}

function handleScroll(event: Event) {
  updateStickyShadow(event.currentTarget as HTMLElement)
}

async function observeViewport() {
  await nextTick()
  resizeObserver?.disconnect()

  const viewport = rootElement.value?.querySelector<HTMLElement>('[data-reka-scroll-area-viewport]')
  if (!viewport)
    return

  updateStickyShadow(viewport)
  resizeObserver = new ResizeObserver(() => updateStickyShadow(viewport))
  resizeObserver.observe(viewport)
  if (viewport.firstElementChild)
    resizeObserver.observe(viewport.firstElementChild)
}

onMounted(observeViewport)
onBeforeUnmount(() => resizeObserver?.disconnect())

watch(
  () => [props.rows.length, props.columns.length, hasActions.value],
  observeViewport
)
</script>

<template>
  <div
    ref="rootElement"
    class="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
    <span v-if="props.loading" class="sr-only" role="status" aria-live="polite">
      Carregando dados da tabela
    </span>
    <ScrollArea
      orientation="both"
      :scrollbar-visibility="props.scrollbarVisibility"
      class="min-h-0 flex-1"
      @scroll="handleScroll">
      <table
        class="w-full min-w-max border-separate border-spacing-0 text-sm text-slate-700"
        :aria-busy="props.loading">
        <caption class="sr-only">{{ props.label }}</caption>
        <thead>
          <tr>
            <th
              v-if="props.selectable"
              scope="col"
              class="sticky top-0 z-20 w-14 min-w-14 border-b border-slate-200 bg-slate-50 px-4 py-3 text-left">
              <Checkbox
                :model-value="bulkSelectionState"
                :disabled="props.loading || selectableKeys.length === 0"
                size="small"
                aria-label="Selecionar todos os registros"
                @update:model-value="toggleAll" />
            </th>

            <th
              v-for="column in props.columns"
              :key="column.key"
              scope="col"
              class="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600"
              :aria-sort="getSortAriaValue(column)"
              :class="[
                columnSizeClasses[column.size ?? 'medium'],
                alignClasses[column.align ?? 'left']
              ]">
              <button
                v-if="column.sortable"
                type="button"
                class="group/sort flex w-full appearance-none items-center gap-1.5 rounded-sm border-0 bg-transparent p-0 font-[inherit] leading-[inherit] text-[inherit] uppercase tracking-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:cursor-wait"
                :class="justifyClasses[column.align ?? 'left']"
                :aria-label="getSortActionLabel(column)"
                :disabled="props.loading"
                @click="toggleSort(column)">
                <span>{{ column.label }}</span>
                <ArrowDownWideNarrowIcon
                  v-if="isSortedBy(column.key, 'desc')"
                  class="size-3.5 shrink-0 text-slate-800"
                  aria-hidden="true" />
                <ArrowUpNarrowWideIcon
                  v-else
                  class="size-3.5 shrink-0 transition-opacity"
                  :class="isSortedBy(column.key, 'asc')
                    ? 'text-slate-800 opacity-100'
                    : 'text-slate-400 opacity-0 group-hover/sort:opacity-100 group-focus-visible/sort:opacity-100'"
                  aria-hidden="true" />
              </button>
              <template v-else>{{ column.label }}</template>
            </th>

            <th
              v-if="hasActions"
              scope="col"
              class="sticky top-0 right-0 z-30 w-px whitespace-nowrap border-b border-l border-slate-200 bg-slate-50 py-3 pl-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600"
              :class="[
                hasVerticalOverflow ? 'pr-8' : 'pr-3',
                hasContentAfterActions ? 'before:pointer-events-none before:absolute before:inset-y-0 before:-left-3 before:w-3 before:bg-gradient-to-r before:from-transparent before:to-slate-300/35 before:content-[\'\']' : ''
              ]">
              {{ props.actionsLabel }}
            </th>
          </tr>
        </thead>

        <tbody v-if="props.loading" aria-hidden="true">
          <tr
            v-for="rowIndex in skeletonRows"
            :key="`skeleton-${rowIndex}`">
            <td
              v-if="props.selectable"
              class="border-b border-slate-100 bg-white px-4 py-3 align-middle">
              <div class="size-4 animate-pulse rounded bg-slate-200" />
            </td>

            <td
              v-for="(column, columnIndex) in props.columns"
              :key="column.key"
              class="border-b border-slate-100 bg-white px-4 py-3 align-middle"
              :class="[
                columnSizeClasses[column.size ?? 'medium'],
                alignClasses[column.align ?? 'left']
              ]">
              <div
                class="h-4 animate-pulse rounded bg-slate-200"
                :class="[
                  columnIndex % 3 === 0 ? 'w-2/3' : columnIndex % 3 === 1 ? 'w-5/6' : 'w-1/2',
                  column.align === 'right' ? 'ml-auto' : column.align === 'center' ? 'mx-auto' : ''
                ]" />
            </td>

            <td
              v-if="hasActions"
              class="sticky right-0 z-20 w-px border-b border-l border-slate-100 bg-white py-2 pl-3 text-right align-middle"
              :class="hasVerticalOverflow ? 'pr-8' : 'pr-3'">
              <div class="ml-auto size-8 animate-pulse rounded-lg bg-slate-200" />
            </td>
          </tr>
        </tbody>

        <tbody v-else-if="displayedRows.length">
          <template
            v-for="(row, rowIndex) in displayedRows"
            :key="getRowKey(row)">
          <tr class="group">
            <td
              v-if="props.selectable"
              class="border-b border-slate-100 bg-white px-4 py-3 align-middle group-hover:bg-slate-50">
              <Checkbox
                :model-value="selectedKeys.has(getRowKey(row))"
                :disabled="isRowDisabled(row)"
                size="small"
                :aria-label="`Selecionar registro ${rowIndex + 1}`"
                @update:model-value="toggleRow(row, $event)" />
            </td>

            <td
              v-for="column in props.columns"
              :key="column.key"
              class="border-b border-slate-100 bg-white px-4 py-3 align-middle group-hover:bg-slate-50"
              :class="[
                columnSizeClasses[column.size ?? 'medium'],
                alignClasses[column.align ?? 'left']
              ]">
              <slot
                v-if="hasColumnSlot(column.key)"
                :name="getColumnSlotName(column.key)"
                :row="row"
                :value="row[column.key]"
                :column="column"
                :row-index="rowIndex" />
              <slot
                v-else-if="$slots.cell"
                name="cell"
                :row="row"
                :value="row[column.key]"
                :column="column"
                :row-index="rowIndex" />
              <template v-else>{{ row[column.key] ?? '—' }}</template>
            </td>

            <td
              v-if="hasActions"
              class="sticky right-0 z-20 w-px whitespace-nowrap border-b border-l border-slate-100 bg-white py-2 pl-3 text-right align-middle transition-colors group-hover:bg-slate-50"
              :class="[
                hasVerticalOverflow ? 'pr-8' : 'pr-3',
                hasContentAfterActions ? 'before:pointer-events-none before:absolute before:inset-y-0 before:-left-3 before:w-3 before:bg-gradient-to-r before:from-transparent before:to-slate-300/35 before:content-[\'\']' : ''
              ]">
              <slot name="actions" :row="row" :row-index="rowIndex" />
            </td>
          </tr>

          <tr
            v-if="hasRowDetail && expandedKeys.has(getRowKey(row))"
            :key="`${getRowKey(row)}-detail`">
            <td
              :colspan="props.columns.length + (props.selectable ? 1 : 0)"
              class="border-b border-slate-100 bg-slate-50 px-4 py-4 text-sm text-slate-600">
              <div class="flex items-start gap-3">
                <CornerDownRightIcon
                  class="mt-0.5 size-4 shrink-0 text-slate-400"
                  aria-hidden="true" />
                <div class="min-w-0 flex-1">
                  <slot name="row-detail" :row="row" :row-index="rowIndex" />
                </div>
              </div>
            </td>
            <td
              v-if="hasActions"
              class="sticky right-0 z-20 w-px whitespace-nowrap border-b border-l border-slate-100 bg-slate-50 py-2 pl-3"
              :class="[
                hasVerticalOverflow ? 'pr-8' : 'pr-3',
                hasContentAfterActions ? 'before:pointer-events-none before:absolute before:inset-y-0 before:-left-3 before:w-3 before:bg-gradient-to-r before:from-transparent before:to-slate-300/35 before:content-[\'\']' : ''
              ]" />
          </tr>
          </template>
        </tbody>

        <tbody v-else>
          <tr>
            <td
              :colspan="props.columns.length + (props.selectable ? 1 : 0) + (hasActions ? 1 : 0)"
              class="h-32 px-6 text-center text-sm text-slate-500">
              <slot name="empty">{{ props.emptyText }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </ScrollArea>
  </div>
</template>
