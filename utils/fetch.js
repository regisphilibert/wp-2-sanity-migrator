import config from '#config'
import cache from './cache.js'
import strToHash from './strToHash.js'

export default async (endpoint, { cache: useCache = true } = {}) => {
  let url = endpoint
  const { domain } = config
  if(endpoint.includes('tribe') || endpoint.includes('/wc/')) {
    url = endpoint
  }
  url = `${domain}/${url}`

  if (useCache) {
    const cached = await cache.read(url)
    if(cached) {
      console.log(`getting cached ${endpoint} OK (${strToHash(url)})`)
      return JSON.parse(cached)
    }
  }
  console.log(`fetching ${endpoint}`)
  const res = await fetch(url);
  if (res.ok) {
      const data = await res.json();
      let output
      if(Array.isArray(data)) {
        // Self-hosted WP REST API (wp-json/wp/v2) and WooCommerce return the
        // collection as a plain array directly.
        output = data
      } else if(typeof data.events !== "undefined") {
        // The Events Calendar plugin (same shape on wp.com and self-hosted).
        output = data.events
      } else if(typeof data.venues !== "undefined") {
        output = data.venues
      } else if(typeof data.posts !== "undefined") {
        // WordPress.com v1.1 API wraps collections as { found, posts: [...] }.
        output = data.posts
      } else {
        // Single-entry response (e.g. fetching one page/post by id).
        output = [data]
      }
      console.log(`fetched ${endpoint} OK`)
      if (useCache) cache.write(url, output)
      return output
  } else {
    console.log(url, 'nope...')
  }
}