import type { StatusHistory } from '@/types/order'

import React from 'react'

interface OrderStatusHistoryProps {
  statusHistory: StatusHistory[]
}

export const OrderStatusHistory: React.FC<OrderStatusHistoryProps> = ({ statusHistory }) => (
  <div className='mb-6'>
    <div className='mb-2 font-semibold'>Status History</div>
    <table className='w-full border text-sm'>
      <thead>
        <tr className='bg-gray-100'>
          <th className='p-2 text-left'>Status</th>
          <th className='p-2 text-left'>Timestamp</th>
          <th className='p-2 text-left'>Notes</th>
        </tr>
      </thead>
      <tbody>
        {statusHistory.map((h, i) => (
          <tr key={i}>
            <td className='p-2'>{h.status.charAt(0).toUpperCase() + h.status.slice(1)}</td>
            <td className='p-2'>{new Date(h.updatedAt).toLocaleString()}</td>
            <td className='p-2'>{h.notes || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
