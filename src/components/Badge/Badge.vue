<script setup lang="ts">
type BadgeVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger'
type BadgeSize = 'small' | 'medium'

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
  small: 'px-2.5 py-1 text-xs',
  medium: 'px-3 py-1.5 text-sm'
}
</script>

<template>
  <span
    class="inline-flex items-center justify-center whitespace-nowrap rounded-full font-semibold"
    :class="[variantClasses[props.variant], sizeClasses[props.size]]">
    <slot />
  </span>
</template>
