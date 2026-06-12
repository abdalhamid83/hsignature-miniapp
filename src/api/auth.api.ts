import axios from 'axios'
import type { LoginResponse, AuthTokens } from '../types/auth.types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

// Uses plain axios — not the intercepted instance — to avoid token loops
export async function loginWithTelegram(initData: string): Promise<LoginResponse> {
  const res = await axios.post(`${BASE_URL}/api/v1/auth/telegram`, { initData })
  return res.data.data
}

export async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  const res = await axios.post(`${BASE_URL}/api/v1/auth/refresh`, { refreshToken })
  return res.data.data
}
