import { api } from './client'
import type { UserProfile, UpdateProfilePayload } from '../types/user.types'

export async function getProfile(): Promise<UserProfile> {
  const res = await api.get<UserProfile>('/users/me')
  return res.data
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<Partial<UserProfile>> {
  const res = await api.patch<Partial<UserProfile>>('/users/me', payload)
  return res.data
}
