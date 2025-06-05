/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import nextAuth from 'next-auth'

import { authConfig } from '@/lib/axios/nextAuthWithExternalAPI/authConfig'

const handleRequest = nextAuth(authConfig)

export { handleRequest as GET, handleRequest as OPTIONS, handleRequest as POST }
