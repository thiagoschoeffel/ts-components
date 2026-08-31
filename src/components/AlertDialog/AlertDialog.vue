<script lang="ts">
export type AlertDialogSize = 'small' | 'medium' | 'large'
export type AlertDialogConfirmVariant = 'primary' | 'success' | 'warning' | 'danger'

export interface AlertDialogProps {
  /** Controlled open state. Supports v-model:open. */
  open?: boolean
  /** Initial state when open is uncontrolled. */
  defaultOpen?: boolean
  /** Visible and accessible dialog heading. */
  title: string
  /** Supporting explanation for the decision. */
  description?: string
  /** Label of the safe action. */
  cancelLabel?: string
  /** Label of the confirming action. */
  confirmLabel?: string
  /** Semantic emphasis of the confirming action. */
  confirmVariant?: AlertDialogConfirmVariant
  /** Controls the maximum dialog width. */
  size?: AlertDialogSize
  /** Shows progress and prevents confirming while true. */
  loading?: boolean
  /** Prevents the confirming action. */
  confirmDisabled?: boolean
}
</script>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger
} from 'reka-ui'
import Button from '../Button/Button.vue'
import Card from '../Card/Card.vue'

const props = withDefaults(defineProps<AlertDialogProps>(), {
  open: undefined,
  defaultOpen: false,
  description: undefined,
  cancelLabel: 'Cancelar',
  confirmLabel: 'Confirmar',
  confirmVariant: 'danger',
  size: 'small',
  loading: false,
  confirmDisabled: false
})

const emit = defineEmits<{
  /** Emitted when the dialog opens or closes. */
  'update:open': [open: boolean]
  /** Emitted when the confirming action is activated. */
  confirm: []
  /** Emitted when the safe action is activated. */
  cancel: []
}>()

defineSlots<{
  /** Interactive element used to open the dialog. */
  trigger?: (props: { open: boolean }) => unknown
  /** Dialog header. The title remains available to assistive technologies when customized. */
  header?: (props: { title: string; description?: string }) => unknown
  /** Main dialog content, displayed after the optional description. */
  default?: () => unknown
  /** Dialog footer. Use the provided callbacks to preserve the closing behavior. */
  footer?: (props: {
    cancel: () => void
    confirm: () => void
    loading: boolean
    confirmDisabled: boolean
  }) => unknown
}>()

const uncontrolledOpen = ref(props.defaultOpen)

watch(
  () => props.open,
  (open) => {
    if (open !== undefined) uncontrolledOpen.value = open
  }
)

const currentOpen = computed(() => props.open ?? uncontrolledOpen.value)

function updateOpen(open: boolean) {
  if (props.open === undefined) uncontrolledOpen.value = open
  emit('update:open', open)
}

function cancel() {
  updateOpen(false)
  emit('cancel')
}

function confirm() {
  if (props.loading || props.confirmDisabled) return

  updateOpen(false)
  emit('confirm')
}

const sizeClasses: Record<AlertDialogSize, string> = {
  small: 'max-w-sm',
  medium: 'max-w-lg',
  large: 'max-w-2xl'
}
</script>

<template>
  <AlertDialogRoot
    :open="currentOpen"
    @update:open="updateOpen">
    <template #default="{ open }">
      <AlertDialogTrigger v-if="$slots.trigger" as-child>
        <slot name="trigger" :open="open" />
      </AlertDialogTrigger>

      <AlertDialogPortal>
        <AlertDialogOverlay class="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[1px] data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <AlertDialogContent
          class="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-slate-500/40"
          :class="sizeClasses[props.size]">
          <AlertDialogTitle v-if="$slots.header" class="sr-only">{{ props.title }}</AlertDialogTitle>

          <Card class="max-h-[calc(100vh-2rem)] shadow-xl">
            <template #header>
              <slot name="header" :title="props.title" :description="props.description">
                <AlertDialogTitle class="font-semibold text-slate-900">{{ props.title }}</AlertDialogTitle>
              </slot>
            </template>

            <AlertDialogDescription v-if="props.description" class="text-slate-500">
              {{ props.description }}
            </AlertDialogDescription>
            <div v-if="$slots.default" :class="{ 'mt-4': props.description }">
              <slot />
            </div>

            <template #footer>
              <slot
                name="footer"
                :cancel="cancel"
                :confirm="confirm"
                :loading="props.loading"
                :confirm-disabled="props.confirmDisabled">
                <div class="flex flex-wrap justify-end gap-3">
                  <AlertDialogCancel as-child>
                    <Button type="button" variant="secondary" @click="emit('cancel')">{{ props.cancelLabel }}</Button>
                  </AlertDialogCancel>
                  <AlertDialogAction as-child>
                    <Button
                      type="button"
                      :variant="props.confirmVariant"
                      :loading="props.loading"
                      :disabled="props.confirmDisabled"
                      @click="emit('confirm')">
                      {{ props.confirmLabel }}
                    </Button>
                  </AlertDialogAction>
                </div>
              </slot>
            </template>
          </Card>
        </AlertDialogContent>
      </AlertDialogPortal>
    </template>
  </AlertDialogRoot>
</template>
