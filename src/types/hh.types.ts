export interface ActiveHH {
  hasActiveEvent:       boolean
  eventId:              string | null
  eventType:            string | null
  hasResponded:         boolean
  expiresAt:            string | null
  timeRemainingSeconds: number
}

export interface HHHistoryItem {
  eventId:     string
  scheduledAt: string
  expiresAt:   string
  status:      'ACTIVE' | 'EXPIRED' | 'COMPLETED'
  responded:   boolean
  respondedAt: string | null
}

export interface HHDSnapshot {
  score:            number
  state:            'EXCEPTIONAL' | 'HEALTHY' | 'WARNING' | 'CRITICAL'
  humanDensity:     number
  hhCompletionRate: number
  avgConfidence:    number
  totalUsers:       number
  activeUsers:      number
  capturedAt:       string
}

export interface SignalDashboard {
  humanId:    string
  confidence: number
  juice:      number
  level:      string
  activeHH:   boolean
}

export interface SignalHistoryItem {
  confidence: number
  juice:      number
  level:      string
  capturedAt: string
}
