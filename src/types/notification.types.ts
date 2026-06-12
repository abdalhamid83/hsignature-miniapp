export type NotificationCategory =
  | 'AUTH' | 'PROFILE' | 'HH' | 'HHD'
  | 'SIGNALS' | 'ADMIN' | 'SYSTEM' | 'SECURITY'

export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL'

export interface Notification {
  id:        string
  category:  NotificationCategory
  priority:  NotificationPriority
  title:     string
  message:   string
  metadata:  Record<string, unknown> | null
  readAt:    string | null
  createdAt: string
}

export interface NotificationPage {
  notifications: Notification[]
  pagination: {
    total:      number
    page:       number
    limit:      number
    pages:      number
    unreadOnly: boolean
  }
}
