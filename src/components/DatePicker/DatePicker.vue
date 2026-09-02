<script lang="ts">
import type { DateValue } from '@internationalized/date'

export type DatePickerSize = 'small' | 'medium' | 'large'
export type DatePickerAlign = 'start' | 'center' | 'end'
export type DatePickerSide = 'top' | 'right' | 'bottom' | 'left'
export type DatePickerWeekdayFormat = 'narrow' | 'short' | 'long'
export type DatePickerWeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6
export type DatePickerMatcher = (date: DateValue) => boolean

export interface DatePickerDaySlotProps {
  date: DateValue
  dayValue: string
  disabled: boolean
  selected: boolean
  today: boolean
  outsideView: boolean
  unavailable: boolean
}

export interface DatePickerProps {
  /** Selected date. Supports v-model. */
  modelValue?: DateValue
  /** Initial selected date when modelValue is not provided. */
  defaultValue?: DateValue
  /** Month currently displayed by the calendar. Supports v-model:placeholder-value. */
  placeholderValue?: DateValue
  /** Initial month displayed when there is no selected date. */
  defaultPlaceholderValue?: DateValue
  /** Visible label associated with the field. */
  label?: string
  /** Supporting text displayed below the field. */
  description?: string
  /** Validation message displayed below the field. */
  error?: string
  /** Marks the field as invalid without requiring an error message. */
  invalid?: boolean
  /** Controls the field height and typography. */
  size?: DatePickerSize
  /** Identifier used to associate the label and supporting text. */
  id?: string
  /** Accessible label used when there is no visible label. */
  ariaLabel?: string
  /** Name submitted with the surrounding form. */
  name?: string
  /** Locale used to format the field, month heading and weekdays. */
  locale?: string
  /** Earliest selectable date. */
  minValue?: DateValue
  /** Latest selectable date. */
  maxValue?: DateValue
  /** Returns true for dates that cannot receive focus or be selected. */
  isDateDisabled?: DatePickerMatcher
  /** Returns true for unavailable dates, rendered as unavailable and not selectable. */
  isDateUnavailable?: DatePickerMatcher
  /** Marks the field as required. */
  required?: boolean
  /** Prevents interaction and form submission of the value. */
  disabled?: boolean
  /** Prevents editing while keeping the value focusable and submittable. */
  readonly?: boolean
  /** Displays a clear action when a date is selected. */
  clearable?: boolean
  /** Accessible label for the clear action. */
  clearLabel?: string
  /** Accessible label for the calendar trigger. */
  calendarButtonLabel?: string
  /** Accessible label for navigation to the previous page. */
  previousButtonLabel?: string
  /** Accessible label for navigation to the next page. */
  nextButtonLabel?: string
  /** Controlled open state. Supports v-model:open. */
  open?: boolean
  /** Initial open state when the popover is uncontrolled. */
  defaultOpen?: boolean
  /** Blocks interaction with content outside the popover while open. */
  modal?: boolean
  /** Closes the calendar as soon as a date is selected. */
  closeOnSelect?: boolean
  /** Prevents deselecting the current date by selecting it again. */
  preventDeselect?: boolean
  /** First day of the week. Defaults to the locale convention. */
  weekStartsOn?: DatePickerWeekStartsOn
  /** Format used for weekday labels. */
  weekdayFormat?: DatePickerWeekdayFormat
  /** Always renders six weeks to avoid changes in panel height. */
  fixedWeeks?: boolean
  /** Number of consecutive months displayed. */
  numberOfMonths?: number
  /** Navigates by numberOfMonths instead of one month at a time. */
  pagedNavigation?: boolean
  /** Preferred side where the calendar opens. */
  side?: DatePickerSide
  /** Alignment of the calendar relative to the field. */
  align?: DatePickerAlign
  /** Distance in pixels between the field and calendar. */
  sideOffset?: number
  /** Minimum distance in pixels from viewport boundaries. */
  collisionPadding?: number
}
</script>

<script setup lang="ts">
import { computed, shallowRef, useId, watch } from 'vue'
import {
  DatePickerCalendar,
  DatePickerCell,
  DatePickerCellTrigger,
  DatePickerContent,
  DatePickerField,
  DatePickerGrid,
  DatePickerGridBody,
  DatePickerGridHead,
  DatePickerGridRow,
  DatePickerHeadCell,
  DatePickerHeader,
  DatePickerHeading,
  DatePickerInput,
  DatePickerNext,
  DatePickerPrev,
  DatePickerRoot,
  DatePickerTrigger
} from 'reka-ui'
import { CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon, XIcon } from '../../icons'
import { controlHeightClasses } from '../controlSize'
import { usePortalLayer } from '../portalLayer'

const props = withDefaults(defineProps<DatePickerProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  placeholderValue: undefined,
  defaultPlaceholderValue: undefined,
  label: undefined,
  description: undefined,
  error: undefined,
  invalid: false,
  size: 'medium',
  id: undefined,
  ariaLabel: undefined,
  name: undefined,
  locale: 'pt-BR',
  minValue: undefined,
  maxValue: undefined,
  isDateDisabled: undefined,
  isDateUnavailable: undefined,
  required: false,
  disabled: false,
  readonly: false,
  clearable: false,
  clearLabel: 'Limpar data',
  calendarButtonLabel: 'Abrir calendário',
  previousButtonLabel: 'Mês anterior',
  nextButtonLabel: 'Próximo mês',
  open: undefined,
  defaultOpen: false,
  modal: false,
  closeOnSelect: true,
  preventDeselect: true,
  weekStartsOn: undefined,
  weekdayFormat: 'short',
  fixedWeeks: true,
  numberOfMonths: 1,
  pagedNavigation: false,
  side: 'bottom',
  align: 'start',
  sideOffset: 6,
  collisionPadding: 8
})

const emit = defineEmits<{
  /** Emitted when the selected date changes. */
  'update:modelValue': [value: DateValue | undefined]
  /** Emitted when the calendar opens or closes. */
  'update:open': [open: boolean]
  /** Emitted when the displayed month changes. */
  'update:placeholderValue': [value: DateValue]
  /** Emitted after the clear action resets the selected date. */
  clear: []
}>()

defineSlots<{
  /** Custom content for a calendar day. */
  day?: (props: DatePickerDaySlotProps) => unknown
}>()

const generatedId = useId()
const fieldId = computed(() => props.id ?? `date-picker-${generatedId}`)
const labelId = computed(() => `${fieldId.value}-label`)
const descriptionId = computed(() => `${fieldId.value}-description`)
const errorId = computed(() => `${fieldId.value}-error`)
const isInvalid = computed(() => props.invalid || Boolean(props.error))
// DateValue implementations contain private state and must not be deeply unwrapped by Vue.
const currentValue = shallowRef<DateValue | undefined>(props.modelValue ?? props.defaultValue)
const currentPlaceholder = shallowRef<DateValue | undefined>(props.placeholderValue ?? props.defaultPlaceholderValue)
const layerOpen = shallowRef(props.open ?? props.defaultOpen)
const { contentLayerStyle } = usePortalLayer('floating', layerOpen)
const describedBy = computed(() => {
  const ids: string[] = []
  if (props.description)
    ids.push(descriptionId.value)
  if (props.error)
    ids.push(errorId.value)
  return ids.length ? ids.join(' ') : undefined
})

const fieldSizeClasses: Record<DatePickerSize, string> = {
  small: 'px-2 text-xs',
  medium: 'px-2.5 text-sm',
  large: 'px-3 text-base'
}

const segmentGapClasses: Record<DatePickerSize, string> = {
  small: 'gap-0.5',
  medium: 'gap-0.5',
  large: 'gap-1'
}

const iconButtonClasses: Record<DatePickerSize, string> = {
  small: 'size-6 [&>svg]:size-3.5',
  medium: 'size-7 [&>svg]:size-4',
  large: 'size-9 [&>svg]:size-4.5'
}

watch(() => props.modelValue, value => currentValue.value = value)
watch(() => props.placeholderValue, value => currentPlaceholder.value = value)
watch(() => props.open, (open) => {
  if (open !== undefined)
    layerOpen.value = open
})

function updateValue(value: DateValue | undefined) {
  currentValue.value = value
  emit('update:modelValue', value)
}

function updatePlaceholder(value: DateValue) {
  currentPlaceholder.value = value
  emit('update:placeholderValue', value)
}

function clearValue() {
  if (props.disabled || props.readonly)
    return
  updateValue(undefined)
  emit('clear')
}

function updateOpen(open: boolean) {
  if (props.open === undefined)
    layerOpen.value = open
  emit('update:open', open)
}
</script>

<template>
  <div class="w-full min-w-0">
    <label
      v-if="props.label"
      :id="labelId"
      :for="fieldId"
      class="mb-1.5 block text-sm font-medium text-slate-700">
      {{ props.label }}<span v-if="props.required" class="text-red-500" aria-hidden="true"> *</span>
    </label>

    <DatePickerRoot
      :model-value="currentValue"
      :placeholder="currentPlaceholder"
      :default-placeholder="props.defaultPlaceholderValue"
      :open="props.open"
      :default-open="props.defaultOpen"
      :modal="props.modal"
      :name="props.name"
      :required="props.required"
      :disabled="props.disabled"
      :readonly="props.readonly"
      :locale="props.locale"
      :min-value="props.minValue"
      :max-value="props.maxValue"
      :is-date-disabled="props.isDateDisabled"
      :is-date-unavailable="props.isDateUnavailable"
      :close-on-select="props.closeOnSelect"
      :prevent-deselect="props.preventDeselect"
      :week-starts-on="props.weekStartsOn"
      :weekday-format="props.weekdayFormat"
      :fixed-weeks="props.fixedWeeks"
      :number-of-months="props.numberOfMonths"
      :paged-navigation="props.pagedNavigation"
      @update:model-value="updateValue"
      @update:placeholder="updatePlaceholder"
      @update:open="updateOpen">
      <DatePickerField
        :aria-label="props.label ? undefined : props.ariaLabel"
        :aria-labelledby="props.label ? labelId : undefined"
        :aria-describedby="describedBy"
        :aria-invalid="isInvalid || undefined"
        :aria-required="props.required || undefined"
        class="box-border flex w-full min-w-0 items-center rounded-lg border bg-white text-slate-800 shadow-xs outline-none transition-[border-color,box-shadow,background-color] duration-150 hover:border-slate-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 data-[disabled]:cursor-not-allowed data-[disabled]:border-slate-200 data-[disabled]:bg-slate-50 data-[disabled]:text-slate-300 data-[readonly]:bg-slate-50"
        :class="[
          controlHeightClasses[props.size],
          fieldSizeClasses[props.size],
          isInvalid
            ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20'
            : 'border-slate-300'
        ]">
        <template #default="{ segments }">
          <div
            class="flex min-w-0 flex-1 items-center overflow-hidden whitespace-nowrap"
            :class="segmentGapClasses[props.size]">
            <DatePickerInput
              v-for="segment in segments"
              :key="segment.part"
              :part="segment.part"
              class="rounded-sm tabular-nums outline-none data-[placeholder]:text-slate-400 data-[disabled]:cursor-not-allowed data-[disabled]:text-slate-300 data-[invalid]:text-red-600 focus:bg-blue-50 focus:text-blue-700"
              :class="segment.part === 'literal' ? 'text-slate-400' : 'px-0.5'">
              {{ segment.value }}
            </DatePickerInput>
          </div>

          <button
            v-if="props.clearable && currentValue && !props.disabled && !props.readonly"
            type="button"
            :aria-label="props.clearLabel"
            class="inline-flex shrink-0 cursor-pointer appearance-none items-center justify-center rounded-md border-0 bg-transparent p-0 text-slate-400 outline-none transition-colors hover:text-slate-800 focus-visible:ring-2 focus-visible:ring-blue-500/30"
            :class="iconButtonClasses[props.size]"
            @click.stop="clearValue">
            <XIcon aria-hidden="true" />
          </button>

          <DatePickerTrigger
            :aria-label="props.calendarButtonLabel"
            class="inline-flex shrink-0 cursor-pointer appearance-none items-center justify-center rounded-md border-0 bg-transparent p-0 text-slate-400 outline-none transition-colors hover:text-slate-800 focus-visible:ring-2 focus-visible:ring-blue-500/30 disabled:cursor-not-allowed disabled:text-slate-200"
            :class="iconButtonClasses[props.size]">
            <CalendarDaysIcon aria-hidden="true" />
          </DatePickerTrigger>
        </template>
      </DatePickerField>

      <DatePickerContent
        :side="props.side"
        :align="props.align"
        :side-offset="props.sideOffset"
        :collision-padding="props.collisionPadding"
        :style="contentLayerStyle"
        class="max-h-[var(--reka-popper-available-height)] max-w-[calc(100vw-1rem)] overflow-auto rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 shadow-lg outline-none">
        <DatePickerCalendar v-slot="{ weekDays, grid }">
          <DatePickerHeader class="relative mb-3 flex h-8 items-center justify-between">
            <DatePickerPrev
              :aria-label="props.previousButtonLabel"
              class="box-border inline-flex size-7 cursor-pointer appearance-none items-center justify-center rounded-lg border border-slate-300 bg-gradient-to-b from-white to-slate-100 p-0 text-xs font-medium leading-none text-slate-900 shadow-xs outline-none transition-[filter,transform,box-shadow] duration-150 hover:brightness-105 hover:shadow-md focus-visible:ring-2 focus-visible:ring-slate-500/40 focus-visible:ring-offset-2 active:translate-y-px active:brightness-95 active:shadow-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50">
              <ChevronLeftIcon class="size-3.5" aria-hidden="true" />
            </DatePickerPrev>
            <DatePickerHeading class="px-2 text-sm font-semibold text-slate-800" />
            <DatePickerNext
              :aria-label="props.nextButtonLabel"
              class="box-border inline-flex size-7 cursor-pointer appearance-none items-center justify-center rounded-lg border border-slate-300 bg-gradient-to-b from-white to-slate-100 p-0 text-xs font-medium leading-none text-slate-900 shadow-xs outline-none transition-[filter,transform,box-shadow] duration-150 hover:brightness-105 hover:shadow-md focus-visible:ring-2 focus-visible:ring-slate-500/40 focus-visible:ring-offset-2 active:translate-y-px active:brightness-95 active:shadow-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50">
              <ChevronRightIcon class="size-3.5" aria-hidden="true" />
            </DatePickerNext>
          </DatePickerHeader>

          <div class="grid gap-4" :style="{ gridTemplateColumns: `repeat(${props.numberOfMonths}, minmax(15.75rem, 1fr))` }">
            <DatePickerGrid v-for="month in grid" :key="month.value.toString()" class="w-full border-collapse select-none">
              <DatePickerGridHead>
                <DatePickerGridRow class="grid grid-cols-7">
                  <DatePickerHeadCell
                    v-for="weekDay in weekDays"
                    :key="weekDay"
                    class="flex h-7 items-center justify-center text-[0.6875rem] font-medium uppercase tracking-wide text-slate-400">
                    {{ weekDay }}
                  </DatePickerHeadCell>
                </DatePickerGridRow>
              </DatePickerGridHead>
              <DatePickerGridBody class="mt-1 grid gap-0.5">
                <DatePickerGridRow v-for="(week, weekIndex) in month.rows" :key="weekIndex" class="grid grid-cols-7 gap-0.5">
                  <DatePickerCell v-for="date in week" :key="date.toString()" :date="date" class="relative flex size-8 items-center justify-center">
                    <DatePickerCellTrigger
                      v-slot="dayState"
                      :day="date"
                      :month="month.value"
                      class="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-xs tabular-nums text-slate-700 outline-none transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-blue-500/30 data-[outside-view]:text-slate-300 data-[today]:font-semibold data-[today]:text-blue-600 data-[selected]:bg-blue-600 data-[selected]:font-semibold data-[selected]:!text-white data-[selected]:hover:bg-blue-700 data-[selected]:hover:!text-white data-[disabled]:cursor-not-allowed data-[disabled]:text-slate-200 data-[disabled]:hover:bg-transparent data-[unavailable]:cursor-not-allowed data-[unavailable]:text-slate-300 data-[unavailable]:line-through data-[unavailable]:hover:bg-transparent">
                      <slot
                        name="day"
                        :date="date"
                        :day-value="dayState.dayValue"
                        :disabled="dayState.disabled"
                        :selected="dayState.selected"
                        :today="dayState.today"
                        :outside-view="dayState.outsideView"
                        :unavailable="dayState.unavailable">
                        {{ dayState.dayValue }}
                      </slot>
                    </DatePickerCellTrigger>
                  </DatePickerCell>
                </DatePickerGridRow>
              </DatePickerGridBody>
            </DatePickerGrid>
          </div>
        </DatePickerCalendar>
      </DatePickerContent>
    </DatePickerRoot>

    <p v-if="props.description" :id="descriptionId" class="mt-1.5 text-xs leading-snug text-slate-500">
      {{ props.description }}
    </p>
    <p v-if="props.error" :id="errorId" class="mt-1.5 text-xs leading-snug text-red-600">
      {{ props.error }}
    </p>
  </div>
</template>
