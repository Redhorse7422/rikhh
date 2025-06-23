// import DeleteConfirmationModal from './DeleteConfirmationModal';
import { RenderValue } from '@/components/common/ColumnValue'
import { Icon } from '@/components/common/icon'
import DeleteConfirmationModal from '@/components/common/Modal/DeleteConfirmationModal'
import { TableProps } from '@/components/ui/paginated-table/type'
import { useApi } from '@/hooks/useApi'
import useToast from '@/hooks/useToast'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const useColumn = (refetch?: () => void) => {
  const router = useRouter()
  const { removeDataSource } = useApi()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { showToast } = useToast()
  const getOption = (status: string) => {
    if (status) return { value: 'Active', color: 'text-success', dotColor: 'bg-green-500' }
    return { value: 'InActive', color: 'text-yellow-100', dotColor: 'bg-yellow-300' }
  }
  const openDeleteModal = (id: string) => {
    setSelectedId(id)
    setIsModalOpen(true)
  }

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    try {
      if (selectedId) {
        await removeDataSource.mutateAsync({
          path: '/v1/categories',
          id: selectedId,
        })
        showToast('Category Deleted successful!', 'success')
        refetch?.()
      }
    } catch (error) {
      showToast('Something went Wrong!', 'error')
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
    },
    {
      header: 'Slug',
      key: 'slug',
      // width: '35%',
      isSort: true,
    },
    {
      header: 'isActive',
      key: 'isActive',
      // width: '120px',
      render: (status: string) => {
        const opt = getOption(status)
        console.log(opt)
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
      render: (status: string) => {
        const opt = getOption(status)
        console.log(opt)
        return (
          <div className='flex items-center gap-2'>
            <RenderValue value={status} size='xl' type='boolean-icon' />
          </div>
        )
      },
    },
    {
      header: 'Action',
      key: 'action',
      className: 'w-[160px] text-right',
      render: (_: any, record: any) => (
        <div className='flex justify-end gap-2'>
          <button className='text-danger px-2 py-2' onClick={() => router.push(`/categories/${record.id}`)}>
            <Icon name='AiOutlineEye' color='success' size='lg' />
          </button>
          <button className='text-danger px-2 py-2' onClick={() => openDeleteModal(record.id)}>
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
