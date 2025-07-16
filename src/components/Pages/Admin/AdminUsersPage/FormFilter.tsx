'use client'

import type { UserFilterValues } from '@/types/user'

import { useForm } from 'react-hook-form'

import { SelectField } from '@/components/FormElements/SelectInput'
import { TextField } from '@/components/FormElements/TextInput'
import { Button } from '@/components/common/Button'
import { Grid, GridItem } from '@/libs/pureTailwind'

import { useUserFilter } from './UserFilterContext'

export const FormFilter = () => {
  const { setFilters } = useUserFilter()
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      search: '',
      role: '',
      status: '',
      emailVerified: '',
      dateRange: {
        start: '',
        end: '',
      },
    },
  })

  const handleOnSubmit = (data: UserFilterValues) => {
    // Clean up data to remove empty strings
    const cleanedData: UserFilterValues = {
      search: data.search || '',
      role: data.role || '',
      status: data.status || '',
      emailVerified: data.emailVerified || '',
      dateRange: {
        start: data.dateRange?.start || '',
        end: data.dateRange?.end || '',
      },
    }
    setFilters(cleanedData)
  }

  const handleReset = () => {
    reset()
    setFilters({
      search: '',
      role: '',
      status: '',
      emailVerified: '',
      dateRange: {
        start: '',
        end: '',
      },
    })
  }

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'seller', label: 'Seller' },
    { value: 'buyer', label: 'Buyer' },
  ]

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
  ]

  const emailVerifiedOptions = [
    { value: '', label: 'All' },
    { value: 'true', label: 'Verified' },
    { value: 'false', label: 'Unverified' },
  ]

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <Grid col={{ default: 1, md: 2, lg: 3 }} rowGap={4} colGap={4}>
        <GridItem colStart={{ default: 1, md: 1, lg: 1 }}>
          <TextField control={control} name='search' label='Search by name or email' />
        </GridItem>
        <GridItem colStart={{ default: 1, md: 2, lg: 2 }}>
          <SelectField control={control} name='role' label='Role' items={roleOptions} />
        </GridItem>
        <GridItem colStart={{ default: 1, md: 1, lg: 3 }}>
          <SelectField control={control} name='status' label='Status' items={statusOptions} />
        </GridItem>
        <GridItem colStart={{ default: 1, md: 2, lg: 1 }}>
          <SelectField control={control} name='emailVerified' label='Email Verified' items={emailVerifiedOptions} />
        </GridItem>
        <GridItem colStart={{ default: 1, md: 1, lg: 2 }}>
          <TextField control={control} name='dateRange.start' label='Start Date' type='date' />
        </GridItem>
        <GridItem colStart={{ default: 1, md: 2, lg: 3 }}>
          <TextField control={control} name='dateRange.end' label='End Date' type='date' />
        </GridItem>
        <GridItem colStart={{ default: 1, md: 1, lg: 1 }} colSpan={{ default: 1, md: 2, lg: 3 }}>
          <div className='flex w-full items-center justify-end gap-3'>
            <Button label='Reset' onClick={handleReset} />
            <Button label='Search' type='submit' />
          </div>
        </GridItem>
      </Grid>
    </form>
  )
}
