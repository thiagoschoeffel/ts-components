<script lang="ts">
export type TabsSize = "small" | "medium" | "large";
export type TabsOrientation = "horizontal" | "vertical";
export type TabsActivationMode = "automatic" | "manual";
export type TabsVariant = "primary" | "secondary";

export interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps {
  /** Current active tab. Supports v-model. */
  modelValue?: string;
  /** Tab activated initially when the component is uncontrolled. */
  defaultValue?: string;
  /** Tabs displayed by the component. */
  tabs: TabItem[];
  /** Accessible name for the tab list. */
  ariaLabel?: string;
  /** Direction used to lay out tabs and handle arrow keys. */
  orientation?: TabsOrientation;
  /** Controls whether focus or explicit confirmation activates a tab. */
  activationMode?: TabsActivationMode;
  /** Controls trigger height and typography. */
  size?: TabsSize;
  /** Color and semantic emphasis of the active tab. */
  variant?: TabsVariant;
  /** Makes the tab list fill the available width. */
  fullWidth?: boolean;
  /** Allows keyboard navigation to loop between the first and last tabs. */
  loop?: boolean;
  /** Removes inactive panels from the DOM. */
  unmountOnHide?: boolean;
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "reka-ui";
import { controlHeightClasses } from "../controlSize";

const props = withDefaults(defineProps<TabsProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  ariaLabel: "Seções",
  orientation: "horizontal",
  activationMode: "automatic",
  size: "medium",
  variant: "secondary",
  fullWidth: false,
  loop: true,
  unmountOnHide: true,
});

const emit = defineEmits<{
  /** Emitted when the active tab changes. */
  "update:modelValue": [value: string];
}>();

defineSlots<{
  /** Customizes each tab trigger. */
  tab?: (props: { tab: TabItem; active: boolean }) => unknown;
  /** Icon displayed before each tab label. */
  icon?: (props: { tab: TabItem; active: boolean }) => unknown;
  /** Indicator displayed after each tab label. */
  badge?: (props: { tab: TabItem; active: boolean }) => unknown;
  /** Content of each tab panel. */
  content?: (props: { tab: TabItem; active: boolean }) => unknown;
}>();

const initialValue = computed(
  () => props.defaultValue ?? props.tabs.find((tab) => !tab.disabled)?.value,
);

const triggerSizeClasses: Record<TabsSize, string> = {
  small: "px-2.5 text-xs",
  medium: "px-3 text-sm",
  large: "px-4 text-base",
};

const iconSizeClasses: Record<TabsSize, string> = {
  small: "[&>svg]:size-3.5",
  medium: "[&>svg]:size-4",
  large: "[&>svg]:size-4.5",
};

const activeVariantClasses: Record<TabsVariant, string> = {
  primary:
    "data-[state=active]:border-blue-700 data-[state=active]:bg-gradient-to-b data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-xs focus-visible:ring-blue-500/40",
  secondary:
    "data-[state=active]:border-slate-300 data-[state=active]:bg-gradient-to-b data-[state=active]:from-white data-[state=active]:to-slate-100 data-[state=active]:text-slate-900 data-[state=active]:shadow-xs focus-visible:ring-slate-500/40",
};

function updateValue(value: string | number) {
  emit("update:modelValue", String(value));
}
</script>

<template>
  <TabsRoot
    v-slot="{ modelValue: activeValue }"
    :model-value="props.modelValue"
    :default-value="initialValue"
    :orientation="props.orientation"
    :activation-mode="props.activationMode"
    :unmount-on-hide="props.unmountOnHide"
    class="min-w-0"
    :class="
      props.orientation === 'vertical' && !props.fullWidth
        ? 'flex items-start gap-4'
        : ''
    "
    @update:model-value="updateValue"
  >
    <TabsList
      :aria-label="props.ariaLabel"
      :loop="props.loop"
      class="min-w-0"
      :class="
        props.orientation === 'vertical'
          ? props.fullWidth
            ? 'flex w-full flex-col'
            : 'flex w-44 shrink-0 flex-col'
          : props.fullWidth
            ? 'flex w-full'
            : 'inline-flex max-w-full overflow-x-auto'
      "
    >
      <TabsTrigger
        v-for="tab in props.tabs"
        :key="tab.value"
        :value="tab.value"
        :disabled="tab.disabled"
        class="inline-flex shrink-0 cursor-pointer appearance-none items-center gap-2 whitespace-nowrap rounded-lg border border-transparent bg-transparent font-medium text-slate-400 outline-none transition-[color,background-color,box-shadow] duration-150 focus-visible:ring-2 data-[state=active]:hover:brightness-105 data-[state=active]:hover:shadow-md data-[state=inactive]:hover:text-slate-800 disabled:cursor-not-allowed disabled:bg-transparent disabled:!text-slate-200 disabled:shadow-none disabled:hover:bg-transparent disabled:hover:!text-slate-200"
        :class="[
          controlHeightClasses[props.size],
          triggerSizeClasses[props.size],
          activeVariantClasses[props.variant],
          props.orientation === 'vertical'
            ? 'w-full justify-start'
            : props.fullWidth
              ? 'min-w-0 flex-1 !shrink justify-center overflow-hidden'
              : 'justify-center',
        ]"
      >
        <span
          v-if="$slots.icon"
          class="inline-flex shrink-0 items-center justify-center"
          :class="iconSizeClasses[props.size]"
          aria-hidden="true"
        >
          <slot name="icon" :tab="tab" :active="activeValue === tab.value" />
        </span>

        <slot name="tab" :tab="tab" :active="activeValue === tab.value">
          <span class="min-w-0 truncate">{{ tab.label }}</span>
        </slot>

        <span v-if="$slots.badge" class="inline-flex shrink-0 items-center">
          <slot name="badge" :tab="tab" :active="activeValue === tab.value" />
        </span>
      </TabsTrigger>
    </TabsList>

    <div
      class="min-w-0"
      :class="
        props.orientation === 'vertical' && !props.fullWidth ? 'flex-1' : 'mt-4'
      "
    >
      <TabsContent
        v-for="tab in props.tabs"
        :key="tab.value"
        :value="tab.value"
        class="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2"
      >
        <slot name="content" :tab="tab" :active="activeValue === tab.value" />
      </TabsContent>
    </div>
  </TabsRoot>
</template>
