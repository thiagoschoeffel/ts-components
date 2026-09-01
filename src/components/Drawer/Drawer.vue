<script lang="ts">
export type DrawerSide = 'top' | 'right' | 'bottom' | 'left'
export type DrawerSize = 'small' | 'medium' | 'large'
export type DrawerModal = boolean | 'trap-focus'
export type DrawerSnapPoint = number | string
export type DrawerOpenChangeReason
  = | 'swipe'
    | 'escape-key'
    | 'outside-press'
    | 'click'
    | 'cancel'
    | 'trigger-press'
    | 'close-press'

export interface DrawerOpenChangeDetails {
  reason?: DrawerOpenChangeReason
}

export interface DrawerProps {
  /** Controlled open state. Supports v-model:open. */
  open?: boolean
  /** Initial open state when the component is uncontrolled. */
  defaultOpen?: boolean
  /** Controls focus trapping and interaction outside the drawer. */
  modal?: DrawerModal
  /** Prevents the trigger from opening the drawer. */
  disabled?: boolean
  /** Edge of the viewport where the drawer is anchored. */
  side?: DrawerSide
  /** Controls the maximum width or height of the panel. */
  size?: DrawerSize
  /** Optional heading displayed in the header. */
  title?: string
  /** Accessible heading used when no visible title is provided. */
  accessibleTitle?: string
  /** Optional supporting text displayed below the title. */
  description?: string
  /** Displays a compact close action in the header. */
  showClose?: boolean
  /** Accessible name for the close action. */
  closeLabel?: string
  /** Preset positions used while dragging the drawer. */
  snapPoints?: DrawerSnapPoint[]
  /** Controlled active snap point. Supports v-model:snapPoint. */
  snapPoint?: DrawerSnapPoint | null
  /** Initial snap point when snapPoint is uncontrolled. */
  defaultSnapPoint?: DrawerSnapPoint | null
  /** Moves through snap points sequentially instead of using the nearest one. */
  snapToSequentialPoints?: boolean
}
</script>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger
} from 'reka-ui'
import { XIcon } from '../../icons'

const props = withDefaults(defineProps<DrawerProps>(), {
  open: undefined,
  defaultOpen: false,
  modal: true,
  disabled: false,
  side: 'right',
  size: 'medium',
  title: undefined,
  accessibleTitle: 'Painel',
  description: undefined,
  showClose: true,
  closeLabel: 'Fechar painel',
  snapPoints: undefined,
  snapPoint: undefined,
  defaultSnapPoint: undefined,
  snapToSequentialPoints: false
})

const emit = defineEmits<{
  /** Emitted when the drawer opens or closes. */
  'update:open': [open: boolean, details?: DrawerOpenChangeDetails]
  /** Emitted after the opening or closing transition finishes. */
  'update:openComplete': [open: boolean]
  /** Emitted when the active snap point changes. */
  'update:snapPoint': [snapPoint: DrawerSnapPoint | null]
}>()

defineSlots<{
  /** Interactive element used to open the drawer. */
  trigger: (props: { open: boolean; disabled: boolean }) => unknown
  /** Main scrollable content. Receives a function that closes the drawer. */
  default: (props: { open: boolean; close: () => void }) => unknown
  /** Optional custom header content. */
  header?: (props: { close: () => void }) => unknown
  /** Optional footer separated from the main content. */
  footer?: (props: { close: () => void }) => unknown
}>()

const swipeDirectionBySide: Record<DrawerSide, 'up' | 'right' | 'down' | 'left'> = {
  top: 'up',
  right: 'right',
  bottom: 'down',
  left: 'left'
}

const panelClassesBySide: Record<DrawerSide, string> = {
  top: 'ts-drawer-top inset-x-2 top-0 w-auto rounded-b-xl border',
  right: 'ts-drawer-right inset-y-2 right-0 h-[calc(100dvh-1rem)] rounded-l-xl border',
  bottom: 'ts-drawer-bottom inset-x-2 bottom-0 w-auto rounded-t-xl border',
  left: 'ts-drawer-left inset-y-2 left-0 h-[calc(100dvh-1rem)] rounded-r-xl border'
}

const dimensionBySize: Record<DrawerSize, string> = {
  small: '20rem',
  medium: '28rem',
  large: '36rem'
}

const panelStyle = computed(() => ({
  '--ts-drawer-size': dimensionBySize[props.size]
}))

const opening = ref(props.open ?? props.defaultOpen)

watch(() => props.open, (open, previousOpen) => {
  if (open && !previousOpen)
    opening.value = true
  else if (!open)
    opening.value = false
})

function forwardOpen(open: boolean, details?: DrawerOpenChangeDetails) {
  opening.value = open
  emit('update:open', open, details)
}

function finishOpening(event: AnimationEvent) {
  if (event.target === event.currentTarget)
    opening.value = false
}
</script>

<template>
  <DrawerRoot
    :open="props.open"
    :default-open="props.defaultOpen"
    :modal="props.modal"
    :swipe-direction="swipeDirectionBySide[props.side]"
    :snap-points="props.snapPoints"
    :snap-point="props.snapPoint"
    :default-snap-point="props.defaultSnapPoint"
    :snap-to-sequential-points="props.snapToSequentialPoints"
    @update:open="forwardOpen"
    @update:open-complete="emit('update:openComplete', $event)"
    @update:snap-point="emit('update:snapPoint', $event)">
    <template #default="{ open, close }">
      <DrawerTrigger as-child :disabled="props.disabled">
        <slot name="trigger" :open="open" :disabled="props.disabled" />
      </DrawerTrigger>

      <DrawerPortal>
        <DrawerOverlay class="ts-drawer-overlay fixed inset-0 z-[60] bg-slate-950/35 backdrop-blur-[1px]" />

        <DrawerContent
          :style="panelStyle"
          class="ts-drawer-content fixed z-[60] flex max-w-full flex-col overflow-hidden border-slate-200 bg-white text-sm text-slate-600 shadow-xl outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-500/40"
          :class="[panelClassesBySide[props.side], { 'ts-drawer-opening': opening }]"
          @animationend="finishOpening">
          <DrawerTitle v-if="!props.title || $slots.header" class="sr-only">
            {{ props.title || props.accessibleTitle }}
          </DrawerTitle>

          <header
            v-if="$slots.header || props.title || props.description || props.showClose"
            class="flex shrink-0 items-start gap-3 border-b border-slate-200 px-5 py-4">
            <div class="min-w-0 flex-1">
              <slot name="header" :close="close">
                <DrawerTitle v-if="props.title" class="font-semibold leading-5 text-slate-900">
                  {{ props.title }}
                </DrawerTitle>
                <DrawerDescription
                  v-if="props.description"
                  class="mt-0.5 text-xs leading-5 text-slate-500">
                  {{ props.description }}
                </DrawerDescription>
              </slot>
            </div>

            <DrawerClose v-if="props.showClose" as-child>
              <button
                type="button"
                class="inline-flex size-7 shrink-0 cursor-pointer appearance-none items-center justify-center rounded-md border-0 bg-transparent p-0 text-slate-400 shadow-none outline-none transition-colors hover:text-slate-800 focus-visible:text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-500/40 disabled:cursor-not-allowed disabled:text-slate-200"
                :aria-label="props.closeLabel">
                <XIcon class="size-4 text-current" aria-hidden="true" />
              </button>
            </DrawerClose>
          </header>

          <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            <slot :open="open" :close="close" />
          </div>

          <footer v-if="$slots.footer" class="shrink-0 border-t border-slate-200 bg-slate-50 px-5 py-4">
            <slot name="footer" :close="close" />
          </footer>
        </DrawerContent>
      </DrawerPortal>
    </template>
  </DrawerRoot>
</template>

<style scoped>
.ts-drawer-overlay {
  opacity: calc(1 - var(--drawer-swipe-progress, 0));
  transition: opacity 200ms ease;
}

.ts-drawer-overlay[data-state='open'] {
  animation: ts-drawer-overlay-in 200ms ease both;
}

.ts-drawer-overlay[data-state='closed'] {
  animation: ts-drawer-overlay-out 200ms ease both;
  pointer-events: none;
  opacity: 0;
}

.ts-drawer-content {
  transition: transform calc(240ms * var(--drawer-swipe-strength, 1)) cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.ts-drawer-content[data-state='closed'] {
  pointer-events: none;
}

.ts-drawer-content[data-swiping] {
  transition-duration: 0ms;
}

.ts-drawer-right,
.ts-drawer-left {
  width: min(var(--ts-drawer-size), calc(100vw - 1rem));
  transform: translate3d(calc(var(--drawer-snap-point-offset, 0px) + var(--drawer-swipe-movement-x, 0px)), 0, 0);
}

.ts-drawer-top,
.ts-drawer-bottom {
  max-height: min(var(--ts-drawer-size), calc(100dvh - 1rem));
  transform: translate3d(0, calc(var(--drawer-snap-point-offset, 0px) + var(--drawer-swipe-movement-y, 0px)), 0);
}

.ts-drawer-right[data-state='closed'] {
  animation: ts-drawer-out-right 240ms cubic-bezier(0.22, 1, 0.36, 1) both;
  transform: translate3d(100%, 0, 0);
}

.ts-drawer-left[data-state='closed'] {
  animation: ts-drawer-out-left 240ms cubic-bezier(0.22, 1, 0.36, 1) both;
  transform: translate3d(-100%, 0, 0);
}

.ts-drawer-top[data-state='closed'] {
  animation: ts-drawer-out-top 240ms cubic-bezier(0.22, 1, 0.36, 1) both;
  transform: translate3d(0, -100%, 0);
}

.ts-drawer-bottom[data-state='closed'] {
  animation: ts-drawer-out-bottom 240ms cubic-bezier(0.22, 1, 0.36, 1) both;
  transform: translate3d(0, 100%, 0);
}

.ts-drawer-opening.ts-drawer-right {
  animation: ts-drawer-in-right 240ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.ts-drawer-opening.ts-drawer-left {
  animation: ts-drawer-in-left 240ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.ts-drawer-opening.ts-drawer-top {
  animation: ts-drawer-in-top 240ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.ts-drawer-opening.ts-drawer-bottom {
  animation: ts-drawer-in-bottom 240ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes ts-drawer-overlay-in {
  from { opacity: 0; }
}

@keyframes ts-drawer-overlay-out {
  from { opacity: 1; }
}

@keyframes ts-drawer-in-right {
  from { transform: translate3d(100%, 0, 0); }
}

@keyframes ts-drawer-in-left {
  from { transform: translate3d(-100%, 0, 0); }
}

@keyframes ts-drawer-in-top {
  from { transform: translate3d(0, -100%, 0); }
}

@keyframes ts-drawer-in-bottom {
  from { transform: translate3d(0, 100%, 0); }
}

@keyframes ts-drawer-out-right {
  from { transform: translate3d(calc(var(--drawer-snap-point-offset, 0px) + var(--drawer-swipe-movement-x, 0px)), 0, 0); }
}

@keyframes ts-drawer-out-left {
  from { transform: translate3d(calc(var(--drawer-snap-point-offset, 0px) + var(--drawer-swipe-movement-x, 0px)), 0, 0); }
}

@keyframes ts-drawer-out-top {
  from { transform: translate3d(0, calc(var(--drawer-snap-point-offset, 0px) + var(--drawer-swipe-movement-y, 0px)), 0); }
}

@keyframes ts-drawer-out-bottom {
  from { transform: translate3d(0, calc(var(--drawer-snap-point-offset, 0px) + var(--drawer-swipe-movement-y, 0px)), 0); }
}

@media (prefers-reduced-motion: reduce) {
  .ts-drawer-overlay,
  .ts-drawer-content,
  .ts-drawer-overlay[data-state='closed'],
  .ts-drawer-content[data-state='closed'] {
    transition-duration: 0ms;
  }

  .ts-drawer-overlay[data-state='open'],
  .ts-drawer-overlay[data-state='closed'],
  .ts-drawer-opening,
  .ts-drawer-content[data-state='closed'] {
    animation-duration: 0ms;
  }
}

</style>
