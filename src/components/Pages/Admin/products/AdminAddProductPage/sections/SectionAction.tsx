// import { useRouter } from 'next/router'

import type { FC } from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { Flex } from '@/components/common/Flex'

type SectionActionProps = {
  updating?: boolean | false
}

export const SectionAction: FC<SectionActionProps> = ({ updating }) => {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <Card className='shadow-t-lg !sticky -bottom-9'>
      <Flex justify='space-between'>
        <Button label='Back' type='button' onClick={handleBack} />

        <Button type='submit' label={updating ? 'Update' : 'Submit'} />
      </Flex>
    </Card>
  )
}
