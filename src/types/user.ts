// User Management Types

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: 'admin' | 'seller' | 'buyer'
  status: 'active' | 'inactive' | 'suspended'
  emailVerified: boolean
  phoneVerified: boolean
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  profile?: UserProfile
  addresses?: UserAddress[]
  preferences?: UserPreferences
}

export interface UserProfile {
  firstName: string
  lastName: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  bio?: string
  website?: string
  socialLinks?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
}

export interface UserAddress {
  id: string
  type: 'billing' | 'shipping'
  isDefault: boolean
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
}

export interface UserPreferences {
  language: string
  currency: string
  timezone: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  theme: 'light' | 'dark' | 'auto'
}

export interface UserFilterValues {
  search: string
  role: string
  status: string
  emailVerified: string
  dateRange: {
    start: string
    end: string
  }
}

export interface UserStats {
  total: number
  active: number
  inactive: number
  suspended: number
  admin: number
  seller: number
  buyer: number
  verified: number
  unverified: number
}

export interface CreateUserData {
  userName: string
  lastName: string
  firstName: string
  email: string
  phone?: string
  role: 'admin' | 'seller' | 'buyer'
  password: string
  isActive: boolean
  profile?: Partial<UserProfile>
}

export interface UpdateUserData {
  name?: string
  email?: string
  phone?: string
  role?: 'admin' | 'seller' | 'buyer'
  status?: 'active' | 'inactive' | 'suspended'
  profile?: Partial<UserProfile>
}
