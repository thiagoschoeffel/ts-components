<script lang="ts">
export type TextareaSize = 'small' | 'medium' | 'large'
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both'

export interface TextareaProps {
  /** Current field value. Supports v-model. */
  modelValue?: string
  /** Visible label associated with the field. */
  label?: string
  /** Supporting text displayed below the field. */
  description?: string
  /** Validation message displayed below the field. */
  error?: string
  /** Marks the field as invalid without requiring an error message. */
  invalid?: boolean
  /** Controls padding and typography. */
  size?: TextareaSize
  /** Identifier used to associate label and supporting text. */
  id?: string
  /** Accessible label used when there is no visible label. */
  ariaLabel?: string
  /** Name submitted with the surrounding form. */
  name?: string
  /** Hint displayed when the field is empty. */
  placeholder?: string
  /** Initial number of visible text rows. */
  rows?: number
  /** Minimum number of accepted characters. */
  minlength?: number
  /** Maximum number of accepted characters. */
  maxlength?: number
  /** Marks the field as required. */
  required?: boolean
  /** Prevents interaction and form submission. */
  disabled?: boolean
  /** Prevents editing while keeping the value focusable. */
  readonly?: boolean
  /** Focuses the field when mounted. */
  autofocus?: boolean
  /** Enables browser spelling suggestions. */
  spellcheck?: boolean
  /** Controls which directions the field can be resized. */
  resize?: TextareaResize
}
</script>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'

const props = withDefaults(defineProps<TextareaProps>(), {
  modelValue: '',
  label: undefined,
  description: undefined,
  error: undefined,
  invalid: false,
  size: 'medium',
  id: undefined,
  ariaLabel: undefined,
  name: undefined,
  placeholder: undefined,
  rows: 4,
  minlength: undefined,
  maxlength: undefined,
  required: false,
  disabled: false,
  readonly: false,
  autofocus: false,
  spellcheck: true,
  resize: 'vertical'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: [event: Event]
  change: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const generatedId = useId()
const textareaElement = ref<HTMLTextAreaElement | null>(null)
const textareaId = computed(() => props.id ?? `textarea-${generatedId}`)
const descriptionId = computed(() => `${textareaId.value}-description`)
const errorId = computed(() => `${textareaId.value}-error`)
const isInvalid = computed(() => props.invalid || Boolean(props.error))
const describedBy = computed(() => [props.description ? descriptionId.value : '', props.error ? errorId.value : ''].filter(Boolean).join(' ') || undefined)

const sizeClasses: Record<TextareaSize, string> = {
  small: 'min-h-16 px-2.5 py-1.5 text-xs',
  medium: 'min-h-20 px-3 py-2 text-sm',
  large: 'min-h-24 px-3.5 py-2.5 text-base'
}

const resizeClasses: Record<TextareaResize, string> = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize'
}

function updateValue(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
  emit('input', event)
}

defineExpose({
  focus: () => textareaElement.value?.focus(),
  select: () => textareaElement.value?.select(),
  textareaElement
})
</script>

<template>
  <div class="min-w-0 w-full">
    <label v-if="props.label" :for="textareaId" class="mb-1.5 block text-sm font-medium text-slate-700">
      {{ props.label }}<span v-if="props.required" class="text-red-500" aria-hidden="true"> *</span>
    </label>
    <textarea
      :id="textareaId"
      ref="textareaElement"
      :value="props.modelValue"
      :name="props.name"
      :placeholder="props.placeholder"
      :rows="props.rows"
      :minlength="props.minlength"
      :maxlength="props.maxlength"
      :required="props.required"
      :disabled="props.disabled"
      :readonly="props.readonly"
      :autofocus="props.autofocus"
      :spellcheck="props.spellcheck"
      :aria-label="props.ariaLabel"
      :aria-invalid="isInvalid"
      :aria-describedby="describedBy"
      class="box-border block w-full rounded-lg border bg-white font-[inherit] text-slate-800 shadow-xs outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-300 read-only:bg-slate-50 read-only:text-slate-500"
      :class="[
        sizeClasses[props.size],
        resizeClasses[props.resize],
        isInvalid ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-300'
      ]"
      @input="updateValue"
      @change="emit('change', $event)"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)" />
    <p v-if="props.description" :id="descriptionId" class="mt-1.5 text-xs leading-snug text-slate-500">{{ props.description }}</p>
    <p v-if="props.error" :id="errorId" class="mt-1.5 text-xs leading-snug text-red-600">{{ props.error }}</p>
  </div>
</template>
