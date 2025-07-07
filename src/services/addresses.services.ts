import type { ApiResBodyBase } from '@/types/api'

export interface Address {
  id: string
  userId: string
  type: 'shipping' | 'billing' | 'both'
  status: 'active' | 'inactive'
  firstName: string
  lastName: string
  company: string | null
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
  isDefault: boolean
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface AddressesResponse {
  shipping: Address[]
  billing: Address[]
}

export interface CreateAddressDto {
  type: 'shipping' | 'billing' | 'both'
  firstName: string
  lastName: string
  company?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
  isDefault?: boolean
  notes?: string
}

export interface UpdateAddressDto extends Partial<CreateAddressDto> {
  id: string
}

// Fetch user addresses
export const getUserAddresses = async (): Promise<ApiResBodyBase<AddressesResponse>> => {
  const response = await fetch('/api/v1/addresses', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch addresses')
  }

  return response.json()
}

// Create new address
export const createAddress = async (addressData: CreateAddressDto): Promise<ApiResBodyBase<Address>> => {
  const response = await fetch('/api/v1/addresses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(addressData),
  })

  if (!response.ok) {
    throw new Error('Failed to create address')
  }

  return response.json()
}

// Update address
export const updateAddress = async (addressData: UpdateAddressDto): Promise<ApiResBodyBase<Address>> => {
  const response = await fetch(`/api/v1/addresses/${addressData.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(addressData),
  })

  if (!response.ok) {
    throw new Error('Failed to update address')
  }

  return response.json()
}

// Delete address
export const deleteAddress = async (addressId: string): Promise<ApiResBodyBase<void>> => {
  const response = await fetch(`/api/v1/addresses/${addressId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to delete address')
  }

  return response.json()
}
