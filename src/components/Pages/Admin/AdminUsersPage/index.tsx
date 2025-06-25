'use client'

import React from 'react'

import { useApi } from '@/hooks/useApi'
import { logger } from '@/libs/logger.client'

export const AdminUsersPage: React.FC = () => {
  const { getDataSource } = useApi()

  const {
    data: users,
    isLoading,
    error,
  } = getDataSource({
    path: '/v1/users/all',
    query: { limit: 50 },
  })

  if (isLoading) {
    return (
      <div className='rounded-lg bg-white p-6 shadow'>
        <h2 className='mb-4 text-2xl font-semibold'>Users Management</h2>
        <p className='text-gray-600'>Loading users...</p>
      </div>
    )
  }

  if (error) {
    logger.error('Failed to fetch users:', error)
    return (
      <div className='rounded-lg bg-white p-6 shadow'>
        <h2 className='mb-4 text-2xl font-semibold'>Users Management</h2>
        <p className='text-red-600'>Failed to load users. Please try again.</p>
      </div>
    )
  }

  return (
    <div className='rounded-lg bg-white p-6 shadow'>
      <h2 className='mb-4 text-2xl font-semibold'>Users Management</h2>
      <p className='text-gray-600'>Manage user accounts and permissions. Total users: {users?.data?.length || 0}</p>
    </div>
  )
}
