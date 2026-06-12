import { api } from './client'
import type { SignalDashboard, SignalHistoryItem } from '../types/hh.types'

export async function getSignal(): Promise<SignalDashboard> {
  const res = await api.get<SignalDashboard>('/signal')
  return res.data
}

export async function getSignalHistory(days = 30): Promise<{ userId: string; days: number; history: SignalHistoryItem[] }> {
  const res = await api.get(`/signal/history`, { params: { days } })
  return res.data
}
