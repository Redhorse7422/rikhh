'use client'

import type { IError } from './type'
import type { AxiosError, AxiosResponse } from 'axios'

import axios from 'axios'

import { logger } from '../logger.client'

import { signOutAndReLogin } from './nextAuthWithExternalAPI'

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_CLIENT_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.request.use(
  async (config) => config,
  async (error: AxiosError): Promise<IError> => Promise.reject(error.response?.data),
)

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

client.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.config.responseType === 'arraybuffer') return response.data
    return response.data?.data
  },
  async (error: AxiosError): Promise<any> => {
    const errorResponse = error?.response?.data as IError

    // --- BEGIN REFRESH LOGIC ---
    if (errorResponse?.code === 1 && errorResponse?.message === 'INVALID_TOKEN_SIGNATURE') {
      const originalRequest = error.config as any
      if (originalRequest._retry) {
        // Already retried, don't loop
        return Promise.reject(errorResponse)
      }
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token
            return client(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }
      originalRequest._retry = true
      isRefreshing = true
      try {
        const { data } = await axios.post('/auth/refresh-token', {}, { withCredentials: true })
        // Save new token to storage/cookie as needed
        localStorage.setItem('accessToken', data.accessToken)
        client.defaults.headers.common['Authorization'] = 'Bearer ' + data.accessToken
        processQueue(null, data.accessToken)
        originalRequest.headers['Authorization'] = 'Bearer ' + data.accessToken
        return client(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        await signOutAndReLogin()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    // --- END REFRESH LOGIC ---

    // if (['admin'].includes(process.env.TEMPLATE ?? 'admin')) {
    //   // NOTE: FOR next-auth, If the token is expired, the user will be signed out and redirected to the login page.
    //   if (errorResponse?.code === 'TOKEN_EXPIRED') await signOutAndReLogin()
    // }

    logger.error('Axios client error:', {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      responseData: error.response?.data,
    })

    return Promise.reject(errorResponse)
  },
)
