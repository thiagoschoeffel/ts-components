import type { Component } from 'vue'
import { icons } from '@lucide/vue'

type LucideIconName = keyof typeof icons & string

export type AvailableIconName = `${LucideIconName}Icon`
export type IconControlName = AvailableIconName | 'Nenhum'

export const noIconOption = 'Nenhum' as const

export const availableIconEntries = Object.entries(icons)
  .sort(([firstName], [secondName]) => firstName.localeCompare(secondName))
  .map(([name, component]) => ({
    name: `${name}Icon` as AvailableIconName,
    component
  }))

export const availableIconNames = availableIconEntries.map(({ name }) => name)
export const iconControlOptions: IconControlName[] = [noIconOption, ...availableIconNames]

const availableIconComponents = Object.fromEntries(
  availableIconEntries.map(({ name, component }) => [name, component])
) as Record<AvailableIconName, Component>

export function getIconComponent(name: IconControlName): Component | null {
  return name === noIconOption ? null : availableIconComponents[name]
}
