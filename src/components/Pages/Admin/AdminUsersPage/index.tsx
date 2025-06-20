'use client'

import { useApi } from '@/hooks/useApi'

export const AdminUsersPage = () => {
  const { getDataSource } = useApi()
  const { data } = getDataSource({
    path: '/v1/users',
    query: {
      // sort: '-updatedAt',
    },
  })
  console.log('Users ===> ', data)
  return (
    <h2 className='pb-2 text-2xl font-bold' style={{ marginTop: -12 }}>
      Users
    </h2>
  )
}
