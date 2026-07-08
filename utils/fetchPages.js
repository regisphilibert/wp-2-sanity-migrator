import fetch from './fetch.js'

// Fetches every page of a collection endpoint without needing to know the
// total count upfront: keeps requesting the next page until one comes back
// empty (or errors, e.g. a WP-core "page beyond total" 400), same pattern
// scripts/storeMedia.js and scripts/storeReviews.js use.
export default async (endpoint) => {
  let entries = []
  let index = 1
  let data

  do {
    const delimiter = endpoint.includes('?') ? '&' : '?'
    data = await fetch(endpoint + `${delimiter}page=${index}`)
    if (data && data.length) {
      entries.push(...data)
    }
    index++
  } while (data && data.length > 0)

  return entries
}