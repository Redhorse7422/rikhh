import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  startAfter,
  limit,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'

import { db } from '@/libs/firebase/config'
import { FirestoreService } from '@/libs/firebase/firestore'

// User interface for Firestore based on the screenshot
interface FirestoreUser {
  uid: string
  name: string
  email: string
  phone: string
  provider: 'PHONE' | 'EMAIL' | 'GOOGLE' | 'FACEBOOK'
  status: 'approved' | 'pending' | 'rejected' | 'blocked'
  isApproved: boolean
  isBlocked: boolean
  isDeleteMarked: boolean
  image_url?: string
  address?: string
  createdAt?: any
  updatedAt?: any
}

interface UserListResponse {
  data: FirestoreUser[]
  nextCursor: any
  hasNextPage: boolean
}

interface CreateUserData {
  name: string
  email: string
  phoneNumber: string
  type: 'buyer' | 'seller'
  // Address data
  street?: string
  city?: string
  state?: string
  zipCode?: string
}

class UserFirebaseService extends FirestoreService<FirestoreUser> {
  constructor() {
    super('users')
  }

  // Create a new user with phone verification
  async createUser(userData: CreateUserData): Promise<string> {
    try {
      const userDoc: Omit<FirestoreUser, 'uid' | 'createdAt' | 'updatedAt'> = {
        name: userData.name,
        email: userData.email,
        phone: userData.phoneNumber,
        provider: 'PHONE',
        status: 'approved',
        isApproved: true,
        isBlocked: false,
        isDeleteMarked: false,
        image_url: 'https://winaero.com/blog/wp-content/uploads/2017/12/User-icon-256-blue.png', // Default avatar
      }

      // Prepare address as a single string (always includes India)
      const addressString =
        userData.street && userData.city
          ? `${userData.street}, ${userData.city}, ${userData.state} ${userData.zipCode}, India`
          : ''

      const addressData = addressString ? { address: addressString } : {}

      const docRef = await addDoc(collection(db, 'users'), {
        ...userDoc,
        ...addressData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      return docRef.id
    } catch (error) {
      console.error('Error creating user:', error)
      throw new Error('Failed to create user')
    }
  }

  // Get user by phone number
  async getUserByPhone(phone: string): Promise<FirestoreUser | null> {
    try {
      const q = query(collection(db, 'users'), where('phone', '==', phone))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        return null
      }

      const userDoc = querySnapshot.docs[0]
      return { uid: userDoc.id, ...userDoc.data() } as FirestoreUser
    } catch (error) {
      console.error('Error fetching user by phone:', error)
      return null
    }
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<FirestoreUser | null> {
    try {
      const q = query(collection(db, 'users'), where('email', '==', email))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        return null
      }

      const userDoc = querySnapshot.docs[0]
      return { uid: userDoc.id, ...userDoc.data() } as FirestoreUser
    } catch (error) {
      console.error('Error fetching user by email:', error)
      return null
    }
  }

  // Get user by UID
  async getUserByUid(uid: string): Promise<FirestoreUser | null> {
    try {
      const docRef = doc(db, 'users', uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return { uid: docSnap.id, ...docSnap.data() } as FirestoreUser
      }

      return null
    } catch (error) {
      console.error('Error fetching user by UID:', error)
      return null
    }
  }

  // Get all users with pagination
  async getAllUsers({
    limit: limitCount = 10,
    lastVisible,
    search,
    status,
    provider,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  }: {
    limit?: number
    lastVisible?: any
    search?: string
    status?: string
    provider?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<UserListResponse> {
    try {
      let q = query(collection(db, 'users'))

      // Apply filters
      if (status) {
        q = query(q, where('status', '==', status))
      }
      if (provider) {
        q = query(q, where('provider', '==', provider))
      }

      // Sorting
      q = query(q, orderBy(sortBy, sortOrder))

      // Pagination
      if (lastVisible) {
        q = query(q, startAfter(lastVisible))
      }

      // Limit
      q = query(q, limit(limitCount))

      const snapshot = await getDocs(q)

      const users = snapshot.docs.map((userDoc) => {
        const data = userDoc.data()
        return {
          uid: userDoc.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          provider: data.provider,
          status: data.status,
          isApproved: data.isApproved,
          isBlocked: data.isBlocked,
          isDeleteMarked: data.isDeleteMarked,
          image_url: data.image_url,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        } as FirestoreUser
      })

      // Apply search filter if provided
      let filteredUsers = users
      if (search) {
        filteredUsers = users.filter(
          (user) =>
            user.name?.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase()) ||
            user.phone?.includes(search),
        )
      }

      const nextCursor = snapshot.docs[snapshot.docs.length - 1]?.get(sortBy)

      return {
        data: filteredUsers,
        nextCursor: nextCursor ?? null,
        hasNextPage: snapshot.docs.length === limitCount,
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      return {
        data: [],
        nextCursor: null,
        hasNextPage: false,
      }
    }
  }

  // Update user
  async updateUser(uid: string, userData: Partial<FirestoreUser>): Promise<void> {
    try {
      const docRef = doc(db, 'users', uid)
      await updateDoc(docRef, {
        ...userData,
        updatedAt: new Date(),
      })
    } catch (error) {
      console.error('Error updating user:', error)
      throw new Error('Failed to update user')
    }
  }

  // Delete user (soft delete)
  async deleteUser(uid: string): Promise<void> {
    try {
      const docRef = doc(db, 'users', uid)
      await updateDoc(docRef, {
        isDeleteMarked: true,
        updatedAt: new Date(),
      })
    } catch (error) {
      console.error('Error deleting user:', error)
      throw new Error('Failed to delete user')
    }
  }

  // Hard delete user
  async hardDeleteUser(uid: string): Promise<void> {
    try {
      const docRef = doc(db, 'users', uid)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error hard deleting user:', error)
      throw new Error('Failed to hard delete user')
    }
  }

  // Check if user exists by phone
  async checkUserExistsByPhone(phone: string): Promise<boolean> {
    const user = await this.getUserByPhone(phone)
    return user !== null
  }

  // Check if user exists by email
  async checkUserExistsByEmail(email: string): Promise<boolean> {
    const user = await this.getUserByEmail(email)
    return user !== null
  }

  // Get user statistics
  async getUserStats(): Promise<{
    total: number
    approved: number
    pending: number
    blocked: number
    phoneUsers: number
    emailUsers: number
  }> {
    try {
      const allUsers = await this.getAllUsers({ limit: 1000 })

      const stats = {
        total: allUsers.data.length,
        approved: allUsers.data.filter((user) => user.isApproved).length,
        pending: allUsers.data.filter((user) => user.status === 'pending').length,
        blocked: allUsers.data.filter((user) => user.isBlocked).length,
        phoneUsers: allUsers.data.filter((user) => user.provider === 'PHONE').length,
        emailUsers: allUsers.data.filter((user) => user.provider === 'EMAIL').length,
      }

      return stats
    } catch (error) {
      console.error('Error getting user stats:', error)
      return {
        total: 0,
        approved: 0,
        pending: 0,
        blocked: 0,
        phoneUsers: 0,
        emailUsers: 0,
      }
    }
  }
}

export const userFirebaseService = new UserFirebaseService()
