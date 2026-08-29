import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { VNodeChild } from 'vue'
import { computed, ref, watch } from 'vue'
import {
  getIconComponent,
  iconControlOptions,
  type IconControlName
} from '../../iconControls'
import { SearchIcon, SettingsIcon } from '../../icons'
import Button from '../Button/Button.vue'
import Input, { type InputProps, type InputSize, type InputValue } from './Input.vue'

const sizes = ['small', 'medium', 'large'] as const
const types = ['text', 'search', 'email', 'password', 'tel', 'url', 'number', 'date', 'time', 'datetime-local'] as const

interface InputStoryArgs extends InputProps {
  leadingIconName: IconControlName
  trailingIconName: IconControlName
  leading?: VNodeChild | (() => unknown)
  trailing?: VNodeChild | (() => unknown)
  action?: VNodeChild | ((props: { size: InputSize }) => unknown)
  'onUpdate:modelValue'?: (value: InputValue) => void
  onInput?: (event: Event) => void
  onChange?: (event: Event) => void
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
  onClear?: () => void
}

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Campo de entrada no estilo visual da biblioteca, preparado para filtros e formulários.

Suporta tipos textuais, numéricos e temporais. Checkbox, radio, file, range e color devem usar componentes próprios por terem interações diferentes.

\`\`\`vue
<Input
  v-model="email"
  type="email"
  label="E-mail"
  autocomplete="email"
  required />
\`\`\`
        `
      }
    }
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Valor atual do campo. Use com v-model.',
      table: { defaultValue: { summary: "''" } }
    },
    type: {
      control: 'select',
      options: types,
      description: 'Tipo nativo do input.',
      table: { defaultValue: { summary: 'text' } }
    },
    label: { control: 'text', description: 'Label visível associado ao campo.' },
    description: { control: 'text', description: 'Texto de apoio exibido abaixo do campo.' },
    error: { control: 'text', description: 'Mensagem de erro que também ativa o estado inválido.' },
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
    id: { control: 'text', description: 'Identificador do input nativo.' },
    ariaLabel: { control: 'text', description: 'Nome acessível usado na ausência de label visível.' },
    name: { control: 'text', description: 'Nome enviado com o formulário.' },
    placeholder: { control: 'text', description: 'Texto exibido enquanto o campo está vazio.' },
    autocomplete: { control: 'text', description: 'Sugestão de preenchimento automático do navegador.' },
    inputmode: { control: 'text', description: 'Sugestão de teclado virtual.' },
    list: { control: 'text', description: 'Identificador de um datalist associado.' },
    min: { control: 'text', description: 'Valor mínimo aceito.' },
    max: { control: 'text', description: 'Valor máximo aceito.' },
    step: { control: 'text', description: 'Incremento numérico ou temporal.' },
    minlength: { control: 'number', description: 'Quantidade mínima de caracteres.' },
    maxlength: { control: 'number', description: 'Quantidade máxima de caracteres.' },
    pattern: { control: 'text', description: 'Expressão regular para validação nativa.' },
    required: {
      control: 'boolean',
      description: 'Marca o campo como obrigatório.',
      table: { defaultValue: { summary: 'false' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o campo.',
      table: { defaultValue: { summary: 'false' } }
    },
    readonly: {
      control: 'boolean',
      description: 'Impede edição, mantendo foco e envio no formulário.',
      table: { defaultValue: { summary: 'false' } }
    },
    autofocus: {
      control: 'boolean',
      description: 'Foca o campo quando ele é montado.',
      table: { defaultValue: { summary: 'false' } }
    },
    spellcheck: {
      control: 'boolean',
      description: 'Ativa sugestões ortográficas do navegador.',
      table: { defaultValue: { summary: 'true' } }
    },
    clearable: {
      control: 'boolean',
      description: 'Exibe um botão para limpar valores não vazios.',
      table: { defaultValue: { summary: 'false' } }
    },
    clearLabel: {
      control: 'text',
      description: 'Nome acessível do botão de limpar.',
      table: { defaultValue: { summary: 'Limpar campo' } }
    },
    leading: {
      control: false,
      description: 'Conteúdo exibido antes do valor, geralmente um ícone.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    leadingIconName: {
      control: 'select',
      options: iconControlOptions,
      description: 'Controle do Storybook para experimentar um ícone inicial.',
      table: { category: 'Storybook' }
    },
    trailing: {
      control: false,
      description: 'Conteúdo exibido depois do valor.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    trailingIconName: {
      control: 'select',
      options: iconControlOptions,
      description: 'Controle do Storybook para experimentar um ícone final.',
      table: { category: 'Storybook' }
    },
    action: {
      control: false,
      description: 'Ação anexada à borda direita do campo. Recebe o tamanho atual.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    'onUpdate:modelValue': { action: 'update:modelValue', description: 'Evento emitido quando o valor muda.' },
    onInput: { action: 'input', description: 'Evento input nativo.' },
    onChange: { action: 'change', description: 'Evento change nativo.' },
    onFocus: { action: 'focus', description: 'Evento focus nativo.' },
    onBlur: { action: 'blur', description: 'Evento blur nativo.' },
    onClear: { action: 'clear', description: 'Evento emitido após limpar o campo.' }
  },
  args: {
    modelValue: '',
    type: 'text',
    label: 'Nome do cliente',
    description: 'Informe o nome usado no pedido.',
    placeholder: 'Digite o nome',
    invalid: false,
    size: 'medium',
    required: false,
    disabled: false,
    readonly: false,
    autofocus: false,
    spellcheck: true,
    clearable: false,
    clearLabel: 'Limpar campo',
    leadingIconName: 'Nenhum',
    trailingIconName: 'Nenhum'
  },
  decorators: [
    (_, context) => ({
      setup: () => ({ storyWidth: context.parameters.storyWidth ?? '20rem' }),
      template: '<div class="max-w-[90vw]" :style="{ width: storyWidth }"><story /></div>'
    })
  ],
  render: (args: InputStoryArgs) => ({
    components: { Input },
    setup() {
      const value = ref(args.modelValue)
      watch(() => args.modelValue, nextValue => value.value = nextValue)
      const selectedLeadingIcon = computed(() => getIconComponent(args.leadingIconName))
      const selectedTrailingIcon = computed(() => getIconComponent(args.trailingIconName))
      return { args, selectedLeadingIcon, selectedTrailingIcon, value }
    },
    template: `
      <Input
        v-model="value"
        :type="args.type"
        :label="args.label"
        :description="args.description"
        :error="args.error"
        :invalid="args.invalid"
        :size="args.size"
        :id="args.id"
        :aria-label="args.ariaLabel"
        :name="args.name"
        :placeholder="args.placeholder"
        :autocomplete="args.autocomplete"
        :inputmode="args.inputmode"
        :list="args.list"
        :min="args.min"
        :max="args.max"
        :step="args.step"
        :minlength="args.minlength"
        :maxlength="args.maxlength"
        :pattern="args.pattern"
        :required="args.required"
        :disabled="args.disabled"
        :readonly="args.readonly"
        :autofocus="args.autofocus"
        :spellcheck="args.spellcheck"
        :clearable="args.clearable"
        :clear-label="args.clearLabel"
        @update:model-value="args['onUpdate:modelValue']"
        @input="args.onInput"
        @change="args.onChange"
        @focus="args.onFocus"
        @blur="args.onBlur"
        @clear="args.onClear">
        <template v-if="selectedLeadingIcon" #leading>
          <component :is="selectedLeadingIcon" />
        </template>
        <template v-if="selectedTrailingIcon" #trailing>
          <component :is="selectedTrailingIcon" />
        </template>
      </Input>
    `
  })
} as Meta<InputStoryArgs>

export default meta
type Story = StoryObj<InputStoryArgs>

export const Playground: Story = {}

export const Filter: Story = {
  render: () => ({
    components: { Input, SearchIcon },
    setup() {
      const query = ref('')
      const orders = ['#1841 · Marina Oliveira', '#1842 · Rafael Santos', '#1843 · Camila Ferreira']
      const filteredOrders = computed(() =>
        orders.filter(order => order.toLocaleLowerCase('pt-BR').includes(query.value.toLocaleLowerCase('pt-BR')))
      )
      return { filteredOrders, query }
    },
    template: `
      <div class="space-y-3">
        <Input
          v-model="query"
          type="search"
          placeholder="Filtrar pedidos"
          aria-label="Filtrar pedidos"
          clearable>
          <template #leading><SearchIcon /></template>
        </Input>
        <p class="text-xs text-slate-500">{{ filteredOrders.length }} pedidos encontrados</p>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Campo de busca sem label visível, com nome acessível, ícone e ação para limpar o filtro.'
      }
    }
  }
}

export const CommonTypes: Story = {
  render: () => ({
    components: { Input },
    template: `
      <div class="grid w-full grid-cols-[repeat(auto-fit,minmax(min(14rem,100%),1fr))] gap-5">
        <Input type="email" label="E-mail" placeholder="nome@empresa.com" autocomplete="email" />
        <Input type="password" label="Senha" placeholder="Digite sua senha" autocomplete="current-password" />
        <Input type="number" label="Quantidade" :min="1" :step="1" model-value="1" />
        <Input type="date" label="Data de entrega" />
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'A mesma base visual atende campos textuais, numéricos e temporais usados em formulários.'
      }
    }
  }
}

export const States: Story = {
  render: () => ({
    components: { Input, SettingsIcon },
    template: `
      <div class="w-80 space-y-5">
        <Input label="Padrão" placeholder="Campo editável" />
        <Input label="Somente leitura" model-value="Valor preservado" readonly />
        <Input label="Desabilitado" model-value="Valor indisponível" disabled />
        <Input label="Com erro" model-value="email-invalido" error="Informe um endereço de e-mail válido." />
        <Input label="Com conteúdo final" model-value="Configuração automática">
          <template #trailing><SettingsIcon /></template>
        </Input>
      </div>
    `
  })
}

export const Sizes: Story = {
  render: () => ({
    components: { Input },
    setup: () => ({ sizes }),
    template: `
      <div class="w-80 space-y-5">
        <Input
          v-for="size in sizes"
          :key="size"
          :size="size"
          :label="size"
          :placeholder="'Input ' + size" />
      </div>
    `
  })
}

export const WithButtons: Story = {
  render: () => ({
    components: { Button, Input },
    setup: () => ({ sizes }),
    template: `
      <div class="w-full space-y-5">
        <div v-for="size in sizes" :key="size" class="space-y-1.5">
          <p class="text-xs font-medium capitalize text-slate-600">{{ size }}</p>
          <div class="flex items-center gap-2">
            <Input
              :size="size"
              class="flex-1"
              :aria-label="'Filtro ' + size"
              placeholder="Filtrar pedidos" />
            <Button :size="size">Filtrar</Button>
          </div>
        </div>
      </div>
    `
  }),
  parameters: {
    storyWidth: '30rem',
    docs: {
      description: {
        story: 'Input e Button compartilham os mesmos tokens de altura em small, medium e large.'
      }
    }
  }
}

export const AttachedButton: Story = {
  render: () => ({
    components: { Button, Input, SearchIcon },
    setup: () => ({ query: ref('') }),
    template: `
      <Input
        v-model="query"
        type="search"
        label="Buscar pedidos"
        placeholder="Número ou cliente"
        clearable>
        <template #leading><SearchIcon /></template>
        <template #action="{ size }">
          <Button :size="size">Buscar</Button>
        </template>
      </Input>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'O slot action conecta visualmente um botão ao campo e fornece o mesmo tamanho para manter as alturas alinhadas.'
      }
    }
  }
}
