<script lang="ts">
export type CheckboxState = boolean | 'indeterminate'
export type CheckboxSize = 'small' | 'medium' | 'large'
</script>

<script setup lang="ts">
import { computed, useId } from 'vue'
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
import { CheckIcon, MinusIcon } from '../../icons'

const props = withDefaults(
  defineProps<{
    /** Controlled checked or indeterminate state. */
    modelValue?: CheckboxState
    /** Visible label associated with the control. */
    label?: string
    /** Supporting text displayed below the label. */
    description?: string
    /** Controls the dimensions of the control and its text. */
    size?: CheckboxSize
    /** Identifier used to associate the control and its label. */
    id?: string
    /** Accessible label used when there is no visible label. */
    ariaLabel?: string
    /** Name submitted with the surrounding form. */
    name?: string
    /** Value submitted when the checkbox is checked. */
    value?: string
    /** Marks the field as required. */
    required?: boolean
    /** Prevents interaction when set to true. */
    disabled?: boolean
  }>(),
  {
    modelValue: false,
    label: undefined,
    description: undefined,
    size: 'medium',
    id: undefined,
    ariaLabel: undefined,
    name: undefined,
    value: 'on',
    required: false,
    disabled: false
  }
)

const emit = defineEmits<{
  /** Emitted when the checked state changes. */
  'update:modelValue': [value: CheckboxState]
}>()

defineSlots<{
  /** Replaces the label prop with custom content. */
  label?: () => unknown
  /** Replaces the description prop with custom content. */
  description?: () => unknown
}>()

const generatedId = useId()
const controlId = computed(() => props.id ?? `checkbox-${generatedId}`)

const controlSizeClasses: Record<CheckboxSize, string> = {
  small: 'size-4 rounded-[0.3rem]',
  medium: 'size-5 rounded-md',
  large: 'size-6 rounded-md'
}

const iconSizeClasses: Record<CheckboxSize, string> = {
  small: 'size-3',
  medium: 'size-3.5',
  large: 'size-4'
}

const labelSizeClasses: Record<CheckboxSize, string> = {
  small: 'text-xs',
  medium: 'text-sm',
  large: 'text-base'
}

const descriptionSizeClasses: Record<CheckboxSize, string> = {
  small: 'text-[0.6875rem]',
  medium: 'text-xs',
  large: 'text-sm'
}
</script>

<template>
  <div
    class="inline-flex items-start gap-2.5 leading-none"
    :class="props.disabled ? 'cursor-not-allowed opacity-50' : ''">
    <CheckboxRoot
      :id="controlId"
      :aria-label="props.ariaLabel"
      :model-value="props.modelValue"
      :name="props.name"
      :value="props.value"
      :required="props.required"
      :disabled="props.disabled"
      class="mt-px inline-flex shrink-0 appearance-none items-center justify-center border border-slate-300 bg-gradient-to-b from-white to-slate-100 text-white shadow-sm transition-[background-color,border-color,box-shadow,filter] duration-150 outline-none data-[state=checked]:border-blue-700 data-[state=checked]:bg-gradient-to-b data-[state=checked]:from-blue-500 data-[state=checked]:to-blue-600 data-[state=indeterminate]:border-blue-700 data-[state=indeterminate]:bg-gradient-to-b data-[state=indeterminate]:from-blue-500 data-[state=indeterminate]:to-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 enabled:cursor-pointer enabled:hover:brightness-[1.03] enabled:active:brightness-95 disabled:cursor-not-allowed"
      :class="controlSizeClasses[props.size]"
      @update:model-value="emit('update:modelValue', $event as CheckboxState)">
      <CheckboxIndicator
        force-mount
        class="inline-flex items-center justify-center data-[state=unchecked]:opacity-0">
        <MinusIcon
          v-if="props.modelValue === 'indeterminate'"
          :class="iconSizeClasses[props.size]"
          :stroke-width="3"
          aria-hidden="true" />
        <CheckIcon
          v-else
          :class="iconSizeClasses[props.size]"
          :stroke-width="3"
          aria-hidden="true" />
      </CheckboxIndicator>
    </CheckboxRoot>

    <div v-if="props.label || props.description || $slots.label || $slots.description" class="min-w-0">
      <label
        v-if="props.label || $slots.label"
        :for="controlId"
        class="block font-medium leading-tight text-slate-800"
        :class="[
          labelSizeClasses[props.size],
          props.disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        ]">
        <slot name="label">{{ props.label }}</slot>
      </label>
      <p
        v-if="props.description || $slots.description"
        class="mt-1 leading-snug text-slate-500"
        :class="descriptionSizeClasses[props.size]">
        <slot name="description">{{ props.description }}</slot>
      </p>
    </div>
  </div>
</template>
