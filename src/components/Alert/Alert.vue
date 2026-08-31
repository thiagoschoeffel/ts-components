<script lang="ts">
export type AlertVariants = 'neutral' | 'info' | 'success' | 'warning' | 'danger'
export type AlertSize = 'small' | 'medium'

export interface AlertProps {
  /** Semantic color used to communicate the message purpose. */
  variants?: AlertVariants
  /** Optional heading displayed above the supporting content. */
  title?: string
  /** Supporting message. Can be replaced by the default slot. */
  description?: string
  /** Controls spacing and typography. */
  size?: AlertSize
  /** Displays an action that lets the consumer dismiss the alert. */
  closable?: boolean
  /** Accessible name of the dismiss action. */
  closeLabel?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { XIcon } from '../../icons'

const props = withDefaults(defineProps<AlertProps>(), {
  variants: 'info',
  title: undefined,
  description: undefined,
  size: 'medium',
  closable: false,
  closeLabel: 'Fechar alerta'
})

const emit = defineEmits<{
  /** Emitted when the dismiss action is activated. */
  close: []
}>()

defineSlots<{
  /** Icon displayed before the message. */
  icon?: () => unknown
  /** Main message content. */
  default?: () => unknown
  /** Optional actions displayed below the message. */
  actions?: () => unknown
}>()

const variantClasses: Record<AlertVariants, string> = {
  neutral: 'border-slate-200 bg-slate-50 text-slate-700',
  info: 'border-blue-200 bg-blue-50 text-blue-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  warning: 'border-amber-300 bg-amber-50 text-amber-800',
  danger: 'border-red-200 bg-red-50 text-red-700'
}

const sizeClasses: Record<AlertSize, string> = {
  small: 'gap-2 px-3 py-2 text-xs',
  medium: 'gap-3 px-4 py-3 text-sm'
}

const firstLineClasses: Record<AlertSize, string> = {
  small: 'min-h-4 leading-4',
  medium: 'min-h-5 leading-5'
}

const closeClasses: Record<AlertVariants, string> = {
  neutral: 'text-slate-400 hover:text-slate-800 focus-visible:ring-slate-500/40',
  info: 'text-blue-600 hover:text-blue-900 focus-visible:ring-blue-500/40',
  success: 'text-emerald-600 hover:text-emerald-900 focus-visible:ring-emerald-500/40',
  warning: 'text-amber-600 hover:text-amber-900 focus-visible:ring-amber-500/40',
  danger: 'text-red-500 hover:text-red-800 focus-visible:ring-red-500/40'
}

const role = computed(() => props.variants === 'danger' || props.variants === 'warning' ? 'alert' : 'status')
</script>

<template>
  <div
    :role="role"
    class="flex items-start rounded-lg border"
    :class="[variantClasses[props.variants], sizeClasses[props.size]]">
    <span
      v-if="$slots.icon"
      class="inline-flex shrink-0 items-center [&>svg]:size-4"
      :class="firstLineClasses[props.size]"
      aria-hidden="true">
      <slot name="icon" />
    </span>
    <div class="min-w-0 flex-1">
      <p v-if="props.title" class="m-0 font-semibold" :class="firstLineClasses[props.size]">{{ props.title }}</p>
      <div :class="[firstLineClasses[props.size], props.title ? 'mt-1' : '']">
        <slot>{{ props.description }}</slot>
      </div>
      <div v-if="$slots.actions" class="mt-3 flex flex-wrap gap-2">
        <slot name="actions" />
      </div>
    </div>
    <button
      v-if="props.closable"
      type="button"
      class="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent p-0 outline-none transition-colors focus-visible:ring-2"
      :class="[firstLineClasses[props.size], closeClasses[props.variants]]"
      :aria-label="props.closeLabel"
      @click="emit('close')">
      <XIcon class="size-4" aria-hidden="true" />
    </button>
  </div>
</template>
