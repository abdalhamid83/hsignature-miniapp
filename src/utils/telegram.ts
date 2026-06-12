// Telegram WebApp SDK helpers
// Works with both @twa-dev/sdk and the globally injected window.Telegram

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

interface TelegramWebApp {
  initData: string
  initDataUnsafe: {
    user?: {
      id: number
      first_name: string
      last_name?: string
      username?: string
      language_code?: string
    }
    start_param?: string
  }
  version: string
  platform: string
  colorScheme: 'light' | 'dark'
  themeParams: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    link_color?: string
    button_color?: string
    button_text_color?: string
    secondary_bg_color?: string
  }
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  ready: () => void
  expand: () => void
  close: () => void
  showPopup: (params: object, callback?: (id: string) => void) => void
  showAlert: (message: string, callback?: () => void) => void
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void
  setHeaderColor: (color: string) => void
  setBackgroundColor: (color: string) => void
  enableClosingConfirmation: () => void
  disableClosingConfirmation: () => void
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
    selectionChanged: () => void
  }
  BackButton: {
    isVisible: boolean
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
  }
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    showProgress: (leaveActive?: boolean) => void
    hideProgress: () => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
    setText: (text: string) => void
  }
}

/**
 * Returns the Telegram WebApp instance.
 * Works with both the global injection and @twa-dev/sdk.
 */
export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp
  }
  return null
}

/**
 * Returns true if the app is running inside Telegram.
 * initData is only present when opened from Telegram.
 */
export function isInsideTelegram(): boolean {
  const tg = getTelegramWebApp()
  return !!tg && !!tg.initData && tg.initData.length > 0
}

/**
 * Returns the raw initData string for backend authentication.
 */
export function getInitData(): string | null {
  const tg = getTelegramWebApp()
  if (!tg || !tg.initData) return null
  return tg.initData
}

/**
 * Returns the Telegram user from initDataUnsafe.
 * NOTE: This is UNSIGNED data — used only for UI display, never for auth.
 */
export function getTelegramUser() {
  const tg = getTelegramWebApp()
  return tg?.initDataUnsafe?.user ?? null
}

/**
 * Returns current color scheme.
 */
export function getColorScheme(): 'light' | 'dark' {
  const tg = getTelegramWebApp()
  return tg?.colorScheme ?? 'dark'
}

/**
 * Initialize the Mini App — must be called once on startup.
 */
export function initTelegramApp(): void {
  const tg = getTelegramWebApp()
  if (!tg) return
  tg.ready()
  tg.expand()
}

/**
 * Apply Telegram theme variables to CSS custom properties.
 */
export function applyTelegramTheme(): void {
  const tg = getTelegramWebApp()
  if (!tg?.themeParams) return
  const { themeParams } = tg
  const root = document.documentElement

  if (themeParams.bg_color)            root.style.setProperty('--tg-theme-bg-color', themeParams.bg_color)
  if (themeParams.text_color)          root.style.setProperty('--tg-theme-text-color', themeParams.text_color)
  if (themeParams.hint_color)          root.style.setProperty('--tg-theme-hint-color', themeParams.hint_color)
  if (themeParams.link_color)          root.style.setProperty('--tg-theme-link-color', themeParams.link_color)
  if (themeParams.button_color)        root.style.setProperty('--tg-theme-button-color', themeParams.button_color)
  if (themeParams.button_text_color)   root.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color)
  if (themeParams.secondary_bg_color)  root.style.setProperty('--tg-theme-secondary-bg-color', themeParams.secondary_bg_color)
}

/**
 * Trigger haptic feedback.
 */
export function haptic(type: 'success' | 'error' | 'warning' | 'light' | 'medium'): void {
  const tg = getTelegramWebApp()
  if (!tg?.HapticFeedback) return
  if (type === 'success' || type === 'error' || type === 'warning') {
    tg.HapticFeedback.notificationOccurred(type)
  } else {
    tg.HapticFeedback.impactOccurred(type)
  }
}
