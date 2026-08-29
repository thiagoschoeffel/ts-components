import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Avatar from './Avatar.vue'

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'URL da imagem exibida no avatar.'
    },
    altText: {
      control: 'text',
      description: 'Texto alternativo acessível da imagem.',
      table: { defaultValue: { summary: 'User avatar' } }
    },
    fallback: {
      control: 'text',
      description: 'Texto exibido enquanto a imagem estiver indisponível.',
      table: { defaultValue: { summary: 'US' } }
    }
  },
  args: {
    src: '',
    altText: 'User avatar',
    fallback: 'US'
  }
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Fallback: Story = {
  args: { fallback: 'JD' }
}

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/128?img=12',
    altText: 'Profile portrait'
  }
}
