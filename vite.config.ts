import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    dts({
      rollupTypes: true,
      exclude: ['src/**/*.stories.ts']
    })
  ],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'TsComponents',
      formats: ['es', 'cjs'],
      fileName: (format) =>
        format === 'es'
          ? 'ts-components.js'
          : 'ts-components.cjs',
      cssFileName: 'style'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
        globals: { vue: 'Vue' }
      }
    }
  }
})
