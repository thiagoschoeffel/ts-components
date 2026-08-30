<script lang="ts">
import type { ControlSize } from '../controlSize'

export type ChipsSize = ControlSize
export type ChipsVariant = 'primary' | 'secondary'

export interface ChipsProps {
  /** Color and visual emphasis of the chip. */
  variant?: ChipsVariant
  /** Controls the chip dimensions. */
  size?: ChipsSize
  /** Accessible name used in place of the visible chip content. */
  ariaLabel?: string
  /** Prevents removing the filter while true. */
  disabled?: boolean
}
</script>

<script setup lang="ts">
import { XIcon } from '../../icons'

const props = withDefaults(defineProps<ChipsProps>(), {
  variant: 'secondary',
  size: 'small',
  ariaLabel: 'Remover filtro',
  disabled: false
})

const emit = defineEmits<{
  /** Emitted when the user removes the chip. */
  remove: [event: MouseEvent]
}>()

defineSlots<{
  /** Filter description displayed inside the chip. */
  default: () => unknown
  /** Icon displayed before the filter description. */
  leading?: () => unknown
  /** Icon replacing the default remove icon. */
  removeIcon?: () => unknown
}>()

const sizeClasses: Record<ChipsSize, string> = {
  small: 'gap-1 py-0.5 pl-2.5 pr-0.5 text-xs',
  medium: 'gap-1.5 py-0.5 pl-3 pr-0.5 text-sm',
  large: 'gap-2 py-0.5 pl-3.5 pr-0.5 text-base'
}

const variantClasses: Record<ChipsVariant, string> = {
  primary: 'bg-blue-100 text-blue-800 data-[disabled=true]:bg-blue-50 data-[disabled=true]:text-blue-200',
  secondary: 'bg-slate-100 text-slate-700 data-[disabled=true]:bg-slate-50 data-[disabled=true]:text-slate-200'
}

const removeButtonSizeClasses: Record<ChipsSize, string> = {
  small: 'size-5 [&>svg]:size-3.5',
  medium: 'size-6 [&>svg]:size-4',
  large: 'size-7 [&>svg]:size-4.5'
}

const removeButtonVariantClasses: Record<ChipsVariant, string> = {
  primary: 'enabled:hover:bg-blue-200/70 focus-visible:ring-blue-500/40',
  secondary: 'enabled:hover:bg-slate-200/70 focus-visible:ring-slate-500/40'
}
</script>

<template>
  <span
    class="inline-flex max-w-full items-center rounded-full font-semibold"
    :class="[variantClasses[props.variant], sizeClasses[props.size]]"
    :data-disabled="props.disabled">
    <span
      v-if="$slots.leading"
      class="inline-flex shrink-0 items-center [&>svg]:size-[1em]"
      aria-hidden="true">
      <slot name="leading" />
    </span>
    <span class="truncate"><slot /></span>
    <button
      type="button"
      class="inline-flex shrink-0 appearance-none items-center justify-center rounded-full border-0 bg-transparent text-current outline-none transition-colors duration-150 enabled:cursor-pointer focus-visible:ring-2 disabled:cursor-not-allowed"
      :class="[removeButtonSizeClasses[props.size], removeButtonVariantClasses[props.variant]]"
      :aria-label="props.ariaLabel"
      :disabled="props.disabled"
      @click="emit('remove', $event)">
      <span class="inline-flex items-center [&>svg]:size-[1em]" aria-hidden="true">
        <slot name="removeIcon"><XIcon /></slot>
      </span>
    </button>
  </span>
</template>
