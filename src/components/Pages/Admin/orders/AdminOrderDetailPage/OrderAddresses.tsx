import type { Address } from '@/types/order'

import React from 'react'

interface OrderAddressesProps {
  shippingAddress: Address
  billingAddress: Address
}

export const OrderAddresses: React.FC<OrderAddressesProps> = ({ shippingAddress, billingAddress }) => (
  <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
    <div>
      <div className='mb-1 font-semibold'>Shipping Address</div>
      <div>
        {shippingAddress.firstName} {shippingAddress.lastName}
      </div>
      <div>{shippingAddress.addressLine1}</div>
      <div>
        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
      </div>
      <div>{shippingAddress.country}</div>
    </div>
    <div>
      <div className='mb-1 font-semibold'>Billing Address</div>
      <div>
        {billingAddress.firstName} {billingAddress.lastName}
      </div>
      <div>{billingAddress.addressLine1}</div>
      <div>
        {billingAddress.city}, {billingAddress.state} {billingAddress.postalCode}
      </div>
      <div>{billingAddress.country}</div>
    </div>
  </div>
)
