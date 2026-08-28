import type { Preview } from '@storybook/vue3-vite'
import '../src/tailwind.css'
import './preview.css'

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    },
    docs: {
      toc: true
    },
    layout: 'centered'
  }
}

export default preview
