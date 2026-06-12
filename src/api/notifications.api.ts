import { api } from './client'
import type { NotificationPage } from '../types/notification.types'

export async function getNotifications(page = 1, limit = 20, unreadOnly = false): Promise<NotificationPage> {
  const res = await api.get<NotificationPage>('/notifications', {
    params: { page, limit, unreadOnly },
  })
  return res.data
}

export async function getUnreadCount(): Promise<{ count: number }> {
  const res = await api.get<{ count: number }>('/notifications/unread-count')
  return res.data
}

export async function markAsRead(id: string): Promise<void> {
  await api.patch(`/notifications/${id}/read`)
}

export async function markAllAsRead(): Promise<{ updated: number }> {
  const res = await api.patch<{ updated: number }>('/notifications/read-all')
  return res.data
}
