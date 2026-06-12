// Token storage — sessionStorage intentionally chosen:
// - Cleared when Telegram closes the Mini App (correct behavior)
// - Re-auth via initData happens automatically on next open
// - Never persists across sessions for security

const ACCESS_KEY  = 'hs_access'
const REFRESH_KEY = 'hs_refresh'

export const token = {
  getAccess():  string | null { return sessionStorage.getItem(ACCESS_KEY) },
  getRefresh(): string | null { return sessionStorage.getItem(REFRESH_KEY) },

  set(access: string, refresh: string): void {
    sessionStorage.setItem(ACCESS_KEY,  access)
    sessionStorage.setItem(REFRESH_KEY, refresh)
  },

  clear(): void {
    sessionStorage.removeItem(ACCESS_KEY)
    sessionStorage.removeItem(REFRESH_KEY)
  },

  hasTokens(): boolean {
    return !!sessionStorage.getItem(ACCESS_KEY) &&
           !!sessionStorage.getItem(REFRESH_KEY)
  },
}
