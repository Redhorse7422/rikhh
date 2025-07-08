export const GUEST_ID_KEY = 'cart_guest_id'

export function getGuestId(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem(GUEST_ID_KEY) : null
}

export function setGuestId(guestId: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(GUEST_ID_KEY, guestId)
  }
}
