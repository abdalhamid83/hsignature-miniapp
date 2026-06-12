import type { ReactNode } from 'react'
import { Spinner } from './Spinner'

interface ButtonProps {
  children:  ReactNode
  onClick?:  () => void
  loading?:  boolean
  disabled?: boolean
  variant?:  'primary' | 'secondary' | 'danger' | 'ghost'
  fullWidth?: boolean
  className?: string
}

const variants = {
  primary:   'bg-brand-600 hover:bg-brand-700 text-white border-transparent',
  secondary: 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700',
  danger:    'bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-500/30',
  ghost:     'bg-transparent hover:bg-gray-800 text-gray-300 border-gray-700',
}

export function Button({
  children, onClick, loading, disabled, variant = 'primary', fullWidth, className = '',
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3
        text-sm font-semibold transition-all active:scale-[0.97]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? <Spinner size="sm" /> : children}
    </button>
  )
}
