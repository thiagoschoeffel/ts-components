<script lang="ts">
export interface SectionCardProps {
  /** Optional compact section heading. */
  title?: string
  /** Supporting text displayed below the heading. */
  description?: string
  /** Visually and semantically disables the section content. */
  disabled?: boolean
}
</script>

<script setup lang="ts">
import Card from '../Card/Card.vue'

const props = withDefaults(defineProps<SectionCardProps>(), {
  title: undefined,
  description: undefined,
  disabled: false
})

defineSlots<{
  /** Custom heading content. */
  header?: () => unknown
  /** Main section content. */
  default: () => unknown
  /** Optional content separated at the bottom. */
  footer?: () => unknown
}>()
</script>

<template>
  <Card
    :aria-disabled="props.disabled || undefined"
    :inert="props.disabled || undefined"
    :class="props.disabled ? 'bg-slate-50 opacity-60' : ''">
    <div v-if="$slots.header || props.title || props.description" class="mb-5">
      <slot name="header">
        <h2 v-if="props.title" class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{{ props.title }}</h2>
        <p v-if="props.description" class="mt-1 text-sm text-slate-500">{{ props.description }}</p>
      </slot>
    </div>
    <slot />
    <template v-if="$slots.footer" #footer><slot name="footer" /></template>
  </Card>
</template>
