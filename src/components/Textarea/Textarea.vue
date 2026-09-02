<script lang="ts">
export type TextareaSize = 'small' | 'medium' | 'large'
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both'

export interface TextareaProps {
  /** Current field value. In rich mode, the value is sanitized HTML. Supports v-model. */
  modelValue?: string
  /** Visible label associated with the field. */
  label?: string
  /** Supporting text displayed below the field. */
  description?: string
  /** Validation message displayed below the field. */
  error?: string
  /** Marks the field as invalid without requiring an error message. */
  invalid?: boolean
  /** Enables the rich-text toolbar and changes modelValue to sanitized HTML. */
  richText?: boolean
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
  /** Minimum number of accepted text characters. */
  minlength?: number
  /** Maximum number of accepted text characters. */
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
import { computed, nextTick, onMounted, ref, useId, watch } from 'vue'
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  RedoIcon,
  RemoveFormattingIcon,
  StrikethroughIcon,
  UnderlineIcon,
  UndoIcon
} from '../../icons'
import Button from '../Button/Button.vue'
import Dialog from '../Dialog/Dialog.vue'
import Input from '../Input/Input.vue'
import Select from '../Select/Select.vue'
import Toggle from '../Toggle/Toggle.vue'
import { normalizeRichText, plainTextToRichText, richTextToPlainText, sanitizeRichText } from './richText'

const props = withDefaults(defineProps<TextareaProps>(), {
  modelValue: '',
  label: undefined,
  description: undefined,
  error: undefined,
  invalid: false,
  richText: false,
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
const editorElement = ref<HTMLElement | null>(null)
const textareaId = computed(() => props.id ?? `textarea-${generatedId}`)
const descriptionId = computed(() => `${textareaId.value}-description`)
const errorId = computed(() => `${textareaId.value}-error`)
const isInvalid = computed(() => props.invalid || Boolean(props.error))
const describedBy = computed(() => [props.description ? descriptionId.value : '', props.error ? errorId.value : ''].filter(Boolean).join(' ') || undefined)
const editable = computed(() => !props.disabled && !props.readonly)
const editorMinHeight = computed(() => `${Math.max(2, props.rows) * 1.5 + (props.size === 'large' ? 1.25 : 1)}rem`)

type RichTextToggleCommand =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikeThrough'
  | 'insertUnorderedList'
  | 'insertOrderedList'
  | 'justifyLeft'
  | 'justifyCenter'
  | 'justifyRight'

const toggleCommands: RichTextToggleCommand[] = [
  'bold',
  'italic',
  'underline',
  'strikeThrough',
  'insertUnorderedList',
  'insertOrderedList',
  'justifyLeft',
  'justifyCenter',
  'justifyRight'
]

const activeCommands = ref<Record<RichTextToggleCommand, boolean>>({
  bold: false,
  italic: false,
  underline: false,
  strikeThrough: false,
  insertUnorderedList: false,
  insertOrderedList: false,
  justifyLeft: false,
  justifyCenter: false,
  justifyRight: false
})
const formatValue = ref<string>()
const fontSizeValue = ref<string>()
const linkDialogOpen = ref(false)
const linkHref = ref('')
const linkFormId = computed(() => `${textareaId.value}-link-form`)
const formatOptions = [
  { value: 'p', label: 'Normal' },
  { value: 'h2', label: 'Título' },
  { value: 'h3', label: 'Subtítulo' },
  { value: 'blockquote', label: 'Citação' }
]
const fontSizeOptions = [
  { value: '2', label: 'Pequeno' },
  { value: '3', label: 'Normal' },
  { value: '4', label: 'Grande' },
  { value: '5', label: 'Muito grande' }
]

const sizeClasses: Record<TextareaSize, string> = {
  small: 'min-h-16 px-2.5 py-1.5 text-xs',
  medium: 'min-h-20 px-3 py-2 text-sm',
  large: 'min-h-24 px-3.5 py-2.5 text-base'
}

const richSizeClasses: Record<TextareaSize, string> = {
  small: 'px-2.5 py-1.5 text-xs',
  medium: 'px-3 py-2 text-sm',
  large: 'px-3.5 py-2.5 text-base'
}

const resizeClasses: Record<TextareaResize, string> = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize'
}

let savedRange: Range | undefined
let lastAcceptedRichValue = ''
let richValueOnFocus = ''

function updateValue(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
  emit('input', event)
}

function normalizedRichValue(value: string) {
  const normalized = normalizeRichText(value)
  return richTextToPlainText(normalized).trim() ? normalized : ''
}

function syncEditor(value: string) {
  if (!editorElement.value)
    return
  const normalized = normalizedRichValue(value)
  lastAcceptedRichValue = normalized
  if (editorElement.value.innerHTML !== normalized)
    editorElement.value.innerHTML = normalized
}

function emitRichValue(event: Event) {
  if (!editorElement.value)
    return
  const sanitized = sanitizeRichText(editorElement.value.innerHTML)
  const value = richTextToPlainText(sanitized).trim() ? sanitized : ''
  if (props.maxlength !== undefined && richTextToPlainText(value).length > props.maxlength) {
    editorElement.value.innerHTML = lastAcceptedRichValue
    return
  }

  lastAcceptedRichValue = value
  if (editorElement.value.innerHTML !== value)
    editorElement.value.innerHTML = value
  emit('update:modelValue', value)
  emit('input', event)
}

function saveSelection() {
  const selection = window.getSelection()
  if (selection?.rangeCount && editorElement.value?.contains(selection.anchorNode))
    savedRange = selection.getRangeAt(0).cloneRange()
}

function updateToolbarState() {
  const selection = window.getSelection()
  if (!selection?.rangeCount || !editorElement.value?.contains(selection.anchorNode))
    return

  for (const commandName of toggleCommands)
    activeCommands.value[commandName] = document.queryCommandState(commandName)

  const currentFormat = String(document.queryCommandValue('formatBlock')).toLowerCase().replace(/[<>]/g, '')
  const currentFontSize = String(document.queryCommandValue('fontSize'))
  formatValue.value = formatOptions.some(option => option.value === currentFormat) ? currentFormat : undefined
  fontSizeValue.value = fontSizeOptions.some(option => option.value === currentFontSize) ? currentFontSize : undefined
}

function handleSelectionChange() {
  saveSelection()
  updateToolbarState()
}

function restoreSelection() {
  if (!savedRange)
    return
  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(savedRange)
}

function command(name: string, value?: string) {
  if (!editable.value)
    return
  editorElement.value?.focus()
  restoreSelection()
  document.execCommand(name, false, value)
  saveSelection()
  emitRichValue(new Event('input', { bubbles: true }))
  updateToolbarState()
}

function changeFormat(value: string) {
  command('formatBlock', value)
}

function changeSize(value: string) {
  command('fontSize', value)
}

function changeColor(event: Event) {
  command('foreColor', (event.target as HTMLInputElement).value)
}

function selectedLinkHref() {
  const selection = window.getSelection()
  const selectedNode = selection?.anchorNode
  const selectedElement = selectedNode instanceof Element ? selectedNode : selectedNode?.parentElement
  const link = selectedElement?.closest('a')
  return link && editorElement.value?.contains(link) ? link.getAttribute('href') ?? '' : ''
}

function openLinkDialog() {
  if (!editable.value)
    return
  saveSelection()
  linkHref.value = selectedLinkHref()
  linkDialogOpen.value = true
}

function confirmLink() {
  const href = linkHref.value.trim()
  if (!href)
    return
  command('createLink', href)
  linkDialogOpen.value = false
}

function handlePaste(event: ClipboardEvent) {
  if (!editable.value)
    return
  event.preventDefault()
  const html = event.clipboardData?.getData('text/html')
  const text = event.clipboardData?.getData('text/plain') ?? ''
  command('insertHTML', html ? sanitizeRichText(html) : plainTextToRichText(text))
}

function handleRichFocus(event: FocusEvent) {
  richValueOnFocus = props.modelValue
  updateToolbarState()
  emit('focus', event)
}

function handleRichBlur(event: FocusEvent) {
  emit('blur', event)
  if (props.modelValue !== richValueOnFocus)
    emit('change', event)
}

function selectContent() {
  if (textareaElement.value) {
    textareaElement.value.select()
    return
  }
  if (!editorElement.value)
    return
  const range = document.createRange()
  range.selectNodeContents(editorElement.value)
  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
}

watch(() => props.modelValue, value => {
  if (props.richText)
    syncEditor(value)
})

watch(() => props.richText, async richText => {
  if (!richText)
    return
  await nextTick()
  syncEditor(props.modelValue)
})

onMounted(async () => {
  if (props.richText) {
    syncEditor(props.modelValue)
    if (props.autofocus) {
      await nextTick()
      editorElement.value?.focus()
    }
  }
})

defineExpose({
  focus: () => (props.richText ? editorElement.value : textareaElement.value)?.focus(),
  select: selectContent,
  textareaElement,
  editorElement
})
</script>

<template>
  <div class="min-w-0 w-full">
    <label v-if="props.label" :for="textareaId" class="mb-1.5 block text-sm font-medium text-slate-700">
      {{ props.label }}<span v-if="props.required" class="text-red-500" aria-hidden="true"> *</span>
    </label>

    <div
      v-if="props.richText"
      class="overflow-hidden rounded-lg border bg-white shadow-xs transition-[border-color,box-shadow,background-color] duration-150 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20"
      :class="[
        isInvalid ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20' : 'border-slate-300',
        props.disabled ? 'cursor-not-allowed border-slate-200 bg-slate-50' : ''
      ]">
      <input v-if="props.name" type="hidden" :name="props.name" :value="props.modelValue" :disabled="props.disabled">
      <div class="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-1.5" role="toolbar" :aria-label="`Formatação de ${props.label ?? props.ariaLabel ?? 'texto'}`">
        <Toggle :model-value="activeCommands.bold" size="small" icon-only title="Negrito" aria-label="Negrito" :disabled="!editable" @mousedown.prevent="saveSelection" @update:model-value="command('bold')"><template #icon><BoldIcon /></template></Toggle>
        <Toggle :model-value="activeCommands.italic" size="small" icon-only title="Itálico" aria-label="Itálico" :disabled="!editable" @mousedown.prevent="saveSelection" @update:model-value="command('italic')"><template #icon><ItalicIcon /></template></Toggle>
        <Toggle :model-value="activeCommands.underline" size="small" icon-only title="Sublinhado" aria-label="Sublinhado" :disabled="!editable" @mousedown.prevent="saveSelection" @update:model-value="command('underline')"><template #icon><UnderlineIcon /></template></Toggle>
        <Toggle :model-value="activeCommands.strikeThrough" size="small" icon-only title="Tachado" aria-label="Tachado" :disabled="!editable" @mousedown.prevent="saveSelection" @update:model-value="command('strikeThrough')"><template #icon><StrikethroughIcon /></template></Toggle>
        <span class="mx-0.5 h-5 w-px bg-slate-200" aria-hidden="true" />
        <Select
          :model-value="formatValue"
          :options="formatOptions"
          placeholder="Estilo"
          aria-label="Estilo do texto"
          size="small"
          class="w-28!"
          :disabled="!editable"
          @mousedown="saveSelection"
          @update:model-value="changeFormat" />
        <Select
          :model-value="fontSizeValue"
          :options="fontSizeOptions"
          placeholder="Tamanho"
          aria-label="Tamanho do texto"
          size="small"
          class="w-32!"
          :disabled="!editable"
          @mousedown="saveSelection"
          @update:model-value="changeSize" />
        <label class="toolbar-color" title="Cor do texto" :aria-disabled="!editable">
          <span class="font-semibold" aria-hidden="true">A</span><span class="absolute inset-x-2 bottom-1 h-0.5 bg-current" aria-hidden="true" />
          <input class="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed" type="color" value="#334155" aria-label="Cor do texto" :disabled="!editable" @mousedown="saveSelection" @change="changeColor">
        </label>
        <span class="mx-0.5 h-5 w-px bg-slate-200" aria-hidden="true" />
        <Toggle :model-value="activeCommands.insertUnorderedList" size="small" icon-only title="Lista com marcadores" aria-label="Lista com marcadores" :disabled="!editable" @mousedown.prevent="saveSelection" @update:model-value="command('insertUnorderedList')"><template #icon><ListIcon /></template></Toggle>
        <Toggle :model-value="activeCommands.insertOrderedList" size="small" icon-only title="Lista numerada" aria-label="Lista numerada" :disabled="!editable" @mousedown.prevent="saveSelection" @update:model-value="command('insertOrderedList')"><template #icon><ListOrderedIcon /></template></Toggle>
        <Toggle :model-value="activeCommands.justifyLeft" size="small" icon-only title="Alinhar à esquerda" aria-label="Alinhar à esquerda" :disabled="!editable" @mousedown.prevent="saveSelection" @update:model-value="command('justifyLeft')"><template #icon><AlignLeftIcon /></template></Toggle>
        <Toggle :model-value="activeCommands.justifyCenter" size="small" icon-only title="Centralizar" aria-label="Centralizar" :disabled="!editable" @mousedown.prevent="saveSelection" @update:model-value="command('justifyCenter')"><template #icon><AlignCenterIcon /></template></Toggle>
        <Toggle :model-value="activeCommands.justifyRight" size="small" icon-only title="Alinhar à direita" aria-label="Alinhar à direita" :disabled="!editable" @mousedown.prevent="saveSelection" @update:model-value="command('justifyRight')"><template #icon><AlignRightIcon /></template></Toggle>
        <Button variant="secondary" size="small" icon-only title="Adicionar link" aria-label="Adicionar link" :disabled="!editable" @mousedown.prevent="saveSelection" @click="openLinkDialog"><template #icon><LinkIcon /></template></Button>
        <Button variant="secondary" size="small" icon-only title="Limpar formatação" aria-label="Limpar formatação" :disabled="!editable" @mousedown.prevent="saveSelection" @click="command('removeFormat')"><template #icon><RemoveFormattingIcon /></template></Button>
        <Button variant="secondary" size="small" icon-only title="Desfazer" aria-label="Desfazer" :disabled="!editable" @mousedown.prevent="saveSelection" @click="command('undo')"><template #icon><UndoIcon /></template></Button>
        <Button variant="secondary" size="small" icon-only title="Refazer" aria-label="Refazer" :disabled="!editable" @mousedown.prevent="saveSelection" @click="command('redo')"><template #icon><RedoIcon /></template></Button>
      </div>
      <div
        :id="textareaId"
        ref="editorElement"
        class="rich-editor block w-full overflow-auto font-[inherit] text-slate-800 outline-none empty:before:pointer-events-none empty:before:text-slate-400 empty:before:content-[attr(data-placeholder)]"
        :class="[richSizeClasses[props.size], resizeClasses[props.resize], props.disabled ? 'text-slate-300' : props.readonly ? 'bg-slate-50 text-slate-500' : '']"
        :style="{ minHeight: editorMinHeight }"
        :contenteditable="editable"
        role="textbox"
        aria-multiline="true"
        :aria-label="props.ariaLabel ?? props.label"
        :aria-placeholder="props.placeholder"
        :aria-invalid="isInvalid"
        :aria-describedby="describedBy"
        :aria-required="props.required"
        :data-placeholder="props.placeholder"
        :spellcheck="props.spellcheck"
        @input="emitRichValue"
        @focus="handleRichFocus"
        @blur="handleRichBlur"
        @keyup="handleSelectionChange"
        @mouseup="handleSelectionChange"
        @paste="handlePaste" />

      <Dialog
        v-model:open="linkDialogOpen"
        title="Adicionar link"
        description="Informe o endereço para o qual o texto selecionado deve apontar."
        size="small">
        <form :id="linkFormId" @submit.prevent="confirmLink">
          <Input
            v-model="linkHref"
            type="url"
            label="Endereço do link"
            placeholder="https://exemplo.com"
            autocomplete="url"
            autofocus
            required />
        </form>
        <template #footer="{ close }">
          <div class="flex flex-wrap justify-end gap-3">
            <Button type="button" variant="secondary" @click="close">Cancelar</Button>
            <Button type="submit" :form="linkFormId" :disabled="!linkHref.trim()">Adicionar link</Button>
          </div>
        </template>
      </Dialog>
    </div>

    <textarea
      v-else
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
      :class="[sizeClasses[props.size], resizeClasses[props.resize], isInvalid ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-300']"
      @input="updateValue"
      @change="emit('change', $event)"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)" />
    <p v-if="props.description" :id="descriptionId" class="mt-1.5 text-xs leading-snug text-slate-500">{{ props.description }}</p>
    <p v-if="props.error" :id="errorId" class="mt-1.5 text-xs leading-snug text-red-600">{{ props.error }}</p>
  </div>
</template>

<style scoped>
.toolbar-color {
  appearance: none;
  position: relative;
  display: flex;
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-slate-300);
  border-radius: 0.5rem;
  background: linear-gradient(to bottom, white, var(--color-slate-100));
  padding: 0;
  color: var(--color-slate-900);
  box-shadow: var(--shadow-xs);
  font-size: 0.75rem;
  transition: filter 150ms, box-shadow 150ms;
}
.toolbar-color:hover { filter: brightness(1.05); box-shadow: var(--shadow-md); }
.toolbar-color:focus-within { outline: 2px solid color-mix(in srgb, var(--color-slate-500) 40%, transparent); outline-offset: 2px; }
.toolbar-color:has(input:disabled) { cursor: not-allowed; opacity: 0.5; }
.rich-editor :deep(p), .rich-editor :deep(div) { margin-block: 0.25rem; }
.rich-editor :deep(h2) { margin-block: 0.5rem 0.25rem; font-size: 1.25rem; font-weight: 600; line-height: 1.5; }
.rich-editor :deep(h3) { margin-block: 0.5rem 0.25rem; font-size: 1rem; font-weight: 600; line-height: 1.5; }
.rich-editor :deep(ul) { margin-block: 0.25rem; list-style: disc; padding-left: 1.5rem; }
.rich-editor :deep(ol) { margin-block: 0.25rem; list-style: decimal; padding-left: 1.5rem; }
.rich-editor :deep(blockquote) { margin-block: 0.5rem; border-left: 3px solid var(--color-slate-300); padding-left: 0.75rem; color: var(--color-slate-500); }
.rich-editor :deep(a) { color: var(--color-blue-600); text-decoration: underline; }
</style>
