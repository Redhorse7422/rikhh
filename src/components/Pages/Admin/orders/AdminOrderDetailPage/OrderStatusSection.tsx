import type { OrderStatus } from '@/types/order'

import React from 'react'

interface OrderStatusSectionProps {
  status: OrderStatus
  statusOptions: { value: OrderStatus; label: string }[]
  statusNotes: string
  onStatusChange: (status: OrderStatus) => void
  onNotesChange: (notes: string) => void
  onSave: () => void
  loading: boolean
  disabled: boolean
  feedback: { success: string | null; error: string | null }
  currentStatus: OrderStatus
}

export const OrderStatusSection: React.FC<OrderStatusSectionProps> = ({
  status,
  statusOptions,
  statusNotes,
  onStatusChange,
  onNotesChange,
  onSave,
  loading,
  disabled,
  feedback,
  currentStatus,
}) => (
  <div className='mb-4 flex items-center gap-4 text-sm text-gray-600'>
    <span>
      Status: <span className='font-semibold'>{currentStatus}</span>
    </span>
    <select
      className='ml-2 rounded border px-2 py-1 text-sm'
      value={status}
      onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
      disabled={loading}
    >
      {statusOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <input
      className='ml-2 w-48 rounded border px-2 py-1 text-sm'
      type='text'
      placeholder='Add note (optional)'
      value={statusNotes}
      onChange={(e) => onNotesChange(e.target.value)}
      disabled={loading}
    />
    <button
      className='ml-2 rounded bg-primary px-3 py-1 text-sm text-white disabled:opacity-60'
      onClick={onSave}
      disabled={loading || status === currentStatus}
    >
      {loading ? 'Saving...' : 'Save'}
    </button>
    {feedback.success && <span className='ml-2 text-green-600'>{feedback.success}</span>}
    {feedback.error && <span className='ml-2 text-red-600'>{feedback.error}</span>}
  </div>
)
