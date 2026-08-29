<script lang="ts">
import type { Component } from 'vue'

export type DropdownMenuAlign = 'start' | 'center' | 'end'
export type DropdownMenuSide = 'top' | 'right' | 'bottom' | 'left'

export interface DropdownMenuActionItem {
  type?: 'item'
  value: string
  label: string
  icon?: Component
  shortcut?: string
  disabled?: boolean
  destructive?: boolean
}

export interface DropdownMenuLabelItem {
  type: 'label'
  label: string
}

export interface DropdownMenuSeparatorItem {
  type: 'separator'
}

export interface DropdownMenuSubmenuItem {
  type: 'submenu'
  label: string
  icon?: Component
  disabled?: boolean
  items: DropdownMenuEntry[]
}

export type DropdownMenuEntry =
  | DropdownMenuActionItem
  | DropdownMenuLabelItem
  | DropdownMenuSeparatorItem
  | DropdownMenuSubmenuItem
</script>

<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger
} from 'reka-ui'
import { EllipsisIcon } from '../../icons'
import DropdownMenuItems from './DropdownMenuItems.vue'

const props = withDefaults(
  defineProps<{
    /** Entries rendered in the menu. Labels and separators are optional. */
    items: DropdownMenuEntry[]
    /** Controlled open state. Supports v-model:open. */
    open?: boolean
    /** Initial open state when the component is uncontrolled. */
    defaultOpen?: boolean
    /** Prevents the trigger from opening the menu. */
    disabled?: boolean
    /** Accessible label used by the default trigger. */
    triggerLabel?: string
    /** Preferred side of the trigger where the menu opens. */
    side?: DropdownMenuSide
    /** Alignment of the menu relative to the trigger. */
    align?: DropdownMenuAlign
    /** Distance in pixels between the trigger and menu. */
    sideOffset?: number
    /** Allows keyboard navigation to loop between the first and last actions. */
    loop?: boolean
    /** Blocks interaction with content outside the menu while it is open. */
    modal?: boolean
  }>(),
  {
    open: undefined,
    defaultOpen: false,
    disabled: false,
    triggerLabel: 'Abrir menu',
    side: 'bottom',
    align: 'end',
    sideOffset: 6,
    loop: true,
    modal: true
  }
)

const emit = defineEmits<{
  /** Emitted when the menu opens or closes. */
  'update:open': [open: boolean]
  /** Emitted when an enabled action is selected. */
  select: [value: string, item: DropdownMenuActionItem, event: Event]
}>()

defineSlots<{
  /** Interactive element used to open the menu. */
  trigger?: (props: { open: boolean }) => unknown
  /** Custom content for every action entry. */
  item?: (props: { item: DropdownMenuActionItem }) => unknown
}>()

function forwardSelect(value: string, item: DropdownMenuActionItem, event: Event) {
  emit('select', value, item, event)
}
</script>

<template>
  <DropdownMenuRoot
    :open="props.open"
    :default-open="props.defaultOpen"
    :modal="props.modal"
    @update:open="emit('update:open', $event)">
    <template #default="{ open }">
      <DropdownMenuTrigger as-child :disabled="props.disabled">
        <slot name="trigger" :open="open">
          <button
            type="button"
            class="inline-flex size-9 cursor-pointer appearance-none items-center justify-center rounded-lg border border-slate-300 bg-gradient-to-b from-white to-slate-100 text-slate-700 shadow-sm outline-none transition-[filter,transform,box-shadow] duration-150 hover:brightness-105 hover:shadow-md focus-visible:ring-2 focus-visible:ring-slate-500/40 focus-visible:ring-offset-2 active:translate-y-px active:brightness-95 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
            :aria-label="props.triggerLabel">
            <EllipsisIcon class="size-4" aria-hidden="true" />
          </button>
        </slot>
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent
          :side="props.side"
          :align="props.align"
          :side-offset="props.sideOffset"
          :loop="props.loop"
          class="z-50 max-h-[var(--reka-dropdown-menu-content-available-height)] min-w-48 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 text-sm shadow-sm outline-none">
          <DropdownMenuItems
            :items="props.items"
            @select="forwardSelect">
            <template v-if="$slots.item" #item="{ item }">
              <slot name="item" :item="item" />
            </template>
          </DropdownMenuItems>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </template>
  </DropdownMenuRoot>
</template>
