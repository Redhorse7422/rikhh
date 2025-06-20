/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { deepCleanUndefined } from '@/utils/object'

type UseNavigateProps = {
  parentPath?: string
}

export const useNavigate = (props?: UseNavigateProps) => {
  const router = useRouter()
  const spr = useSearchParams()
  const pathname = usePathname()

  const navigate = (addonQs?: Record<string, any>, path?: string) => {
    const qs: any = {}
    spr.forEach((v, k) => {
      if (v) qs[k] = v
    })

    const qsParams = new URLSearchParams(deepCleanUndefined({ ...qs, ...(addonQs || {}) })).toString()
    const parent = props?.parentPath || pathname
    const sub = path ? `/${path}` : ''
    const params = qsParams ? `?${qsParams}` : ''
    router.replace(`${parent}${sub}${params}`)
  }

  const rPush = (path?: string) => {
    const parent = props?.parentPath || pathname
    const sub = path ? `/${path}` : ''
    router.push(`${parent}${sub}`)
  }

  return { navigate, rPush }
}
