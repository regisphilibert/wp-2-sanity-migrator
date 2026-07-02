import config from '../data/config.js'
import cache from './cache.js'
import strToHash from './strToHash.js'

export default async (endpoint) => {
  let url = endpoint
  const { domain } = config
  if(endpoint.includes('tribe') || endpoint.includes('/wc/')) {
    url = endpoint
  }
  url = `${domain}/${url}`

  const cached = await cache.read(endpoint)
  if(cached) {
    console.log(`getting cached ${endpoint} OK (${strToHash(endpoint)})`)
    return JSON.parse(cached)
  } else {
    console.log(`fetching ${endpoint}`)
  }
  const res = await fetch(url);
  if (res.ok) {
      let data = await res.json();
      if(typeof data == "object" && !Array.isArray(data)) {
        if(typeof data.events !== "undefined") {
          data = data.events
        } else if(typeof data.venues !== "undefined") {
          data = data.venues
        } else {
          data = [data]
        }
      }
      let output = data
      if(Array.isArray(data)) {
        output = data[0].posts
      }
      console.log(`fetched ${endpoint} OK`)
      cache.write(endpoint, output)
      return output
  } else {
    console.log(url, 'nope...')
  }
}