<script lang="ts">
export type PrintPreviewVariant = 'label' | 'document'

export interface PrintPreviewProps {
  /** Identifica o formato físico mostrado ao lado do título. */
  format?: string
  /** Define a proporção e o comportamento de rolagem do papel. */
  variant?: PrintPreviewVariant
  /** Título visual apresentado acima da área de pré-visualização. */
  title?: string
  /** Nome acessível da região que contém o conteúdo imprimível. */
  ariaLabel?: string
}
</script>

<script setup lang="ts">
withDefaults(defineProps<PrintPreviewProps>(), {
  format: undefined,
  variant: 'document',
  title: 'Pré-visualização',
  ariaLabel: 'Pré-visualização de impressão'
})

defineSlots<{
  /** Conteúdo visual do papel, sem controles ou ações da interface. */
  default?: () => unknown
}>()
</script>

<template>
  <section :aria-label="ariaLabel">
    <div class="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
      <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{{ title }}</p>
      <p v-if="format" class="text-xs font-medium text-slate-400">{{ format }}</p>
    </div>

    <div
      class="rounded-lg border border-slate-200 bg-slate-100 p-3 shadow-inner sm:p-4"
      :class="variant === 'document' ? 'max-h-[60vh] overflow-x-hidden overflow-y-auto' : 'overflow-hidden'">
      <div
        class="mx-auto overflow-hidden border border-slate-800 bg-white text-slate-900 shadow-sm"
        :class="variant === 'label'
          ? 'aspect-[2/1] w-full'
          : 'min-h-[42rem] w-full'">
        <slot />
      </div>
    </div>
  </section>
</template>
