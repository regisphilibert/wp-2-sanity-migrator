import generatePortableText from '#pt/generatePortableText.js'
import formatDate from '#utils/formatDate.js'
import getID from '#utils/getID.js'

// Attribution/source-link fields aren't handled here — the previous project
// sourced them from an ACF field group that won't exist on a fresh site.
// See transformers/_examples/acf.js for that mapping.
const transformer = (entry, type) => {
  const output = {
    _type: 'review',
    title: entry.title,
    _id: getID(entry.id, type),
    wpId: entry.id,
    publishedAt: formatDate(entry.date_gmt),
  }

  const body = entry.content && entry.content.rendered
    .replace('“', '')
    .replace('”', '')
    .replace('&#8220;', '')
    .replace('&#8221;', '')

  if(!!body) {
    output.body = generatePortableText(body)
  }

  return output
}

export default {
  type: 'review',
  transformer,
  endpoints: [
    ['sm_reviews?per_page=100']
  ]
}
