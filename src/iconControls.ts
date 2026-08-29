import type { Component } from 'vue'
import * as availableIcons from './icons'

export type AvailableIconName = keyof typeof availableIcons
export type IconControlName = AvailableIconName | 'Nenhum'

export const noIconOption = 'Nenhum' as const

export const availableIconEntries = Object.entries(availableIcons)
  .sort(([firstName], [secondName]) => firstName.localeCompare(secondName))
  .map(([name, component]) => ({
    name: name as AvailableIconName,
    component
  }))

export const availableIconNames = availableIconEntries.map(({ name }) => name)
export const iconControlOptions: IconControlName[] = [noIconOption, ...availableIconNames]

export function getIconComponent(name: IconControlName): Component | null {
  return name === noIconOption ? null : availableIcons[name]
}
