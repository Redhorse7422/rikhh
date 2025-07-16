import React from 'react'

interface OrderHeaderProps {
  orderNumber: string
  onDelete: () => void
  deleteLoading: boolean
  deleteError: string | null
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({ orderNumber, onDelete, deleteLoading, deleteError }) => (
  <div className='mb-2 flex items-center justify-between'>
    <h1 className='text-2xl font-bold'>Order #{orderNumber}</h1>
    <button
      className='rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60'
      onClick={onDelete}
      disabled={deleteLoading}
    >
      {deleteLoading ? 'Deleting...' : 'Delete Order'}
    </button>
    {deleteError && <div className='ml-4 text-red-600'>{deleteError}</div>}
  </div>
)
