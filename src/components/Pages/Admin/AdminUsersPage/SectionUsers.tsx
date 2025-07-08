'use client'

import type { SmartColumn } from '@/components/ui/smart-paginated-table/types'

import { useRef } from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/common/Button'
import { SmartPaginatedTable } from '@/components/ui/smart-paginated-table'

// import { useUserFilter } from './UserFilterContext'
import { useColumn } from './useColumn'

export const SectionUsers = () => {
  // const { filters } = useUserFilter()
  const tableRef = useRef<{ refetch: () => void }>(null)
  const { columns, modal } = useColumn(() => tableRef.current?.refetch())
  const router = useRouter()

  return (
    <>
      <div className='mb-4 flex items-center justify-between'>
        <p className='text-lg font-semibold'>Users</p>
        <div className='flex gap-3'>
          <Button
            icon='AiOutlinePlus'
            label='Add User'
            variant='outlinePrimary'
            onClick={() => router.push('/users/add')}
          />
        </div>
      </div>
      <SmartPaginatedTable
        ref={tableRef}
        path='/v1/users'
        columns={columns as SmartColumn[]}
        initialQuery={{
          sort: '-createdAt',
          // filters: {
          //   ...filters,
          // },
        }}
      />
      {modal}
    </>
  )
}
