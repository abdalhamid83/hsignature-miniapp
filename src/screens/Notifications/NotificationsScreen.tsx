import { useEffect, useState, useCallback } from 'react'
import { PageLayout } from '../../components/layout/PageLayout'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { EmptyState } from '../../components/ui/EmptyState'
import { Badge } from '../../components/ui/Badge'
import { getNotifications, markAsRead, markAllAsRead } from '../../api/notifications.api'
import type { Notification } from '../../types/notification.types'
import { haptic } from '../../utils/telegram'

const PRIORITY_VARIANTS = {
  CRITICAL: 'error',
  HIGH:     'warning',
  NORMAL:   'info',
  LOW:      'default',
} as const

const CATEGORY_ICONS: Record<string, string> = {
  AUTH: '🔑', PROFILE: '👤', HH: '👋', HHD: '📊',
  SIGNALS: '📡', ADMIN: '⚙️', SYSTEM: '🔧', SECURITY: '🛡️',
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function NotificationsScreen() {
  const [items,       setItems]       = useState<Notification[]>([])
  const [page,        setPage]        = useState(1)
  const [totalPages,  setTotalPages]  = useState(1)
  const [loading,     setLoading]     = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [markingAll,  setMarkingAll]  = useState(false)

  const loadPage = useCallback(async (p: number, append = false) => {
    if (p === 1) setLoading(true); else setLoadingMore(true)
    try {
      const data = await getNotifications(p, 20)
      setItems((prev) => append ? [...prev, ...data.notifications] : data.notifications)
      setTotalPages(data.pagination.pages)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => { loadPage(1) }, [loadPage])

  async function handleRead(id: string) {
    haptic('light')
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
    await markAsRead(id)
  }

  async function handleReadAll() {
    haptic('success')
    setMarkingAll(true)
    try {
      await markAllAsRead()
      setItems((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })))
    } finally {
      setMarkingAll(false)
    }
  }

  function loadMore() {
    const next = page + 1
    setPage(next)
    loadPage(next, true)
  }

  const unreadCount = items.filter((n) => !n.readAt).length

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-950">
      <Spinner size="lg" />
    </div>
  )

  return (
    <PageLayout
      title="Notifications"
      action={
        unreadCount > 0 ? (
          <Button variant="ghost" onClick={handleReadAll} loading={markingAll} className="text-xs py-1.5 px-3">
            Read all
          </Button>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <EmptyState icon="🔔" title="No notifications" message="You're all caught up. New notifications will appear here." />
      ) : (
        <div className="space-y-2 pt-2">
          {items.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.readAt && handleRead(n.id)}
              className={`rounded-2xl border p-4 transition-colors ${
                n.readAt
                  ? 'border-gray-800 bg-gray-900/50'
                  : 'border-gray-700 bg-gray-900 cursor-pointer active:scale-[0.99]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="text-xl flex-shrink-0 mt-0.5">
                    {CATEGORY_ICONS[n.category] ?? '📬'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-semibold truncate ${n.readAt ? 'text-gray-400' : 'text-white'}`}>
                        {n.title}
                      </p>
                      {!n.readAt && (
                        <span className="h-2 w-2 rounded-full bg-brand-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge label={n.priority} variant={PRIORITY_VARIANTS[n.priority]} />
                      <span className="text-[10px] text-gray-600">{timeAgo(n.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {page < totalPages && (
            <div className="flex justify-center pt-2 pb-4">
              <Button variant="secondary" onClick={loadMore} loading={loadingMore}>
                Load more
              </Button>
            </div>
          )}
        </div>
      )}
    </PageLayout>
  )
}
