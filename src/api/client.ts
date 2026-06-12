import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { token } from '../utils/token'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Attach access token to every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const access = token.getAccess()
  if (access) config.headers.Authorization = `Bearer ${access}`
  return config
})

// Track whether a refresh is already in progress to avoid loops
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: string) => void
  reject:  (reason: unknown) => void
}> = []

function processQueue(error: unknown, newToken: string | null = null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(newToken!)))
  failedQueue = []
}

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Only attempt refresh on 401, only once per request
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    const refreshToken = token.getRefresh()
    if (!refreshToken) {
      token.clear()
      window.location.reload()
      return Promise.reject(error)
    }

    if (isRefreshing) {
      // Queue this request until refresh completes
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((newToken) => {
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      })
    }

    original._retry = true
    isRefreshing = true

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/refresh`, {
        refreshToken,
      })
      const { accessToken, refreshToken: newRefresh } = res.data.data
      token.set(accessToken, newRefresh)
      processQueue(null, accessToken)
      original.headers.Authorization = `Bearer ${accessToken}`
      return api(original)
    } catch (err) {
      processQueue(err, null)
      token.clear()
      window.location.reload()
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  },
)

// Unwrap the backend envelope automatically
// All responses return { success, statusCode, timestamp, data }
api.interceptors.response.use((res) => {
  if (res.data && 'data' in res.data) {
    res.data = res.data.data
  }
  return res
})
