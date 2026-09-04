import type { DateValue } from '@internationalized/date'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { getDayOfWeek, parseDate } from '@internationalized/date'
import { computed, ref, shallowRef, watch } from 'vue'
import DateRangePicker, {
  type DateRangePickerProps,
  type DateRangePickerValue
} from './DateRangePicker.vue'

const sizes = ['small', 'medium', 'large'] as const
const weekdayFormats = ['narrow', 'short', 'long'] as const
const sides = ['top', 'right', 'bottom', 'left'] as const
const alignments = ['start', 'center', 'end'] as const

interface DateRangePickerStoryArgs extends DateRangePickerProps {
  'onUpdate:modelValue'?: (value: DateRangePickerValue) => void
  'onUpdate:open'?: (open: boolean) => void
  'onUpdate:placeholderValue'?: (value: DateValue) => void
  'onUpdate:startValue'?: (value: DateValue | undefined) => void
  onClear?: () => void
}

const selectedRange = (): DateRangePickerValue => ({
  start: parseDate('2026-09-15'),
  end: parseDate('2026-09-22')
})

const meta = {
  title: 'Components/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Seletor de intervalo baseado no Date Range Picker do Reka UI. Oferece edição segmentada das datas inicial e final, seleção contínua no calendário, navegação por teclado e integração com formulários.

O valor usa \`DateValue\` de \`@internationalized/date\` nas duas extremidades:

\`\`\`vue
<script setup lang="ts">
import { parseDate } from '@internationalized/date'
import { shallowRef } from 'vue'

const period = shallowRef({
  start: parseDate('2026-09-15'),
  end: parseDate('2026-09-22')
})
</script>

<DateRangePicker v-model="period" label="Período" />
\`\`\`
        `
      }
    }
  },
  argTypes: {
    modelValue: { control: false, description: 'Intervalo selecionado. Use com v-model.', table: { type: { summary: 'DateRangePickerValue' } } },
    defaultValue: { control: false, description: 'Intervalo inicial quando modelValue não é fornecido.' },
    placeholderValue: { control: false, description: 'Mês exibido. Use com v-model:placeholder-value.' },
    defaultPlaceholderValue: { control: false, description: 'Mês inicial exibido sem uma seleção.' },
    label: { control: 'text', description: 'Label visível associado ao campo.' },
    description: { control: 'text', description: 'Texto de apoio abaixo do campo.' },
    error: { control: 'text', description: 'Mensagem que também ativa o estado inválido.' },
    invalid: { control: 'boolean', description: 'Ativa o estado inválido.', table: { defaultValue: { summary: 'false' } } },
    size: { control: 'select', options: sizes, description: 'Altura e tipografia.', table: { defaultValue: { summary: 'medium' } } },
    id: { control: 'text', description: 'Identificador do campo.' },
    ariaLabel: { control: 'text', description: 'Nome acessível usado sem label visível.' },
    name: { control: 'text', description: 'Nome enviado com o formulário.' },
    locale: { control: 'text', description: 'Locale de formatação.', table: { defaultValue: { summary: 'pt-BR' } } },
    minValue: { control: false, description: 'Menor data selecionável.' },
    maxValue: { control: false, description: 'Maior data selecionável.' },
    isDateDisabled: { control: false, description: 'Callback que desabilita datas.' },
    isDateUnavailable: { control: false, description: 'Callback que marca datas indisponíveis.' },
    isDateHighlightable: { control: false, description: 'Callback que limita o destaque provisório.' },
    allowNonContiguousRanges: { control: 'boolean', description: 'Permite incluir datas indisponíveis no intervalo.', table: { defaultValue: { summary: 'false' } } },
    fixedDate: { control: 'select', options: [undefined, 'start', 'end'], description: 'Mantém uma extremidade fixa durante a edição.' },
    maximumDays: { control: { type: 'number', min: 1, max: 365 }, description: 'Quantidade máxima de dias no intervalo.' },
    required: { control: 'boolean', description: 'Marca o campo como obrigatório.', table: { defaultValue: { summary: 'false' } } },
    disabled: { control: 'boolean', description: 'Desabilita o campo.', table: { defaultValue: { summary: 'false' } } },
    readonly: { control: 'boolean', description: 'Impede alterações preservando o valor.', table: { defaultValue: { summary: 'false' } } },
    clearable: { control: 'boolean', description: 'Exibe a ação de limpar.', table: { defaultValue: { summary: 'false' } } },
    clearLabel: { control: 'text', description: 'Nome acessível da ação de limpar.', table: { defaultValue: { summary: 'Limpar período' } } },
    calendarButtonLabel: { control: 'text', description: 'Nome acessível do botão do calendário.', table: { defaultValue: { summary: 'Abrir calendário de período' } } },
    previousButtonLabel: { control: 'text', description: 'Nome acessível da navegação anterior.', table: { defaultValue: { summary: 'Período anterior' } } },
    nextButtonLabel: { control: 'text', description: 'Nome acessível da próxima navegação.', table: { defaultValue: { summary: 'Próximo período' } } },
    open: { control: false, description: 'Estado controlado do popover. Use com v-model:open.' },
    defaultOpen: { control: 'boolean', description: 'Estado inicial de abertura.', table: { defaultValue: { summary: 'false' } } },
    modal: { control: 'boolean', description: 'Bloqueia interação externa enquanto aberto.', table: { defaultValue: { summary: 'false' } } },
    closeOnSelect: { control: 'boolean', description: 'Fecha após selecionar as duas extremidades.', table: { defaultValue: { summary: 'true' } } },
    preventDeselect: { control: 'boolean', description: 'Impede remover a seleção sem escolher outra.', table: { defaultValue: { summary: 'true' } } },
    weekStartsOn: { control: 'select', options: [undefined, 0, 1, 2, 3, 4, 5, 6], description: 'Primeiro dia da semana; segue o locale por padrão.' },
    weekdayFormat: { control: 'select', options: weekdayFormats, description: 'Formato dos dias da semana.', table: { defaultValue: { summary: 'short' } } },
    fixedWeeks: { control: 'boolean', description: 'Mantém seis semanas no calendário.', table: { defaultValue: { summary: 'true' } } },
    numberOfMonths: { control: { type: 'number', min: 1, max: 3 }, description: 'Quantidade de meses visíveis.', table: { defaultValue: { summary: '2' } } },
    pagedNavigation: { control: 'boolean', description: 'Navega pela quantidade de meses visíveis.', table: { defaultValue: { summary: 'true' } } },
    side: { control: 'select', options: sides, description: 'Lado preferido do calendário.', table: { defaultValue: { summary: 'bottom' } } },
    align: { control: 'select', options: alignments, description: 'Alinhamento com o campo.', table: { defaultValue: { summary: 'start' } } },
    sideOffset: { control: { type: 'number', min: 0, max: 24 }, description: 'Distância entre campo e calendário.', table: { defaultValue: { summary: '6' } } },
    collisionPadding: { control: { type: 'number', min: 0, max: 32 }, description: 'Distância mínima da viewport.', table: { defaultValue: { summary: '8' } } },
    day: { control: false, description: 'Personaliza o conteúdo dos dias.', table: { category: 'Slots', type: { summary: 'Vue slot' } } },
    'onUpdate:modelValue': { action: 'update:modelValue', description: 'Emitido quando o intervalo muda.' },
    'onUpdate:open': { action: 'update:open', description: 'Emitido quando o calendário abre ou fecha.' },
    'onUpdate:placeholderValue': { action: 'update:placeholderValue', description: 'Emitido quando o mês exibido muda.' },
    'onUpdate:startValue': { action: 'update:startValue', description: 'Emitido ao escolher o início provisório.' },
    onClear: { action: 'clear', description: 'Emitido após limpar o intervalo.' }
  },
  args: {
    modelValue: selectedRange(),
    label: 'Período da reserva',
    description: 'Escolha as datas de entrada e saída.',
    invalid: false,
    size: 'medium',
    locale: 'pt-BR',
    allowNonContiguousRanges: false,
    required: false,
    disabled: false,
    readonly: false,
    clearable: true,
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
  },
  decorators: [
    () => ({ template: '<div class="w-96 max-w-[90vw]"><story /></div>' })
  ],
  render: (args: DateRangePickerStoryArgs) => ({
    components: { DateRangePicker },
    setup() {
      const value = shallowRef(args.modelValue ?? { start: undefined, end: undefined })
      const open = ref(args.open)
      const placeholderValue = shallowRef(args.placeholderValue)
      const forwardedArgs = computed(() => {
        const result = { ...args }
        delete result.modelValue
        delete result.open
        delete result.placeholderValue
        delete result['onUpdate:modelValue']
        delete result['onUpdate:open']
        delete result['onUpdate:placeholderValue']
        delete result['onUpdate:startValue']
        delete result.onClear
        return result
      })
      watch(() => args.modelValue, next => { if (next) value.value = next })
      watch(() => args.open, next => open.value = next)
      watch(() => args.placeholderValue, next => placeholderValue.value = next)
      return { args, forwardedArgs, open, placeholderValue, value }
    },
    template: `
      <DateRangePicker
        v-bind="forwardedArgs"
        v-model="value"
        v-model:open="open"
        v-model:placeholder-value="placeholderValue"
        @update:model-value="args['onUpdate:modelValue']"
        @update:open="args['onUpdate:open']"
        @update:placeholder-value="args['onUpdate:placeholderValue']"
        @update:start-value="args['onUpdate:startValue']"
        @clear="args.onClear" />
    `
  })
} as Meta<DateRangePickerStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sizes: Story = {
  render: () => ({
    components: { DateRangePicker },
    setup: () => ({ range: selectedRange(), sizes }),
    template: `
      <div class="flex flex-col gap-5">
        <DateRangePicker v-for="size in sizes" :key="size" :model-value="range" :size="size" :label="size" :number-of-months="1" />
      </div>
    `
  })
}

export const States: Story = {
  render: () => ({
    components: { DateRangePicker },
    setup: () => ({ empty: shallowRef<DateRangePickerValue>({ start: undefined, end: undefined }), range: selectedRange() }),
    template: `
      <div class="flex flex-col gap-5">
        <DateRangePicker v-model="empty" label="Sem período" :number-of-months="1" />
        <DateRangePicker :model-value="range" label="Somente leitura" readonly :number-of-months="1" />
        <DateRangePicker :model-value="range" label="Desabilitado" disabled :number-of-months="1" />
        <DateRangePicker :model-value="range" label="Com erro" error="Selecione um período permitido." :number-of-months="1" />
      </div>
    `
  })
}

export const BookingRules: Story = {
  render: () => ({
    components: { DateRangePicker },
    setup() {
      const placeholder = parseDate('2026-09-01')
      const minValue = parseDate('2026-09-01')
      const maxValue = parseDate('2026-10-31')
      const isDateDisabled = (date: DateValue) => getDayOfWeek(date, 'pt-BR') === 0
      const isDateUnavailable = (date: DateValue) => date.month === 9 && [7, 21, 22].includes(date.day)
      return { isDateDisabled, isDateUnavailable, maxValue, minValue, placeholder }
    },
    template: `
      <DateRangePicker
        :default-placeholder-value="placeholder"
        :min-value="minValue"
        :max-value="maxValue"
        :is-date-disabled="isDateDisabled"
        :is-date-unavailable="isDateUnavailable"
        :maximum-days="14"
        label="Período da estadia"
        description="Até 14 dias; domingos e datas ocupadas não podem ser selecionados."
        default-open />
    `
  }),
  parameters: { docs: { disable: true } }
}
