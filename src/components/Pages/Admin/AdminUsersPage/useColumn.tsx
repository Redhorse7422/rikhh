'use client'

import type { TableProps } from '@/components/ui/paginated-table/type'

import { useState } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { RenderValue } from '@/components/common/ColumnValue'
import { Flex } from '@/components/common/Flex'
import DeleteConfirmationModal from '@/components/common/Modal/DeleteConfirmationModal'
import { Icon } from '@/components/common/icon'
import { useApi } from '@/hooks/useApi'
import useToast from '@/hooks/useToast'
import { logger } from '@/libs/logger.client'

import type { User } from '@/types/user'

export const useColumn = (refetch?: () => void) => {
  const router = useRouter()
  const { removeDataSource } = useApi()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { showToast } = useToast()

  const openDeleteModal = (id: string) => {
    setSelectedId(id)
    setIsModalOpen(true)
  }

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!selectedId) return

    try {
      await removeDataSource.mutateAsync({
        path: '/v1/users',
        id: selectedId,
      })
      showToast('User deleted successfully!', 'success')
      refetch?.()
    } catch (error) {
      logger.error('Failed to delete user:', error)
      showToast('Failed to delete user. Please try again.', 'error')
    } finally {
      closeModal()
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedId(null)
  }

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { color: 'bg-red-100 text-red-800', label: 'Admin' },
      seller: { color: 'bg-blue-100 text-blue-800', label: 'Seller' },
      buyer: { color: 'bg-green-100 text-green-800', label: 'Buyer' },
    }
    const config = roleConfig[role as keyof typeof roleConfig] || { color: 'bg-gray-100 text-gray-800', label: role }
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
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
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'bg-gray-100 text-gray-800', label: status }
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const columns: TableProps['columns'] = [
    {
      header: 'User',
      key: 'name',
      isSort: true,
      render: (_: string, item: User) => {
        const avatarUrl = item?.avatar || '/images/user/user-01.png'

        return (
          <Flex align='center' gap='small'>
            <div className='relative h-10 w-10 overflow-hidden rounded-full'>
              <Image
                src={avatarUrl}
                width={40}
                height={40}
                alt={item.name || 'User avatar'}
                className='object-cover'
              />
            </div>
            <div className='flex flex-col'>
              <span className='font-medium text-gray-900'>{item.name}</span>
              <span className='text-sm text-gray-500'>{item.email}</span>
            </div>
          </Flex>
        )
      },
    },
    {
      header: 'Role',
      key: 'role',
      isSort: true,
      render: (role: string) => getRoleBadge(role),
    },
    {
      header: 'Status',
      key: 'status',
      isSort: true,
      render: (status: string) => getStatusBadge(status),
    },
    {
      header: 'Email Verified',
      key: 'emailVerified',
      render: (verified: boolean) => {
        return (
          <div className='flex items-center gap-2'>
            <RenderValue value={verified} size='xl' type='boolean-icon' />
          </div>
        )
      },
    },
    {
      header: 'Phone',
      key: 'phone',
      render: (phone: string) => {
        return phone ? (
          <span className='text-sm text-gray-600'>{phone}</span>
        ) : (
          <span className='text-sm text-gray-400'>Not provided</span>
        )
      },
    },
    {
      header: 'Joined',
      key: 'createdAt',
      isSort: true,
      render: (date: string) => {
        return (
          <div className='flex flex-col'>
            <span className='text-sm font-medium text-gray-900'>
              {new Date(date).toLocaleDateString()}
            </span>
            <span className='text-xs text-gray-500'>
              {new Date(date).toLocaleTimeString()}
            </span>
          </div>
        )
      },
    },
    {
      header: 'Actions',
      key: 'action',
      className: 'w-[200px] text-right',
      render: (_: unknown, record: User) => (
        <div className='flex justify-end gap-2'>
          <button
            className='rounded px-2 py-2 text-primary hover:bg-gray-100'
            onClick={() => router.push(`/users/${record.id}`)}
            aria-label={`View ${record.name}`}
          >
            <Icon name='AiOutlineEye' color='primary' size='lg' />
          </button>
          <button
            className='rounded px-2 py-2 text-warning hover:bg-gray-100'
            onClick={() => router.push(`/users/${record.id}/edit`)}
            aria-label={`Edit ${record.name}`}
          >
            <Icon name='AiOutlineFileText' color='warning' size='lg' />
          </button>
          <button
            className='rounded px-2 py-2 text-danger hover:bg-gray-100'
            onClick={() => openDeleteModal(record.id)}
            aria-label={`Delete ${record.name}`}
          >
            <Icon name='AiOutlineDelete' color='danger' size='lg' />
          </button>
        </div>
      ),
    },
  ]

  return {
    columns,
    modal: (
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        title='Delete User'
        description='Are you sure you want to delete this user? This action cannot be undone.'
      />
    ),
  }
} 