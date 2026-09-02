<script lang="ts">
export type ToggleSize = 'small' | 'medium' | 'large'

export interface ToggleProps {
  /** Current pressed state. Supports v-model. */
  modelValue?: boolean
  /** Controls the toggle dimensions. */
  size?: ToggleSize
  /** Uses square dimensions for a toggle containing only an icon. */
  iconOnly?: boolean
  /** Prevents interaction when set to true. */
  disabled?: boolean
  /** Name submitted with the surrounding form. */
  name?: string
  /** Marks the toggle as required in the surrounding form. */
  required?: boolean
}
</script>

<script setup lang="ts">
import { Toggle as ToggleRoot } from 'reka-ui'
import { controlHeightClasses } from '../controlSize'

const props = withDefaults(defineProps<ToggleProps>(), {
  modelValue: false,
  size: 'medium',
  iconOnly: false,
  disabled: false,
  name: undefined,
  required: false
})

const emit = defineEmits<{
  /** Emitted when the pressed state changes. */
  'update:modelValue': [value: boolean]
}>()

defineSlots<{
  /** Content displayed inside the toggle. */
  default?: (props: { pressed: boolean }) => unknown
  /** Icon displayed before the text. */
  icon?: (props: { pressed: boolean }) => unknown
}>()

const sizeClasses: Record<ToggleSize, string> = {
  small: 'px-2.5 text-xs',
  medium: 'px-3.5 text-sm',
  large: 'px-4.5 text-base'
}

const iconOnlySizeClasses: Record<ToggleSize, string> = {
  small: 'w-7 text-xs',
  medium: 'w-9 text-sm',
  large: 'w-11 text-base'
}
</script>

<template>
  <ToggleRoot
    v-slot="{ pressed }"
    :model-value="props.modelValue"
    :disabled="props.disabled"
    :name="props.name"
    :required="props.required"
    class="box-border inline-flex appearance-none items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-slate-300 bg-gradient-to-b from-white to-slate-100 font-medium leading-none text-slate-900 shadow-xs outline-none transition-[filter,transform,box-shadow,background-color,border-color] duration-150 focus-visible:ring-2 focus-visible:ring-slate-500/40 focus-visible:ring-offset-2 data-[state=on]:border-slate-400 data-[state=on]:from-slate-200 data-[state=on]:to-slate-100 data-[state=on]:shadow-inner disabled:cursor-not-allowed disabled:opacity-50 enabled:cursor-pointer enabled:hover:brightness-105 enabled:hover:shadow-md enabled:active:translate-y-px enabled:active:brightness-95 enabled:active:shadow-none"
    :class="[
      controlHeightClasses[props.size],
      props.iconOnly ? iconOnlySizeClasses[props.size] : sizeClasses[props.size]
    ]"
    @update:model-value="emit('update:modelValue', $event)">
    <span
      v-if="$slots.icon"
      class="inline-flex shrink-0 items-center justify-center [&>svg]:size-[1em]"
      aria-hidden="true">
      <slot name="icon" :pressed="pressed" />
    </span>
    <slot :pressed="pressed" />
  </ToggleRoot>
</template>
