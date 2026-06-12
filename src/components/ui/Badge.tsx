type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default'

const styles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/20  text-amber-400  border-amber-500/30',
  error:   'bg-red-500/20    text-red-400    border-red-500/30',
  info:    'bg-blue-500/20   text-blue-400   border-blue-500/30',
  default: 'bg-gray-500/20   text-gray-400   border-gray-500/30',
}

export function Badge({ label, variant = 'default' }: { label: string; variant?: BadgeVariant }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[variant]}`}>
      {label}
    </span>
  )
}

export function hhdVariant(state: string): BadgeVariant {
  if (state === 'EXCEPTIONAL') return 'success'
  if (state === 'HEALTHY')     return 'info'
  if (state === 'WARNING')     return 'warning'
  return 'error'
}
