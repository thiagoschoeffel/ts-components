<script setup lang="ts">
export type BadgeVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger'
export type BadgeSize = 'small' | 'medium' | 'large'

const props = withDefaults(
  defineProps<{
    /** Color and semantic emphasis of the badge. */
    variant?: BadgeVariant
    /** Controls the badge dimensions. */
    size?: BadgeSize
  }>(),
  {
    variant: 'neutral',
    size: 'small'
  }
)

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-slate-100 text-slate-700',
  info: 'bg-blue-100 text-blue-800',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800'
}

const sizeClasses: Record<BadgeSize, string> = {
  small: 'px-2 py-0.5 text-[0.6875rem]',
  medium: 'px-2.5 py-1 text-xs',
  large: 'px-3 py-1.5 text-sm'
}
</script>

<template>
  <span
    class="inline-flex items-center justify-center whitespace-nowrap rounded-full font-semibold"
    :class="[variantClasses[props.variant], sizeClasses[props.size]]">
    <slot />
  </span>
</template>
