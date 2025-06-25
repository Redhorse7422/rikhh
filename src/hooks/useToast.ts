import type { ToastPosition } from 'react-hot-toast'

import toast from 'react-hot-toast'

const useToast = () => {
  const showToast = (
    message: string,
    type: 'success' | 'error' | 'loading' = 'success',
    options: { position?: ToastPosition; [key: string]: any } = {},
  ) => {
    // Provide a fallback for position if it's not passed
    const baseOptions = {
      duration: type === 'error' ? 6000 : 5000,
      position: options.position ?? 'top-right',
      iconTheme: {
        primary: type === 'error' ? '#EF4444' : '#10B981',
        secondary: 'white',
      },
      ...options,
    }

    switch (type) {
      case 'success':
        return toast.success(message, baseOptions)
      case 'error':
        return toast.error(message, baseOptions)
      case 'loading':
        return toast.loading(message, baseOptions)
      default:
        return toast(message, baseOptions)
    }
  }

  const dismissToast = (id: string) => {
    toast.dismiss(id)
  }

  return { showToast, dismissToast }
}

export default useToast
