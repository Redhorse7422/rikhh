import { TableProps } from '@/components/ui/paginated-table/type'

export const useColumn = () => {
  const columns: TableProps['columns'] = [
    {
      header: 'Name',
      key: 'name',
      width: '35%',
      isSort: true,
    },
    {
      header: 'Slug',
      key: 'slug',
      width: '35%',
      isSort: true,
    },
  ]

  return { columns }
}
