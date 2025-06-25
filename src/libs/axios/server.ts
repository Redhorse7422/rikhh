'use server'

import type { IError } from './type'
import type { AxiosError, AxiosResponse } from 'axios'

import axios from 'axios'

import { logger } from '../logger.server'

export const server = axios.create({
  baseURL: process.env.API_SERVER_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

server.interceptors.request.use(
  async (config) => config,
  async (error: AxiosError): Promise<IError> => Promise.reject(error.response?.data),
)

server.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError): Promise<IError> => {
    const errorResponse = error?.response?.data as IError

    logger.error('Axios server error:', {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      responseData: error.response?.data,
    })

    return Promise.reject({ ...errorResponse, statusCode: error?.response?.status })
  },
)
