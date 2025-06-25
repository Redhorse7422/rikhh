'use client'

import type { ToastOptions } from 'react-hot-toast'

import { Toaster } from 'react-hot-toast'

const ToastProvider = () => {
  const toastOptions: ToastOptions = {
    position: 'top-right',
    duration: 5000,
    style: {
      background: '#fff',
      color: '#333',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '14px',
      maxWidth: '500px',
    },
  }

  return <Toaster toastOptions={toastOptions} />
}

export default ToastProvider
