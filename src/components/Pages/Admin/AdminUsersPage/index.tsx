'use client'

import { SectionFilter } from './SectionFilter'
import { SectionUsers } from './SectionUsers'
import { UserFilterProvider } from './UserFilterContext'

export const AdminUsersPage = () => {
  return (
    <UserFilterProvider>
      <div className='flex flex-col gap-y-6'>
        <SectionFilter />
        <SectionUsers />
      </div>
    </UserFilterProvider>
  )
}
