import { useLocation, useNavigate } from 'react-router-dom'
import { haptic } from '../../utils/telegram'

const TABS = [
  { path: '/',              icon: '◈',  label: 'Signal'  },
  { path: '/hh',            icon: '👋', label: 'HH'      },
  { path: '/notifications', icon: '🔔', label: 'Alerts'  },
  { path: '/profile',       icon: '◉',  label: 'Profile' },
  { path: '/invite',        icon: '🔗', label: 'Invite'  },
]

interface BottomNavProps {
  unreadCount?: number
}

export function BottomNav({ unreadCount = 0 }: BottomNavProps) {
  const { pathname } = useLocation()
  const navigate     = useNavigate()

  function go(path: string) {
    if (pathname !== path) {
      haptic('light')
      navigate(path)
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800 bg-gray-950/95 backdrop-blur-sm">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {TABS.map((tab) => {
          const active = pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => go(tab.path)}
              className={`relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 min-w-[56px] transition-colors ${
                active ? 'text-brand-400' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
              {tab.path === '/notifications' && unreadCount > 0 && (
                <span className="absolute -top-0.5 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
