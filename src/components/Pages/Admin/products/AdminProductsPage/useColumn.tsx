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



interface ProductItem {
  id: string
  name: string
  slug: string
  thumbnailImg?: string
  isActive: boolean
  isFeatured: boolean
}

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
        path: '/v1/products',
        id: selectedId,
      })
      showToast('Product deleted successfully!', 'success')
      refetch?.()
    } catch (error) {
      logger.error('Failed to delete product:', error)
      showToast('Failed to delete product. Please try again.', 'error')
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
      isSort: true,
      render: (_: string, item: ProductItem) => {
        const imageUrl = item?.thumbnailImg?.startsWith('http') ? item.thumbnailImg : '/images/no-image.png'

        return (
          <Flex align='center' gap='small'>
            {imageUrl && (
              <Image
                src={imageUrl}
                width={64}
                height={64}
                alt={item.name || 'Product image'}
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
      isSort: true,
    },
    {
      header: 'Active',
      key: 'isActive',
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
      render: (_: unknown, record: ProductItem) => (
        <div className='flex justify-end gap-2'>
          <button
            className='rounded px-2 py-2 text-success hover:bg-gray-100'
            onClick={() => router.push(`/products/${record.id}`)}
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
        title='Delete Product'
        description='Are you sure you want to delete this product? This action cannot be undone.'
      />
    ),
  }
}
