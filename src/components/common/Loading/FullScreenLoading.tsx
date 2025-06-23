import clsx from 'clsx'
import { Loader } from './Loader'

export const FullScreenLoading = () => {
  return (
    <div
      className={clsx(
        'fixed left-1/2 top-1/2 z-[1003] -translate-x-1/2 -translate-y-1/2',
        'h-screen w-screen bg-black/70 backdrop-blur',
      )}
    >
      <div
        className={clsx(
          'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
          'flex flex-col items-center justify-center gap-2',
        )}
      >
        <Loader />
        <span className='text-lg text-white'>Loading...</span>
      </div>
    </div>
  )
}
