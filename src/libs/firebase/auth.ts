import type { User, UserCredential } from 'firebase/auth'

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  confirmPasswordReset,
} from 'firebase/auth'

import { auth } from './config'

// Sign up with email and password
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName?: string,
): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)

  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName })
  }

  return userCredential
}

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password)
}

// Sign out
export const signOutUser = async (): Promise<void> => {
  return signOut(auth)
}

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser
}

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

// Send password reset email
export const sendPasswordReset = async (email: string): Promise<void> => {
  return sendPasswordResetEmail(auth, email)
}

// Confirm password reset
export const confirmPasswordResetCode = async (code: string, newPassword: string): Promise<void> => {
  return confirmPasswordReset(auth, code, newPassword)
}

// Update user profile
export const updateUserProfile = async (updates: { displayName?: string; photoURL?: string }): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error('No user is currently signed in')
  }

  return updateProfile(auth.currentUser, updates)
}
