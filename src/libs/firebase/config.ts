import { getAnalytics, isSupported } from 'firebase/analytics'
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Validate required configuration
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId']
const missingFields = requiredFields.filter((field) => !firebaseConfig[field as keyof typeof firebaseConfig])

if (missingFields.length > 0) {
  console.error('❌ Missing Firebase configuration fields:', missingFields)
  throw new Error(`Firebase configuration is incomplete. Missing: ${missingFields.join(', ')}`)
}

// Initialize Firebase with proper singleton pattern
function getFirebaseApp() {
  try {
    // Check if Firebase is already initialized
    const existingApps = getApps()
    let app: any

    if (existingApps.length > 0) {
      app = getApp()
      // Only log once when reusing existing instance
      if (!(globalThis as any).__firebaseLogged) {
        console.log('✅ Firebase already initialized, reusing existing instance')
        ;(globalThis as any).__firebaseLogged = true
      }
    } else {
      // Initialize Firebase
      app = initializeApp(firebaseConfig)
      // Only log once when initializing
      if (!(globalThis as any).__firebaseLogged) {
        console.log('✅ Firebase initialized successfully')
        ;(globalThis as any).__firebaseLogged = true
      }
    }

    return app
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error)
    throw error
  }
}

// Get the Firebase app instance
const app = getFirebaseApp()

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Initialize Analytics conditionally (only in browser and if supported)
export const analytics =
  typeof window !== 'undefined' ? isSupported().then((yes) => (yes ? getAnalytics(app) : null)) : Promise.resolve(null)

export default app
