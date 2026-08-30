<script lang="ts">
export type RadioGroupSize = 'small' | 'medium' | 'large'
export type RadioGroupOrientation = 'vertical' | 'horizontal'

export interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}
</script>

<script setup lang="ts">
import { useId } from 'vue'
import {
  RadioGroupIndicator,
  RadioGroupItem,
  RadioGroupRoot
} from 'reka-ui'

const props = withDefaults(
  defineProps<{
    /** Value of the selected option. */
    modelValue?: string
    /** Options displayed in the group. */
    options: RadioOption[]
    /** Visible title for the group. */
    label?: string
    /** Supporting text displayed below the group title. */
    description?: string
    /** Layout direction of the options. */
    orientation?: RadioGroupOrientation
    /** Controls the dimensions of each option. */
    size?: RadioGroupSize
    /** Name submitted with the surrounding form. */
    name?: string
    /** Marks the group as required. */
    required?: boolean
    /** Prevents interaction with every option. */
    disabled?: boolean
    /** Allows keyboard navigation to loop between the first and last options. */
    loop?: boolean
  }>(),
  {
    modelValue: undefined,
    label: undefined,
    description: undefined,
    orientation: 'vertical',
    size: 'medium',
    name: undefined,
    required: false,
    disabled: false,
    loop: true
  }
)

const emit = defineEmits<{
  /** Emitted when the selected option changes. */
  'update:modelValue': [value: string]
}>()

const generatedId = useId()

const controlSizeClasses: Record<RadioGroupSize, string> = {
  small: 'size-4',
  medium: 'size-5',
  large: 'size-6'
}

const indicatorSizeClasses: Record<RadioGroupSize, string> = {
  small: 'size-1.5',
  medium: 'size-2',
  large: 'size-2.5'
}

const labelSizeClasses: Record<RadioGroupSize, string> = {
  small: 'text-xs',
  medium: 'text-sm',
  large: 'text-base'
}

const descriptionSizeClasses: Record<RadioGroupSize, string> = {
  small: 'text-[0.6875rem]',
  medium: 'text-xs',
  large: 'text-sm'
}

function optionId(index: number) {
  return `radio-${generatedId}-${index}`
}
</script>

<template>
  <div class="space-y-3">
    <div v-if="props.label || props.description" class="space-y-1">
      <p v-if="props.label" class="text-sm font-medium text-slate-700">{{ props.label }}</p>
      <p v-if="props.description" class="text-xs text-slate-500">{{ props.description }}</p>
    </div>

    <RadioGroupRoot
      :model-value="props.modelValue"
      :orientation="props.orientation"
      :name="props.name"
      :required="props.required"
      :disabled="props.disabled"
      :loop="props.loop"
      :aria-label="props.label || 'Opções'"
      class="flex"
      :class="props.orientation === 'horizontal' ? 'flex-row flex-wrap gap-x-5 gap-y-3' : 'flex-col gap-3'"
      @update:model-value="emit('update:modelValue', String($event))">
      <div
        v-for="(option, index) in props.options"
        :key="option.value"
        class="inline-flex items-start gap-2.5"
        :class="props.disabled || option.disabled ? 'cursor-not-allowed opacity-50' : ''">
        <RadioGroupItem
          :id="optionId(index)"
          :value="option.value"
          :disabled="option.disabled"
          class="mt-px inline-flex shrink-0 appearance-none items-center justify-center rounded-full border border-slate-300 bg-gradient-to-b from-white to-slate-100 shadow-xs transition-[background-color,border-color,box-shadow,filter] duration-150 outline-none data-[state=checked]:border-blue-700 data-[state=checked]:bg-gradient-to-b data-[state=checked]:from-blue-500 data-[state=checked]:to-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 enabled:cursor-pointer enabled:hover:brightness-[1.03] enabled:active:brightness-95 disabled:cursor-not-allowed"
          :class="controlSizeClasses[props.size]">
          <RadioGroupIndicator
            class="rounded-full bg-white shadow-xs"
            :class="indicatorSizeClasses[props.size]" />
        </RadioGroupItem>

        <div class="min-w-0">
          <label
            :for="optionId(index)"
            class="block font-medium leading-tight text-slate-800"
            :class="[
              labelSizeClasses[props.size],
              props.disabled || option.disabled ? 'cursor-not-allowed' : 'cursor-pointer'
            ]">
            {{ option.label }}
          </label>
          <p
            v-if="option.description"
            class="mt-1 leading-snug text-slate-500"
            :class="descriptionSizeClasses[props.size]">
            {{ option.description }}
          </p>
        </div>
      </div>
    </RadioGroupRoot>
  </div>
</template>
