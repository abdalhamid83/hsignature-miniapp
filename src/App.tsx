import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './store/AuthContext'
import { FullPageSpinner } from './components/ui/Spinner'
import { BottomNav } from './components/layout/BottomNav'
import { DashboardScreen }     from './screens/Dashboard/DashboardScreen'
import { NotificationsScreen } from './screens/Notifications/NotificationsScreen'
import { HHScreen }            from './screens/HH/HHScreen'
import { ProfileScreen }       from './screens/Profile/ProfileScreen'
import { InviteScreen }        from './screens/Invite/InviteScreen'
import { useState, useEffect } from 'react'
import { getUnreadCount } from './api/notifications.api'

function NotTelegramScreen() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-950 px-8 text-center">
      <span className="text-5xl mb-4">✈️</span>
      <h1 className="text-xl font-bold text-white mb-2">Open from Telegram</h1>
      <p className="text-gray-400 text-sm leading-relaxed">
        HSignature is a Telegram Mini App.<br />
        Please open it from the <span className="text-brand-400 font-semibold">@HSignatureBot</span> in Telegram.
      </p>
    </div>
  )
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-950 px-8 text-center">
      <span className="text-5xl mb-4">⚠️</span>
      <h1 className="text-xl font-bold text-white mb-2">Something went wrong</h1>
      <p className="text-gray-400 text-sm">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </div>
  )
}

function AuthenticatedApp() {
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    getUnreadCount().then((r) => setUnread(r.count))
    // Poll every 60s
    const interval = setInterval(() => {
      getUnreadCount().then((r) => setUnread(r.count))
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gray-950 min-h-screen">
      <Routes>
        <Route path="/"              element={<DashboardScreen />} />
        <Route path="/notifications" element={<NotificationsScreen />} />
        <Route path="/hh"            element={<HHScreen />} />
        <Route path="/profile"       element={<ProfileScreen />} />
        <Route path="/invite"        element={<InviteScreen />} />
        <Route path="*"              element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav unreadCount={unread} />
    </div>
  )
}

export default function App() {
  const { status, error } = useAuth()

  if (status === 'loading')       return <FullPageSpinner />
  if (status === 'not-telegram')  return <NotTelegramScreen />
  if (status === 'error')         return <ErrorScreen message={error ?? 'Unknown error'} />
  if (status === 'authenticated') return <AuthenticatedApp />

  return <FullPageSpinner />
}
