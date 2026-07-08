import getReviews from '#utils/getReviews.js'
import base from '#transformers/base.js'
import rels from '#transformers/rels.js'

// Author bio fields (name, links, testimonial) aren't handled here — the
// previous project sourced them from an ACF field group that won't exist
// on a fresh site. See transformers/_examples/acf.js for that mapping.
const transformer = (entry, type) => {
  const bottom = base(entry, type)
  delete bottom.publishedAt

  const output = {
    ...bottom,
    wpId: entry.id,
    associations: ['author'],
  }

  const reviews = getReviews(entry.id)
  if(!!reviews) {
    output.reviews = rels(reviews, 'review')
  }

  return output
}

export default {
  type: 'person',
  transformer,
  endpoints: [
    'sm_authors?per_page=100'
  ]
}
