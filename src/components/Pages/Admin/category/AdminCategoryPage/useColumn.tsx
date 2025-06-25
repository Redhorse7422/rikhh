// import DeleteConfirmationModal from './DeleteConfirmationModal';
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



interface CategoryItem {
  id: string
  name: string
  slug: string
  image?: string
  isActive: boolean
  isFeatured: boolean
}

export const useColumn = (refetch?: () => void) => {
  const router = useRouter()
  const { removeDataSource } = useApi()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { showToast } = useToast()
  // const getOption = (status: string) => {
  //   if (status) return { value: 'Active', color: 'text-success', dotColor: 'bg-green-500' }
  //   return { value: 'InActive', color: 'text-yellow-100', dotColor: 'bg-yellow-300' }
  // }
  const openDeleteModal = (id: string) => {
    setSelectedId(id)
    setIsModalOpen(true)
  }

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!selectedId) return

    try {
      await removeDataSource.mutateAsync({
        path: '/v1/categories',
        id: selectedId,
      })
      showToast('Category deleted successfully!', 'success')
      refetch?.()
    } catch (error) {
      logger.error('Failed to delete category:', error)
      showToast('Failed to delete category. Please try again.', 'error')
    } finally {
      closeModal()
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedId(null)
  }

  const columns: TableProps['columns'] = [
    {
      header: 'Name',
      key: 'name',
      // width: '35%',
      isSort: true,
      render: (_: string, item: CategoryItem) => {
        const imageUrl = item?.image?.startsWith('http') ? item.image : '/images/no-image.png'

        return (
          <Flex align='center' gap='small'>
            {imageUrl && (
              <Image
                src={imageUrl}
                width={64}
                height={64}
                alt={item.name || 'Category image'}
                className='rounded-md object-cover'
              />
            )}
            <span>{item.name}</span>
          </Flex>
        )
      },
    },
    {
      header: 'Slug',
      key: 'slug',
      // width: '35%',
      isSort: true,
    },
    {
      header: 'Active',
      key: 'isActive',
      // width: '120px',
      render: (status: boolean) => {
        return (
          <div className='flex items-center gap-2'>
            <RenderValue value={status} size='xl' type='boolean-icon' />
          </div>
        )
      },
    },
    {
      header: 'Featured',
      key: 'isFeatured',
      // width: '120px',
      render: (status: boolean) => {
        return (
          <div className='flex items-center gap-2'>
            <RenderValue value={status} size='xl' type='boolean-icon' />
          </div>
        )
      },
    },
    {
      header: 'Actions',
      key: 'action',
      className: 'w-[160px] text-right',
      render: (_: unknown, record: CategoryItem) => (
        <div className='flex justify-end gap-2'>
          <button
            className='rounded px-2 py-2 text-success hover:bg-gray-100'
            onClick={() => router.push(`/categories/${record.id}`)}
            aria-label={`View ${record.name}`}
          >
            <Icon name='AiOutlineEye' color='success' size='lg' />
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
        title='Delete Category'
        description='Are you sure you want to delete this category? This action cannot be undone.'
      />
    ),
  }
}
