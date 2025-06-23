// import { useRouter } from 'next/router'

import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { Flex } from '@/components/common/Flex'
import { useRouter } from 'next/navigation'

export const SectionAction = () => {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <Card className='shadow-t-lg !sticky -bottom-9'>
      <Flex justify='space-between'>
        <Button label='Back' type='button' onClick={handleBack} />

        <Button type='submit' label='Submit' />
      </Flex>
    </Card>
  )
}
