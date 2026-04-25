export function getRiskTone(level: string) {
  if (level === 'High') return 'text-coral border-coral/40 bg-coral/10'
  if (level === 'Medium') return 'text-sun border-sun/40 bg-sun/10'
  return 'text-mint border-mint/40 bg-mint/10'
}

export function formatConfidence(value?: number | null) {
  if (value === null || value === undefined) return '--'
  return `${Math.round(value * 100)}%`
}
