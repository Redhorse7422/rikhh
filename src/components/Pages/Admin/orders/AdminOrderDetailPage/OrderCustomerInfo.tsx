import React from 'react'

interface OrderCustomerInfoProps {
  customerFirstName: string
  customerLastName: string
  customerEmail: string
}

export const OrderCustomerInfo: React.FC<OrderCustomerInfoProps> = ({
  customerFirstName,
  customerLastName,
  customerEmail,
}) => (
  <div className='mb-6'>
    <div className='mb-1 font-semibold'>Customer</div>
    <div>
      {customerFirstName} {customerLastName}
      <span> ({customerEmail})</span>
    </div>
  </div>
)
