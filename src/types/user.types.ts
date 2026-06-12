export interface Signal {
  confidence: number
  juice:      number
  level:      'SIGNAL' | 'VERIFIED' | 'TRUSTED' | 'EXPERT' | 'MASTER'
  updatedAt:  string
}

export interface UserProfile {
  id:                string
  humanId:           string
  telegramUsername:  string | null
  telegramFirstName: string | null
  telegramLastName:  string | null
  status:            'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  primaryLanguage:   string
  secondaryLanguage: string | null
  createdAt:         string
  updatedAt:         string
  signal:            Signal | null
  hhParticipations:  number
}

export interface UpdateProfilePayload {
  primaryLanguage?:   string
  secondaryLanguage?: string
}
