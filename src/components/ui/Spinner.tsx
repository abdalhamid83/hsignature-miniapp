export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }[size]
  return (
    <div className={`${s} animate-spin rounded-full border-2 border-brand-500 border-t-transparent`} />
  )
}

export function FullPageSpinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-950">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  )
}
