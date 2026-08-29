import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import {
  ClipboardListIcon,
  EllipsisIcon,
  LogOutIcon,
  SettingsIcon,
  UserRoundCogIcon
} from '../../icons'
import Button from '../Button/Button.vue'
import DropdownMenu from './DropdownMenu.vue'

const alignments = ['start', 'center', 'end'] as const
const sides = ['top', 'right', 'bottom', 'left'] as const

const accountItems = [
  { value: 'profile', label: 'Perfil', icon: UserRoundCogIcon, shortcut: '⇧⌘P' },
  { value: 'settings', label: 'Configurações', icon: SettingsIcon, shortcut: '⌘,' },
  { value: 'orders', label: 'Meus pedidos', icon: ClipboardListIcon },
  { type: 'separator' },
  { value: 'logout', label: 'Sair', icon: LogOutIcon, destructive: true }
] as const

const meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Menu de ações baseado no Reka UI, com posicionamento em portal, gerenciamento de foco, navegação por teclado e typeahead.

Use \`v-model:open\` quando precisar controlar o estado e o evento \`select\` para reagir à escolha de uma ação.

\`\`\`vue
<DropdownMenu :items="items" @select="handleSelect">
  <template #trigger>
    <Button variant="secondary">Opções</Button>
  </template>
</DropdownMenu>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    items: {
      control: false,
      description: 'Ações exibidas no menu. Rótulos e separadores são opcionais.',
      table: {
        type: { summary: 'DropdownMenuEntry[]' },
        detail: `Action: { value: string; label: string; ... } | Submenu: { type: 'submenu'; label: string; items: DropdownMenuEntry[] } | Label: { type: 'label'; label: string } | Separator: { type: 'separator' }`
      }
    },
    open: {
      control: false,
      description: 'Estado controlado de abertura. Quando omitido, o componente funciona de forma não controlada. Use com v-model:open.'
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Estado inicial quando a abertura não é controlada.',
      table: { defaultValue: { summary: 'false' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Impede que o trigger abra o menu.',
      table: { defaultValue: { summary: 'false' } }
    },
    triggerLabel: {
      control: 'text',
      description: 'Nome acessível aplicado ao trigger padrão.',
      table: { defaultValue: { summary: 'Abrir menu' } }
    },
    side: {
      control: 'select',
      options: sides,
      description: 'Lado preferencial para abertura do menu.',
      table: { defaultValue: { summary: 'bottom' } }
    },
    align: {
      control: 'select',
      options: alignments,
      description: 'Alinhamento do menu em relação ao trigger.',
      table: { defaultValue: { summary: 'end' } }
    },
    sideOffset: {
      control: { type: 'number', min: 0, step: 1 },
      description: 'Distância em pixels entre trigger e menu.',
      table: { defaultValue: { summary: '6' } }
    },
    loop: {
      control: 'boolean',
      description: 'Continua a navegação por teclado entre as extremidades.',
      table: { defaultValue: { summary: 'true' } }
    },
    modal: {
      control: 'boolean',
      description: 'Bloqueia interação externa enquanto o menu está aberto.',
      table: { defaultValue: { summary: 'true' } }
    },
    trigger: {
      control: false,
      description: 'Elemento interativo usado para abrir o menu. Recebe open.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    item: {
      control: false,
      description: 'Personaliza o conteúdo de todas as ações. Recebe item.',
      table: { category: 'Slots', type: { summary: 'Vue slot' } }
    },
    'onUpdate:open': {
      action: 'update:open',
      description: 'Evento emitido ao abrir ou fechar o menu.'
    },
    onSelect: {
      action: 'select',
      description: 'Evento emitido com value, item e evento original.'
    }
  },
  args: {
    items: [...accountItems],
    open: undefined,
    defaultOpen: false,
    disabled: false,
    triggerLabel: 'Abrir opções da conta',
    side: 'bottom',
    align: 'end',
    sideOffset: 6,
    loop: true,
    modal: true
  },
  render: (args) => ({
    components: { Button, DropdownMenu },
    setup() {
      const open = ref(args.open)
      watch(() => args.open, value => open.value = value)
      return { args, open }
    },
    template: `
      <DropdownMenu
        v-model:open="open"
        :items="args.items"
        :default-open="args.defaultOpen"
        :disabled="args.disabled"
        :trigger-label="args.triggerLabel"
        :side="args.side"
        :align="args.align"
        :side-offset="args.sideOffset"
        :loop="args.loop"
        :modal="args.modal"
        @update:open="args['onUpdate:open']"
        @select="args.onSelect">
        <template #trigger>
          <Button variant="secondary">
            Opções
            <template #trailingIcon><EllipsisIcon /></template>
          </Button>
        </template>
      </DropdownMenu>
    `
  })
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const IconTrigger: Story = {
  render: () => ({
    components: { DropdownMenu },
    setup: () => ({ items: [...accountItems] }),
    template: `
      <DropdownMenu
        :items="items"
        trigger-label="Abrir ações da conta" />
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Sem o slot trigger, o componente usa um botão compacto com ícone e nome acessível.'
      }
    }
  }
}

export const WithLabel: Story = {
  render: () => ({
    components: { Button, DropdownMenu },
    setup: () => ({
      items: [
        { type: 'label', label: 'Minha conta' },
        ...accountItems
      ]
    }),
    template: `
      <DropdownMenu :items="items">
        <template #trigger>
          <Button variant="secondary">Conta</Button>
        </template>
      </DropdownMenu>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'O rótulo opcional contextualiza um grupo de ações sem funcionar como uma opção selecionável.'
      }
    }
  }
}

export const Sections: Story = {
  render: () => ({
    components: { Button, DropdownMenu },
    setup: () => ({
      items: [
        { type: 'label', label: 'Conta' },
        { value: 'profile', label: 'Perfil', icon: UserRoundCogIcon },
        { value: 'settings', label: 'Configurações', icon: SettingsIcon },
        { type: 'separator' },
        { type: 'label', label: 'Sessão' },
        { value: 'logout', label: 'Sair', icon: LogOutIcon, destructive: true }
      ]
    }),
    template: `
      <DropdownMenu :items="items">
        <template #trigger>
          <Button variant="secondary">Opções da conta</Button>
        </template>
      </DropdownMenu>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Labels e separadores organizam ações relacionadas em seções visuais não selecionáveis.'
      }
    }
  }
}

export const Submenus: Story = {
  render: () => ({
    components: { Button, DropdownMenu },
    setup: () => ({
      items: [
        { value: 'open', label: 'Abrir pedido', icon: ClipboardListIcon },
        {
          type: 'submenu',
          label: 'Alterar status',
          items: [
            { value: 'confirmed', label: 'Confirmado' },
            { value: 'production', label: 'Em produção' },
            { value: 'packed', label: 'Embalado' }
          ]
        },
        {
          type: 'submenu',
          label: 'Mais opções',
          items: [
            { value: 'duplicate', label: 'Duplicar pedido' },
            {
              type: 'submenu',
              label: 'Exportar',
              items: [
                { value: 'export-pdf', label: 'Documento PDF' },
                { value: 'export-csv', label: 'Planilha CSV' }
              ]
            },
            { type: 'separator' },
            { value: 'cancel', label: 'Cancelar pedido', destructive: true }
          ]
        }
      ]
    }),
    template: `
      <DropdownMenu :items="items" @select="(value) => console.log(value)">
        <template #trigger>
          <Button variant="secondary">Ações do pedido</Button>
        </template>
      </DropdownMenu>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Submenus abrem lateralmente por mouse ou teclado e podem conter outros submenus.'
      }
    }
  }
}

export const ItemStates: Story = {
  render: () => ({
    components: { Button, DropdownMenu },
    setup: () => ({
      items: [
        { type: 'label', label: 'Pedido #1842' },
        { value: 'open', label: 'Abrir pedido' },
        { value: 'duplicate', label: 'Duplicar pedido' },
        { value: 'invoice', label: 'Emitir nota fiscal', disabled: true },
        { type: 'separator' },
        { value: 'cancel', label: 'Cancelar pedido', destructive: true }
      ]
    }),
    template: `
      <DropdownMenu :items="items" align="start">
        <template #trigger>
          <Button variant="secondary">Ações do pedido</Button>
        </template>
      </DropdownMenu>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Itens desabilitados permanecem visíveis, enquanto ações destrutivas recebem tratamento semântico próprio.'
      }
    }
  }
}
