<script lang="ts">
export type MultiSelectSize = 'small' | 'medium' | 'large'

export interface MultiSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface MultiSelectProps {
  /** Current selected values. Supports v-model. */
  modelValue?: string[]
  /** Options displayed in the list. */
  options: MultiSelectOption[]
  /** Text displayed when no option is selected. */
  placeholder?: string
  /** Visible label associated with the select. */
  label?: string
  /** Supporting text displayed below the select. */
  description?: string
  /** Validation message displayed below the select. */
  error?: string
  /** Marks the select as invalid without requiring an error message. */
  invalid?: boolean
  /** Controls the trigger height and typography. */
  size?: MultiSelectSize
  /** Identifier used to associate the label and supporting text. */
  id?: string
  /** Accessible label used when there is no visible label. */
  ariaLabel?: string
  /** Name submitted with the surrounding form. */
  name?: string
  /** Browser autocomplete hint. */
  autocomplete?: string
  /** Marks the select as required. */
  required?: boolean
  /** Prevents interaction and form submission of the values. */
  disabled?: boolean
  /** Controlled open state. Supports v-model:open. */
  open?: boolean
  /** Initial open state when the component is uncontrolled. */
  defaultOpen?: boolean
}
</script>

<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport
} from 'reka-ui'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '../../icons'
import { controlHeightClasses } from '../controlSize'

const props = withDefaults(defineProps<MultiSelectProps>(), {
  modelValue: () => [],
  placeholder: 'Selecione uma ou mais opções',
  label: undefined,
  description: undefined,
  error: undefined,
  invalid: false,
  size: 'medium',
  id: undefined,
  ariaLabel: undefined,
  name: undefined,
  autocomplete: undefined,
  required: false,
  disabled: false,
  open: undefined,
  defaultOpen: false
})

const emit = defineEmits<{
  /** Emitted when the selected values change. */
  'update:modelValue': [values: string[]]
  /** Emitted when the list opens or closes. */
  'update:open': [open: boolean]
}>()

defineSlots<{
  /** Custom content for the selected values. */
  value?: (props: { options: MultiSelectOption[] }) => unknown
  /** Custom content for every option. */
  option?: (props: { option: MultiSelectOption }) => unknown
}>()

const generatedId = useId()
const selectId = computed(() => props.id ?? `multi-select-${generatedId}`)
const descriptionId = computed(() => `${selectId.value}-description`)
const errorId = computed(() => `${selectId.value}-error`)
const isInvalid = computed(() => props.invalid || Boolean(props.error))
const currentValue = ref<string[]>([...props.modelValue])
const selectedValues = computed(() => new Set(currentValue.value))
const selectedOptions = computed(() => props.options.filter(option => selectedValues.value.has(option.value)))
const describedBy = computed(() => {
  const ids: string[] = []
  if (props.description)
    ids.push(descriptionId.value)
  if (props.error)
    ids.push(errorId.value)
  return ids.length ? ids.join(' ') : undefined
})

const triggerSizeClasses: Record<MultiSelectSize, string> = {
  small: 'px-2.5 text-xs',
  medium: 'px-3 text-sm',
  large: 'px-3.5 text-base'
}

const iconSizeClasses: Record<MultiSelectSize, string> = {
  small: '[&>svg]:size-3.5',
  medium: '[&>svg]:size-4',
  large: '[&>svg]:size-4.5'
}

watch(() => props.modelValue, values => currentValue.value = [...values])

function updateValue(value: unknown) {
  const values = Array.isArray(value) ? value.map(String) : []
  currentValue.value = values
  emit('update:modelValue', values)
}

function optionStateClasses(option: MultiSelectOption) {
  if (option.disabled)
    return 'cursor-not-allowed bg-transparent text-slate-200 data-[highlighted]:bg-transparent data-[highlighted]:text-slate-200'

  if (selectedValues.value.has(option.value))
    return 'cursor-pointer bg-blue-50 text-blue-600 data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-600'

  return 'cursor-pointer text-slate-400 data-[highlighted]:bg-slate-50 data-[highlighted]:text-slate-800'
}
</script>

<template>
  <div class="w-full min-w-0">
    <label
      v-if="props.label"
      :for="selectId"
      class="mb-1.5 block text-sm font-medium text-slate-700">
      {{ props.label }}
      <span v-if="props.required" class="text-red-500" aria-hidden="true"> *</span>
    </label>

    <SelectRoot
      :model-value="currentValue"
      :open="props.open"
      :default-open="props.defaultOpen"
      :name="props.name"
      :autocomplete="props.autocomplete"
      :required="props.required"
      :disabled="props.disabled"
      multiple
      @update:model-value="updateValue"
      @update:open="emit('update:open', $event)">
      <SelectTrigger
        :id="selectId"
        :aria-label="props.ariaLabel"
        :aria-invalid="isInvalid"
        :aria-describedby="describedBy"
        class="box-border inline-flex w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-lg border bg-white text-left text-slate-800 shadow-xs outline-none transition-[border-color,box-shadow,background-color] duration-150 hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-300"
        :class="[
          controlHeightClasses[props.size],
          triggerSizeClasses[props.size],
          isInvalid
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-300'
        ]">
        <SelectValue :placeholder="props.placeholder" class="min-w-0 flex-1 truncate data-[placeholder]:text-slate-400">
          <template v-if="selectedOptions.length">
            <slot name="value" :options="selectedOptions">
              {{ selectedOptions.map(option => option.label).join(', ') }}
            </slot>
          </template>
          <template v-else>{{ props.placeholder }}</template>
        </SelectValue>
        <SelectIcon
          class="inline-flex shrink-0 items-center justify-center self-center leading-none text-slate-400 transition-transform duration-150 [[data-state=open]_&]:rotate-180"
          :class="iconSizeClasses[props.size]">
          <ChevronDownIcon aria-hidden="true" />
        </SelectIcon>
      </SelectTrigger>

      <SelectPortal>
        <SelectContent
          position="popper"
          align="start"
          :side-offset="6"
          :style="{ width: 'var(--reka-select-trigger-width)' }"
          class="z-50 max-h-[var(--reka-select-content-available-height)] overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 text-sm shadow-xs outline-none">
          <SelectScrollUpButton class="flex h-6 cursor-default items-center justify-center text-slate-400">
            <ChevronUpIcon class="size-4" aria-hidden="true" />
          </SelectScrollUpButton>

          <SelectViewport class="max-h-[min(18rem,var(--reka-select-content-available-height))]">
            <SelectItem
              v-for="option in props.options"
              :key="option.value"
              :value="option.value"
              :disabled="option.disabled"
              :text-value="option.label"
              class="flex min-h-7 w-full items-center gap-2 rounded-md px-2 py-1 outline-none"
              :class="optionStateClasses(option)">
              <span class="flex size-4 shrink-0 items-center justify-center">
                <SelectItemIndicator class="flex size-4 items-center justify-center text-current">
                  <CheckIcon class="size-3.5" aria-hidden="true" />
                </SelectItemIndicator>
              </span>
              <SelectItemText class="block min-w-0 flex-1 truncate">
                <slot name="option" :option="option">
                  {{ option.label }}
                </slot>
              </SelectItemText>
            </SelectItem>
          </SelectViewport>

          <SelectScrollDownButton class="flex h-6 cursor-default items-center justify-center text-slate-400">
            <ChevronDownIcon class="size-4" aria-hidden="true" />
          </SelectScrollDownButton>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>

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
