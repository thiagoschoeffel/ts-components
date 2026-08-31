<script lang="ts">
export type EmptyStateSize = 'small' | 'medium' | 'large'

export interface EmptyStateProps {
  /** Primary empty-state message. */
  title: string
  /** Supporting explanation or next-step guidance. */
  description?: string
  /** Controls spacing and maximum text width. */
  size?: EmptyStateSize
  /** Displays the state inside a dashed boundary. */
  bordered?: boolean
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<EmptyStateProps>(), {
  description: undefined,
  size: 'medium',
  bordered: true
})

defineSlots<{
  /** Optional illustrative icon. */
  icon?: () => unknown
  /** Optional content displayed below the description. */
  default?: () => unknown
  /** Primary recovery or creation action. */
  action?: () => unknown
}>()

const sizeClasses: Record<EmptyStateSize, string> = {
  small: 'px-4 py-5',
  medium: 'px-5 py-8',
  large: 'px-6 py-12'
}
</script>

<template>
  <div
    class="text-center"
    :class="[sizeClasses[props.size], props.bordered ? 'rounded-lg border border-dashed border-slate-300' : '']">
    <div
      v-if="$slots.icon"
      class="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-slate-50 text-slate-600 [&>svg]:size-6"
      aria-hidden="true">
      <slot name="icon" />
    </div>
    <p class="text-sm font-medium text-slate-700">{{ props.title }}</p>
    <p v-if="props.description" class="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">{{ props.description }}</p>
    <div v-if="$slots.default" class="mx-auto mt-3 max-w-md text-sm text-slate-500"><slot /></div>
    <div v-if="$slots.action" class="mt-4 flex justify-center"><slot name="action" /></div>
  </div>
</template>
