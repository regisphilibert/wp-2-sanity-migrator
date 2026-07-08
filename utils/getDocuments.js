import fetch from "./fetch.js"
import fetchPages from "./fetchPages.js"
import * as progress from "./cli/progress.js"

export default async function(collection) {
  let documents = []
  let entries = []
  const { type = 'unknown', getter = null, pages = null, endpoints = [], transformer = null } = collection
  progress.start(type)
  if(getter) {
    entries = await getter()
    documents.push(...entries)
    progress.finish(documents.length)
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
  progress.finish(documents.length)
  return documents
}