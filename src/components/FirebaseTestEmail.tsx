'use client'

import { useEffect, useState } from 'react'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { collection, getDocs } from 'firebase/firestore'

import { db, auth } from '@/libs/firebase/config'

export const FirebaseTestEmail = () => {
  const [firestoreStatus, setFirestoreStatus] = useState<'testing' | 'success' | 'error'>('testing')
  const [authStatus, setAuthStatus] = useState<'testing' | 'success' | 'error'>('testing')
  const [firestoreError, setFirestoreError] = useState<string>('')
  const [authError, setAuthError] = useState<string>('')
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('password123')

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

    testFirestore()
  }, [])

  // Test Firebase Auth with email/password
  const testAuth = async () => {
    setAuthStatus('testing')
    setAuthError('')

    try {
      console.log('🧪 Testing Firebase Auth with email/password...')
      const result = await signInWithEmailAndPassword(auth, email, password)
      console.log('✅ Authentication successful!')
      console.log('👤 User ID:', result.user.uid)
      console.log('📧 User Email:', result.user.email)
      setAuthStatus('success')
    } catch (error) {
      console.error('❌ Authentication failed:', error)
      setAuthError(error instanceof Error ? error.message : 'Unknown error')
      setAuthStatus('error')
    }
  }

  return (
    <div className='mx-auto mt-8 max-w-md rounded-lg bg-white p-6 shadow-md'>
      <h2 className='mb-4 text-xl font-bold'>Firebase Connection Test (Email/Password)</h2>

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
          <div className='space-y-2'>
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

            <div className='space-y-2'>
              <input
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <button
                onClick={testAuth}
                disabled={authStatus === 'testing'}
                className='w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50'
              >
                Test Authentication
              </button>
            </div>

            {authError && <p className='mt-1 text-sm text-red-600'>{authError}</p>}
          </div>
        </div>
      </div>

      <div className='mt-6 rounded bg-gray-50 p-4'>
        <h4 className='mb-2 font-semibold'>Setup Instructions:</h4>
        <ul className='space-y-1 text-sm text-gray-600'>
          <li>• Enable Email/Password authentication in Firebase Console</li>
          <li>• Add a test user with the email and password above</li>
          <li>• Or create your own test user and update the credentials</li>
          <li>• Check browser console for detailed logs</li>
        </ul>
      </div>
    </div>
  )
}
