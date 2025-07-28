import type {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Query,
  QuerySnapshot,
  DocumentSnapshot,
  WriteBatch,
  Transaction,
} from 'firebase/firestore'

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  endBefore,
  writeBatch,
  runTransaction,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'

import { db } from './config'

// Generic CRUD operations
export class FirestoreService<T = DocumentData> {
  private collectionRef: CollectionReference<T>

  constructor(collectionName: string) {
    this.collectionRef = collection(db, collectionName) as CollectionReference<T>
  }

  // Create a new document
  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as T & { createdAt: any; updatedAt: any }

    const docRef = await addDoc(this.collectionRef, docData)
    return docRef.id
  }

  // Get a document by ID
  async getById(id: string): Promise<T | null> {
    const docRef = doc(this.collectionRef, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T
    }

    return null
  }

  // Get all documents
  async getAll(): Promise<T[]> {
    const querySnapshot = await getDocs(this.collectionRef)
    return querySnapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }) as T)
  }

  // Update a document
  async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(this.collectionRef, id)
    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    }

    await updateDoc(docRef, updateData)
  }

  // Delete a document
  async delete(id: string): Promise<void> {
    const docRef = doc(this.collectionRef, id)
    await deleteDoc(docRef)
  }

  // Query documents with filters
  async query(filters: {
    field?: string
    operator?: '==' | '!=' | '<' | '<=' | '>' | '>='
    value?: any
    orderBy?: string
    orderDirection?: 'asc' | 'desc'
    limit?: number
  }): Promise<T[]> {
    let q: Query<T> = this.collectionRef

    if (filters.field && filters.operator && filters.value !== undefined) {
      q = query(q, where(filters.field, filters.operator, filters.value))
    }

    if (filters.orderBy) {
      q = query(q, orderBy(filters.orderBy, filters.orderDirection || 'asc'))
    }

    if (filters.limit) {
      q = query(q, limit(filters.limit))
    }

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }) as T)
  }

  // Real-time listener
  onSnapshot(
    callback: (docs: T[]) => void,
    filters?: {
      field?: string
      operator?: '==' | '!=' | '<' | '<=' | '>' | '>='
      value?: any
      orderBy?: string
      orderDirection?: 'asc' | 'desc'
    },
  ) {
    let q: Query<T> = this.collectionRef

    if (filters?.field && filters?.operator && filters?.value !== undefined) {
      q = query(q, where(filters.field, filters.operator, filters.value))
    }

    if (filters?.orderBy) {
      q = query(q, orderBy(filters.orderBy, filters.orderDirection || 'asc'))
    }

    return onSnapshot(q, (querySnapshot) => {
      const docs = querySnapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }) as T)
      callback(docs)
    })
  }
}

// Utility functions
export const createBatch = (): WriteBatch => {
  return writeBatch(db)
}

export const runFirestoreTransaction = async <T>(
  updateFunction: (transaction: Transaction) => Promise<T>,
): Promise<T> => {
  return runTransaction(db, updateFunction)
}

// Timestamp utilities
export const timestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate()
}

export const dateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date)
}

export const now = (): Timestamp => {
  return Timestamp.now()
}
