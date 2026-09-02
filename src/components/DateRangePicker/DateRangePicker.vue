<script lang="ts">
import type { DateValue } from '@internationalized/date'
import type {
  DatePickerAlign,
  DatePickerMatcher,
  DatePickerSide,
  DatePickerSize,
  DatePickerWeekdayFormat,
  DatePickerWeekStartsOn
} from '../DatePicker/DatePicker.vue'

export type DateRangePickerSize = DatePickerSize
export type DateRangePickerAlign = DatePickerAlign
export type DateRangePickerSide = DatePickerSide
export type DateRangePickerWeekdayFormat = DatePickerWeekdayFormat
export type DateRangePickerWeekStartsOn = DatePickerWeekStartsOn
export type DateRangePickerMatcher = DatePickerMatcher
export type DateRangePickerFixedDate = 'start' | 'end'

export interface DateRangePickerValue {
  start: DateValue | undefined
  end: DateValue | undefined
}

export interface DateRangePickerDaySlotProps {
  date: DateValue
  dayValue: string
  disabled: boolean
  selected: boolean
  today: boolean
  outsideView: boolean
  unavailable: boolean
  highlighted: boolean
  selectionStart: boolean
  selectionEnd: boolean
}

export interface DateRangePickerProps {
  /** Selected date range. Supports v-model. */
  modelValue?: DateRangePickerValue
  /** Initial range when modelValue is not provided. */
  defaultValue?: DateRangePickerValue
  /** Month currently displayed. Supports v-model:placeholder-value. */
  placeholderValue?: DateValue
  /** Initial displayed month when there is no selected range. */
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
  size?: DateRangePickerSize
  /** Identifier used to associate the label and supporting text. */
  id?: string
  /** Accessible label used when there is no visible label. */
  ariaLabel?: string
  /** Name submitted with the surrounding form. */
  name?: string
  /** Locale used to format the field and calendar. */
  locale?: string
  /** Earliest selectable date. */
  minValue?: DateValue
  /** Latest selectable date. */
  maxValue?: DateValue
  /** Returns true for dates that cannot receive focus or be selected. */
  isDateDisabled?: DateRangePickerMatcher
  /** Returns true for dates rendered as unavailable. */
  isDateUnavailable?: DateRangePickerMatcher
  /** Returns true for dates that may be highlighted while choosing an end date. */
  isDateHighlightable?: DateRangePickerMatcher
  /** Allows a range to contain unavailable dates. */
  allowNonContiguousRanges?: boolean
  /** Keeps one endpoint fixed when the range is edited. */
  fixedDate?: DateRangePickerFixedDate
  /** Maximum number of days allowed in the range. */
  maximumDays?: number
  /** Marks the field as required. */
  required?: boolean
  /** Prevents interaction and form submission. */
  disabled?: boolean
  /** Prevents editing while keeping the value focusable and submittable. */
  readonly?: boolean
  /** Displays a clear action when either endpoint exists. */
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
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Blocks interaction outside the popover while open. */
  modal?: boolean
  /** Closes the calendar when both endpoints are selected. */
  closeOnSelect?: boolean
  /** Prevents deselecting the range without choosing another. */
  preventDeselect?: boolean
  /** First day of the week. Defaults to the locale convention. */
  weekStartsOn?: DateRangePickerWeekStartsOn
  /** Format used for weekday labels. */
  weekdayFormat?: DateRangePickerWeekdayFormat
  /** Always renders six weeks. */
  fixedWeeks?: boolean
  /** Number of consecutive months displayed. */
  numberOfMonths?: number
  /** Navigates by numberOfMonths. */
  pagedNavigation?: boolean
  /** Preferred side where the calendar opens. */
  side?: DateRangePickerSide
  /** Alignment of the calendar relative to the field. */
  align?: DateRangePickerAlign
  /** Distance in pixels between field and calendar. */
  sideOffset?: number
  /** Minimum distance in pixels from viewport boundaries. */
  collisionPadding?: number
}
</script>

<script setup lang="ts">
import { computed, shallowRef, useId, watch } from 'vue'
import {
  DateRangePickerCalendar,
  DateRangePickerCell,
  DateRangePickerCellTrigger,
  DateRangePickerContent,
  DateRangePickerField,
  DateRangePickerGrid,
  DateRangePickerGridBody,
  DateRangePickerGridHead,
  DateRangePickerGridRow,
  DateRangePickerHeadCell,
  DateRangePickerHeader,
  DateRangePickerHeading,
  DateRangePickerInput,
  DateRangePickerNext,
  DateRangePickerPrev,
  DateRangePickerRoot,
  DateRangePickerTrigger
} from 'reka-ui'
import { CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon, XIcon } from '../../icons'
import { controlHeightClasses } from '../controlSize'
import { usePortalLayer } from '../portalLayer'

const emptyRange = (): DateRangePickerValue => ({ start: undefined, end: undefined })

const props = withDefaults(defineProps<DateRangePickerProps>(), {
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
  isDateHighlightable: undefined,
  allowNonContiguousRanges: false,
  fixedDate: undefined,
  maximumDays: undefined,
  required: false,
  disabled: false,
  readonly: false,
  clearable: false,
  clearLabel: 'Limpar período',
  calendarButtonLabel: 'Abrir calendário de período',
  previousButtonLabel: 'Período anterior',
  nextButtonLabel: 'Próximo período',
  open: undefined,
  defaultOpen: false,
  modal: false,
  closeOnSelect: true,
  preventDeselect: true,
  weekStartsOn: undefined,
  weekdayFormat: 'short',
  fixedWeeks: true,
  numberOfMonths: 2,
  pagedNavigation: true,
  side: 'bottom',
  align: 'start',
  sideOffset: 6,
  collisionPadding: 8
})

const emit = defineEmits<{
  'update:modelValue': [value: DateRangePickerValue]
  'update:open': [open: boolean]
  'update:placeholderValue': [value: DateValue]
  'update:startValue': [value: DateValue | undefined]
  clear: []
}>()

defineSlots<{
  /** Custom content for a calendar day. */
  day?: (props: DateRangePickerDaySlotProps) => unknown
}>()

const generatedId = useId()
const fieldId = computed(() => props.id ?? `date-range-picker-${generatedId}`)
const labelId = computed(() => `${fieldId.value}-label`)
const descriptionId = computed(() => `${fieldId.value}-description`)
const errorId = computed(() => `${fieldId.value}-error`)
const isInvalid = computed(() => props.invalid || Boolean(props.error))
const currentValue = shallowRef<DateRangePickerValue>(props.modelValue ?? props.defaultValue ?? emptyRange())
const currentPlaceholder = shallowRef<DateValue | undefined>(props.placeholderValue ?? props.defaultPlaceholderValue)
const layerOpen = shallowRef(props.open ?? props.defaultOpen)
const { contentLayerStyle } = usePortalLayer('floating', layerOpen)
const hasValue = computed(() => Boolean(currentValue.value.start || currentValue.value.end))
const describedBy = computed(() => [
  props.description ? descriptionId.value : '',
  props.error ? errorId.value : ''
].filter(Boolean).join(' ') || undefined)

const fieldSizeClasses: Record<DateRangePickerSize, string> = {
  small: 'px-2 text-xs',
  medium: 'px-2.5 text-sm',
  large: 'px-3 text-base'
}

const iconButtonClasses: Record<DateRangePickerSize, string> = {
  small: 'size-6 [&>svg]:size-3.5',
  medium: 'size-7 [&>svg]:size-4',
  large: 'size-9 [&>svg]:size-4.5'
}

watch(() => props.modelValue, value => {
  if (value)
    currentValue.value = value
})
watch(() => props.placeholderValue, value => currentPlaceholder.value = value)
watch(() => props.open, (open) => {
  if (open !== undefined)
    layerOpen.value = open
})

function updateValue(value: DateRangePickerValue) {
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
  updateValue(emptyRange())
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

    <DateRangePickerRoot
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
      :is-date-highlightable="props.isDateHighlightable"
      :allow-non-contiguous-ranges="props.allowNonContiguousRanges"
      :fixed-date="props.fixedDate"
      :maximum-days="props.maximumDays"
      :close-on-select="props.closeOnSelect"
      :prevent-deselect="props.preventDeselect"
      :week-starts-on="props.weekStartsOn"
      :weekday-format="props.weekdayFormat"
      :fixed-weeks="props.fixedWeeks"
      :number-of-months="props.numberOfMonths"
      :paged-navigation="props.pagedNavigation"
      @update:model-value="updateValue"
      @update:placeholder="updatePlaceholder"
      @update:start-value="emit('update:startValue', $event)"
      @update:open="updateOpen">
      <DateRangePickerField
        :aria-label="props.label ? undefined : props.ariaLabel"
        :aria-labelledby="props.label ? labelId : undefined"
        :aria-describedby="describedBy"
        :aria-invalid="isInvalid || undefined"
        :aria-required="props.required || undefined"
        class="box-border flex w-full min-w-0 items-center rounded-lg border bg-white text-slate-800 shadow-xs outline-none transition-[border-color,box-shadow,background-color] duration-150 hover:border-slate-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 data-[disabled]:cursor-not-allowed data-[disabled]:border-slate-200 data-[disabled]:bg-slate-50 data-[disabled]:text-slate-300 data-[readonly]:bg-slate-50"
        :class="[
          controlHeightClasses[props.size],
          fieldSizeClasses[props.size],
          isInvalid ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20' : 'border-slate-300'
        ]">
        <template #default="{ segments }">
          <div class="flex min-w-0 flex-1 items-center overflow-hidden whitespace-nowrap">
            <div class="flex min-w-0 items-center">
              <DateRangePickerInput
                v-for="segment in segments.start"
                :key="`start-${segment.part}`"
                type="start"
                :part="segment.part"
                class="rounded-sm px-0.5 tabular-nums outline-none data-[placeholder]:text-slate-400 data-[disabled]:text-slate-300 data-[invalid]:text-red-600 focus:bg-blue-50 focus:text-blue-700">
                {{ segment.value }}
              </DateRangePickerInput>
            </div>
            <span class="mx-1 text-slate-400" aria-hidden="true">–</span>
            <div class="flex min-w-0 items-center">
              <DateRangePickerInput
                v-for="segment in segments.end"
                :key="`end-${segment.part}`"
                type="end"
                :part="segment.part"
                class="rounded-sm px-0.5 tabular-nums outline-none data-[placeholder]:text-slate-400 data-[disabled]:text-slate-300 data-[invalid]:text-red-600 focus:bg-blue-50 focus:text-blue-700">
                {{ segment.value }}
              </DateRangePickerInput>
            </div>
          </div>

          <button
            v-if="props.clearable && hasValue && !props.disabled && !props.readonly"
            type="button"
            :aria-label="props.clearLabel"
            class="inline-flex shrink-0 cursor-pointer appearance-none items-center justify-center rounded-md border-0 bg-transparent p-0 text-slate-400 outline-none transition-colors hover:text-slate-800 focus-visible:ring-2 focus-visible:ring-blue-500/30"
            :class="iconButtonClasses[props.size]"
            @click.stop="clearValue">
            <XIcon aria-hidden="true" />
          </button>

          <DateRangePickerTrigger
            :aria-label="props.calendarButtonLabel"
            class="inline-flex shrink-0 cursor-pointer appearance-none items-center justify-center rounded-md border-0 bg-transparent p-0 text-slate-400 outline-none transition-colors hover:text-slate-800 focus-visible:ring-2 focus-visible:ring-blue-500/30 disabled:cursor-not-allowed disabled:text-slate-200"
            :class="iconButtonClasses[props.size]">
            <CalendarDaysIcon aria-hidden="true" />
          </DateRangePickerTrigger>
        </template>
      </DateRangePickerField>

      <DateRangePickerContent
        :side="props.side"
        :align="props.align"
        :side-offset="props.sideOffset"
        :collision-padding="props.collisionPadding"
        :style="contentLayerStyle"
        class="max-h-[var(--reka-popper-available-height)] max-w-[calc(100vw-1rem)] overflow-auto rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 shadow-lg outline-none">
        <DateRangePickerCalendar v-slot="{ weekDays, grid }">
          <DateRangePickerHeader class="relative mb-3 flex h-8 items-center justify-between">
            <DateRangePickerPrev
              :aria-label="props.previousButtonLabel"
              class="box-border inline-flex size-7 cursor-pointer appearance-none items-center justify-center rounded-lg border border-slate-300 bg-gradient-to-b from-white to-slate-100 p-0 text-xs font-medium leading-none text-slate-900 shadow-xs outline-none transition-[filter,transform,box-shadow] duration-150 hover:brightness-105 hover:shadow-md focus-visible:ring-2 focus-visible:ring-slate-500/40 focus-visible:ring-offset-2 active:translate-y-px active:brightness-95 active:shadow-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50">
              <ChevronLeftIcon class="size-3.5" aria-hidden="true" />
            </DateRangePickerPrev>
            <DateRangePickerHeading class="px-2 text-sm font-semibold text-slate-800" />
            <DateRangePickerNext
              :aria-label="props.nextButtonLabel"
              class="box-border inline-flex size-7 cursor-pointer appearance-none items-center justify-center rounded-lg border border-slate-300 bg-gradient-to-b from-white to-slate-100 p-0 text-xs font-medium leading-none text-slate-900 shadow-xs outline-none transition-[filter,transform,box-shadow] duration-150 hover:brightness-105 hover:shadow-md focus-visible:ring-2 focus-visible:ring-slate-500/40 focus-visible:ring-offset-2 active:translate-y-px active:brightness-95 active:shadow-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50">
              <ChevronRightIcon class="size-3.5" aria-hidden="true" />
            </DateRangePickerNext>
          </DateRangePickerHeader>

          <div class="grid gap-4" :style="{ gridTemplateColumns: `repeat(${props.numberOfMonths}, minmax(15.75rem, 1fr))` }">
            <DateRangePickerGrid v-for="month in grid" :key="month.value.toString()" class="w-full border-collapse select-none">
              <DateRangePickerGridHead>
                <DateRangePickerGridRow class="grid grid-cols-7">
                  <DateRangePickerHeadCell
                    v-for="weekDay in weekDays"
                    :key="weekDay"
                    class="flex h-7 items-center justify-center text-[0.6875rem] font-medium uppercase tracking-wide text-slate-400">
                    {{ weekDay }}
                  </DateRangePickerHeadCell>
                </DateRangePickerGridRow>
              </DateRangePickerGridHead>
              <DateRangePickerGridBody class="mt-1 grid gap-0.5">
                <DateRangePickerGridRow v-for="(week, weekIndex) in month.rows" :key="weekIndex" class="grid grid-cols-7">
                  <DateRangePickerCell v-for="date in week" :key="date.toString()" :date="date" class="relative flex size-8 items-center justify-center">
                    <DateRangePickerCellTrigger
                      v-slot="dayState"
                      :day="date"
                      :month="month.value"
                      class="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-xs tabular-nums text-slate-700 outline-none transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-blue-500/30 data-[outside-view]:text-slate-300 data-[today]:font-semibold data-[today]:text-blue-600 data-[highlighted]:rounded-none data-[highlighted]:bg-blue-50 data-[selected]:rounded-none data-[selected]:bg-blue-50 data-[selected]:font-medium data-[selected]:text-blue-700 data-[selection-start]:!rounded-l-lg data-[selection-start]:!bg-blue-600 data-[selection-start]:!font-semibold data-[selection-start]:!text-white data-[selection-end]:!rounded-r-lg data-[selection-end]:!bg-blue-600 data-[selection-end]:!font-semibold data-[selection-end]:!text-white data-[selection-start][data-selection-end]:!rounded-lg data-[disabled]:cursor-not-allowed data-[disabled]:text-slate-200 data-[disabled]:hover:bg-transparent data-[unavailable]:cursor-not-allowed data-[unavailable]:text-slate-300 data-[unavailable]:line-through data-[unavailable]:hover:bg-transparent">
                      <slot
                        name="day"
                        :date="date"
                        :day-value="dayState.dayValue"
                        :disabled="dayState.disabled"
                        :selected="dayState.selected"
                        :today="dayState.today"
                        :outside-view="dayState.outsideView"
                        :unavailable="dayState.unavailable"
                        :highlighted="dayState.highlighted"
                        :selection-start="dayState.selectionStart"
                        :selection-end="dayState.selectionEnd">
                        {{ dayState.dayValue }}
                      </slot>
                    </DateRangePickerCellTrigger>
                  </DateRangePickerCell>
                </DateRangePickerGridRow>
              </DateRangePickerGridBody>
            </DateRangePickerGrid>
          </div>
        </DateRangePickerCalendar>
      </DateRangePickerContent>
    </DateRangePickerRoot>

    <p v-if="props.description" :id="descriptionId" class="mt-1.5 text-xs leading-snug text-slate-500">{{ props.description }}</p>
    <p v-if="props.error" :id="errorId" class="mt-1.5 text-xs leading-snug text-red-600">{{ props.error }}</p>
  </div>
</template>
