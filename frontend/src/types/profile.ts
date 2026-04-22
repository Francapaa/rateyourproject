export interface ProfileData {
  id: string
  email: string
  name: string
  avatar_url: string | null
  role: string
  seniority: string
  is_premium: boolean
}

export interface UpdateProfileInput {
  role: string
  seniority: string
}
