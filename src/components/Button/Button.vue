<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
type ButtonSize = 'small' | 'medium' | 'large'

const props = withDefaults(
  defineProps<{
    /** Color and visual emphasis of the button. */
    variant?: ButtonVariant
    /** Controls the button dimensions. */
    size?: ButtonSize
    /** Native button type. */
    type?: 'button' | 'submit' | 'reset'
    /** Prevents interaction when set to true. */
    disabled?: boolean
    /** Shows progress and prevents interaction while true. */
    loading?: boolean
    /** Uses square dimensions for a button containing only an icon. */
    iconOnly?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'medium',
    type: 'button',
    disabled: false,
    loading: false,
    iconOnly: false
  }
)

defineEmits<{
  /** Emitted when the button is activated. */
  click: [event: MouseEvent]
}>()

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'border-blue-700 bg-gradient-to-b from-blue-500 to-blue-600 text-white focus-visible:ring-blue-500/40',
  secondary: 'border-slate-300 bg-gradient-to-b from-white to-slate-100 text-slate-900 focus-visible:ring-slate-500/40',
  success: 'border-emerald-700 bg-gradient-to-b from-emerald-500 to-emerald-600 text-white focus-visible:ring-emerald-500/40',
  warning: 'border-amber-500 bg-gradient-to-b from-amber-300 to-amber-400 text-amber-950 focus-visible:ring-amber-500/40',
  danger: 'border-red-700 bg-gradient-to-b from-red-500 to-red-600 text-white focus-visible:ring-red-500/40'
}

const sizeClasses: Record<ButtonSize, string> = {
  small: 'h-7 px-2.5 text-xs',
  medium: 'h-9 px-3.5 text-sm',
  large: 'h-11 px-4.5 text-base'
}

const iconOnlySizeClasses: Record<ButtonSize, string> = {
  small: 'size-7 text-xs',
  medium: 'size-9 text-sm',
  large: 'size-11 text-base'
}
</script>

<template>
  <button
    class="inline-flex appearance-none items-center justify-center gap-2 whitespace-nowrap rounded-lg border font-medium leading-none shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    :class="[
      variantClasses[props.variant],
      props.iconOnly ? iconOnlySizeClasses[props.size] : sizeClasses[props.size],
      props.loading
        ? 'cursor-wait opacity-50'
        : props.disabled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer transition-[filter,transform,box-shadow] duration-150 hover:brightness-105 hover:shadow-md active:translate-y-px active:brightness-95 active:shadow-none'
    ]"
    :disabled="props.disabled || props.loading"
    :type="props.type"
    :aria-busy="props.loading"
    @click="$emit('click', $event)">
    <span
      v-if="props.loading"
      class="size-[0.875em] shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent"
      aria-hidden="true" />
    <span
      v-if="$slots.icon && !props.loading"
      class="inline-flex shrink-0 items-center justify-center [&>svg]:size-[1em]"
      aria-hidden="true">
      <slot name="icon" />
    </span>
    <slot />
    <span
      v-if="$slots.trailingIcon && !props.loading"
      class="inline-flex shrink-0 items-center justify-center [&>svg]:size-[1em]"
      aria-hidden="true">
      <slot name="trailingIcon" />
    </span>
  </button>
</template>
