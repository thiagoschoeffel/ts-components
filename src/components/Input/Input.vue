<script lang="ts">
export type InputSize = 'small' | 'medium' | 'large'
export type InputType =
  | 'text'
  | 'search'
  | 'email'
  | 'password'
  | 'tel'
  | 'url'
  | 'number'
  | 'date'
  | 'time'
  | 'datetime-local'
export type InputValue = string | number

export interface InputProps {
  /** Current field value. Supports v-model. */
  modelValue?: InputValue
  /** Native type for text-like and date/time inputs. */
  type?: InputType
  /** Visible label associated with the input. */
  label?: string
  /** Supporting text displayed below the input. */
  description?: string
  /** Validation message displayed below the input. */
  error?: string
  /** Marks the field as invalid without requiring an error message. */
  invalid?: boolean
  /** Controls the field height and typography. */
  size?: InputSize
  /** Identifier used to associate the label and supporting text. */
  id?: string
  /** Accessible label used when there is no visible label. */
  ariaLabel?: string
  /** Name submitted with the surrounding form. */
  name?: string
  /** Hint displayed when the field is empty. */
  placeholder?: string
  /** Browser autocomplete hint. */
  autocomplete?: string
  /** Virtual keyboard hint for supported devices. */
  inputmode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'
  /** Identifier of an associated datalist. */
  list?: string
  /** Minimum accepted value or date. */
  min?: string | number
  /** Maximum accepted value or date. */
  max?: string | number
  /** Numeric or temporal increment. */
  step?: string | number
  /** Minimum number of characters accepted. */
  minlength?: number
  /** Maximum number of characters accepted. */
  maxlength?: number
  /** Regular expression used by native validation. */
  pattern?: string
  /** Marks the field as required. */
  required?: boolean
  /** Prevents interaction and form submission of the value. */
  disabled?: boolean
  /** Prevents editing while keeping the value focusable and submittable. */
  readonly?: boolean
  /** Focuses the field when it is mounted. */
  autofocus?: boolean
  /** Enables browser spelling suggestions. */
  spellcheck?: boolean
  /** Displays a button that clears a non-empty value. */
  clearable?: boolean
  /** Accessible label for the clear button. */
  clearLabel?: string
}
</script>

<script setup lang="ts">
import { computed, nextTick, ref, useId } from 'vue'
import { XIcon } from '../../icons'
import { controlHeightClasses } from '../controlSize'

const props = withDefaults(
  defineProps<InputProps>(),
  {
    modelValue: '',
    type: 'text',
    label: undefined,
    description: undefined,
    error: undefined,
    invalid: false,
    size: 'medium',
    id: undefined,
    ariaLabel: undefined,
    name: undefined,
    placeholder: undefined,
    autocomplete: undefined,
    inputmode: undefined,
    list: undefined,
    min: undefined,
    max: undefined,
    step: undefined,
    minlength: undefined,
    maxlength: undefined,
    pattern: undefined,
    required: false,
    disabled: false,
    readonly: false,
    autofocus: false,
    spellcheck: true,
    clearable: false,
    clearLabel: 'Limpar campo'
  }
)

const emit = defineEmits<{
  /** Emitted when the field value changes. */
  'update:modelValue': [value: InputValue]
  /** Emitted for the native input event. */
  input: [event: Event]
  /** Emitted when the value is committed. */
  change: [event: Event]
  /** Emitted when the field receives focus. */
  focus: [event: FocusEvent]
  /** Emitted when the field loses focus. */
  blur: [event: FocusEvent]
  /** Emitted after the clear button resets the field. */
  clear: []
}>()

defineSlots<{
  /** Content displayed before the input value. */
  leading?: () => unknown
  /** Content displayed after the input value and before the clear button. */
  trailing?: () => unknown
  /** Action attached to the right edge of the input. */
  action?: (props: { size: InputSize }) => unknown
}>()

const generatedId = useId()
const inputElement = ref<HTMLInputElement | null>(null)
const inputId = computed(() => props.id ?? `input-${generatedId}`)
const descriptionId = computed(() => `${inputId.value}-description`)
const errorId = computed(() => `${inputId.value}-error`)
const isInvalid = computed(() => props.invalid || Boolean(props.error))
const hasValue = computed(() => props.modelValue !== '' && props.modelValue != null)
const showClearButton = computed(() =>
  props.clearable && hasValue.value && !props.disabled && !props.readonly
)
const describedBy = computed(() => {
  const ids: string[] = []
  if (props.description)
    ids.push(descriptionId.value)
  if (props.error)
    ids.push(errorId.value)
  return ids.length ? ids.join(' ') : undefined
})

const sizeClasses: Record<InputSize, string> = {
  small: 'px-2.5 text-xs',
  medium: 'px-3 text-sm',
  large: 'px-3.5 text-base'
}

const leadingPaddingClasses: Record<InputSize, string> = {
  small: 'pl-8',
  medium: 'pl-9',
  large: 'pl-10'
}

const trailingPaddingClasses: Record<InputSize, string> = {
  small: 'pr-8',
  medium: 'pr-10',
  large: 'pr-12'
}

const doubleTrailingPaddingClasses: Record<InputSize, string> = {
  small: 'pr-15',
  medium: 'pr-19',
  large: 'pr-23'
}

const iconPositionClasses: Record<InputSize, string> = {
  small: 'px-2 [&>svg]:size-3.5',
  medium: 'px-2.5 [&>svg]:size-4',
  large: 'px-3 [&>svg]:size-4.5'
}

const trailingControlClasses: Record<InputSize, string> = {
  small: 'size-7 [&>svg]:size-3.5',
  medium: 'size-9 [&>svg]:size-4',
  large: 'size-11 [&>svg]:size-4.5'
}

function updateValue(event: Event) {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' && target.value !== ''
    ? target.valueAsNumber
    : target.value
  emit('update:modelValue', value)
  emit('input', event)
}

async function clearValue() {
  emit('update:modelValue', '')
  emit('clear')
  await nextTick()
  inputElement.value?.focus()
}

defineExpose({
  /** Focuses the native input element. */
  focus: () => inputElement.value?.focus(),
  /** Selects the complete native input value. */
  select: () => inputElement.value?.select(),
  /** Native input element. */
  inputElement
})
</script>

<template>
  <div class="min-w-0 w-full">
    <label
      v-if="props.label"
      :for="inputId"
      class="mb-1.5 block text-sm font-medium text-slate-700">
      {{ props.label }}
      <span v-if="props.required" class="text-red-500" aria-hidden="true"> *</span>
    </label>

    <div class="flex min-w-0">
      <div class="relative min-w-0 flex-1 focus-within:z-10">
      <span
        v-if="$slots.leading"
        class="pointer-events-none absolute inset-y-0 left-0 z-10 inline-flex items-center justify-center text-slate-400"
        :class="iconPositionClasses[props.size]"
        aria-hidden="true">
        <slot name="leading" />
      </span>

      <input
        :id="inputId"
        ref="inputElement"
        :value="props.modelValue"
        :type="props.type"
        :name="props.name"
        :placeholder="props.placeholder"
        :autocomplete="props.autocomplete"
        :inputmode="props.inputmode"
        :list="props.list"
        :min="props.min"
        :max="props.max"
        :step="props.step"
        :minlength="props.minlength"
        :maxlength="props.maxlength"
        :pattern="props.pattern"
        :required="props.required"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :autofocus="props.autofocus"
        :spellcheck="props.spellcheck"
        :aria-label="props.ariaLabel"
        :aria-invalid="isInvalid"
        :aria-describedby="describedBy"
        class="box-border block min-w-0 w-full appearance-none rounded-lg border bg-white text-slate-800 shadow-xs outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-300 read-only:bg-slate-50 read-only:text-slate-500"
        :class="[
          sizeClasses[props.size],
          controlHeightClasses[props.size],
          $slots.action ? 'rounded-r-none' : '',
          $slots.leading ? leadingPaddingClasses[props.size] : '',
          $slots.trailing && showClearButton
            ? doubleTrailingPaddingClasses[props.size]
            : $slots.trailing || showClearButton
              ? trailingPaddingClasses[props.size]
              : '',
          isInvalid
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-300'
        ]"
        @input="updateValue"
        @change="emit('change', $event)"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)" />

      <div
        v-if="$slots.trailing || showClearButton"
        class="absolute inset-y-0 right-0 z-10 flex items-center">
        <span
          v-if="$slots.trailing"
          class="pointer-events-none inline-flex items-center justify-center text-slate-400"
          :class="trailingControlClasses[props.size]"
          aria-hidden="true">
          <slot name="trailing" />
        </span>

        <button
          v-if="showClearButton"
          type="button"
          class="inline-flex cursor-pointer appearance-none items-center justify-center border-0 bg-transparent p-0 text-slate-400 outline-none hover:text-slate-800 focus-visible:text-slate-800"
          :class="trailingControlClasses[props.size]"
          :aria-label="props.clearLabel"
          @click="clearValue">
          <XIcon aria-hidden="true" />
        </button>
      </div>
      </div>

      <div
        v-if="$slots.action"
        class="-ml-px shrink-0 [&>*]:rounded-l-none">
        <slot name="action" :size="props.size" />
      </div>
    </div>

    <p
      v-if="props.description"
      :id="descriptionId"
      class="mt-1.5 text-xs leading-snug text-slate-500">
      {{ props.description }}
    </p>
    <p
      v-if="props.error"
      :id="errorId"
      class="mt-1.5 text-xs leading-snug text-red-600">
      {{ props.error }}
    </p>
  </div>
</template>

<style scoped>
input[type='search']::-webkit-search-cancel-button,
input[type='search']::-webkit-search-decoration {
  appearance: none;
  -webkit-appearance: none;
}

input[type='search']::-ms-clear {
  display: none;
}
</style>
