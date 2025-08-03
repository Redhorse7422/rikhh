import { addDoc, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'

import { db } from '@/libs/firebase/config'

// Booking interface based on your Firestore structure
export interface Booking {
  id?: string
  firstName: string
  lastName?: string
  email: string
  phone: string
  streetAddress: string
  town?: string
  country?: string
  postCode?: string
  productId: string
  productName: string
  productCategory?: string
  imageUrl: string
  price: number
  quantity: number
  sellerId: string
  userId: string
  orderNotes?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  timestamp: Date
  bookingDate?: string
  visitBefore?: string
}

class BookingFirebaseService {
  private collectionName = 'bookings'

  // Create a new booking
  async createBooking(bookingData: Omit<Booking, 'id' | 'timestamp'>): Promise<string> {
    try {
      const bookingWithTimestamp = {
        ...bookingData,
        timestamp: new Date(),
        status: 'pending' as const,
      }

      const docRef = await addDoc(collection(db, this.collectionName), bookingWithTimestamp)
      return docRef.id
    } catch (error) {
      console.error('Error creating booking:', error)
      throw new Error('Failed to create booking')
    }
  }

  // Get bookings by user ID
  async getBookingsByUserId(userId: string): Promise<Booking[]> {
    try {
      const q = query(collection(db, this.collectionName), where('userId', '==', userId), orderBy('timestamp', 'desc'))

      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[]
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      return []
    }
  }

  // Get bookings by seller ID
  async getBookingsBySellerId(sellerId: string): Promise<Booking[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('sellerId', '==', sellerId),
        orderBy('timestamp', 'desc'),
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[]
    } catch (error) {
      console.error('Error fetching seller bookings:', error)
      return []
    }
  }

  // Get recent bookings (for admin/dashboard)
  async getRecentBookings(limitCount: number = 10): Promise<Booking[]> {
    try {
      const q = query(collection(db, this.collectionName), orderBy('timestamp', 'desc'), limit(limitCount))

      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[]
    } catch (error) {
      console.error('Error fetching recent bookings:', error)
      return []
    }
  }
}

export const bookingFirebaseService = new BookingFirebaseService()
