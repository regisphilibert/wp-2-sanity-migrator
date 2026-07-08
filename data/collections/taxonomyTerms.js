import getID from '#utils/getID.js'
import getTermType from '#utils/getTermType.js'
import getTitle from '#utils/getTitle.js'

const transformer = (entry, type) => {
  const termType = getTermType(entry.id)
  return {
    _id: getID(entry.id, termType),
    title: getTitle(entry.name),
    _type: termType,
    slug: {
      _type: 'slug',
      current: entry.slug
    }
  }
}

export default {
  type: 'taxonomyTerm',
  transformer,
  endpoints: [
    'product_cat?per_page=100',
    'product_tag?per_page=100'
  ]
}
