import type { ApiResBodyBase } from '@/types/api'

export interface GuestDataCheckResponse {
  guestData: {
    hasCartItems: boolean
    hasOrders: boolean
    cartItemCount: number
    orderCount: number
  }
  orderHistory: Array<{
    id: string
    orderNumber: string
    status: string
    totalAmount: number
    createdAt: string
    itemCount: number
  }>
}

export interface RegisterAndMigratePayload {
  guestId: string
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
}

export interface RegisterAndMigrateResponse {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    type: string
    phone?: string
    emailVerified: boolean
    createdAt: string
    updatedAt: string
  }
  accessToken: string
  refreshToken: string
  migrationSummary: {
    cartItemsMigrated: number
    ordersMigrated: number
    addressesMigrated: number
  }
}

// Check guest data before migration
export const checkGuestData = async (guestId: string): Promise<{ success: boolean; data: GuestDataCheckResponse }> => {
  const response = await fetch(`/api/guest-migration/check/${guestId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to check guest data')
  }

  return response.json()
}

// Register and migrate guest data
export const registerAndMigrate = async (
  payload: RegisterAndMigratePayload,
): Promise<{ success: boolean; data: RegisterAndMigrateResponse }> => {
  const response = await fetch('/api/guest-migration/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to register and migrate guest data')
  }

  return response.json()
}
