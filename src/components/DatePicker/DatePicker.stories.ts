import type { DateValue } from '@internationalized/date'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { VNodeChild } from 'vue'
import { CalendarDate, getDayOfWeek, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { ref, shallowRef, watch } from 'vue'
import DatePicker, {
  type DatePickerDaySlotProps,
  type DatePickerProps
} from './DatePicker.vue'

const sizes = ['small', 'medium', 'large'] as const
const weekdayFormats = ['narrow', 'short', 'long'] as const
const sides = ['top', 'right', 'bottom', 'left'] as const
const alignments = ['start', 'center', 'end'] as const

interface DatePickerStoryArgs extends DatePickerProps {
  day?: VNodeChild | ((props: DatePickerDaySlotProps) => unknown)
  'onUpdate:modelValue'?: (value: DateValue | undefined) => void
  'onUpdate:open'?: (open: boolean) => void
  'onUpdate:placeholderValue'?: (value: DateValue) => void
  onClear?: () => void
}

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Seletor de data baseado no Date Picker do Reka UI, com campo segmentado, calendário em popover, navegação completa por teclado e integração com formulários.

O valor usa \`DateValue\` de \`@internationalized/date\`, evitando conversões implícitas de fuso horário. Para datas sem horário, crie um \`CalendarDate\` ou use \`parseDate\`.

\`\`\`vue
<script setup lang="ts">
import { parseDate } from '@internationalized/date'
import { shallowRef } from 'vue'

const deliveryDate = shallowRef(parseDate('2026-09-15'))
</script>

<DatePicker
  v-model="deliveryDate"
  label="Data de entrega"
  :min-value="parseDate('2026-09-01')"
  required
/>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    modelValue: {
      control: false,
      description: 'Data selecionada. Use com v-model.',
      table: { type: { summary: 'DateValue' } }
    },
    defaultValue: {
      control: false,
      description: 'Data inicial quando modelValue não é fornecido.',
      table: { type: { summary: 'DateValue' } }
    },
    placeholderValue: {
      control: false,
      description: 'Mês exibido no calendário. Use com v-model:placeholder-value.',
      table: { type: { summary: 'DateValue' } }
    },
    defaultPlaceholderValue: {
      control: false,
      description: 'Mês inicial exibido quando não há data selecionada.',
      table: { type: { summary: 'DateValue' } }
    },
    label: { control: 'text', description: 'Label visível associado ao campo.' },
    description: { control: 'text', description: 'Texto de apoio exibido abaixo do campo.' },
    error: { control: 'text', description: 'Mensagem que também ativa o estado inválido.' },
    invalid: {
      control: 'boolean',
      description: 'Ativa o estado inválido sem exigir uma mensagem.',
      table: { defaultValue: { summary: 'false' } }
    },
    size: {
      control: 'select',
      options: sizes,
      description: 'Altura e tipografia do campo.',
      table: { defaultValue: { summary: 'medium' } }
    },
    id: { control: 'text', description: 'Identificador do campo enviado ao formulário.' },
    ariaLabel: { control: 'text', description: 'Nome acessível usado na ausência de label visível.' },
    name: { control: 'text', description: 'Nome enviado com o formulário.' },
    locale: {
      control: 'text',
      description: 'Locale usado na formatação e nas convenções do calendário.',
      table: { defaultValue: { summary: 'pt-BR' } }
    },
    minValue: { control: false, description: 'Menor data selecionável.', table: { type: { summary: 'DateValue' } } },
    maxValue: { control: false, description: 'Maior data selecionável.', table: { type: { summary: 'DateValue' } } },
    isDateDisabled: { control: false, description: 'Callback que desabilita datas e remove seu foco.' },
    isDateUnavailable: { control: false, description: 'Callback que marca datas indisponíveis.' },
    required: {
      control: 'boolean',
      description: 'Marca o campo como obrigatório.',
      table: { defaultValue: { summary: 'false' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o campo e sua participação no formulário.',
      table: { defaultValue: { summary: 'false' } }
    },
    readonly: {
      control: 'boolean',
      description: 'Mantém o valor acessível e submittable, mas impede alterações.',
      table: { defaultValue: { summary: 'false' } }
    },
    clearable: {
      control: 'boolean',
      description: 'Exibe a ação de limpar quando existe uma data.',
      table: { defaultValue: { summary: 'false' } }
    },
    clearLabel: {
      control: 'text',
      description: 'Nome acessível da ação de limpar.',
      table: { defaultValue: { summary: 'Limpar data' } }
    },
    calendarButtonLabel: {
      control: 'text',
      description: 'Nome acessível do botão do calendário.',
      table: { defaultValue: { summary: 'Abrir calendário' } }
    },
    previousButtonLabel: {
      control: 'text',
      description: 'Nome acessível da navegação anterior.',
      table: { defaultValue: { summary: 'Mês anterior' } }
    },
    nextButtonLabel: {
      control: 'text',
      description: 'Nome acessível da próxima navegação.',
      table: { defaultValue: { summary: 'Próximo mês' } }
    },
    open: { control: false, description: 'Estado controlado do popover. Use com v-model:open.' },
    defaultOpen: {
      control: 'boolean',
      description: 'Estado inicial quando a abertura não é controlada.',
      table: { defaultValue: { summary: 'false' } }
    },
    modal: {
      control: 'boolean',
      description: 'Bloqueia a interação fora do calendário enquanto aberto.',
      table: { defaultValue: { summary: 'false' } }
    },
    closeOnSelect: {
      control: 'boolean',
      description: 'Fecha o calendário após selecionar uma data.',
      table: { defaultValue: { summary: 'true' } }
    },
    preventDeselect: {
      control: 'boolean',
      description: 'Impede remover a seleção clicando novamente na mesma data.',
      table: { defaultValue: { summary: 'true' } }
    },
    weekStartsOn: {
      control: 'select',
      options: [undefined, 0, 1, 2, 3, 4, 5, 6],
      description: 'Primeiro dia da semana; por padrão segue o locale.'
    },
    weekdayFormat: {
      control: 'select',
      options: weekdayFormats,
      description: 'Formato dos nomes dos dias da semana.',
      table: { defaultValue: { summary: 'short' } }
    },
    fixedWeeks: {
      control: 'boolean',
      description: 'Mantém seis semanas e estabiliza a altura do popover.',
      table: { defaultValue: { summary: 'true' } }
    },
    numberOfMonths: {
      control: { type: 'number', min: 1, max: 3, step: 1 },
      description: 'Quantidade de meses consecutivos.',
      table: { defaultValue: { summary: '1' } }
    },
    pagedNavigation: {
      control: 'boolean',
      description: 'Navega pela quantidade de meses visíveis.',
      table: { defaultValue: { summary: 'false' } }
    },
    side: {
      control: 'select',
      options: sides,
      description: 'Lado preferido para abrir o calendário.',
      table: { defaultValue: { summary: 'bottom' } }
    },
    align: {
      control: 'select',
      options: alignments,
      description: 'Alinhamento do calendário com o campo.',
      table: { defaultValue: { summary: 'start' } }
    },
    sideOffset: {
      control: { type: 'number', min: 0, max: 24 },
      description: 'Distância em pixels entre campo e calendário.',
      table: { defaultValue: { summary: '6' } }
    },
    collisionPadding: {
      control: { type: 'number', min: 0, max: 32 },
      description: 'Distância mínima das bordas da viewport.',
      table: { defaultValue: { summary: '8' } }
    },
    day: {
      control: false,
      description: 'Personaliza o conteúdo de cada dia e recebe data e estados.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    'onUpdate:modelValue': { action: 'update:modelValue', description: 'Emitido quando a data selecionada muda.' },
    'onUpdate:open': { action: 'update:open', description: 'Emitido quando o calendário abre ou fecha.' },
    'onUpdate:placeholderValue': { action: 'update:placeholderValue', description: 'Emitido quando o mês exibido muda.' },
    onClear: { action: 'clear', description: 'Emitido após limpar a data.' }
  },
  args: {
    modelValue: parseDate('2026-09-15'),
    label: 'Data de entrega',
    description: 'Escolha uma data para agendar a entrega.',
    invalid: false,
    size: 'medium',
    locale: 'pt-BR',
    required: false,
    disabled: false,
    readonly: false,
    clearable: true,
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
  },
  decorators: [
    () => ({ template: '<div class="w-80 max-w-[90vw]"><story /></div>' })
  ],
  render: (args: DatePickerStoryArgs) => ({
    components: { DatePicker },
    setup() {
      const value = shallowRef(args.modelValue)
      const open = ref(args.open)
      const placeholderValue = shallowRef(args.placeholderValue)
      watch(() => args.modelValue, nextValue => value.value = nextValue)
      watch(() => args.open, nextOpen => open.value = nextOpen)
      watch(() => args.placeholderValue, nextValue => placeholderValue.value = nextValue)
      return { args, open, placeholderValue, value }
    },
    template: `
      <DatePicker
        v-model="value"
        v-model:open="open"
        v-model:placeholder-value="placeholderValue"
        :default-value="args.defaultValue"
        :default-placeholder-value="args.defaultPlaceholderValue"
        :label="args.label"
        :description="args.description"
        :error="args.error"
        :invalid="args.invalid"
        :size="args.size"
        :id="args.id"
        :aria-label="args.ariaLabel"
        :name="args.name"
        :locale="args.locale"
        :min-value="args.minValue"
        :max-value="args.maxValue"
        :is-date-disabled="args.isDateDisabled"
        :is-date-unavailable="args.isDateUnavailable"
        :required="args.required"
        :disabled="args.disabled"
        :readonly="args.readonly"
        :clearable="args.clearable"
        :clear-label="args.clearLabel"
        :calendar-button-label="args.calendarButtonLabel"
        :previous-button-label="args.previousButtonLabel"
        :next-button-label="args.nextButtonLabel"
        :default-open="args.defaultOpen"
        :modal="args.modal"
        :close-on-select="args.closeOnSelect"
        :prevent-deselect="args.preventDeselect"
        :week-starts-on="args.weekStartsOn"
        :weekday-format="args.weekdayFormat"
        :fixed-weeks="args.fixedWeeks"
        :number-of-months="args.numberOfMonths"
        :paged-navigation="args.pagedNavigation"
        :side="args.side"
        :align="args.align"
        :side-offset="args.sideOffset"
        :collision-padding="args.collisionPadding"
        @update:model-value="args['onUpdate:modelValue']"
        @update:open="args['onUpdate:open']"
        @update:placeholder-value="args['onUpdate:placeholderValue']"
        @clear="args.onClear" />
    `
  })
} as Meta<DatePickerStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sizes: Story = {
  render: () => ({
    components: { DatePicker },
    setup: () => ({ sizes, value: parseDate('2026-09-15') }),
    template: `
      <div class="flex flex-col gap-5">
        <DatePicker
          v-for="size in sizes"
          :key="size"
          :model-value="value"
          :size="size"
          :label="size" />
      </div>
    `
  })
}

export const States: Story = {
  render: () => ({
    components: { DatePicker },
    setup: () => ({
      emptyValue: shallowRef<DateValue>(),
      selectedValue: parseDate('2026-09-15')
    }),
    template: `
      <div class="flex flex-col gap-5">
        <DatePicker v-model="emptyValue" label="Sem data" description="Preencha pelos segmentos ou abra o calendário." />
        <DatePicker :model-value="selectedValue" label="Somente leitura" readonly />
        <DatePicker :model-value="selectedValue" label="Desabilitado" disabled />
        <DatePicker :model-value="selectedValue" label="Com erro" error="A data precisa estar dentro do prazo do pedido." />
      </div>
    `
  })
}

export const TodaySelected: Story = {
  render: () => ({
    components: { DatePicker },
    setup: () => ({ currentDate: today(getLocalTimeZone()) }),
    template: `
      <DatePicker
        :model-value="currentDate"
        label="Dia atual selecionado"
        description="O número do dia permanece legível quando os estados hoje e selecionado coincidem."
        default-open />
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Valida a sobreposição dos estados de dia atual e data selecionada, preservando o contraste do número sobre o fundo azul.'
      }
    }
  }
}

export const Availability: Story = {
  render: () => ({
    components: { DatePicker },
    setup() {
      const minValue = parseDate('2026-09-01')
      const maxValue = parseDate('2026-10-15')
      const placeholderValue = parseDate('2026-09-01')
      const isDateDisabled = (date: DateValue) => getDayOfWeek(date, 'pt-BR') === 0
      const isDateUnavailable = (date: DateValue) => (
        (date.month === 9 && [7, 21, 22].includes(date.day))
        || (date.month === 10 && [5, 12].includes(date.day))
      )
      return { isDateDisabled, isDateUnavailable, maxValue, minValue, placeholderValue }
    },
    template: `
      <DatePicker
        :default-placeholder-value="placeholderValue"
        :min-value="minValue"
        :max-value="maxValue"
        :is-date-disabled="isDateDisabled"
        :is-date-unavailable="isDateUnavailable"
        label="Agendamento"
        description="Domingos estão desabilitados; datas riscadas já estão ocupadas."
        default-open />
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Limites de período, domingos desabilitados e dias indisponíveis são comunicados visualmente e às tecnologias assistivas.'
      }
    }
  }
}

export const MultipleMonths: Story = {
  render: () => ({
    components: { DatePicker },
    setup: () => ({ selectedValue: new CalendarDate(2026, 9, 15) }),
    template: `
      <DatePicker
        :model-value="selectedValue"
        :number-of-months="2"
        paged-navigation
        label="Período de planejamento"
        description="Dois meses visíveis com navegação paginada."
        default-open />
    `
  })
}

export const CustomDay: Story = {
  render: () => ({
    components: { DatePicker },
    setup: () => ({
      selectedValue: parseDate('2026-09-15'),
      hasEvent: (date: DateValue) => date.month === 9 && [4, 11, 18, 25].includes(date.day)
    }),
    template: `
      <DatePicker :model-value="selectedValue" label="Agenda" default-open>
        <template #day="{ date, dayValue }">
          <span class="relative inline-flex size-full items-center justify-center">
            {{ dayValue }}
            <span
              v-if="hasEvent(date)"
              class="absolute bottom-0.5 size-1 rounded-full bg-current"
              aria-hidden="true" />
          </span>
        </template>
      </DatePicker>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'O slot day permite enriquecer as células sem substituir o comportamento acessível fornecido pelo Reka UI.'
      }
    }
  }
}
