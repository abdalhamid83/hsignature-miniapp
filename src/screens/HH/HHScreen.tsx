import { useEffect, useState, useCallback } from 'react'
import { PageLayout } from '../../components/layout/PageLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { EmptyState } from '../../components/ui/EmptyState'
import { Badge } from '../../components/ui/Badge'
import { getActiveHH, respondToHH, getHHHistory } from '../../api/hh.api'
import type { ActiveHH, HHHistoryItem } from '../../types/hh.types'
import { haptic } from '../../utils/telegram'

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return 'Expired'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m remaining`
  return `${m}m remaining`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en', { month: 'short', day: 'numeric' })
}

export function HHScreen() {
  const [activeHH,   setActiveHH]   = useState<ActiveHH | null>(null)
  const [history,    setHistory]    = useState<HHHistoryItem[]>([])
  const [loading,    setLoading]    = useState(true)
  const [responding, setResponding] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [a, h] = await Promise.all([getActiveHH(), getHHHistory(30)])
      setActiveHH(a)
      setHistory(h)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleRespond() {
    if (!activeHH?.hasActiveEvent || activeHH.hasResponded) return
    haptic('medium')
    setResponding(true)
    try {
      await respondToHH()
      haptic('success')
      // Optimistically update
      setActiveHH((prev) => prev ? { ...prev, hasResponded: true } : prev)
    } finally {
      setResponding(false)
    }
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-950">
      <Spinner size="lg" />
    </div>
  )

  const respondedCount = history.filter((h) => h.responded).length
  const completionRate = history.length > 0
    ? Math.round((respondedCount / history.length) * 100) : 0

  return (
    <PageLayout title="Hello Human">
      <div className="space-y-4 pt-2 animate-fade-in">

        {/* Active Event */}
        <Card>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Today's HH</p>
          {activeHH?.hasActiveEvent ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge
                  label={activeHH.hasResponded ? 'Responded ✓' : 'Pending'}
                  variant={activeHH.hasResponded ? 'success' : 'warning'}
                />
                <span className="text-xs text-gray-500">
                  {formatCountdown(activeHH.timeRemainingSeconds)}
                </span>
              </div>

              {!activeHH.hasResponded ? (
                <div>
                  <p className="text-sm text-gray-300 mb-3">
                    A new HH event is active. Confirm your presence to build your confidence score.
                  </p>
                  <Button fullWidth onClick={handleRespond} loading={responding}>
                    👋 Hello Human — I'm Here
                  </Button>
                </div>
              ) : (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-center">
                  <p className="text-emerald-400 font-semibold text-sm">Presence confirmed ✓</p>
                  <p className="text-xs text-gray-500 mt-0.5">Your signal score will update tonight</p>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              icon="🌙"
              title="No active HH event"
              message="The next Hello Human event will start at midnight UTC."
            />
          )}
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Last 30',  value: history.length },
            { label: 'Responded', value: respondedCount },
            { label: 'Rate',      value: `${completionRate}%` },
          ].map((s) => (
            <Card key={s.label} className="text-center py-3">
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">History</p>
            <div className="space-y-1.5">
              {history.map((item) => (
                <div
                  key={item.eventId}
                  className="flex items-center justify-between rounded-xl bg-gray-900 border border-gray-800 px-3 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-lg ${item.responded ? 'text-emerald-400' : 'text-gray-600'}`}>
                      {item.responded ? '✓' : '○'}
                    </span>
                    <span className="text-sm text-gray-300">{formatDate(item.scheduledAt)}</span>
                  </div>
                  <div className="text-right">
                    <Badge
                      label={item.responded ? 'Responded' : 'Missed'}
                      variant={item.responded ? 'success' : 'default'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </PageLayout>
  )
}
