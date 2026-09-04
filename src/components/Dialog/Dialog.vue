<script lang="ts">
export type DialogSize = 'small' | 'medium' | 'large'

export interface DialogProps {
  /** Controlled open state. Supports v-model:open. */
  open?: boolean
  /** Initial state when open is uncontrolled. */
  defaultOpen?: boolean
  /** Visible and accessible dialog heading. */
  title: string
  /** Supporting text displayed below the heading. */
  description?: string
  /** Controls the maximum dialog width. */
  size?: DialogSize
  /** Prevents interaction with content outside the dialog. */
  modal?: boolean
  /** Removes the dialog content from the DOM when closed. */
  unmountOnHide?: boolean
  /** Displays the close button in the header. */
  showClose?: boolean
  /** Accessible label for the close button. */
  closeLabel?: string
}
</script>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger
} from 'reka-ui'
import { XIcon } from '../../icons'
import Card from '../Card/Card.vue'
import { usePortalLayer } from '../portalLayer'
import ScrollArea from '../ScrollArea/ScrollArea.vue'

const props = withDefaults(defineProps<DialogProps>(), {
  open: undefined,
  defaultOpen: false,
  description: undefined,
  size: 'medium',
  modal: true,
  unmountOnHide: true,
  showClose: true,
  closeLabel: 'Fechar diálogo'
})

const emit = defineEmits<{
  /** Emitted when the dialog opens or closes. */
  'update:open': [open: boolean]
}>()

defineSlots<{
  /** Interactive element used to open the dialog. */
  trigger?: (props: { open: boolean }) => unknown
  /** Dialog header. The title remains available to assistive technologies when customized. */
  header?: (props: { title: string; description?: string; close: () => void }) => unknown
  /** Main dialog content. */
  default?: (props: { close: () => void }) => unknown
  /** Dialog footer. */
  footer?: (props: { close: () => void }) => unknown
}>()

const uncontrolledOpen = ref(props.defaultOpen)

watch(() => props.open, open => {
  if (open !== undefined)
    uncontrolledOpen.value = open
})

const currentOpen = computed(() => props.open ?? uncontrolledOpen.value)
const { contentLayerStyle, overlayLayerStyle } = usePortalLayer('modal', currentOpen)

function updateOpen(open: boolean) {
  if (props.open === undefined)
    uncontrolledOpen.value = open
  emit('update:open', open)
}

const sizeClasses: Record<DialogSize, string> = {
  small: 'max-w-sm',
  medium: 'max-w-lg',
  large: 'max-w-2xl'
}
</script>

<template>
  <DialogRoot
    :open="currentOpen"
    :modal="props.modal"
    :unmount-on-hide="props.unmountOnHide"
    @update:open="updateOpen">
    <template #default="{ open }">
      <DialogTrigger v-if="$slots.trigger" as-child>
        <slot name="trigger" :open="open" />
      </DialogTrigger>

      <DialogPortal>
        <DialogOverlay :style="overlayLayerStyle" class="fixed inset-0 bg-slate-950/35 backdrop-blur-[1px]" />
        <DialogContent
          :style="contentLayerStyle"
          class="fixed left-1/2 top-1/2 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-slate-500/40"
          :class="sizeClasses[props.size]">
          <DialogTitle v-if="$slots.header" class="sr-only">{{ props.title }}</DialogTitle>
          <DialogDescription v-if="$slots.header && props.description" class="sr-only">
            {{ props.description }}
          </DialogDescription>

          <Card class="max-h-[calc(100dvh-2rem)] shadow-xl [&>div]:flex [&>div]:min-h-0 [&>div]:flex-col">
            <template #header>
              <div class="flex min-w-0 items-start justify-between gap-4">
                <div class="min-w-0 flex-1">
                  <slot name="header" :title="props.title" :description="props.description" :close="() => updateOpen(false)">
                    <DialogTitle class="font-semibold text-slate-900">{{ props.title }}</DialogTitle>
                    <DialogDescription v-if="props.description" class="mt-1 text-sm leading-5 text-slate-500">
                      {{ props.description }}
                    </DialogDescription>
                  </slot>
                </div>
                <DialogClose v-if="props.showClose" as-child>
                  <button
                    type="button"
                    class="inline-flex size-7 shrink-0 cursor-pointer appearance-none items-center justify-center border-0 bg-transparent p-0 text-slate-400 shadow-none outline-none transition-colors hover:text-slate-800 focus-visible:text-slate-800 disabled:cursor-not-allowed disabled:text-slate-200"
                    :aria-label="props.closeLabel">
                    <XIcon class="size-4 text-current" aria-hidden="true" />
                  </button>
                </DialogClose>
              </div>
            </template>

            <ScrollArea
              class="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] [&_[data-reka-scroll-area-viewport]]:min-h-0"
              scrollbar-visibility="auto">
              <slot :close="() => updateOpen(false)" />
            </ScrollArea>

            <template v-if="$slots.footer" #footer>
              <slot name="footer" :close="() => updateOpen(false)" />
            </template>
          </Card>
        </DialogContent>
      </DialogPortal>
    </template>
  </DialogRoot>
</template>
