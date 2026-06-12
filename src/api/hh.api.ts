import { api } from './client'
import type { ActiveHH, HHHistoryItem } from '../types/hh.types'

export async function getActiveHH(): Promise<ActiveHH> {
  const res = await api.get<ActiveHH>('/hh/active')
  return res.data
}

export async function respondToHH(): Promise<{ message: string; respondedAt: string }> {
  const res = await api.post('/hh/respond')
  return res.data
}

export async function getHHHistory(limit = 30): Promise<HHHistoryItem[]> {
  const res = await api.get<HHHistoryItem[]>('/hh/history', { params: { limit } })
  return res.data
}
