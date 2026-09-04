/**
 * Re-export the complete Lucide Vue catalog so every icon is available from
 * the library entry point. Lucide provides both `IconName` and
 * `IconNameIcon` aliases for consumers.
 */
export * from '@lucide/vue'

// Preserve the shapes previously exposed by these two public aliases.
export { Redo2 as RedoIcon, Undo2 as UndoIcon } from '@lucide/vue'
