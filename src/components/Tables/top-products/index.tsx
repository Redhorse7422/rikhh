import Image from 'next/image'

import { PaginatedTable } from '@/components/ui/paginated-table'

export async function TopProducts() {
  const columns = [
    {
      accessorKey: 'image',
      header: 'Product',
      cell: (row: any) => (
        <div className='flex items-center gap-3'>
          <Image
            src={row.image}
            className='aspect-[6/5] w-15 rounded-[5px] object-cover'
            width={60}
            height={50}
            alt={`Image for ${row.name}`}
          />
          <div>{row.name}</div>
        </div>
      ),
      className: 'min-w-[200px] pl-5 sm:pl-6 xl:pl-7.5',
    },
    {
      accessorKey: 'category',
      header: 'Category',
      className: 'min-w-[120px]',
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: (row: any) => `$${row.price}`,
      className: 'min-w-[100px]',
    },
    {
      accessorKey: 'sold',
      header: 'Sold',
      className: 'min-w-[80px]',
    },
    {
      accessorKey: 'profit',
      header: 'Profit',
      cell: (row: any) => <span className='text-green-500'>${row.profit}</span>,
      className: 'min-w-[100px] pr-5 text-right sm:pr-6 xl:pr-7.5',
    },
  ]

  return (
    <div className='rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card'>
      <div className='px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5'>
        <h2 className='text-2xl font-bold text-dark dark:text-white'>Top Products</h2>
      </div>

      <PaginatedTable path='/categories' columns={columns} />
    </div>
  )
}
