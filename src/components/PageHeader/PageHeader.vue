<script setup lang="ts">
defineProps<{
  /** Main heading of the page. */
  title: string
  /** Supporting text displayed below the heading. */
  subtitle?: string
}>()
</script>

<template>
  <header class="flex items-center gap-3 text-slate-800">
    <div v-if="$slots.icon" class="shrink-0" aria-hidden="true">
      <slot name="icon" />
    </div>

    <div class="flex min-w-0 flex-col gap-2">
      <h1 class="m-0 text-2xl font-bold leading-none">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="m-0 text-sm leading-none text-slate-400">
        {{ subtitle }}
      </p>
    </div>
  </header>
</template>
