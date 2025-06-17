'use server'

import type { IError } from '../type'
import type { NextRequest } from 'next/server'

import { cookies, headers } from 'next/headers'
import { getServerSession, type Session } from 'next-auth'
import { encode, getToken } from 'next-auth/jwt'

import { authConfig } from '@/libs/axios/nextAuthWithExternalAPI/authConfig'
import { logger } from '@/libs/logger'
import { textTimeToTimestamp } from '@/utils/textTimeToTimestamp'

import { server } from '../server'

type ServerFetchProps = {
  bypassAuth?: boolean
  accessToken?: string
  refreshToken?: string
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  path: string
  headers?: Record<string, string | null>
  body?: Record<string, unknown> | FormData
  params?: Record<string, unknown>
  responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream' | undefined

  // NOTE: for SSR component
  fromSSR?: boolean
}

const getRequestConfig = (opt: ServerFetchProps) => {
  logger.debug(`Get the request config: ${JSON.stringify(opt)}`)
   logger.debug(`Get the request config1: ${JSON.stringify(opt.headers)}`)
  return {
    headers: {
      ...opt.headers,
      ...(opt.accessToken && { Authorization: `Bearer ${opt.accessToken}` }),
    },
    ...(opt?.responseType && { responseType: 'arraybuffer' }),
    ...(opt?.params && { params: opt.params }),
  } as object
}

const updateNewSession = async (session: Session['user']) => {
  logger.info('Updating new session token...')
  const newSessionToken = await encode({
    secret: process.env.NEXTAUTH_SECRET as string,
    token: { ...session },
    // TODO: set maxAge extended time from the old token
    maxAge: textTimeToTimestamp(process.env.NEXTAUTH_SESSION_MAX_AGE as string),
  })

  logger.info('Setting new session token...')

  const sessionCookie = process.env.NEXTAUTH_URL?.startsWith('https://')
    ? '__Secure-next-auth.session-token'
    : 'next-auth.session-token'
  const cookieStore = await cookies()
  cookieStore.set(sessionCookie, newSessionToken)
  logger.info('Successfully updated the session token with a new access token.')
}

const requestor = async (opt: ServerFetchProps, config: object) => {
  const { method, path, body } = opt
  logger.info(`Start requesting data from the server...with method: ${method} and path: ${path}`)

  // NOTE: only allow GET and DELETE method without body
  switch (method) {
    case 'get':
      return server.get(path, { ...config })
    case 'delete':
      return server.delete(path, { ...config })
  }

  // NOTE: only allow POST, PUT, PATCH method with body
  switch (method) {
    case 'post':
      return server.post(path, body, { ...config })
    case 'put':
      return server.put(path, body, { ...config })
    case 'patch':
      return server.patch(path, body, { ...config })
    default:
      throw new Error('Method not allowed')
  }
}

export const requestNewToken = async (opt: ServerFetchProps) => {
  logger.info('Requesting a new token...')
  const { refreshToken } = opt
  const _headers = { Authorization: `Bearer ${refreshToken}` }

  try {
    // NOTE: request new token
    const response = await server.post('/v1/auth/refresh', {}, { headers: _headers })
    const isSuccess = response?.data.code === 'REQUEST_NEW_TOKEN_SUCCESS'

    if (isSuccess) {
      // NOTE: get new access token and retry the request
      logger.info('Request new token success...')
      const newAccessToken = response?.data.data.accessToken
      await updateNewSession(response?.data.data)

      logger.info(' Retrying the request...')
      const result = await requestor(opt, getRequestConfig({ ...opt, accessToken: newAccessToken }))
      logger.info('Successfully fetched data from the server with new token.')
      return result
    }

    // NOTE: if failed to request new token
    logger.error('Failed to request a new token.')
    throw new Error('Failed to refresh token')
  } catch (error) {
    const _err = error as IError

    // NOTE: if the refresh token expired, redirect to login page(Handle by client)
    // if (_err?.code === 'TOKEN_EXPIRED') return { data: _err }

    console.error('Error request new token', _err)
    logger.error(`Failed to request a new token or Token expired, by error: ${_err.message}`)
    throw { ..._err, statusCode: _err?.statusCode }
  }
}

export const serverFetch = async (opt: ServerFetchProps) => {
  const { path, fromSSR } = opt
  logger.info(`Start fetching data from the server...with path: ${path}`)

  if (opt.bypassAuth) {
    logger.info('Bypassing authentication...')
    return server.get(path)
  }

  try {
    const res = await requestor(opt, getRequestConfig(opt))
    logger.info('Successfully fetched data from the server.')
    return res
  } catch (error) {
    const _err = error as IError

    // NOTE: if the access token expired, request new token and retry the request
    if (_err?.code === 'TOKEN_EXPIRED') {
      if (fromSSR) {
        logger.info('Token expired, requesting a new token from SSR...')
        const headersList = await headers()
        const host = headersList.get('host') // e.g. 'example.com'
        const protocol = headersList.get('x-forwarded-proto') || 'https' // Fallback to 'https' if not provided
        const domain = `${protocol}://${host}` // e.g. 'https://example.com'
        const res = await server.post(`${domain}/api/auth/ssr-refresh`, opt)
        return res
      }
      logger.info('Token expired, requesting a new token...')
      return requestNewToken(opt)
    }

    console.error('Failed to fetch data from the server:', _err)
    logger.error(`Failed to fetch data from the server: ${_err.message}`)

    throw { ..._err, statusCode: _err?.statusCode }
  }
}

export const serverFetchWithNextRequest = async (req: NextRequest) => {
  logger.info('Start fetching data from the server with NextRequest...')
  const method = (req.method.toLowerCase() as ServerFetchProps['method']) || 'get'
  const path = req.nextUrl.pathname.replace('/api', '') + (req.nextUrl?.search || '')
  const session = await getToken({ req })
  const isDownloadFile = req?.headers.get('x-download-file') === 'true'

  // NOTE: get body from request
  const contentType = req.headers.get('content-type')
  const isMultiPart = contentType?.includes('multipart/form-data')
  let body = null
  try {
    body = isMultiPart ? await req.formData() : await req.json()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {}

  // NOTE: set token payload
  const tokenPayload = {
    ...(session?.accessToken ? { accessToken: session.accessToken } : {}),
    ...(session?.refreshToken ? { refreshToken: session.refreshToken } : {}),
  }

  const res = await serverFetch({
    ...(tokenPayload as object),
    method,
    path,
    headers: {
      ...(req.headers.get('content-type') && { 'Content-Type': req.headers.get('content-type') }),
      ...(req.headers.get('accept') && { Accept: req.headers.get('accept') }),
    },
    ...(body && { body }),
    ...(isDownloadFile && { responseType: 'arraybuffer' }),
  })

  logger.info('Successfully fetched data from the server with NextRequest.')
  return res
}

export const serverFetchWithSsrComponent = async (opt: ServerFetchProps) => {
  logger.info('Start fetching data from the server with SSR component...')
  const session = await getServerSession(authConfig)
  const acToken = session?.user?.accessToken as string
  const rfToken = session?.user?.refreshToken as string

  // NOTE: set token payload
  const tokenPayload = {
    ...(acToken ? { accessToken: acToken } : {}),
    ...(rfToken ? { refreshToken: rfToken } : {}),
  }

  const res = await serverFetch({
    ...tokenPayload,
    ...opt,
    fromSSR: true,
  })

  logger.info('Successfully fetched data from the server with SSR component.')
  return res
}
