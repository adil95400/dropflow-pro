
import { ShopifyClient } from './shopify'

export const publishBlogToShopify = async (shop: string, accessToken: string, blogData: any) => {
  const client = new ShopifyClient(shop, accessToken)
  return await client.post('/admin/api/2023-01/blogs.json', { blog: blogData })
}
