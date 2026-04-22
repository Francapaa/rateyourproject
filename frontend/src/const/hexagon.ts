export type HexDimension = {
  label: string
  value: string
}

export const HEX_DIMENSIONS: HexDimension[] = [
  { label: 'Architecture', value: '85%' },
  { label: 'Code Quality', value: '72%' },
  { label: 'Testing', value: '60%' },
  { label: 'Documentation', value: '45%' },
  { label: 'Deploy', value: '68%' },
  { label: 'Best Practices', value: '78%' },
]

export const HEX_CENTER_SCORE = 68