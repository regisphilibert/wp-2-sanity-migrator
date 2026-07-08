import fetch from "./fetch.js"
import fetchPages from "./fetchPages.js"

export default async function(collection) {
  let documents = []
  let entries = []
  const { type = 'unknown', getter = null, pages = null, endpoints = [], transformer = null } = collection
  if(getter) {
    entries = await getter()
    documents.push(...entries)
    console.log(`${type} OK, with ${documents.length} entries`)
    return documents
  }
  let fetches = endpoints
  for (const endpoint of fetches) {
    if(typeof endpoint == "object") {
      entries = await fetchPages(endpoint[0])
    } else {
      entries = await fetch(endpoint)
    }
    if(transformer) {
      entries = entries.map(entry => transformer(entry, type))
    }
    documents.push(...entries)
  }
  console.log(`${type} OK, with ${documents.length} entries`)
  return documents
}