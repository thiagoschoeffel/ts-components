<script lang="ts">
export type PopoverAlign = 'start' | 'center' | 'end'
export type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
export type PopoverSize = 'small' | 'medium' | 'large'

export interface PopoverProps {
  /** Controlled open state. Supports v-model:open. */
  open?: boolean
  /** Initial open state when the component is uncontrolled. */
  defaultOpen?: boolean
  /** Blocks interaction with content outside the popover while it is open. */
  modal?: boolean
  /** Prevents the trigger from opening the popover. */
  disabled?: boolean
  /** Optional heading displayed above the main content. */
  title?: string
  /** Optional supporting text displayed below the title. */
  description?: string
  /** Displays a compact close action in the header. */
  showClose?: boolean
  /** Accessible name for the close action. */
  closeLabel?: string
  /** Controls the width of the floating panel. */
  size?: PopoverSize
  /** Preferred side of the trigger where the panel opens. */
  side?: PopoverSide
  /** Alignment of the panel relative to the trigger. */
  align?: PopoverAlign
  /** Distance in pixels between the trigger and panel. */
  sideOffset?: number
  /** Offset in pixels along the alignment axis. */
  alignOffset?: number
  /** Repositions the panel to keep it inside the viewport. */
  avoidCollisions?: boolean
  /** Minimum distance in pixels from viewport collision boundaries. */
  collisionPadding?: number
}
</script>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger
} from 'reka-ui'
import { XIcon } from '../../icons'
import { usePortalLayer } from '../portalLayer'

const props = withDefaults(defineProps<PopoverProps>(), {
  open: undefined,
  defaultOpen: false,
  modal: false,
  disabled: false,
  title: undefined,
  description: undefined,
  showClose: false,
  closeLabel: 'Fechar popover',
  size: 'medium',
  side: 'bottom',
  align: 'center',
  sideOffset: 8,
  alignOffset: 0,
  avoidCollisions: true,
  collisionPadding: 8
})

const emit = defineEmits<{
  /** Emitted when the popover opens or closes. */
  'update:open': [open: boolean]
}>()

defineSlots<{
  /** Interactive element used to open the popover. */
  trigger: (props: { open: boolean; disabled: boolean }) => unknown
  /** Main content. Receives a function that closes the popover. */
  default: (props: { open: boolean; close: () => void }) => unknown
  /** Optional custom header. Receives a function that closes the popover. */
  header?: (props: { close: () => void }) => unknown
  /** Optional footer separated from the main content. */
  footer?: (props: { close: () => void }) => unknown
}>()

const widthBySize: Record<PopoverSize, string> = {
  small: '14rem',
  medium: '18rem',
  large: '24rem'
}

const layerOpen = ref(props.open ?? props.defaultOpen)
const { contentLayerStyle } = usePortalLayer('floating', layerOpen)

watch(() => props.open, (open) => {
  if (open !== undefined)
    layerOpen.value = open
})

const contentStyle = computed(() => ({
  ...contentLayerStyle.value,
  '--ts-popover-width': widthBySize[props.size]
}))

function updateOpen(open: boolean) {
  if (props.open === undefined)
    layerOpen.value = open
  emit('update:open', open)
}
</script>

<template>
  <PopoverRoot
    :open="props.open"
    :default-open="props.defaultOpen"
    :modal="props.modal"
    @update:open="updateOpen">
    <template #default="{ open, close }">
      <PopoverTrigger as-child :disabled="props.disabled">
        <slot name="trigger" :open="open" :disabled="props.disabled" />
      </PopoverTrigger>

      <PopoverPortal>
        <PopoverContent
          :side="props.side"
          :align="props.align"
          :side-offset="props.sideOffset"
          :align-offset="props.alignOffset"
          :avoid-collisions="props.avoidCollisions"
          :collision-padding="props.collisionPadding"
          :style="contentStyle"
          class="max-h-[var(--reka-popover-content-available-height)] w-[min(var(--ts-popover-width),calc(100vw-2rem))] overflow-y-auto rounded-xl border border-slate-200 bg-white text-sm text-slate-600 shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-slate-500/40">
          <header
            v-if="$slots.header || props.title || props.description || props.showClose"
            class="flex items-start gap-3 border-b border-slate-200 px-4 py-3">
            <div class="min-w-0 flex-1">
              <slot name="header" :close="close">
                <h2 v-if="props.title" class="font-semibold leading-5 text-slate-900">
                  {{ props.title }}
                </h2>
                <p v-if="props.description" class="mt-0.5 text-xs leading-5 text-slate-500">
                  {{ props.description }}
                </p>
              </slot>
            </div>

            <PopoverClose v-if="props.showClose" as-child>
              <button
                type="button"
                class="-mr-1 inline-flex size-7 shrink-0 cursor-pointer appearance-none items-center justify-center border-0 bg-transparent p-0 text-slate-400 shadow-none outline-none transition-colors hover:text-slate-800 focus-visible:text-slate-800 disabled:cursor-not-allowed disabled:text-slate-200"
                :aria-label="props.closeLabel">
                <XIcon class="size-4 text-current" aria-hidden="true" />
              </button>
            </PopoverClose>
          </header>

          <div class="px-4 py-3.5">
            <slot :open="open" :close="close" />
          </div>

          <footer v-if="$slots.footer" class="border-t border-slate-200 bg-slate-50 px-4 py-3">
            <slot name="footer" :close="close" />
          </footer>

          <PopoverArrow as-child :width="14" :height="7">
            <svg
              width="14"
              height="7"
              viewBox="0 0 14 7"
              preserveAspectRatio="none"
              class="overflow-visible">
              <path d="M0 0 H14" class="stroke-white" stroke-width="3" />
              <path
                d="M0.5 0 L7 6.5 L13.5 0"
                class="fill-white stroke-slate-200 drop-shadow-[0_1px_1px_rgb(15_23_42_/_0.10)]"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
                vector-effect="non-scaling-stroke" />
            </svg>
          </PopoverArrow>
        </PopoverContent>
      </PopoverPortal>
    </template>
  </PopoverRoot>
</template>
