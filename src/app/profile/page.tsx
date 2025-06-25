'use client'

import { useState } from 'react'

import Image from 'next/image'
import { useForm } from 'react-hook-form'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { TextField } from '@/components/FormElements/TextInput'
import { Button } from '@/components/common/Button'
import useToast from '@/hooks/useToast'
import { logger } from '@/libs/logger.client'

import { CameraIcon } from './_components/icons'
import { SocialAccounts } from './_components/social-accounts'



interface ProfileForm {
  name: string
  email: string
  bio: string
}

export default function Page() {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({
    name: 'Danish Heilium',
    profilePhoto: '/images/user/user-03.png',
    coverPhoto: '/images/cover/cover-01.png',
  })

  const { showToast } = useToast()

  const { control, handleSubmit } = useForm<ProfileForm>({
    defaultValues: {
      name: data.name,
      email: '',
      bio: '',
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'profilePhoto') {
      const file = e.target?.files?.[0]

      setData({
        ...data,
        profilePhoto: file ? URL.createObjectURL(file) : data.profilePhoto,
      })
    } else if (e.target.name === 'coverPhoto') {
      const file = e.target?.files?.[0]

      setData({
        ...data,
        coverPhoto: file ? URL.createObjectURL(file) : data.coverPhoto,
      })
    } else {
      setData({
        ...data,
        [e.target.name]: e.target.value,
      })
    }
  }

  const onSubmit = async (formData: ProfileForm) => {
    try {
      setIsLoading(true)
      // TODO: Implement profile update logic
      logger.info('Profile update requested:', formData)
      showToast('Profile updated successfully!', 'success')
    } catch (error) {
      logger.error('Failed to update profile:', error)
      showToast('Failed to update profile. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='mx-auto w-full max-w-[970px]'>
      <Breadcrumb pageName='Profile' />

      <div className='overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card'>
        <div className='relative z-20 h-35 md:h-65'>
          <Image
            src={data?.coverPhoto}
            alt='profile cover'
            className='h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center'
            width={970}
            height={260}
            style={{
              width: 'auto',
              height: 'auto',
            }}
          />
          <div className='absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4'>
            <label
              htmlFor='cover'
              className='flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-[15px] py-[5px] text-body-sm font-medium text-white hover:bg-opacity-90'
            >
              <input
                type='file'
                name='coverPhoto'
                id='coverPhoto'
                className='sr-only'
                onChange={handleChange}
                accept='image/png, image/jpg, image/jpeg'
              />

              <CameraIcon />

              <span>Edit</span>
            </label>
          </div>
        </div>
        <div className='px-4 pb-6 text-center lg:pb-8 xl:pb-11.5'>
          <div className='relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3'>
            <div className='relative drop-shadow-2'>
              {data?.profilePhoto && (
                <>
                  <Image
                    src={data?.profilePhoto}
                    width={160}
                    height={160}
                    className='overflow-hidden rounded-full'
                    alt='profile'
                  />

                  <label
                    htmlFor='profilePhoto'
                    className='absolute bottom-0 right-0 flex size-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2'
                  >
                    <CameraIcon />

                    <input
                      type='file'
                      name='profilePhoto'
                      id='profilePhoto'
                      className='sr-only'
                      onChange={handleChange}
                      accept='image/png, image/jpg, image/jpeg'
                    />
                  </label>
                </>
              )}
            </div>
          </div>
          <div className='mt-4'>
            <h3 className='mb-1 text-heading-6 font-bold text-dark dark:text-white'>{data?.name}</h3>
            <p className='font-medium'>Ui/Ux Designer</p>
            <div className='mx-auto mb-5.5 mt-5 grid max-w-[370px] grid-cols-3 rounded-[5px] border border-stroke py-[9px] shadow-1 dark:border-dark-3 dark:bg-dark-2 dark:shadow-card'>
              <div className='flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3 xsm:flex-row'>
                <span className='font-medium text-dark dark:text-white'>259</span>
                <span className='text-body-sm'>Posts</span>
              </div>
              <div className='flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3 xsm:flex-row'>
                <span className='font-medium text-dark dark:text-white'>129K</span>
                <span className='text-body-sm'>Followers</span>
              </div>
              <div className='flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row'>
                <span className='font-medium text-dark dark:text-white'>2K</span>
                <span className='text-body-sm-sm'>Following</span>
              </div>
            </div>

            <div className='mx-auto max-w-[720px]'>
              <h4 className='font-medium text-dark dark:text-white'>About Me</h4>
              <p className='mt-4'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu
                condimentum mauris tempus ut. Donec fermentum blandit aliquet. Etiam dictum dapibus ultricies. Sed vel
                aliquet libero. Nunc a augue fermentum, pharetra ligula sed, aliquam lacus.
              </p>
            </div>

            <SocialAccounts />
          </div>
        </div>
      </div>

      <div className='mt-6 rounded-lg bg-white p-6 shadow'>
        <h2 className='mb-6 text-2xl font-semibold'>Profile Settings</h2>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <TextField
            control={control}
            name='name'
            label='Full Name'
            placeholder='Enter your full name'
            rules={{ required: 'Name is required' }}
          />
          <TextField
            control={control}
            name='email'
            label='Email'
            placeholder='Enter your email'
            rules={{ required: 'Email is required' }}
          />
          <TextField control={control} name='bio' label='Bio' placeholder='Tell us about yourself' />
          <Button type='submit' label={isLoading ? 'Updating...' : 'Update Profile'} disabled={isLoading} />
        </form>
      </div>
    </div>
  )
}
