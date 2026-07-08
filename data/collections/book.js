import config from '#config'
import generatePortableText from '#pt/generatePortableText.js'
import getReviews from '#utils/getReviews.js'
import getTermType from '#utils/getTermType.js'
import base from '#transformers/base.js'
import rel from '#transformers/rel.js'
import rels from '#transformers/rels.js'

const { woo_params, woo_endpoint } = config

// pageCount/subtitle/persons aren't handled here — the previous project
// sourced them from an ACF field group on the WP post that won't exist on a
// fresh site. See transformers/_examples/acf.js for that mapping.
const transformer = (entry, type) => {
  let output = {...base(entry, type)}

  const {
    date_created_gmt: date,
    description: content,
    short_description: description,
    product_cat: taxonomyProductCategories,
    product_tag: taxonomyProductTags,
    variations,
    name,
    categories,
    tags,
    id: wpId,
  } = entry
  output.title = name
  output.wpId = wpId
  if(!!content) {
    output.body = generatePortableText(content)
  }
  if(!!date) {
    output.publishedAt = date + `.000Z`
  }
  if(!!description) {
    output.description = generatePortableText(description)
  }
  if(!!variations) {
    output.editions = rels(variations, 'bookEdition')
  }
  let types = {}
  const allTerms = [...categories, ...tags]
  const storedAsObjects = ['taxonomyGenre', 'taxonomySeries']
  allTerms.forEach(t => {
    const termType = getTermType(t.id)
    if(!storedAsObjects.includes(termType)) {
      const key = termType + 's'
      if(!types[key]) {
        types[key] = []
      }
      types[key].push(rel(t.id, termType))
    } else {
      types[termType] = rel(t.id, termType)
    }
  });

  output = {
    ...output,
    ...types,
  }

  const reviews = getReviews(entry.id)
  if(!!reviews) {
    output.reviews = rels(reviews, 'review')
  }

  return output
}

export default {
  type: 'book',
  transformer,
  endpoints: [
    [`${woo_endpoint}/products?${woo_params}&per_page=100`]
  ]
}
