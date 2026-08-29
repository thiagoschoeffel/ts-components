<script setup lang="ts">
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from 'reka-ui'
import { ChevronRightIcon } from '../../icons'
import type {
  DropdownMenuActionItem,
  DropdownMenuEntry
} from './DropdownMenu.vue'

defineProps<{
  items: DropdownMenuEntry[]
}>()

const emit = defineEmits<{
  select: [value: string, item: DropdownMenuActionItem, event: Event]
}>()

defineSlots<{
  item?: (props: { item: DropdownMenuActionItem }) => unknown
}>()

function handleSelect(event: Event, item: DropdownMenuActionItem) {
  emit('select', item.value, item, event)
}

function forwardSelect(value: string, item: DropdownMenuActionItem, event: Event) {
  emit('select', value, item, event)
}
</script>

<template>
  <template v-for="(entry, index) in items" :key="index">
    <DropdownMenuSeparator
      v-if="entry.type === 'separator'"
      class="-mx-1.5 my-1.5 h-px bg-slate-200" />

    <DropdownMenuLabel
      v-else-if="entry.type === 'label'"
      class="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600">
      {{ entry.label }}
    </DropdownMenuLabel>

    <DropdownMenuSub v-else-if="entry.type === 'submenu'">
      <DropdownMenuSubTrigger
        :disabled="entry.disabled"
        class="group flex min-h-7 cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1 text-slate-400 outline-none data-[disabled]:cursor-not-allowed data-[disabled]:text-slate-200 data-[state=open]:bg-slate-50 data-[state=open]:text-slate-800 data-[highlighted]:bg-slate-50 data-[highlighted]:text-slate-800">
        <component
          :is="entry.icon"
          v-if="entry.icon"
          class="size-4 shrink-0 text-current"
          aria-hidden="true" />
        <span class="min-w-0 flex-1 truncate">{{ entry.label }}</span>
        <ChevronRightIcon class="ml-4 size-3.5 shrink-0 text-current" aria-hidden="true" />
      </DropdownMenuSubTrigger>

      <DropdownMenuSubContent
        :side-offset="4"
        :align-offset="-4"
        class="z-50 max-h-[var(--reka-dropdown-menu-content-available-height)] min-w-48 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 text-sm shadow-sm outline-none">
        <DropdownMenuItems
          :items="entry.items"
          @select="forwardSelect">
          <template v-if="$slots.item" #item="{ item }">
            <slot name="item" :item="item" />
          </template>
        </DropdownMenuItems>
      </DropdownMenuSubContent>
    </DropdownMenuSub>

    <DropdownMenuItem
      v-else
      :disabled="entry.disabled"
      class="group flex min-h-7 cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1 outline-none data-[disabled]:cursor-not-allowed data-[disabled]:text-slate-200"
      :class="entry.destructive
        ? 'text-red-500 data-[highlighted]:bg-red-50'
        : 'text-slate-400 data-[highlighted]:bg-slate-50 data-[highlighted]:text-slate-800'"
      @select="handleSelect($event, entry)">
      <slot name="item" :item="entry">
        <component
          :is="entry.icon"
          v-if="entry.icon"
          class="size-4 shrink-0 text-current"
          aria-hidden="true" />
        <span class="min-w-0 flex-1 truncate">{{ entry.label }}</span>
        <kbd
          v-if="entry.shortcut"
          class="ml-4 shrink-0 font-sans text-xs text-current">
          {{ entry.shortcut }}
        </kbd>
      </slot>
    </DropdownMenuItem>
  </template>
</template>
