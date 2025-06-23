/* eslint-disable react/jsx-no-constructed-context-values */

'use client'

import { FullScreenLoading } from '@/components/common/Loading/FullScreenLoading'
import React, { createContext, useCallback, useEffect, useState } from 'react'

type FullScreenLoadingContextType = {
  isOpen: boolean | null
  open: () => void
  close: () => void
}

const FullScreenLoadingContext = createContext<FullScreenLoadingContextType>({
  isOpen: false,
  open: () => {},
  close: () => {},
})

export const FullScreenLoadingProvider = ({ children }: React.PropsWithChildren) => {
  const [open, setOpen] = useState<boolean | null>(null)

  const handleBody = useCallback(() => {
    if (open === null) return
    document.body.style.overflow = open ? 'hidden' : 'auto'
  }, [open])

  useEffect(() => {
    handleBody()
  }, [handleBody, open])

  return (
    <FullScreenLoadingContext.Provider
      value={{
        isOpen: open,
        open: () => setOpen(true),
        close: () => setOpen(false),
      }}
    >
      {open && <FullScreenLoading />}
      {children}
    </FullScreenLoadingContext.Provider>
  )
}

export const useFullScreenLoading = () => React.useContext(FullScreenLoadingContext)
