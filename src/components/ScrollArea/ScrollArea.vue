<script setup lang="ts">
import {
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport
} from 'reka-ui'

type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both'
type ScrollbarVisibility = 'auto' | 'always' | 'scroll' | 'hover' | 'glimpse'

const props = withDefaults(
  defineProps<{
    /** Scroll directions made available in the area. */
    orientation?: ScrollAreaOrientation
    /** Controls when the custom scrollbars are displayed. */
    scrollbarVisibility?: ScrollbarVisibility
  }>(),
  {
    orientation: 'vertical',
    scrollbarVisibility: 'auto'
  }
)

const emit = defineEmits<{
  /** Native scroll event emitted by the viewport. */
  scroll: [event: Event]
}>()

const contentWidthClasses: Record<ScrollAreaOrientation, string> = {
  vertical: 'min-w-full',
  horizontal: 'min-w-full w-max',
  both: 'min-w-full w-max'
}
</script>

<template>
  <ScrollAreaRoot
    class="relative isolate min-h-0 min-w-0 w-full overflow-hidden"
    :type="props.scrollbarVisibility">
    <ScrollAreaViewport
      class="size-full rounded-[inherit]"
      @scroll="emit('scroll', $event)">
      <div :class="contentWidthClasses[props.orientation]">
        <slot />
      </div>
    </ScrollAreaViewport>

    <ScrollAreaScrollbar
      v-if="props.orientation === 'vertical' || props.orientation === 'both'"
      orientation="vertical"
      class="z-50 flex w-2 touch-none select-none p-0.5"
      :class="props.orientation === 'both' && '!bottom-2'">
      <ScrollAreaThumb class="relative flex-1 rounded-full bg-slate-300" />
    </ScrollAreaScrollbar>

    <ScrollAreaScrollbar
      v-if="props.orientation === 'horizontal' || props.orientation === 'both'"
      orientation="horizontal"
      class="z-50 flex h-2 touch-none select-none p-0.5"
      :class="props.orientation === 'both' && '!right-2'">
      <ScrollAreaThumb class="relative h-full rounded-full bg-slate-300" />
    </ScrollAreaScrollbar>

    <ScrollAreaCorner class="z-50 bg-slate-100" />
  </ScrollAreaRoot>
</template>
