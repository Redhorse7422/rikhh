'use client'
import type { UpdateUserData, User } from '@/types/user'

import { useEffect } from 'react'

import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { SelectField } from '@/components/FormElements/SelectInput'
import { TextField } from '@/components/FormElements/TextInput'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { Icon } from '@/components/common/icon'
import { useApi } from '@/hooks/useApi'
import useToast from '@/hooks/useToast'
import { logger } from '@/libs/logger.client'
import { Grid, GridItem } from '@/libs/pureTailwind'

export const AdminEditUserPage = () => {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const { getDataSource, updateDataSource } = useApi()
  const { showToast } = useToast()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserData>()

  const {
    data: user,
    isLoading,
    error: errorFetch,
  } = getDataSource({
    path: `/v1/users/${userId}`,
  })

  // useEffect(() => {
  //   if (user) {
  //     const userData = user as User
  //     reset({
  //       name: userData.name,
  //       email: userData.email,
  //       phone: userData.phone || '',
  //       role: userData.role,
  //       status: userData.status,
  //       profile: userData.profile,
  //     })
  //   }
  // }, [user, reset])

  const onSubmit = async (data: UpdateUserData) => {
    try {
      await updateDataSource.mutateAsync({
        path: `/v1/users/${userId}`,
        body: {},
      })
      showToast('User updated successfully!', 'success')
      router.push(`/users/${userId}`)
    } catch (error) {
      logger.error('Failed to update user:', error)
      showToast('Failed to update user. Please try again.', 'error')
    }
  }

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'seller', label: 'Seller' },
    { value: 'buyer', label: 'Buyer' },
  ]

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
  ]

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <Icon name='AiOutlineLoading' className='mx-auto h-8 w-8 animate-spin text-primary' />
          <p className='mt-2 text-gray-600'>Loading user details...</p>
        </div>
      </div>
    )
  }

  if (errorFetch || !user) {
    logger.error('Failed to fetch user:', errorFetch)
    return (
      <div className='rounded-lg bg-white p-6 shadow'>
        <div className='text-center'>
          <Icon name='AiOutlineCloseCircle' className='mx-auto h-12 w-12 text-red-500' />
          <h2 className='mt-4 text-xl font-semibold text-gray-900'>User Not Found</h2>
          <p className='mt-2 text-gray-600'>The user you are looking for does not exist or has been deleted.</p>
          <Button label='Back to Users' onClick={() => router.push('/users')} className='mt-4' />
        </div>
      </div>
    )
  }

  // const userData = user as User

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button
            icon='AiOutlineArrowLeft'
            label='Back to User'
            variant='outlinePrimary'
            onClick={() => router.push(`/users/${userId}`)}
          />
          <h1 className='text-2xl font-bold text-gray-900'>Edit User</h1>
        </div>
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='border-b border-gray-200 pb-4'>
            <h2 className='text-lg font-medium text-gray-900'>Basic Information</h2>
            <p className='mt-1 text-sm text-gray-600'>Update the user information below.</p>
          </div>

          <Grid col={{ default: 1, md: 2 }} rowGap={4} colGap={4}>
            <GridItem colStart={{ default: 1, md: 1 }}>
              <TextField
                control={control}
                name='name'
                label='Full Name'
                placeholder='Enter full name'
                // error={errors.name?.message}
                rules={{ required: 'Full name is required' }}
              />
            </GridItem>
            <GridItem colStart={{ default: 1, md: 2 }}>
              <TextField
                control={control}
                name='email'
                label='Email Address'
                type='email'
                placeholder='Enter email address'
                // error={errors.email?.message}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                }}
              />
            </GridItem>
            <GridItem colStart={{ default: 1, md: 1 }}>
              <TextField
                control={control}
                name='phone'
                label='Phone Number'
                placeholder='Enter phone number'
                // error={errors.phone?.message}
              />
            </GridItem>
            <GridItem colStart={{ default: 1, md: 2 }}>
              <SelectField
                control={control}
                name='role'
                label='Role'
                // options={roleOptions}
                // error={errors.role?.message}
                rules={{ required: 'Role is required' }}
              />
            </GridItem>
            <GridItem colStart={{ default: 1, md: 1 }}>
              <SelectField
                control={control}
                name='status'
                label='Status'
                // options={statusOptions}
                // error={errors.status?.message}
                rules={{ required: 'Status is required' }}
              />
            </GridItem>
          </Grid>

          <div className='flex justify-end space-x-3 pt-6'>
            <Button
              label='Cancel'
              variant='outlinePrimary'
              onClick={() => router.push(`/users/${userId}`)}
              type='button'
            />
            <Button
              label={isSubmitting ? 'Updating...' : 'Update User'}
              type='submit'
              disabled={isSubmitting}
              icon={isSubmitting ? 'AiOutlineLoading' : undefined}
            />
          </div>
        </form>
      </Card>
    </div>
  )
}
