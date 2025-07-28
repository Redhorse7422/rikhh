import { FirebaseTestOptimized } from '@/components/FirebaseTestOptimized'

export default function TestImagesPage() {
  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4'>
        <h1 className='mb-8 text-center text-3xl font-bold'>Firebase Storage Image Test</h1>
        <FirebaseTestOptimized />
      </div>
    </div>
  )
}
