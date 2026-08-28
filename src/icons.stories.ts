import type { Meta, StoryObj } from '@storybook/vue3-vite'
import * as availableIcons from './icons'

const icons = Object.entries(availableIcons)
  .sort(([firstName], [secondName]) => firstName.localeCompare(secondName))
  .map(([name, component]) => ({ name, component }))

const meta = {
  title: 'Icons/Available Icons',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Icons exported by `ts-components`. Import any icon by its displayed name, for example: `import { MenuIcon } from \'ts-components\'`.'
      }
    }
  },
  argTypes: {
    size: {
      control: { type: 'range', min: 12, max: 64, step: 1 },
      description: 'Width and height of every icon.',
      table: { defaultValue: { summary: '24' } }
    },
    color: {
      control: 'color',
      description: 'Stroke color applied to every icon.',
      table: { defaultValue: { summary: 'currentColor' } }
    },
    strokeWidth: {
      control: { type: 'range', min: 0.5, max: 4, step: 0.25 },
      description: 'Stroke width applied to every icon.',
      table: { defaultValue: { summary: '2' } }
    }
  },
  args: {
    size: 24,
    color: '#0f172a',
    strokeWidth: 2
  }
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Gallery: Story = {
  parameters: {
    layout: 'fullscreen'
  },
  render: (args) => ({
    setup: () => ({ args, icons }),
    template: `
      <div class="box-border grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(9rem,100%),1fr))] gap-4 p-4">
        <article
          v-for="icon in icons"
          :key="icon.name"
          class="flex min-h-28 flex-col items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-slate-800 shadow-sm">
          <component
            :is="icon.component"
            :size="args.size"
            :color="args.color"
            :stroke-width="args.strokeWidth"
            aria-hidden="true"
          />
          <code class="text-center text-xs font-medium text-slate-700">{{ icon.name }}</code>
        </article>
      </div>
    `
  })
}
