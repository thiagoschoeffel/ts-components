<template>
  <article class="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <header v-if="$slots.header" class="border-b border-slate-200 px-6 py-4">
      <slot name="header" />
    </header>

    <div class="flex-1 px-6 py-5 text-sm leading-6 text-slate-600">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="border-t border-slate-200 bg-slate-50 px-6 py-4">
      <slot name="footer" />
    </footer>
  </article>
</template>
