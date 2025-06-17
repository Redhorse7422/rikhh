'use client'
import { EmailIcon, PasswordIcon } from '@/assets/icons'
import Link from 'next/link'
import React, { useState } from 'react'
import InputGroup from '../FormElements/InputGroup'
import { Checkbox } from '../FormElements/checkbox'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import useToast from '@/hooks/useToast'

export default function SigninWithPassword() {
  const [data, setData] = useState({
    email: process.env.NEXT_PUBLIC_DEMO_USER_MAIL || '',
    password: process.env.NEXT_PUBLIC_DEMO_USER_PASS || '',
    remember: false,
  })
  const { showToast } = useToast()
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)

    try {
      console.log('data ==>', data)
      const result = await signIn('credentials', {
        ...data,
        redirect: false,
      })
      console.log(result)

      if (!result?.ok) {
        if (result?.status === 401) {
          showToast('Invalid credentials!', 'error', {
            position: 'top-center',
          })
        } else {
          showToast('Login failed!', 'error')
        }
        setLoading(false)
        return
      }

      router.push('/')
      showToast('Login successful!', 'success')
    } catch (error) {
      console.error(error)
      showToast('An error occurred!', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup
        type='email'
        label='Email'
        className='mb-4 [&_input]:py-[15px]'
        placeholder='Enter your email'
        name='email'
        handleChange={handleChange}
        value={data.email}
        icon={<EmailIcon />}
      />

      <InputGroup
        type='password'
        label='Password'
        className='mb-5 [&_input]:py-[15px]'
        placeholder='Enter your password'
        name='password'
        handleChange={handleChange}
        value={data.password}
        icon={<PasswordIcon />}
      />

      <div className='mb-6 flex items-center justify-between gap-2 py-2 font-semibold'>
        <Checkbox
          label='Remember me'
          name='remember'
          withIcon='check'
          minimal
          radius='md'
          onChange={(e) =>
            setData((prev) => ({
              ...prev,
              remember: e.target.checked,
            }))
          }
        />

        <Link href='/auth/forgot-password' className='hover:text-primary dark:text-gray-300 dark:hover:text-primary'>
          Forgot Password?
        </Link>
      </div>

      <div className='mb-4.5'>
        <button
          disabled={loading}
          type='submit'
          className='flex w-full items-center justify-center gap-2 rounded-lg bg-primary p-4 font-semibold text-gray-50 transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:bg-gray-500'
        >
          {loading ? (
            <span className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-gray-50 border-t-transparent' />
          ) : (
            'Sign In'
          )}
        </button>
      </div>
    </form>
  )
}
