'use server'

import type { IError } from '@/libs/axios/type'
import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { serverFetchWithNextRequest } from '@/libs/axios'
import { logger } from '@/libs/logger'

export const GET = async (req: NextRequest) => {
  try {
    const isDownloadFile = req?.headers.get('x-download-file') === 'true'
    const response = await serverFetchWithNextRequest(req)

    const resContentType = response.headers?.['content-type']
    const isFileResponse =
      resContentType?.includes('image') ||
      resContentType?.includes('pdf') ||
      resContentType?.includes('octet-stream') ||
      resContentType?.includes('vnd.openxmlformats-officedocument.spreadsheetml.sheet') ||
      resContentType?.includes('zip')

    if (isDownloadFile || isFileResponse) {
      const res = new NextResponse(Buffer.from(response.data))

      Object.entries(response.headers).forEach(([key, value]) => {
        res.headers.set(key, value)
      })

      res.headers.set('Content-Type', resContentType || req.headers.get('content-type') || 'application/octet-stream')
      return res
    }

    return NextResponse.json({ ...response.data })
  } catch (error) {
    const _err = error as IError

    logger.error('[app.api.*path] Something went wrong', _err)
    return NextResponse.json({ ..._err }, { status: _err?.statusCode })
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const response = await serverFetchWithNextRequest(req)

    return NextResponse.json({ ...response.data })
  } catch (error) {
    const _err = error as IError

    logger.error('Something went wrong', { err: _err, url: req.url, method: req.method })
    return NextResponse.json({ ..._err }, { status: _err?.statusCode })
  }
}

export const PUT = async (req: NextRequest) => {
  try {
    const response = await serverFetchWithNextRequest(req)

    return NextResponse.json({ ...response.data })
  } catch (error) {
    const _err = error as IError

    logger.error('Something went wrong', { err: _err, url: req.url, method: req.method })
    return NextResponse.json({ ..._err }, { status: _err?.statusCode })
  }
}

export const PATCH = async (req: NextRequest) => {
  try {
    const response = await serverFetchWithNextRequest(req)

    return NextResponse.json({ ...response.data })
  } catch (error) {
    const _err = error as IError

    logger.error('Something went wrong', { err: _err, url: req.url, method: req.method })
    return NextResponse.json({ ..._err }, { status: _err?.statusCode })
  }
}

export const DELETE = async (req: NextRequest) => {
  try {
    const response = await serverFetchWithNextRequest(req)

    return NextResponse.json({ ...response.data })
  } catch (error) {
    const _err = error as IError

    logger.error('Something went wrong', { err: _err, url: req.url, method: req.method })
    return NextResponse.json({ ..._err }, { status: _err?.statusCode })
  }
}
