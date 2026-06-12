import type { ReactNode } from 'react'

interface PageLayoutProps {
  title?:    string
  children:  ReactNode
  action?:   ReactNode
}

export function PageLayout({ title, children, action }: PageLayoutProps) {
  return (
    <div className="flex h-screen flex-col bg-gray-950 text-white">
      {title && (
        <header className="flex items-center justify-between px-4 pt-4 pb-3">
          <h1 className="text-lg font-bold text-white">{title}</h1>
          {action && <div>{action}</div>}
        </header>
      )}
      <main className="flex-1 overflow-y-auto px-4 pb-24">
        {children}
      </main>
    </div>
  )
}
