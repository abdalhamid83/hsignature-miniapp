import { useEffect, useState } from 'react'
import { PageLayout } from '../../components/layout/PageLayout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Spinner } from '../../components/ui/Spinner'
import { getProfile } from '../../api/users.api'
import type { UserProfile } from '../../types/user.types'

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-white text-right max-w-[60%] truncate">
        {value || '—'}
      </span>
    </div>
  )
}

export function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfile().then(setProfile).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-950">
      <Spinner size="lg" />
    </div>
  )

  return (
    <PageLayout title="Profile">
      <div className="space-y-4 pt-2 animate-fade-in">

        {/* Identity */}
        <div className="text-center py-4">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-brand-900/50 border border-brand-700/50">
            <span className="text-2xl">◉</span>
          </div>
          <p className="font-mono text-xl font-bold text-brand-400">{profile?.humanId ?? '—'}</p>
          <div className="mt-1.5 flex items-center justify-center gap-2">
            <Badge
              label={profile?.status ?? '—'}
              variant={profile?.status === 'ACTIVE' ? 'success' : profile?.status === 'SUSPENDED' ? 'error' : 'default'}
            />
          </div>
        </div>

        {/* Telegram Info */}
        <Card>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Telegram</p>
          <Row label="Name" value={[profile?.telegramFirstName, profile?.telegramLastName].filter(Boolean).join(' ')} />
          <Row label="Username" value={profile?.telegramUsername ? `@${profile.telegramUsername}` : null} />
        </Card>

        {/* Account Info */}
        <Card>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Account</p>
          <Row label="Human ID"       value={profile?.humanId} />
          <Row label="Primary Lang"   value={profile?.primaryLanguage?.toUpperCase()} />
          <Row label="Secondary Lang" value={profile?.secondaryLanguage?.toUpperCase()} />
          <Row label="Joined"         value={profile?.createdAt ? formatDate(profile.createdAt) : null} />
          <Row label="HH Events"      value={profile?.hhParticipations?.toString()} />
        </Card>

        {/* Signal */}
        {profile?.signal && (
          <Card>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Signal</p>
            <Row label="Confidence" value={`${profile.signal.confidence.toFixed(1)} / 100`} />
            <Row label="Juice"      value={`${profile.signal.juice.toFixed(1)}`} />
            <Row label="Level"      value={profile.signal.level} />
          </Card>
        )}

      </div>
    </PageLayout>
  )
}
