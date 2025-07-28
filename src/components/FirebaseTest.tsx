'use client'

import { useEffect, useState } from 'react'

import { signInAnonymously } from 'firebase/auth'
import { collection, getDocs } from 'firebase/firestore'

import { db, auth } from '@/libs/firebase/config'

export const FirebaseTest = () => {
  const [firestoreStatus, setFirestoreStatus] = useState<'testing' | 'success' | 'error'>('testing')
  const [authStatus, setAuthStatus] = useState<'testing' | 'success' | 'error'>('testing')
  const [firestoreError, setFirestoreError] = useState<string>('')
  const [authError, setAuthError] = useState<string>('')

  useEffect(() => {
    // Test Firestore connection
    const testFirestore = async () => {
      try {
        console.log('🧪 Testing Firestore connection...')
        const testCollection = collection(db, 'test')
        const snapshot = await getDocs(testCollection)
        console.log('✅ Firestore connection successful!')
        console.log('📊 Documents found:', snapshot.size)
        setFirestoreStatus('success')
      } catch (error) {
        console.error('❌ Firestore connection failed:', error)
        setFirestoreError(error instanceof Error ? error.message : 'Unknown error')
        setFirestoreStatus('error')
      }
    }

    // Test Firebase Auth
    const testAuth = async () => {
      try {
        console.log('🧪 Testing Firebase Auth...')
        const result = await signInAnonymously(auth)
        console.log('✅ Authentication successful!')
        console.log('👤 User ID:', result.user.uid)
        setAuthStatus('success')
      } catch (error) {
        console.error('❌ Authentication failed:', error)
        setAuthError(error instanceof Error ? error.message : 'Unknown error')
        setAuthStatus('error')
      }
    }

    testFirestore()
    testAuth()
  }, [])

  return (
    <div className='mx-auto mt-8 max-w-md rounded-lg bg-white p-6 shadow-md'>
      <h2 className='mb-4 text-xl font-bold'>Firebase Connection Test</h2>

      <div className='space-y-4'>
        <div>
          <h3 className='mb-2 font-semibold'>Firestore Database</h3>
          <div className='flex items-center space-x-2'>
            {firestoreStatus === 'testing' && (
              <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600'></div>
            )}
            {firestoreStatus === 'success' && <div className='h-4 w-4 rounded-full bg-green-500'></div>}
            {firestoreStatus === 'error' && <div className='h-4 w-4 rounded-full bg-red-500'></div>}
            <span className={firestoreStatus === 'error' ? 'text-red-600' : 'text-gray-700'}>
              {firestoreStatus === 'testing' && 'Testing connection...'}
              {firestoreStatus === 'success' && 'Connected successfully'}
              {firestoreStatus === 'error' && 'Connection failed'}
            </span>
          </div>
          {firestoreError && <p className='mt-1 text-sm text-red-600'>{firestoreError}</p>}
        </div>

        <div>
          <h3 className='mb-2 font-semibold'>Firebase Authentication</h3>
          <div className='flex items-center space-x-2'>
            {authStatus === 'testing' && (
              <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600'></div>
            )}
            {authStatus === 'success' && <div className='h-4 w-4 rounded-full bg-green-500'></div>}
            {authStatus === 'error' && <div className='h-4 w-4 rounded-full bg-red-500'></div>}
            <span className={authStatus === 'error' ? 'text-red-600' : 'text-gray-700'}>
              {authStatus === 'testing' && 'Testing connection...'}
              {authStatus === 'success' && 'Connected successfully'}
              {authStatus === 'error' && 'Connection failed'}
            </span>
          </div>
          {authError && <p className='mt-1 text-sm text-red-600'>{authError}</p>}
        </div>
      </div>

      <div className='mt-6 rounded bg-gray-50 p-4'>
        <h4 className='mb-2 font-semibold'>Next Steps:</h4>
        <ul className='space-y-1 text-sm text-gray-600'>
          <li>• Check browser console for detailed logs</li>
          <li>• Verify Firestore Database is enabled in Firebase Console</li>
          <li>• Check security rules if connection fails</li>
          <li>• Ensure Authentication is enabled in Firebase Console</li>
        </ul>
      </div>
    </div>
  )
}
