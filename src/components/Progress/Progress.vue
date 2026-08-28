<script setup lang="ts">
import { computed } from 'vue'
import { ProgressIndicator, ProgressRoot } from 'reka-ui'

type ProgressVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger'
type ProgressSize = 'small' | 'medium' | 'large'

const props = withDefaults(
  defineProps<{
    /** Current amount completed. */
    value: number
    /** Amount that represents a complete progress bar. */
    max?: number
    /** Semantic color of the completed portion. */
    variant?: ProgressVariant
    /** Height of the progress bar. */
    size?: ProgressSize
    /** Accessible description of the progress state. */
    label?: string
  }>(),
  {
    max: 100,
    variant: 'info',
    size: 'medium',
    label: 'Progresso'
  }
)

const segmentCount = 20

const safeMax = computed(() => (props.max > 0 ? props.max : 100))
const normalizedValue = computed(() => Math.min(Math.max(props.value, 0), safeMax.value))
const percentage = computed(() => (normalizedValue.value / safeMax.value) * 100)
const filledSegments = computed(() => Math.round((percentage.value / 100) * segmentCount))

const variantClasses: Record<ProgressVariant, string> = {
  neutral: 'bg-slate-500',
  info: 'bg-blue-600',
  success: 'bg-emerald-600',
  warning: 'bg-amber-500',
  danger: 'bg-red-600'
}

const sizeClasses: Record<ProgressSize, string> = {
  small: 'h-1.5',
  medium: 'h-2.5',
  large: 'h-3.5'
}

const getValueLabel = () => `${props.label}: ${Math.round(percentage.value)}%`
</script>

<template>
  <ProgressRoot
    :model-value="normalizedValue"
    :max="safeMax"
    :get-value-label="getValueLabel"
    class="overflow-hidden rounded-full bg-slate-200"
    :class="sizeClasses[props.size]">
    <ProgressIndicator class="grid h-full grid-cols-[repeat(20,minmax(0,1fr))]">
      <span
        v-for="segment in segmentCount"
        :key="segment"
        class="h-full"
        :class="segment <= filledSegments ? variantClasses[props.variant] : 'bg-transparent'" />
    </ProgressIndicator>
  </ProgressRoot>
</template>
