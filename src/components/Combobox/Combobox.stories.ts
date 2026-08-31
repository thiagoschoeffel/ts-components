import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import { SearchIcon } from '../../icons'
import Combobox, { type ComboboxOption, type ComboboxProps } from './Combobox.vue'

interface ComboboxStoryArgs extends ComboboxProps {
  leading?: unknown
  option?: unknown
  empty?: unknown
  'onUpdate:modelValue'?: (value: string | undefined) => void
  'onUpdate:searchValue'?: (value: string) => void
  onSelect?: (option: ComboboxOption) => void
}

const options: ComboboxOption[] = [
  { value: 'ana', label: 'Ana Martins', description: '(11) 99999-1234' },
  { value: 'bruno', label: 'Bruno Lima', description: '(11) 98888-4321' },
  { value: 'carla', label: 'Carla Souza', description: '(11) 97777-5678' }
]

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Campo de busca com lista acessível de opções, seleção por teclado e suporte a filtragem externa.' } } },
  argTypes: {
    modelValue: { control: 'text', description: 'Valor selecionado. Use com v-model.' },
    searchValue: { control: 'text', description: 'Texto pesquisado. Use com v-model:search-value.', table: { defaultValue: { summary: "''" } } },
    options: { control: false, description: 'Opções disponíveis.', table: { type: { summary: 'ComboboxOption[]' } } },
    label: { control: 'text', description: 'Label visível.' }, description: { control: 'text', description: 'Texto de apoio.' }, error: { control: 'text', description: 'Mensagem de validação.' },
    invalid: { control: 'boolean', description: 'Ativa estado inválido.', table: { defaultValue: { summary: 'false' } } },
    placeholder: { control: 'text', description: 'Texto exibido quando vazio.' }, emptyText: { control: 'text', description: 'Mensagem sem resultados.', table: { defaultValue: { summary: 'Nenhuma opção encontrada.' } } }, loadingText: { control: 'text', description: 'Mensagem durante carregamento.', table: { defaultValue: { summary: 'Carregando opções...' } } },
    loading: { control: 'boolean', description: 'Ativa estado de carregamento.', table: { defaultValue: { summary: 'false' } } }, disabled: { control: 'boolean', description: 'Desabilita o campo.', table: { defaultValue: { summary: 'false' } } }, required: { control: 'boolean', description: 'Marca como obrigatório.', table: { defaultValue: { summary: 'false' } } },
    size: { control: 'select', options: ['small', 'medium', 'large'], description: 'Altura e tipografia.', table: { defaultValue: { summary: 'medium' } } }, id: { control: 'text', description: 'Identificador do campo.' }, ariaLabel: { control: 'text', description: 'Nome acessível sem label.' }, externalFilter: { control: 'boolean', description: 'Desativa filtragem interna.', table: { defaultValue: { summary: 'false' } } },
    leading: { control: false, description: 'Ícone inicial.', table: { category: 'Slots', type: { summary: 'Vue slot' } } }, option: { control: false, description: 'Renderização de uma opção.', table: { category: 'Slots', type: { summary: 'Vue slot' } } }, empty: { control: false, description: 'Estado sem resultados.', table: { category: 'Slots', type: { summary: 'Vue slot' } } },
    'onUpdate:modelValue': { action: 'update:modelValue' }, 'onUpdate:searchValue': { action: 'update:searchValue' }, onSelect: { action: 'select' }
  },
  args: { modelValue: undefined, searchValue: '', options, label: 'Cliente', placeholder: 'Buscar por nome ou telefone...', emptyText: 'Nenhum cliente encontrado.', loading: false, disabled: false, required: false, invalid: false, size: 'medium', externalFilter: false },
  decorators: [() => ({ template: '<div class="w-[min(24rem,90vw)] min-h-72"><story /></div>' })],
  render: (args: ComboboxStoryArgs) => ({
    components: { Combobox, SearchIcon },
    setup() { const value = ref(args.modelValue); const search = ref(args.searchValue); watch(() => args.modelValue, next => value.value = next); watch(() => args.searchValue, next => search.value = next); return { args, value, search } },
    template: '<Combobox v-model="value" v-model:search-value="search" v-bind="args"><template #leading><SearchIcon /></template></Combobox>'
  })
} satisfies Meta<ComboboxStoryArgs>

export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {}
export const Loading: Story = { args: { loading: true } }
