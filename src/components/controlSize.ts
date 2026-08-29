export type ControlSize = 'small' | 'medium' | 'large'

/** Shared heights for form controls and buttons. */
export const controlHeightClasses: Record<ControlSize, string> = {
  small: 'h-7',
  medium: 'h-9',
  large: 'h-11'
}
