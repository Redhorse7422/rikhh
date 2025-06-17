import type { IError } from '@/types/error'
import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { logger } from '@/libs/logger'

import { requestNewToken } from './server'

export const apiAuthSsrRefresh = async (req: NextRequest) => {
  try {
    logger.info('Start refreshing session in the ssr mode...')
    const body = await req.json()
    const res = await requestNewToken(body)
    logger.info('Successfully refreshed session in the ssr mode.')
    return NextResponse.json(res.data)
  } catch (error) {
    const _err = error as IError

    console.error('Failed refreshed session in the ssr mode.', _err)
    logger.error('Failed refreshed session in the ssr mode.', {
      err: _err,
      url: req.url,
      method: req.method,
    })
    return NextResponse.json({ ..._err }, { status: _err?.statusCode })
  }
}
