import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Avatar from './Avatar.vue'

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'URL of the image displayed in the avatar.'
    },
    altText: {
      control: 'text',
      description: 'Accessible alternative text for the avatar image.',
      table: { defaultValue: { summary: 'User avatar' } }
    },
    fallback: {
      control: 'text',
      description: 'Text displayed while the image is unavailable.',
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
