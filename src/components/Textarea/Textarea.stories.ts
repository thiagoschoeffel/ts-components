import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import Textarea, { type TextareaProps } from './Textarea.vue'

interface TextareaStoryArgs extends TextareaProps {
  'onUpdate:modelValue'?: (value: string) => void
  onInput?: (event: Event) => void
  onChange?: (event: Event) => void
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
}

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Campo para textos de múltiplas linhas, alinhado aos estados e tamanhos do Input.' } } },
  argTypes: {
    modelValue: { control: 'text', description: 'Valor atual. Use com v-model.', table: { defaultValue: { summary: "''" } } },
    label: { control: 'text', description: 'Label visível.' },
    description: { control: 'text', description: 'Texto de apoio.' },
    error: { control: 'text', description: 'Mensagem de validação.' },
    invalid: { control: 'boolean', description: 'Ativa o estado inválido.', table: { defaultValue: { summary: 'false' } } },
    size: { control: 'select', options: ['small', 'medium', 'large'], description: 'Espaçamento e tipografia.', table: { defaultValue: { summary: 'medium' } } },
    rows: { control: 'number', description: 'Quantidade inicial de linhas.', table: { defaultValue: { summary: '4' } } },
    resize: { control: 'select', options: ['none', 'vertical', 'horizontal', 'both'], description: 'Direções permitidas para redimensionamento.', table: { defaultValue: { summary: 'vertical' } } },
    required: { control: 'boolean', description: 'Marca o campo como obrigatório.', table: { defaultValue: { summary: 'false' } } },
    disabled: { control: 'boolean', description: 'Desabilita o campo.', table: { defaultValue: { summary: 'false' } } },
    readonly: { control: 'boolean', description: 'Impede edição mantendo o valor.', table: { defaultValue: { summary: 'false' } } },
    autofocus: { control: 'boolean', description: 'Foca ao montar.', table: { defaultValue: { summary: 'false' } } },
    spellcheck: { control: 'boolean', description: 'Ativa sugestões ortográficas.', table: { defaultValue: { summary: 'true' } } },
    id: { control: 'text', description: 'Identificador do campo.' },
    ariaLabel: { control: 'text', description: 'Nome acessível sem label visível.' },
    name: { control: 'text', description: 'Nome enviado no formulário.' },
    placeholder: { control: 'text', description: 'Texto exibido quando vazio.' },
    minlength: { control: 'number', description: 'Mínimo de caracteres.' },
    maxlength: { control: 'number', description: 'Máximo de caracteres.' },
    'onUpdate:modelValue': { action: 'update:modelValue' }, onInput: { action: 'input' }, onChange: { action: 'change' }, onFocus: { action: 'focus' }, onBlur: { action: 'blur' }
  },
  args: { modelValue: '', label: 'Observação', description: 'Inclua orientações relevantes.', placeholder: 'Digite uma observação...', rows: 4, resize: 'vertical', size: 'medium', invalid: false, required: false, disabled: false, readonly: false, autofocus: false, spellcheck: true },
  decorators: [() => ({ template: '<div class="w-[min(32rem,90vw)]"><story /></div>' })],
  render: (args: TextareaStoryArgs) => ({
    components: { Textarea },
    setup() { const value = ref(args.modelValue); watch(() => args.modelValue, next => value.value = next); return { args, value } },
    template: '<Textarea v-model="value" v-bind="args" />'
  })
} satisfies Meta<TextareaStoryArgs>

export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {}
export const WithError: Story = { args: { error: 'A observação deve ter no máximo 200 caracteres.', modelValue: 'Orientação inválida' } }
