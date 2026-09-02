import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'

type PortalLayerKind = 'floating' | 'modal'

const BASE_LAYER = 50
const PORTAL_LAYER_STATE_KEY = Symbol.for('@thiagoschoeffel/ts-components:portal-layer-state')

interface PortalLayerState {
  activeGroups: number
  highestLayer: number
}

function getLayerState() {
  const globalState = globalThis as typeof globalThis & {
    [PORTAL_LAYER_STATE_KEY]?: PortalLayerState
  }

  globalState[PORTAL_LAYER_STATE_KEY] ??= {
    activeGroups: 0,
    highestLayer: BASE_LAYER - 1
  }

  return globalState[PORTAL_LAYER_STATE_KEY]
}

function acquireLayers(count: number) {
  const state = getLayerState()
  if (state.activeGroups === 0)
    state.highestLayer = BASE_LAYER - 1

  state.activeGroups += 1
  const firstLayer = state.highestLayer + 1
  state.highestLayer += count
  return firstLayer
}

function releaseLayers() {
  const state = getLayerState()
  state.activeGroups = Math.max(0, state.activeGroups - 1)
  if (state.activeGroups === 0)
    state.highestLayer = BASE_LAYER - 1
}

/**
 * Assigns portal layers by opening order. A modal reserves consecutive layers
 * for its backdrop and surface; floating content reserves one layer. This
 * keeps nested and subsequently opened surfaces above every active ancestor.
 * The state lives on globalThis so separate microfrontend bundles participate
 * in the same stack when they render into the same document.
 */
export function usePortalLayer(kind: PortalLayerKind, open: Readonly<Ref<boolean>>) {
  const overlayZIndex = ref(BASE_LAYER)
  const contentZIndex = ref(kind === 'modal' ? BASE_LAYER + 1 : BASE_LAYER)
  let acquired = false

  function sync(opened: boolean) {
    if (opened && !acquired) {
      const firstLayer = acquireLayers(kind === 'modal' ? 2 : 1)
      overlayZIndex.value = firstLayer
      contentZIndex.value = kind === 'modal' ? firstLayer + 1 : firstLayer
      acquired = true
      return
    }

    if (!opened && acquired) {
      releaseLayers()
      acquired = false
    }
  }

  watch(open, sync)
  onMounted(() => sync(open.value))
  onBeforeUnmount(() => sync(false))

  return {
    contentLayerStyle: computed(() => ({ zIndex: contentZIndex.value })),
    overlayLayerStyle: computed(() => ({ zIndex: overlayZIndex.value }))
  }
}
