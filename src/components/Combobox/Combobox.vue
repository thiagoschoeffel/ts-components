<script lang="ts">
export type ComboboxSize = 'small' | 'medium' | 'large'

export interface ComboboxOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface ComboboxProps {
  /** Selected option value. Supports v-model. */
  modelValue?: string
  /** Current search text. Supports v-model:search-value. */
  searchValue?: string
  /** Options available for selection. */
  options: ComboboxOption[]
  /** Visible label associated with the search field. */
  label?: string
  /** Supporting text displayed below the field. */
  description?: string
  /** Validation message displayed below the field. */
  error?: string
  /** Marks the field as invalid. */
  invalid?: boolean
  /** Hint displayed while the search is empty. */
  placeholder?: string
  /** Text shown when no option matches. */
  emptyText?: string
  /** Text shown while options are being loaded. */
  loadingText?: string
  /** Shows the loading state instead of options. */
  loading?: boolean
  /** Prevents interaction. */
  disabled?: boolean
  /** Marks the field as required. */
  required?: boolean
  /** Controls field height and typography. */
  size?: ComboboxSize
  /** Identifier used by the field label. */
  id?: string
  /** Accessible label used without a visible label. */
  ariaLabel?: string
  /** Disables built-in filtering for server-side or custom filtering. */
  externalFilter?: boolean
}
</script>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxViewport
} from 'reka-ui'
import { controlHeightClasses } from '../controlSize'
import { usePortalLayer } from '../portalLayer'

const props = withDefaults(defineProps<ComboboxProps>(), {
  modelValue: undefined,
  searchValue: '',
  label: undefined,
  description: undefined,
  error: undefined,
  invalid: false,
  placeholder: undefined,
  emptyText: 'Nenhuma opção encontrada.',
  loadingText: 'Carregando opções...',
  loading: false,
  disabled: false,
  required: false,
  size: 'medium',
  id: undefined,
  ariaLabel: undefined,
  externalFilter: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
  'update:searchValue': [value: string]
  select: [option: ComboboxOption]
}>()

defineSlots<{
  /** Icon displayed before the search text. */
  leading?: () => unknown
  /** Custom rendering for each option. */
  option?: (props: { option: ComboboxOption; selected: boolean }) => unknown
  /** Custom empty-state content. */
  empty?: (props: { searchValue: string }) => unknown
}>()

const generatedId = useId()
const fieldId = computed(() => props.id ?? `combobox-${generatedId}`)
const descriptionId = computed(() => `${fieldId.value}-description`)
const errorId = computed(() => `${fieldId.value}-error`)
const isInvalid = computed(() => props.invalid || Boolean(props.error))
const describedBy = computed(() => [props.description ? descriptionId.value : '', props.error ? errorId.value : ''].filter(Boolean).join(' ') || undefined)
const layerOpen = ref(false)
const { contentLayerStyle } = usePortalLayer('floating', layerOpen)

const inputSizeClasses: Record<ComboboxSize, string> = {
  small: 'text-xs',
  medium: 'text-sm',
  large: 'text-base'
}

const defaultPaddingClasses: Record<ComboboxSize, string> = {
  small: 'pl-2.5 pr-2.5',
  medium: 'pl-3 pr-3',
  large: 'pl-3.5 pr-3.5'
}

const leadingPaddingClasses: Record<ComboboxSize, string> = {
  small: 'pl-8 pr-2.5',
  medium: 'pl-9 pr-3',
  large: 'pl-10 pr-3.5'
}

const leadingIconClasses: Record<ComboboxSize, string> = {
  small: 'px-2 [&>svg]:size-3.5',
  medium: 'px-2.5 [&>svg]:size-4',
  large: 'px-3 [&>svg]:size-4.5'
}

function selectValue(value: string) {
  const option = props.options.find(current => current.value === value)
  emit('update:modelValue', value)
  if (option)
    emit('select', option)
}

function updateOpen(open: boolean) {
  layerOpen.value = open
}
</script>

<template>
  <div class="min-w-0 w-full">
    <label v-if="props.label" :for="fieldId" class="mb-1.5 block text-sm font-medium text-slate-700">
      {{ props.label }}<span v-if="props.required" class="text-red-500" aria-hidden="true"> *</span>
    </label>
    <ComboboxRoot
      :model-value="props.modelValue"
      :disabled="props.disabled"
      :ignore-filter="props.externalFilter"
      :open-on-click="true"
      :open-on-focus="true"
      :reset-search-term-on-blur="false"
      :reset-search-term-on-select="false"
      @update:model-value="selectValue(String($event))"
      @update:open="updateOpen">
      <ComboboxAnchor class="relative">
        <span
          v-if="$slots.leading"
          class="pointer-events-none absolute inset-y-0 left-0 z-10 inline-flex items-center justify-center text-slate-400"
          :class="leadingIconClasses[props.size]"
          aria-hidden="true"><slot name="leading" /></span>
        <ComboboxInput
          :id="fieldId"
          :model-value="props.searchValue"
          :placeholder="props.placeholder"
          :disabled="props.disabled"
          :aria-label="props.ariaLabel"
          :aria-invalid="isInvalid"
          :aria-describedby="describedBy"
          class="box-border block w-full appearance-none rounded-lg border bg-white text-slate-800 shadow-xs outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-300"
          :class="[
            controlHeightClasses[props.size],
            inputSizeClasses[props.size],
            $slots.leading ? leadingPaddingClasses[props.size] : defaultPaddingClasses[props.size],
            isInvalid ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-300'
          ]"
          @update:model-value="emit('update:searchValue', String($event))" />
      </ComboboxAnchor>

      <ComboboxPortal>
        <ComboboxContent
          position="popper"
          :side-offset="4"
          :style="contentLayerStyle"
          class="max-h-72 w-[var(--reka-combobox-trigger-width)] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg outline-none">
          <ComboboxViewport class="p-1">
            <div v-if="props.loading" class="px-3 py-4 text-center text-sm text-slate-500">{{ props.loadingText }}</div>
            <template v-else>
              <ComboboxItem
                v-for="option in props.options"
                :key="option.value"
                :value="option.value"
                :text-value="`${option.label} ${option.description ?? ''}`"
                :disabled="option.disabled"
                class="group flex cursor-pointer select-none items-center rounded-md px-3 py-2.5 text-sm text-slate-700 outline-none data-[highlighted]:bg-slate-50 data-[highlighted]:text-slate-900 data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-800 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50">
                <slot name="option" :option="option" :selected="props.modelValue === option.value">
                  <span class="min-w-0">
                    <span class="block font-medium">{{ option.label }}</span>
                    <span v-if="option.description" class="mt-0.5 block text-xs text-slate-500 group-data-[state=checked]:text-blue-800">{{ option.description }}</span>
                  </span>
                </slot>
              </ComboboxItem>
              <ComboboxEmpty class="px-4 py-5 text-center text-sm text-slate-500">
                <slot name="empty" :search-value="props.searchValue">{{ props.emptyText }}</slot>
              </ComboboxEmpty>
            </template>
          </ComboboxViewport>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
    <p v-if="props.description" :id="descriptionId" class="mt-1.5 text-xs leading-snug text-slate-500">{{ props.description }}</p>
    <p v-if="props.error" :id="errorId" class="mt-1.5 text-xs leading-snug text-red-600">{{ props.error }}</p>
  </div>
</template>
