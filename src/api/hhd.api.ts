import { api } from './client'
import type { HHDSnapshot } from '../types/hh.types'

export async function getHHD(): Promise<HHDSnapshot> {
  const res = await api.get<HHDSnapshot>('/network/hhd')
  return res.data
}
