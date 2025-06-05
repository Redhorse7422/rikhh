'use client'

import type { FC, ReactNode } from 'react'
import React from 'react'
import { Header } from './Header'
import { MainLayoutProvider } from './MainLayoutContext'
import { Sidebar } from '../sidebar'
import { SidebarProvider } from '../sidebar/sidebar-context'

export type MainLayoutBaseProps = {
  children: ReactNode
}

export const MainLayoutBase: FC<MainLayoutBaseProps> = ({ children }) => {
  return (
    <MainLayoutProvider>
      <SidebarProvider>
        <div className='flex min-h-screen'>
          <Sidebar />

          <div className='w-full bg-gray-2 dark:bg-[#020d1a]'>
            <Header />

            <main className='isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10'>
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </MainLayoutProvider>
  )
}
