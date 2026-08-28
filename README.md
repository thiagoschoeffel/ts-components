# TS Components

A minimal component library for Vue 3.

## Development and build

```bash
npm install
npm run build
```

## Component playground

Run Storybook to explore component properties, variants and states with live
controls:

```bash
npm run storybook
```

Storybook is available at http://localhost:6006. To generate a static version
of the component documentation, run:

```bash
npm run build-storybook
```

The static site is generated in `storybook-static`.

Before publishing, make sure `ts-components` is available on npm, or change
the package name in `package.json` to your preferred scoped name.

```bash
npm login
npm publish --access public
```

## Usage in another project

```bash
npm install ts-components
```

Import only the component you need:

```vue
<script setup lang="ts">
import { Button } from 'ts-components'
import 'ts-components/style.css'
</script>

<template>
  <Button variant="primary" @click="console.log('clicked')">
    Save
  </Button>
</template>
```

Or register every component globally in `main.ts`:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import TsComponents from 'ts-components'
import 'ts-components/style.css'

createApp(App).use(TsComponents).mount('#app')
```

## Icons

Selected Lucide icons can be imported directly from the library:

```vue
<script setup lang="ts">
import { MenuIcon } from 'ts-components'
</script>

<template>
  <MenuIcon :size="20" />
</template>
```

To expose another icon, add it to `src/icons.ts`.

To test without publishing, run `npm pack` in this library and install the
generated `.tgz` file in the consuming project.
