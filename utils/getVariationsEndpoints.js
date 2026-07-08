import config from '#config'
import fetchPages from './fetchPages.js'

const { woo_params, woo_endpoint } = config
export default async () => {
  const endpoint = `${woo_endpoint}/products?${woo_params}&per_page=100`
  const products = await fetchPages(endpoint)
  const endpoints = products.map(p => `/wc/v3/products/${p.id}/variations?${woo_params}`)
  return endpoints
}