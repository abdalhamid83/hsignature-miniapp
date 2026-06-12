export interface AuthTokens {
  accessToken:  string
  refreshToken: string
  expiresIn:    string
}

export interface LoginResponse extends AuthTokens {
  humanId:   string
  isNewUser: boolean
}
