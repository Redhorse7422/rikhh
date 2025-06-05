'use client'

import React, { createContext, useState } from 'react'

export type MainLayoutContextProps = {
  collapsed: boolean
  setCollapsed: (value: boolean) => void
}

export const MainLayoutContext = createContext<MainLayoutContextProps>({
  collapsed: false,
  setCollapsed: () => {},
})

type MainLayoutProviderProps = {
  children: React.ReactNode
}

export const MainLayoutProvider: React.FC<MainLayoutProviderProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false)

  return <MainLayoutContext.Provider value={{ collapsed, setCollapsed }}>{children}</MainLayoutContext.Provider>
}
