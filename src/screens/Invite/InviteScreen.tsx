import { useState } from 'react'
import { PageLayout } from '../../components/layout/PageLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../store/AuthContext'
import { buildReferralLink } from '../../utils/referral'
import { getTelegramWebApp, haptic } from '../../utils/telegram'

export function InviteScreen() {
  const { humanId }  = useAuth()
  const [copied, setCopied] = useState(false)

  const link = humanId ? buildReferralLink(humanId) : ''

  async function handleCopy() {
    if (!link) return
    haptic('light')
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for environments without clipboard API
      const el = document.createElement('textarea')
      el.value = link
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleShare() {
    if (!link) return
    haptic('medium')
    const tg = getTelegramWebApp()
    if (tg) {
      // Use Telegram's native share
      const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent('Join me on HSignature — build your Human Presence Protocol identity.')}`
      window.open(shareUrl, '_blank')
    } else if (navigator.share) {
      navigator.share({ title: 'HSignature', url: link })
    }
  }

  return (
    <PageLayout title="Invite">
      <div className="space-y-4 pt-2 animate-fade-in">

        {/* Hero */}
        <div className="text-center py-6">
          <span className="text-5xl mb-3 block">🔗</span>
          <h2 className="text-lg font-bold text-white">Invite Humans</h2>
          <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">
            Share your personal invite link to bring new humans into the network.
          </p>
        </div>

        {/* Link */}
        <Card>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Your invite link</p>
          <div className="rounded-xl bg-gray-800 border border-gray-700 px-3 py-3 break-all">
            <p className="text-xs font-mono text-brand-400 leading-relaxed">{link || '—'}</p>
          </div>
          <div className="flex gap-2 mt-3">
            <Button
              variant="primary"
              fullWidth
              onClick={handleCopy}
              className={copied ? 'bg-emerald-600 border-emerald-600' : ''}
            >
              {copied ? '✓ Copied!' : '📋 Copy link'}
            </Button>
            <Button variant="secondary" fullWidth onClick={handleShare}>
              📤 Share
            </Button>
          </div>
        </Card>

        {/* Info */}
        <Card>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">How it works</p>
          <div className="space-y-2.5">
            {[
              { icon: '1️⃣', text: 'Share your personal invite link.' },
              { icon: '2️⃣', text: 'Friends open HSignature from Telegram.' },
              { icon: '3️⃣', text: 'They receive a Human ID and join the network.' },
            ].map((s) => (
              <div key={s.icon} className="flex items-start gap-2.5">
                <span className="text-base flex-shrink-0">{s.icon}</span>
                <p className="text-sm text-gray-300">{s.text}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-3 border-t border-gray-800 pt-3">
            Referral rewards are not yet active. Stay tuned for future updates.
          </p>
        </Card>

      </div>
    </PageLayout>
  )
}
