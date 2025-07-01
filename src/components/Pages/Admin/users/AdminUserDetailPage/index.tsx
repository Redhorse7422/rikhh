'use client'
import type { User } from '@/types/user'

import { useState } from 'react'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { Icon } from '@/components/common/icon'
import { useApi } from '@/hooks/useApi'
import { logger } from '@/libs/logger.client'

export const AdminUserDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const [activeTab, setActiveTab] = useState('profile')

  const { getDataSourceById } = useApi()

  const {
    data: user,
    isLoading,
    error,
  } = getDataSourceById<{ data: User }>({
    path: `/v1/users/${userId}`,
    id: userId,
    enabled: !!userId,
  })

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <Icon name='AiOutlineLoading' className='mx-auto h-8 w-8 animate-spin text-primary' />
          <p className='mt-2 text-gray-600'>Loading user details...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    logger.error('Failed to fetch user:', error)
    return (
      <div className='rounded-lg bg-white p-6 shadow'>
        <div className='text-center'>
          <Icon name='AiOutlineCloseCircle' className='mx-auto h-12 w-12 text-red-500' />
          <h2 className='mt-4 text-xl font-semibold text-gray-900'>User Not Found</h2>
          <p className='mt-2 text-gray-600'>The user you are looking for does not exist or has been deleted.</p>
          <Button label='Back to Users' onClick={() => router.push('/users')} className='mt-4' />
        </div>
      </div>
    )
  }

  const userData = user.data

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { color: 'bg-red-100 text-red-800', label: 'Admin' },
      seller: { color: 'bg-blue-100 text-blue-800', label: 'Seller' },
      buyer: { color: 'bg-green-100 text-green-800', label: 'Buyer' },
    }
    const config = roleConfig[role as keyof typeof roleConfig] || { color: 'bg-gray-100 text-gray-800', label: role }
    return (
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      inactive: { color: 'bg-yellow-100 text-yellow-800', label: 'Inactive' },
      suspended: { color: 'bg-red-100 text-red-800', label: 'Suspended' },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: 'bg-gray-100 text-gray-800',
      label: status,
    }
    return (
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'AiOutlineUser' },
    { id: 'addresses', label: 'Addresses', icon: 'AiOutlineFileText' },
    { id: 'preferences', label: 'Preferences', icon: 'AiOutlineFile' },
  ]

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button
            icon='AiOutlineArrowLeft'
            label='Back'
            variant='outlinePrimary'
            onClick={() => router.push('/users')}
          />
          <h1 className='text-2xl font-bold text-gray-900'>User Details</h1>
        </div>
        <div className='flex space-x-3'>
          <Button
            icon='AiOutlineFileText'
            label='Edit User'
            variant='outlinePrimary'
            onClick={() => router.push(`/users/${userId}/edit`)}
          />
        </div>
      </div>

      {/* User Info Card */}
      <Card>
        <div className='flex items-start space-x-6'>
          <div className='relative h-24 w-24 overflow-hidden rounded-full'>
            <Image
              src={userData.avatar || '/images/user/user-01.png'}
              width={96}
              height={96}
              alt={userData.name}
              className='object-cover'
            />
          </div>
          <div className='flex-1'>
            <div className='flex items-center space-x-4'>
              <h2 className='text-xl font-semibold text-gray-900'>{userData.name}</h2>
              {getRoleBadge(userData.role)}
              {getStatusBadge(userData.status)}
            </div>
            <p className='mt-1 text-gray-600'>{userData.email}</p>
            {userData.phone && <p className='text-gray-600'>{userData.phone}</p>}
            <div className='mt-4 flex items-center space-x-6 text-sm text-gray-500'>
              <span>Joined: {new Date(userData.createdAt).toLocaleDateString()}</span>
              {userData.lastLoginAt && <span>Last login: {new Date(userData.lastLoginAt).toLocaleDateString()}</span>}
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Card>
        <div className='border-b border-gray-200'>
          <nav className='-mb-px flex space-x-8'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 border-b-2 px-1 py-2 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {/* <Icon name={tab.icon} className='h-4 w-4' /> */}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className='mt-6'>
          {activeTab === 'profile' && (
            <div className='space-y-4'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <label className='text-sm font-medium text-gray-700'>First Name</label>
                  <p className='mt-1 text-gray-900'>{userData.profile?.firstName || 'Not provided'}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-700'>Last Name</label>
                  <p className='mt-1 text-gray-900'>{userData.profile?.lastName || 'Not provided'}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-700'>Date of Birth</label>
                  <p className='mt-1 text-gray-900'>{userData.profile?.dateOfBirth || 'Not provided'}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-700'>Gender</label>
                  <p className='mt-1 text-gray-900'>{userData.profile?.gender || 'Not provided'}</p>
                </div>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-700'>Bio</label>
                <p className='mt-1 text-gray-900'>{userData.profile?.bio || 'No bio provided'}</p>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-700'>Website</label>
                <p className='mt-1 text-gray-900'>{userData.profile?.website || 'Not provided'}</p>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className='space-y-4'>
              {userData.addresses && userData.addresses.length > 0 ? (
                userData.addresses.map((address) => (
                  <div key={address.id} className='rounded-lg border border-gray-200 p-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-2'>
                        <span className='text-sm font-medium text-gray-700'>{address.type}</span>
                        {address.isDefault && (
                          <span className='rounded-full bg-primary px-2 py-1 text-xs text-white'>Default</span>
                        )}
                      </div>
                    </div>
                    <div className='mt-2 text-sm text-gray-600'>
                      <p>{address.street}</p>
                      <p>
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p>{address.country}</p>
                      {address.phone && <p>Phone: {address.phone}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-gray-500'>No addresses found</p>
              )}
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className='space-y-4'>
              {userData.preferences ? (
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>Language</label>
                    <p className='mt-1 text-gray-900'>{userData.preferences.language}</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>Currency</label>
                    <p className='mt-1 text-gray-900'>{userData.preferences.currency}</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>Timezone</label>
                    <p className='mt-1 text-gray-900'>{userData.preferences.timezone}</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>Theme</label>
                    <p className='mt-1 text-gray-900'>{userData.preferences.theme}</p>
                  </div>
                </div>
              ) : (
                <p className='text-gray-500'>No preferences found</p>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
