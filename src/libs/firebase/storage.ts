import type { UploadMetadata } from 'firebase/storage'

import {
  ref,
  uploadBytes,
  uploadString as firebaseUploadString,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
  updateMetadata,
} from 'firebase/storage'

import { storage } from './config'

// Upload file to Firebase Storage
export const uploadFile = async (path: string, file: File | Blob, metadata?: UploadMetadata): Promise<string> => {
  const storageRef = ref(storage, path)
  const snapshot = await uploadBytes(storageRef, file, metadata)
  return getDownloadURL(snapshot.ref)
}

// Upload string data to Firebase Storage
export const uploadString = async (
  path: string,
  data: string,
  format: 'raw' | 'base64' | 'base64url' | 'data_url' = 'raw',
  metadata?: UploadMetadata,
): Promise<string> => {
  const storageRef = ref(storage, path)
  const snapshot = await firebaseUploadString(storageRef, data, format, metadata)
  return getDownloadURL(snapshot.ref)
}

// Get download URL for a file
export const getFileDownloadURL = async (path: string): Promise<string> => {
  const storageRef = ref(storage, path)
  return getDownloadURL(storageRef)
}

// Delete a file from Firebase Storage
export const deleteFile = async (path: string): Promise<void> => {
  const storageRef = ref(storage, path)
  await deleteObject(storageRef)
}

// List all files in a directory
export const listFiles = async (path: string): Promise<string[]> => {
  const storageRef = ref(storage, path)
  const result = await listAll(storageRef)
  return result.items.map((item) => item.fullPath)
}

// Get file metadata
export const getFileMetadata = async (path: string) => {
  const storageRef = ref(storage, path)
  return getMetadata(storageRef)
}

// Update file metadata
export const updateFileMetadata = async (path: string, metadata: UploadMetadata) => {
  const storageRef = ref(storage, path)
  return updateMetadata(storageRef, metadata)
}

// Generate a unique file path
export const generateFilePath = (folder: string, fileName: string, userId?: string): string => {
  const timestamp = Date.now()
  const uniqueId = Math.random().toString(36).substring(2, 15)
  const userIdPrefix = userId ? `${userId}/` : ''

  return `${folder}/${userIdPrefix}${timestamp}_${uniqueId}_${fileName}`
}

// Upload image with compression
export const uploadImage = async (path: string, file: File, quality: number = 0.8): Promise<string> => {
  // Create a canvas to compress the image
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()

  return new Promise((resolve, reject) => {
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      if (ctx) {
        ctx.drawImage(img, 0, 0)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              uploadFile(path, blob, {
                contentType: file.type,
              })
                .then(resolve)
                .catch(reject)
            } else {
              reject(new Error('Failed to compress image'))
            }
          },
          file.type,
          quality,
        )
      } else {
        reject(new Error('Failed to get canvas context'))
      }
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}
