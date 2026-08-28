<script setup lang="ts">
import { AvatarFallback, AvatarImage, AvatarRoot } from 'reka-ui'

withDefaults(
  defineProps<{
    /** URL of the image displayed in the avatar. */
    src?: string
    /** Accessible alternative text for the avatar image. */
    altText?: string
    /** Text displayed while the image is unavailable. */
    fallback?: string
  }>(),
  {
    altText: 'User avatar',
    fallback: 'US'
  }
)
</script>

<template>
  <AvatarRoot class="inline-flex size-8 items-center justify-center overflow-hidden rounded-full bg-slate-200">
    <AvatarImage v-if="src" :src="src" :alt="altText" class="size-full object-cover" />
    <AvatarFallback class="text-xs font-bold text-slate-800">
      {{ fallback }}
    </AvatarFallback>
  </AvatarRoot>
</template>
