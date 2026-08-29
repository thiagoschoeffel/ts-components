import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import { CalendarDaysIcon, SettingsIcon, UserRoundCogIcon } from '../../icons'
import Button from '../Button/Button.vue'
import Input from '../Input/Input.vue'
import Popover from './Popover.vue'

const alignments = ['start', 'center', 'end'] as const
const sides = ['top', 'right', 'bottom', 'left'] as const
const sizes = ['small', 'medium', 'large'] as const

const meta = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Painel flutuante baseado no Popover do Reka UI, com posicionamento responsivo, gerenciamento de foco e fechamento por Escape ou interação externa.

Use o slot \`trigger\` para o controle de abertura e o slot padrão para o conteúdo. Os slots recebem \`close\`, útil para concluir ações sem controlar o estado externamente.

\`\`\`vue
<Popover title="Preferências" show-close>
  <template #trigger>
    <Button variant="secondary">Abrir preferências</Button>
  </template>

  <template #default="{ close }">
    <p>Conteúdo do painel.</p>
    <Button @click="close">Concluir</Button>
  </template>
</Popover>
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
      control: 'boolean',
      description: 'Bloqueia interação externa e restringe o conteúdo percebido por leitores de tela.',
      table: { defaultValue: { summary: 'false' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Impede que o trigger abra o painel.',
      table: { defaultValue: { summary: 'false' } }
    },
    title: {
      control: 'text',
      description: 'Título opcional exibido no cabeçalho.',
      table: { defaultValue: { summary: 'undefined' } }
    },
    description: {
      control: 'text',
      description: 'Texto de apoio opcional exibido abaixo do título.',
      table: { defaultValue: { summary: 'undefined' } }
    },
    showClose: {
      control: 'boolean',
      description: 'Exibe uma ação compacta de fechar no cabeçalho.',
      table: { defaultValue: { summary: 'false' } }
    },
    closeLabel: {
      control: 'text',
      description: 'Nome acessível da ação de fechar.',
      table: { defaultValue: { summary: 'Fechar popover' } }
    },
    size: {
      control: 'select',
      options: sizes,
      description: 'Largura do painel, limitada de forma responsiva em telas estreitas.',
      table: { defaultValue: { summary: 'medium' } }
    },
    side: {
      control: 'select',
      options: sides,
      description: 'Lado preferencial para abertura do painel.',
      table: { defaultValue: { summary: 'bottom' } }
    },
    align: {
      control: 'select',
      options: alignments,
      description: 'Alinhamento do painel em relação ao trigger.',
      table: { defaultValue: { summary: 'center' } }
    },
    sideOffset: {
      control: { type: 'number', min: 0, step: 1 },
      description: 'Distância em pixels entre trigger e painel.',
      table: { defaultValue: { summary: '8' } }
    },
    alignOffset: {
      control: { type: 'number', step: 1 },
      description: 'Deslocamento em pixels no eixo de alinhamento.',
      table: { defaultValue: { summary: '0' } }
    },
    avoidCollisions: {
      control: 'boolean',
      description: 'Reposiciona o painel para mantê-lo dentro da área visível.',
      table: { defaultValue: { summary: 'true' } }
    },
    collisionPadding: {
      control: { type: 'number', min: 0, step: 1 },
      description: 'Distância mínima em pixels das bordas usadas para detectar colisões.',
      table: { defaultValue: { summary: '8' } }
    },
    trigger: {
      control: false,
      description: 'Elemento interativo que abre o painel. Recebe open e disabled.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    default: {
      control: false,
      description: 'Conteúdo principal. Recebe open e close.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    header: {
      control: false,
      description: 'Cabeçalho personalizado. Substitui title e description e recebe close.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    footer: {
      control: false,
      description: 'Rodapé opcional com separação visual. Recebe close.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    'onUpdate:open': {
      action: 'update:open',
      description: 'Evento emitido ao abrir ou fechar o painel.'
    }
  },
  args: {
    open: undefined,
    defaultOpen: false,
    modal: false,
    disabled: false,
    title: 'Próximo evento',
    description: 'Detalhes rápidos da agenda.',
    showClose: true,
    closeLabel: 'Fechar popover',
    size: 'medium',
    side: 'bottom',
    align: 'center',
    sideOffset: 8,
    alignOffset: 0,
    avoidCollisions: true,
    collisionPadding: 8
  },
  render: (args) => ({
    components: { Button, CalendarDaysIcon, Popover },
    setup() {
      const open = ref(args.open)
      watch(() => args.open, value => open.value = value)
      return { args, open }
    },
    template: `
      <Popover
        v-model:open="open"
        :default-open="args.defaultOpen"
        :modal="args.modal"
        :disabled="args.disabled"
        :title="args.title"
        :description="args.description"
        :show-close="args.showClose"
        :close-label="args.closeLabel"
        :size="args.size"
        :side="args.side"
        :align="args.align"
        :side-offset="args.sideOffset"
        :align-offset="args.alignOffset"
        :avoid-collisions="args.avoidCollisions"
        :collision-padding="args.collisionPadding"
        @update:open="args['onUpdate:open']">
        <template #trigger="{ disabled }">
          <Button variant="secondary" :disabled="disabled">
            Agenda
            <template #trailingIcon><CalendarDaysIcon /></template>
          </Button>
        </template>

        <div class="space-y-1">
          <p class="font-medium text-slate-900">Revisão do produto</p>
          <p class="text-xs leading-5 text-slate-500">Hoje, das 14:00 às 14:45 · Sala Ipê</p>
        </div>
      </Popover>
    `
  })
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Compact: Story = {
  render: () => ({
    components: { Button, Popover, UserRoundCogIcon },
    template: `
      <Popover size="small" align="start">
        <template #trigger>
          <Button variant="secondary" icon-only aria-label="Ver perfil">
            <template #icon><UserRoundCogIcon /></template>
          </Button>
        </template>

        <div class="space-y-1">
          <p class="font-medium text-slate-900">Thiago Schoeffel</p>
          <p class="text-xs text-slate-500">Administrador</p>
        </div>
      </Popover>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Sem título ou rodapé, o painel mantém uma apresentação compacta para informações breves.'
      }
    }
  }
}

export const FormWithFooter: Story = {
  render: () => ({
    components: { Button, Input, Popover, SettingsIcon },
    setup() {
      const name = ref('Painel principal')
      return { name }
    },
    template: `
      <Popover
        title="Renomear visualização"
        description="O novo nome será visível para toda a equipe."
        size="large"
        align="end"
        show-close>
        <template #trigger>
          <Button variant="secondary">
            Configurar
            <template #trailingIcon><SettingsIcon /></template>
          </Button>
        </template>

        <Input v-model="name" label="Nome" />

        <template #footer="{ close }">
          <div class="flex justify-end gap-2">
            <Button size="small" variant="secondary" @click="close">Cancelar</Button>
            <Button size="small" @click="close">Salvar</Button>
          </div>
        </template>
      </Popover>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'O rodapé acomoda ações relacionadas, e o callback close encerra o fluxo sem exigir estado controlado.'
      }
    }
  }
}

export const Controlled: Story = {
  render: () => ({
    components: { Button, Popover },
    setup() {
      const open = ref(false)
      return { open }
    },
    template: `
      <div class="flex flex-col items-center gap-3">
        <Popover v-model:open="open" title="Estado controlado" show-close>
          <template #trigger>
            <Button variant="secondary">{{ open ? 'Aberto' : 'Abrir' }}</Button>
          </template>
          <p>O estado pode ser sincronizado com qualquer parte da aplicação.</p>
        </Popover>

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
        story: 'v-model:open permite abrir, fechar e observar o popover a partir do componente consumidor.'
      }
    }
  }
}
