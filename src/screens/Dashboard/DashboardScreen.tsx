import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../../components/layout/PageLayout'
import { Card } from '../../components/ui/Card'
import { Badge, hhdVariant } from '../../components/ui/Badge'
import { Spinner } from '../../components/ui/Spinner'
import { getSignal } from '../../api/signal.api'
import { getHHD } from '../../api/hhd.api'
import { getUnreadCount } from '../../api/notifications.api'
import type { SignalDashboard, HHDSnapshot } from '../../types/hh.types'
import { useAuth } from '../../store/AuthContext'

export function DashboardScreen() {
  const { humanId } = useAuth()
  const navigate    = useNavigate()

  const [signal,  setSignal]  = useState<SignalDashboard | null>(null)
  const [hhd,     setHhd]     = useState<HHDSnapshot | null>(null)
  const [unread,  setUnread]  = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getSignal(), getHHD(), getUnreadCount()])
      .then(([s, h, n]) => { setSignal(s); setHhd(h); setUnread(n.count) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <Spinner size="lg" />
      </div>
    )
  }

  const confidenceColor =
    (signal?.confidence ?? 0) >= 80 ? 'text-emerald-400' :
    (signal?.confidence ?? 0) >= 50 ? 'text-blue-400'    :
    (signal?.confidence ?? 0) >= 25 ? 'text-amber-400'   : 'text-red-400'

  return (
    <PageLayout>
      <div className="space-y-4 pt-4 animate-fade-in">

        {/* Human ID */}
        <div className="text-center pb-2">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Human ID</p>
          <p className="text-2xl font-bold font-mono text-brand-400">{humanId ?? '—'}</p>
        </div>

        {/* Signal Score */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Signal Score</p>
            <Badge label={signal?.level ?? '—'} variant="info" />
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className={`text-4xl font-bold ${confidenceColor}`}>
              {signal?.confidence.toFixed(1) ?? '0'}
            </span>
            <span className="text-gray-500 pb-1 text-sm">/ 100</span>
          </div>
          {/* Confidence bar */}
          <div className="h-2 rounded-full bg-gray-800">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all duration-500"
              style={{ width: `${signal?.confidence ?? 0}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-600">
            <span>Juice: {signal?.juice.toFixed(1) ?? '0'}</span>
            <span className={signal?.activeHH ? 'text-emerald-400' : 'text-gray-600'}>
              {signal?.activeHH ? '● HH Active' : '○ No HH'}
            </span>
          </div>
        </Card>

        {/* HHD */}
        <Card>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Network Health</p>
            <Badge label={hhd?.state ?? '—'} variant={hhdVariant(hhd?.state ?? '')} />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-white">
              {hhd?.score.toFixed(1) ?? '—'}
            </span>
            <span className="text-gray-500 pb-0.5 text-sm">HHD</span>
          </div>
          {hhd && (
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'Density',    value: `${hhd.humanDensity.toFixed(0)}%` },
                { label: 'HH Rate',   value: `${hhd.hhCompletionRate.toFixed(0)}%` },
                { label: 'Avg Conf',  value: `${hhd.avgConfidence.toFixed(0)}` },
              ].map((s) => (
                <div key={s.label} className="rounded-lg bg-gray-800/60 py-2">
                  <p className="text-xs font-semibold text-white">{s.value}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* HH + Notifications row */}
        <div className="grid grid-cols-2 gap-3">
          <Card onClick={() => navigate('/hh')} className="cursor-pointer">
            <p className="text-xs text-gray-500 mb-1">Hello Human</p>
            {signal?.activeHH ? (
              <div>
                <span className="text-emerald-400 text-sm font-semibold">Active ✓</span>
                <p className="text-xs text-gray-600 mt-0.5">Tap to respond</p>
              </div>
            ) : (
              <span className="text-gray-500 text-sm">No event</span>
            )}
          </Card>
          <Card onClick={() => navigate('/notifications')} className="cursor-pointer">
            <p className="text-xs text-gray-500 mb-1">Notifications</p>
            <div className="flex items-center gap-2">
              <span className="text-white text-2xl font-bold">{unread}</span>
              {unread > 0 && (
                <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] text-white">unread</span>
              )}
            </div>
          </Card>
        </div>

      </div>
    </PageLayout>
  )
}
