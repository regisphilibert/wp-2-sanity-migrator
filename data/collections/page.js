import config from '#config'
import base from '#transformers/base.js'

const { page_excluded_ids = [] } = config

const transformer = (entry, type) => {
  let slug = entry.slug
  if(slug == 'representation') {
    slug = 'connect/' + entry.slug
  }
  let bottom = base(entry, type)
  delete bottom.publishedAt
  return {
    ...bottom,
    wpId: entry.id,
    slug: {
      _type: 'slug',
      current: slug
    }
  }
}

export default {
  type: 'page',
  transformer,
  endpoints: [
    `pages?per_page=100&exclude=${page_excluded_ids.join(',')}`
  ]
}
