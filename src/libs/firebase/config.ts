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

// Debug Firebase configuration
if (typeof window !== 'undefined') {
  console.log('🔥 Firebase Config:', {
    apiKey: firebaseConfig.apiKey ? '✅ Set' : '❌ Missing',
    authDomain: firebaseConfig.authDomain ? '✅ Set' : '❌ Missing',
    projectId: firebaseConfig.projectId ? '✅ Set' : '❌ Missing',
    storageBucket: firebaseConfig.storageBucket ? '✅ Set' : '❌ Missing',
    messagingSenderId: firebaseConfig.messagingSenderId ? '✅ Set' : '❌ Missing',
    appId: firebaseConfig.appId ? '✅ Set' : '❌ Missing',
    measurementId: firebaseConfig.measurementId ? '✅ Set' : '❌ Missing',
  })

  // Log actual values for debugging (be careful with sensitive data)
  console.log('🔍 Firebase Project ID:', firebaseConfig.projectId)
  console.log('🔍 Firebase Auth Domain:', firebaseConfig.authDomain)
}

// Validate required configuration
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId']
const missingFields = requiredFields.filter((field) => !firebaseConfig[field as keyof typeof firebaseConfig])

if (missingFields.length > 0) {
  console.error('❌ Missing Firebase configuration fields:', missingFields)
  throw new Error(`Firebase configuration is incomplete. Missing: ${missingFields.join(', ')}`)
}

// Initialize Firebase
let app
try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
  console.log('✅ Firebase initialized successfully')
} catch (error) {
  console.error('❌ Firebase initialization failed:', error)
  throw error
}

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Initialize Analytics conditionally (only in browser and if supported)
export const analytics =
  typeof window !== 'undefined' ? isSupported().then((yes) => (yes ? getAnalytics(app) : null)) : Promise.resolve(null)

export default app
