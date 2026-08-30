import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import { CalendarDaysIcon, SettingsIcon } from '../../icons'
import Button from '../Button/Button.vue'
import Input from '../Input/Input.vue'
import ScrollArea from '../ScrollArea/ScrollArea.vue'
import Drawer from './Drawer.vue'

const sides = ['top', 'right', 'bottom', 'left'] as const
const sizes = ['small', 'medium', 'large'] as const

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Painel modal baseado no Drawer do Reka UI. Inclui gerenciamento de foco, fechamento por Escape ou interação externa, gesto de arrastar na direção da borda e transições coerentes com o ponto de origem.

Use o slot \`trigger\` para o controle de abertura, o slot padrão para o conteúdo e \`footer\` para ações persistentes. Os slots de conteúdo recebem \`close\`, permitindo concluir o fluxo sem controlar o estado externamente.

\`title\` é opcional visualmente. Quando omitido, \`accessibleTitle\` mantém um nome para leitores de tela.

\`\`\`vue
<Drawer title="Filtros" description="Refine os resultados exibidos.">
  <template #trigger>
    <Button variant="secondary">Abrir filtros</Button>
  </template>

  <template #default="{ close }">
    <p>Conteúdo do painel.</p>
    <Button @click="close">Aplicar</Button>
  </template>
</Drawer>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    open: {
      control: false,
      description: 'Estado controlado de abertura. Quando omitido, use defaultOpen. Compatível com v-model:open.'
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Estado inicial quando a abertura não é controlada.',
      table: { defaultValue: { summary: 'false' } }
    },
    modal: {
      control: 'select',
      options: [true, false, 'trap-focus'],
      description: 'Define bloqueio externo e captura de foco. trap-focus captura o foco sem bloquear ponteiro externo.',
      table: { defaultValue: { summary: 'true' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Impede que o trigger abra o painel.',
      table: { defaultValue: { summary: 'false' } }
    },
    side: {
      control: 'select',
      options: sides,
      description: 'Borda de origem do painel e direção do gesto para fechá-lo. O respiro permanece apenas nas bordas perpendiculares.',
      table: { defaultValue: { summary: 'right' } }
    },
    size: {
      control: 'select',
      options: sizes,
      description: 'Largura máxima nas laterais ou altura máxima no topo e rodapé.',
      table: { defaultValue: { summary: 'medium' } }
    },
    title: {
      control: 'text',
      description: 'Título opcional exibido no cabeçalho.',
      table: { defaultValue: { summary: 'undefined' } }
    },
    accessibleTitle: {
      control: 'text',
      description: 'Título somente para leitores de tela quando title não é exibido.',
      table: { defaultValue: { summary: 'Painel' } }
    },
    description: {
      control: 'text',
      description: 'Texto de apoio opcional exibido abaixo do título.',
      table: { defaultValue: { summary: 'undefined' } }
    },
    showClose: {
      control: 'boolean',
      description: 'Exibe uma ação compacta de fechar no cabeçalho.',
      table: { defaultValue: { summary: 'true' } }
    },
    closeLabel: {
      control: 'text',
      description: 'Nome acessível da ação de fechar.',
      table: { defaultValue: { summary: 'Fechar painel' } }
    },
    snapPoints: {
      control: false,
      description: 'Posições predefinidas para o gesto, em frações, pixels ou unidades CSS.',
      table: { type: { summary: '(number | string)[]' }, defaultValue: { summary: 'undefined' } }
    },
    snapPoint: {
      control: false,
      description: 'Snap point controlado. Compatível com v-model:snapPoint.',
      table: { type: { summary: 'number | string | null' }, defaultValue: { summary: 'undefined' } }
    },
    defaultSnapPoint: {
      control: false,
      description: 'Snap point inicial quando o valor não é controlado.',
      table: { type: { summary: 'number | string | null' }, defaultValue: { summary: 'undefined' } }
    },
    snapToSequentialPoints: {
      control: 'boolean',
      description: 'Avança um snap point por gesto em vez de selecionar o mais próximo.',
      table: { defaultValue: { summary: 'false' } }
    },
    trigger: {
      control: false,
      description: 'Elemento interativo que abre o painel. Recebe open e disabled.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    default: {
      control: false,
      description: 'Conteúdo principal rolável. Recebe open e close.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    header: {
      control: false,
      description: 'Cabeçalho visual personalizado. Recebe close.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    footer: {
      control: false,
      description: 'Rodapé opcional com separação visual. Recebe close.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    'onUpdate:open': {
      action: 'update:open',
      description: 'Evento emitido ao abrir ou fechar, incluindo o motivo quando disponível.'
    },
    'onUpdate:openComplete': {
      action: 'update:openComplete',
      description: 'Evento emitido ao concluir a transição de abertura ou fechamento.'
    },
    'onUpdate:snapPoint': {
      action: 'update:snapPoint',
      description: 'Evento emitido quando o snap point ativo muda.'
    }
  },
  args: {
    open: undefined,
    defaultOpen: false,
    modal: true,
    disabled: false,
    side: 'right',
    size: 'medium',
    title: 'Preferências',
    accessibleTitle: 'Painel',
    description: 'Ajuste as opções desta visualização.',
    showClose: true,
    closeLabel: 'Fechar painel',
    snapPoints: undefined,
    snapPoint: undefined,
    defaultSnapPoint: undefined,
    snapToSequentialPoints: false
  },
  render: (args) => ({
    components: { Button, Drawer, SettingsIcon },
    setup() {
      const open = ref(args.open)
      watch(() => args.open, value => open.value = value)
      return { args, open }
    },
    template: `
      <Drawer
        v-model:open="open"
        :default-open="args.defaultOpen"
        :modal="args.modal"
        :disabled="args.disabled"
        :side="args.side"
        :size="args.size"
        :title="args.title"
        :accessible-title="args.accessibleTitle"
        :description="args.description"
        :show-close="args.showClose"
        :close-label="args.closeLabel"
        :snap-points="args.snapPoints"
        :snap-point="args.snapPoint"
        :default-snap-point="args.defaultSnapPoint"
        :snap-to-sequential-points="args.snapToSequentialPoints"
        @update:open="args['onUpdate:open']"
        @update:open-complete="args['onUpdate:openComplete']"
        @update:snap-point="args['onUpdate:snapPoint']">
        <template #trigger="{ disabled }">
          <Button variant="secondary" :disabled="disabled">
            Preferências
            <template #trailingIcon><SettingsIcon /></template>
          </Button>
        </template>

        <div class="space-y-5">
          <div class="space-y-1">
            <p class="font-medium text-slate-900">Resumo semanal</p>
            <p class="text-xs leading-5 text-slate-500">Receba um resumo das atividades toda segunda-feira.</p>
          </div>
          <div class="space-y-1">
            <p class="font-medium text-slate-900">Atualizações do projeto</p>
            <p class="text-xs leading-5 text-slate-500">Acompanhe alterações importantes feitas pela equipe.</p>
          </div>
        </div>

        <template #footer="{ close }">
          <div class="flex justify-end gap-2">
            <Button size="small" variant="secondary" @click="close">Cancelar</Button>
            <Button size="small" @click="close">Salvar</Button>
          </div>
        </template>
      </Drawer>
    `
  })
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const AllSides: Story = {
  render: () => ({
    components: { Button, Drawer },
    template: `
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Drawer side="top" title="Painel superior" description="Aberto a partir do topo da viewport.">
          <template #trigger><Button variant="secondary">Topo</Button></template>
          <p>O painel preserva um pequeno espaço em relação às bordas da tela.</p>
        </Drawer>

        <Drawer side="right" title="Painel direito" description="Aberto a partir do lado direito da viewport.">
          <template #trigger><Button variant="secondary">Direita</Button></template>
          <p>O painel preserva um pequeno espaço em relação às bordas da tela.</p>
        </Drawer>

        <Drawer side="bottom" title="Painel inferior" description="Aberto a partir da base da viewport.">
          <template #trigger><Button variant="secondary">Base</Button></template>
          <p>O painel preserva um pequeno espaço em relação às bordas da tela.</p>
        </Drawer>

        <Drawer side="left" title="Painel esquerdo" description="Aberto a partir do lado esquerdo da viewport.">
          <template #trigger><Button variant="secondary">Esquerda</Button></template>
          <p>O painel preserva um pequeno espaço em relação às bordas da tela.</p>
        </Drawer>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'O painel encosta na borda de origem e mantém 8 px de respiro nas bordas perpendiculares. Os cantos voltados à origem permanecem quadrados, enquanto os opostos são arredondados.'
      }
    }
  }
}

export const BottomSheet: Story = {
  render: () => ({
    components: { Button, CalendarDaysIcon, Drawer },
    template: `
      <Drawer
        side="bottom"
        size="small"
        title="Próximos eventos"
        description="Arraste o painel para baixo para fechar.">
        <template #trigger>
          <Button variant="secondary">
            Ver agenda
            <template #trailingIcon><CalendarDaysIcon /></template>
          </Button>
        </template>

        <div class="mx-auto grid w-full max-w-2xl gap-3 sm:grid-cols-2">
          <div class="rounded-lg border border-slate-200 p-3">
            <p class="font-medium text-slate-900">Revisão do produto</p>
            <p class="mt-1 text-xs text-slate-500">Hoje, 14:00 · Sala Ipê</p>
          </div>
          <div class="rounded-lg border border-slate-200 p-3">
            <p class="font-medium text-slate-900">Planejamento semanal</p>
            <p class="mt-1 text-xs text-slate-500">Segunda, 09:30 · Remoto</p>
          </div>
        </div>
      </Drawer>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Na base da viewport, o componente funciona como uma bottom sheet responsiva e pode ser fechado com gesto vertical.'
      }
    }
  }
}

export const FormWithFooter: Story = {
  render: () => ({
    components: { Button, Drawer, Input },
    setup() {
      const name = ref('Visão geral')
      return { name }
    },
    template: `
      <Drawer
        side="left"
        size="small"
        title="Renomear visualização"
        description="O novo nome será visível para toda a equipe.">
        <template #trigger>
          <Button variant="secondary">Renomear</Button>
        </template>

        <Input v-model="name" label="Nome" />

        <template #footer="{ close }">
          <div class="flex justify-end gap-2">
            <Button size="small" variant="secondary" @click="close">Cancelar</Button>
            <Button size="small" @click="close">Salvar</Button>
          </div>
        </template>
      </Drawer>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'O rodapé permanece fixo enquanto somente o conteúdo central recebe rolagem.'
      }
    }
  }
}

export const OverScrollableContent: Story = {
  render: () => ({
    components: { Button, Drawer, ScrollArea },
    template: `
      <div class="w-[min(42rem,calc(100vw-3rem))]">
        <ScrollArea
          orientation="both"
          scrollbar-visibility="always"
          class="h-64 rounded-lg border border-slate-200 bg-white">
          <div class="grid w-[54rem] grid-cols-4 gap-3 p-4">
            <div
              v-for="item in 24"
              :key="item"
              class="rounded-lg bg-slate-50 px-4 py-5 text-sm text-slate-600">
              Pedido {{ String(item).padStart(2, '0') }}
            </div>
          </div>
        </ScrollArea>

        <Drawer
          default-open
          side="left"
          size="small"
          title="Camadas da interface"
          description="O backdrop e o painel permanecem acima das barras de rolagem.">
          <template #trigger>
            <Button class="mt-4" variant="secondary">Verificar camadas</Button>
          </template>
          <p>As barras pertencem somente ao contexto local da área rolável.</p>
        </Drawer>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Regressão visual da hierarquia de camadas: barras de rolagem locais ficam sob o backdrop e o painel modal.'
      }
    }
  }
}

export const Controlled: Story = {
  render: () => ({
    components: { Button, Drawer },
    setup() {
      const open = ref(false)
      return { open }
    },
    template: `
      <div class="flex flex-col items-center gap-3">
        <Drawer v-model:open="open" title="Estado controlado">
          <template #trigger>
            <Button variant="secondary">{{ open ? 'Aberto' : 'Abrir painel' }}</Button>
          </template>
          <p>O estado pode ser sincronizado com qualquer parte da aplicação.</p>
        </Drawer>

        <button
          type="button"
          class="cursor-pointer appearance-none rounded-md border-0 bg-transparent p-0 text-xs font-medium text-slate-400 outline-none transition-colors hover:text-slate-800 focus-visible:text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-500/40 focus-visible:ring-offset-2"
          :aria-pressed="open"
          @click="open = !open">
          {{ open ? 'Fechar externamente' : 'Abrir externamente' }}
        </button>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'v-model:open permite abrir, fechar e observar o drawer a partir do componente consumidor.'
      }
    }
  }
}
