<script lang="ts">
export type PaginationSize = 'small' | 'medium' | 'large'
</script>

<script setup lang="ts">
import {
  PaginationEllipsis,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot
} from 'reka-ui'
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons'

const props = withDefaults(
  defineProps<{
    /** Current page, starting at 1. */
    modelValue?: number
    /** Total number of records. */
    total: number
    /** Number of records represented by each page. */
    itemsPerPage?: number
    /** Number of adjacent pages shown around the current page. */
    siblingCount?: number
    /** Always keeps the first and last pages visible. */
    showEdges?: boolean
    /** Controls the dimensions of the navigation controls. */
    size?: PaginationSize
    /** Prevents interaction with every navigation control. */
    disabled?: boolean
    /** Accessible name for the navigation region. */
    label?: string
  }>(),
  {
    modelValue: 1,
    itemsPerPage: 10,
    siblingCount: 1,
    showEdges: true,
    size: 'medium',
    disabled: false,
    label: 'Paginação'
  }
)

const emit = defineEmits<{
  /** Emitted when the current page changes. */
  'update:modelValue': [value: number]
}>()

const itemSizeClasses: Record<PaginationSize, string> = {
  small: 'size-7 text-xs',
  medium: 'size-9 text-sm',
  large: 'size-11 text-base'
}

const iconSizeClasses: Record<PaginationSize, string> = {
  small: 'size-3.5',
  medium: 'size-4',
  large: 'size-5'
}

const controlClasses = 'inline-flex shrink-0 appearance-none items-center justify-center rounded-lg border border-slate-300 bg-gradient-to-b from-white to-slate-100 font-medium text-slate-700 shadow-xs outline-none transition-[filter,transform,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 enabled:cursor-pointer enabled:hover:brightness-[1.03] enabled:hover:shadow-md enabled:active:translate-y-px enabled:active:brightness-95 enabled:active:shadow-none disabled:cursor-not-allowed disabled:opacity-45'
</script>

<template>
  <PaginationRoot
    :page="props.modelValue"
    :total="props.total"
    :items-per-page="props.itemsPerPage"
    :sibling-count="props.siblingCount"
    :show-edges="props.showEdges"
    :disabled="props.disabled"
    :aria-label="props.label"
    @update:page="emit('update:modelValue', $event)">
    <PaginationList v-slot="{ items }" class="flex items-center gap-1.5">
      <PaginationPrev
        :class="[controlClasses, itemSizeClasses[props.size]]">
        <ChevronLeftIcon :class="iconSizeClasses[props.size]" aria-hidden="true" />
      </PaginationPrev>

      <template v-for="(item, index) in items" :key="item.type === 'page' ? item.value : `ellipsis-${index}`">
        <PaginationListItem
          v-if="item.type === 'page'"
          :value="item.value"
          :class="[
            controlClasses,
            itemSizeClasses[props.size],
            'data-[selected=true]:border-blue-700 data-[selected=true]:bg-gradient-to-b data-[selected=true]:from-blue-500 data-[selected=true]:to-blue-600 data-[selected=true]:text-white'
          ]">
          {{ item.value }}
        </PaginationListItem>
        <PaginationEllipsis
          v-else
          class="inline-flex shrink-0 items-center justify-center text-slate-500"
          :class="itemSizeClasses[props.size]"
          aria-hidden="true">
          <span class="-translate-y-0.5">&hellip;</span>
        </PaginationEllipsis>
      </template>

      <PaginationNext
        :class="[controlClasses, itemSizeClasses[props.size]]">
        <ChevronRightIcon :class="iconSizeClasses[props.size]" aria-hidden="true" />
      </PaginationNext>
    </PaginationList>
  </PaginationRoot>
</template>
