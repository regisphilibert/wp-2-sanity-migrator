import generatePortableText from '#pt/generatePortableText.js'
import getReviews from '#utils/getReviews.js'
import base from '#transformers/base.js'
import rels from '#transformers/rels.js'

const undefinedIfEmpty = (value) => {
  return value !== "" ? value : undefined
}

const transformer = (entry, type) => {
  const bottom = base(entry, type)
  delete bottom.publishedAt
  const { acf: {
    sm_author_first_name: firstName,
    sm_author_last_name: lastName,
    sm_author_website: link,
    sm_author_twitter: twitter,
    sm_author_facebook: facebook,
    sm_author_testimonial: testimonial,
  } = {}} = entry

  const output =  {
    ...bottom,
    wpId: entry.id,
    associations: ['author'],
    firstName: undefinedIfEmpty(firstName),
    lastName: undefinedIfEmpty(lastName),
    link: undefinedIfEmpty(link),
    twitter: undefinedIfEmpty(twitter),
    facebook: undefinedIfEmpty(facebook),
    testimonial: !!testimonial ? generatePortableText(testimonial) : undefined
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
