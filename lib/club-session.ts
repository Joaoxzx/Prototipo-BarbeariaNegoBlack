export const CLUB_SESSION_KEY = 'negoblack-club-session'
export const CUSTOMER_PROFILES_KEY = 'negoblack-customer-profiles'
export const LAST_CUSTOMER_PHONE_KEY = 'negoblack-last-customer-phone'
export const CLUB_SESSION_CHANGE_EVENT = 'negoblack-club-session-change'

export type ClubSession = {
  name?: string
  phone?: string
  remainingCuts?: number
}

export type CustomerProfile = {
  name: string
  phone: string
}
