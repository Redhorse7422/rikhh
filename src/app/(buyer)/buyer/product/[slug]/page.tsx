import { ProductDetailPage } from '@/components/Pages/Buyer/ProductDetailPage'

export default async function ProductPage({}: { params: Promise<{ slug: string[] }> }) {
  return <ProductDetailPage />
}
