import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { loginWithTelegram } from '../api/auth.api'
import { token } from '../utils/token'
import { getInitData, isInsideTelegram, initTelegramApp, applyTelegramTheme, getColorScheme } from '../utils/telegram'

type AuthStatus = 'loading' | 'unauthenticated' | 'not-telegram' | 'authenticated' | 'error'

interface AuthState {
  status:   AuthStatus
  humanId:  string | null
  error:    string | null
}

interface AuthContextValue extends AuthState {
  logout: () => void
  isDark: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    status:  'loading',
    humanId: null,
    error:   null,
  })
  const [isDark, setIsDark] = useState(true)

  const authenticate = useCallback(async () => {
    // 1. Init Telegram SDK
    initTelegramApp()
    applyTelegramTheme()
    setIsDark(getColorScheme() === 'dark')

    // 2. Must be inside Telegram
    if (!isInsideTelegram()) {
      setState({ status: 'not-telegram', humanId: null, error: null })
      return
    }

    // 3. If tokens already exist in sessionStorage, use them
    if (token.hasTokens()) {
      // Tokens were set in this session — user is authenticated
      // humanId stored separately for display
      const stored = sessionStorage.getItem('hs_human_id')
      setState({ status: 'authenticated', humanId: stored, error: null })
      return
    }

    // 4. Login with initData
    const initData = getInitData()
    if (!initData) {
      setState({ status: 'not-telegram', humanId: null, error: null })
      return
    }

    try {
      const result = await loginWithTelegram(initData)
      token.set(result.accessToken, result.refreshToken)
      sessionStorage.setItem('hs_human_id', result.humanId)
      setState({ status: 'authenticated', humanId: result.humanId, error: null })
    } catch {
      setState({ status: 'error', humanId: null, error: 'Authentication failed. Please try again.' })
    }
  }, [])

  useEffect(() => {
    authenticate()
  }, [authenticate])

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const logout = useCallback(() => {
    token.clear()
    sessionStorage.removeItem('hs_human_id')
    setState({ status: 'unauthenticated', humanId: null, error: null })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, logout, isDark }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
