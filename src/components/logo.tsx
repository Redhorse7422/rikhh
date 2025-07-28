import Image from 'next/image'

export function Logo() {
  return (
    <div className='relative h-8 max-w-[10.847rem]'>
      <Image
        src="/images/logo/logo.svg"
        className='dark:hidden'
        alt='Rikhh Seller logo'
        role='presentation'
        quality={100}
        width={120}
        height={48}
      />

      <Image
        src="/images/logo/logo-dark.svg"
        className='hidden dark:block'
        alt='Rikhh Seller logo'
        role='presentation'
        quality={100}
        width={120}
        height={48}
      />
    </div>
  )
}
