import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { VNodeChild } from 'vue'
import { computed, ref, watch } from 'vue'
import {
  getIconComponent,
  iconControlOptions,
  type IconControlName
} from '../../iconControls'
import {
  CheckIcon,
  ClipboardListIcon,
  MessagesSquareIcon
} from '../../icons'
import Badge from '../Badge/Badge.vue'
import Tabs, {
  type TabItem,
  type TabsProps,
  type TabsVariant
} from './Tabs.vue'

const sizes = ['small', 'medium', 'large'] as const
const variants: TabsVariant[] = ['primary', 'secondary']
const orientations = ['horizontal', 'vertical'] as const
const activationModes = ['automatic', 'manual'] as const

const accountTabs: TabItem[] = [
  { value: 'overview', label: 'Visão geral' },
  { value: 'activity', label: 'Atividade' },
  { value: 'permissions', label: 'Permissões' },
  { value: 'billing', label: 'Faturamento', disabled: true }
]

const descriptions: Record<string, string> = {
  overview: 'Resumo das informações e indicadores mais importantes desta conta.',
  activity: 'Histórico recente de acessos, alterações e eventos da equipe.',
  permissions: 'Papéis e níveis de acesso concedidos aos integrantes da conta.',
  billing: 'Plano contratado, forma de pagamento e histórico de cobranças.'
}

interface TabsStoryArgs extends TabsProps {
  tab?: VNodeChild | ((props: { tab: TabItem; active: boolean }) => unknown)
  icon?: VNodeChild | ((props: { tab: TabItem; active: boolean }) => unknown)
  badge?: VNodeChild | ((props: { tab: TabItem; active: boolean }) => unknown)
  content?: VNodeChild | ((props: { tab: TabItem; active: boolean }) => unknown)
  iconName: IconControlName
  'onUpdate:modelValue'?: (value: string) => void
}

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Navegação entre painéis baseada no Tabs do Reka UI, com visual compacto, navegação por teclado e orientação horizontal ou vertical.

Quando \`modelValue\` e \`defaultValue\` não são informados, a primeira aba habilitada é selecionada. Use o slot \`content\` para renderizar o painel correspondente a cada item.

\`\`\`vue
<Tabs v-model="section" :tabs="sections" aria-label="Configurações">
  <template #icon="{ tab }">
    <component :is="icons[tab.value]" />
  </template>
  <template #badge="{ tab }">
    <Badge>{{ totals[tab.value] }}</Badge>
  </template>
  <template #content="{ tab }">
    Conteúdo de {{ tab.label }}
  </template>
</Tabs>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    modelValue: {
      control: 'select',
      options: accountTabs.filter(tab => !tab.disabled).map(tab => tab.value),
      description: 'Valor da aba ativa. Use com v-model.'
    },
    defaultValue: {
      control: 'select',
      options: accountTabs.filter(tab => !tab.disabled).map(tab => tab.value),
      description: 'Aba ativa inicialmente quando o estado não é controlado.',
      table: { defaultValue: { summary: 'Primeira aba habilitada' } }
    },
    tabs: {
      control: false,
      description: 'Lista de abas com value, label e estado desabilitado opcional.',
      table: {
        type: { summary: 'TabItem[]' },
        detail: '{ value: string; label: string; disabled?: boolean }[]'
      }
    },
    ariaLabel: {
      control: 'text',
      description: 'Nome acessível da lista de abas.',
      table: { defaultValue: { summary: 'Seções' } }
    },
    orientation: {
      control: 'select',
      options: orientations,
      description: 'Organização visual e direção usada pelas teclas de seta.',
      table: { defaultValue: { summary: 'horizontal' } }
    },
    activationMode: {
      control: 'select',
      options: activationModes,
      description: 'Define se foco ou confirmação explícita ativa uma aba.',
      table: { defaultValue: { summary: 'automatic' } }
    },
    size: {
      control: 'select',
      options: sizes,
      description: 'Altura e tipografia dos acionadores.',
      table: { defaultValue: { summary: 'medium' } }
    },
    variant: {
      control: 'select',
      options: variants,
      description: 'Cor e ênfase semântica da aba ativa.',
      table: { defaultValue: { summary: 'secondary' } }
    },
    fullWidth: {
      control: 'boolean',
      description: 'Faz a lista de abas ocupar toda a largura disponível. Na horizontal, distribui os itens igualmente.',
      table: { defaultValue: { summary: 'false' } }
    },
    loop: {
      control: 'boolean',
      description: 'Continua a navegação por teclado entre as extremidades.',
      table: { defaultValue: { summary: 'true' } }
    },
    unmountOnHide: {
      control: 'boolean',
      description: 'Remove painéis inativos do DOM.',
      table: { defaultValue: { summary: 'true' } }
    },
    tab: {
      control: false,
      description: 'Personaliza cada acionador. Recebe tab e active.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    icon: {
      control: false,
      description: 'Ícone exibido antes do label. Recebe tab e active.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    badge: {
      control: false,
      description: 'Indicador exibido depois do label. Recebe tab e active e pode usar o componente Badge.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    content: {
      control: false,
      description: 'Renderiza o painel de cada item. Recebe tab e active.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    iconName: {
      control: 'select',
      options: iconControlOptions,
      description: 'Controle do Storybook para experimentar o slot de ícone.',
      table: { category: 'Storybook' }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Evento emitido quando a aba ativa muda.'
    }
  },
  args: {
    modelValue: 'overview',
    defaultValue: undefined,
    tabs: accountTabs,
    ariaLabel: 'Seções da conta',
    orientation: 'horizontal',
    activationMode: 'automatic',
    size: 'medium',
    variant: 'secondary',
    fullWidth: false,
    loop: true,
    unmountOnHide: true,
    iconName: 'Nenhum'
  },
  decorators: [
    () => ({ template: '<div class="w-[42rem] max-w-[90vw]"><story /></div>' })
  ],
  render: (args: TabsStoryArgs) => ({
    components: { Tabs },
    setup() {
      const value = ref(args.modelValue)
      const selectedIcon = computed(() => getIconComponent(args.iconName))
      watch(() => args.modelValue, nextValue => value.value = nextValue)
      return { args, descriptions, selectedIcon, value }
    },
    template: `
      <Tabs
        v-model="value"
        :default-value="args.defaultValue"
        :tabs="args.tabs"
        :aria-label="args.ariaLabel"
        :orientation="args.orientation"
        :activation-mode="args.activationMode"
        :size="args.size"
        :variant="args.variant"
        :full-width="args.fullWidth"
        :loop="args.loop"
        :unmount-on-hide="args.unmountOnHide"
        @update:model-value="args['onUpdate:modelValue']">
        <template v-if="selectedIcon" #icon>
          <component :is="selectedIcon" />
        </template>
        <template #content="{ tab }">
          <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p class="text-sm font-medium text-slate-800">{{ tab.label }}</p>
            <p class="mt-1 text-sm leading-relaxed text-slate-500">{{ descriptions[tab.value] }}</p>
          </div>
        </template>
      </Tabs>
    `
  })
} as Meta<TabsStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sizes: Story = {
  render: () => ({
    components: { Tabs },
    setup: () => ({ sizes }),
    template: `
      <div class="flex flex-col gap-8">
        <div v-for="size in sizes" :key="size" class="space-y-3">
          <p class="text-xs font-medium capitalize text-slate-500">{{ size }}</p>
          <div class="grid grid-cols-1 items-start gap-5 sm:grid-cols-2">
            <div class="space-y-2">
              <p class="text-xs text-slate-400">Horizontal</p>
              <Tabs
                :size="size"
                :tabs="[
                  { value: 'details', label: 'Detalhes' },
                  { value: 'history', label: 'Histórico' },
                  { value: 'files', label: 'Arquivos' }
                ]">
                <template #content="{ tab }">
                  <p class="text-sm text-slate-500">Painel de {{ tab.label.toLowerCase() }}.</p>
                </template>
              </Tabs>
            </div>

            <div class="space-y-2">
              <p class="text-xs text-slate-400">Vertical</p>
              <Tabs
                orientation="vertical"
                :size="size"
                :tabs="[
                  { value: 'details', label: 'Detalhes' },
                  { value: 'history', label: 'Histórico' },
                  { value: 'files', label: 'Arquivos' }
                ]">
                <template #content="{ tab }">
                  <p class="text-sm text-slate-500">Painel de {{ tab.label.toLowerCase() }}.</p>
                </template>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    `
  })
}

export const Variants: Story = {
  render: () => ({
    components: { CheckIcon, Tabs },
    setup: () => ({ variants }),
    template: `
      <div class="flex flex-col gap-5">
        <div v-for="variant in variants" :key="variant" class="space-y-2">
          <p class="text-xs font-medium capitalize text-slate-500">{{ variant }}</p>
          <div class="grid grid-cols-1 items-start gap-5 sm:grid-cols-2">
            <Tabs
              default-value="active"
              :variant="variant"
              :tabs="[
                { value: 'active', label: 'Selecionada' },
                { value: 'inactive', label: 'Outra aba' }
              ]">
              <template #icon><CheckIcon /></template>
              <template #content>
                <span class="text-sm text-slate-500">Orientação horizontal.</span>
              </template>
            </Tabs>

            <Tabs
              default-value="active"
              orientation="vertical"
              :variant="variant"
              :tabs="[
                { value: 'active', label: 'Selecionada' },
                { value: 'inactive', label: 'Outra aba' }
              ]">
              <template #icon><CheckIcon /></template>
              <template #content>
                <span class="text-sm text-slate-500">Orientação vertical.</span>
              </template>
            </Tabs>
          </div>
        </div>
      </div>
    `
  })
}

export const Vertical: Story = {
  args: { orientation: 'vertical', size: 'medium', variant: 'secondary' },
  render: (args) => ({
    components: { Tabs },
    setup: () => ({ accountTabs, args, descriptions }),
    template: `
      <Tabs
        orientation="vertical"
        :size="args.size"
        :variant="args.variant"
        :full-width="args.fullWidth"
        :tabs="accountTabs"
        :loop="args.loop"
        :activation-mode="args.activationMode"
        :unmount-on-hide="args.unmountOnHide"
        aria-label="Configurações da conta">
        <template #content="{ tab }">
          <div class="min-h-40 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p class="text-sm font-medium text-slate-800">{{ tab.label }}</p>
            <p class="mt-1 text-sm leading-relaxed text-slate-500">{{ descriptions[tab.value] }}</p>
          </div>
        </template>
      </Tabs>
    `
  })
}

export const FullWidth: Story = {
  args: { fullWidth: true },
  render: () => ({
    components: { Badge, Tabs },
    setup: () => ({
      tabs: [
        { value: 'overview', label: 'Visão geral' },
        { value: 'activity', label: 'Atividade recente' },
        { value: 'permissions', label: 'Permissões' }
      ],
      counts: { overview: 12, activity: 8, permissions: 3 }
    }),
    template: `
      <div class="space-y-8">
        <div class="space-y-2">
          <p class="text-xs font-medium text-slate-500">Largura disponível</p>
          <Tabs full-width :tabs="tabs" aria-label="Seções do painel">
            <template #badge="{ tab }">
              <Badge>{{ counts[tab.value] }}</Badge>
            </template>
            <template #content="{ tab }">
              <p class="text-sm text-slate-500">Conteúdo de {{ tab.label.toLowerCase() }}.</p>
            </template>
          </Tabs>
        </div>

        <div class="w-72 max-w-full space-y-2">
          <p class="text-xs font-medium text-slate-500">Container estreito</p>
          <Tabs full-width :tabs="tabs" aria-label="Seções do painel em espaço reduzido">
            <template #content="{ tab }">
              <p class="text-sm text-slate-500">Conteúdo de {{ tab.label.toLowerCase() }}.</p>
            </template>
          </Tabs>
        </div>

        <div class="space-y-2">
          <p class="text-xs font-medium text-slate-500">Vertical em largura total</p>
          <Tabs
            full-width
            orientation="vertical"
            :tabs="tabs"
            aria-label="Seções verticais em largura total">
            <template #badge="{ tab }">
              <Badge>{{ counts[tab.value] }}</Badge>
            </template>
            <template #content="{ tab }">
              <p class="text-sm text-slate-500">Conteúdo de {{ tab.label.toLowerCase() }}.</p>
            </template>
          </Tabs>
        </div>
      </div>
    `
  })
}

export const CustomTab: Story = {
  render: () => ({
    components: { Badge, Tabs },
    setup: () => ({
      tabs: [
        { value: 'inbox', label: 'Entrada' },
        { value: 'review', label: 'Em revisão' },
        { value: 'done', label: 'Concluídos' }
      ],
      counts: { inbox: 8, review: 3, done: 24 },
      icons: {
        inbox: MessagesSquareIcon,
        review: ClipboardListIcon,
        done: CheckIcon
      }
    }),
    template: `
      <div class="space-y-8">
        <div class="space-y-2">
          <p class="text-xs font-medium text-slate-500">Horizontal</p>
          <Tabs :tabs="tabs" aria-label="Situação das tarefas">
            <template #icon="{ tab }">
              <component :is="icons[tab.value]" />
            </template>
            <template #badge="{ tab, active }">
              <Badge :variant="active ? 'info' : 'neutral'">
                {{ counts[tab.value] }}
              </Badge>
            </template>
            <template #content="{ tab }">
              <p class="text-sm text-slate-500">Tarefas em “{{ tab.label.toLowerCase() }}”.</p>
            </template>
          </Tabs>
        </div>

        <div class="space-y-2">
          <p class="text-xs font-medium text-slate-500">Vertical</p>
          <Tabs orientation="vertical" :tabs="tabs" aria-label="Situação vertical das tarefas">
            <template #icon="{ tab }">
              <component :is="icons[tab.value]" />
            </template>
            <template #badge="{ tab, active }">
              <Badge :variant="active ? 'info' : 'neutral'">
                {{ counts[tab.value] }}
              </Badge>
            </template>
            <template #content="{ tab }">
              <p class="text-sm text-slate-500">Tarefas em “{{ tab.label.toLowerCase() }}”.</p>
            </template>
          </Tabs>
        </div>
      </div>
    `
  })
}
