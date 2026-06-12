interface EmptyStateProps {
  icon:    string
  title:   string
  message: string
}

export function EmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <span className="text-4xl">{icon}</span>
      <p className="font-semibold text-gray-200">{title}</p>
      <p className="text-sm text-gray-500 max-w-xs">{message}</p>
    </div>
  )
}
