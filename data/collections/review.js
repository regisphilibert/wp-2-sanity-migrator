import generatePortableText from '#pt/generatePortableText.js'
import formatDate from '#utils/formatDate.js'
import getID from '#utils/getID.js'
import getTitle from '#utils/getTitle.js'

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

  if(entry.acf) {
    const { attribution, link_to_original: link } = entry.acf
    output.title = getTitle(attribution)
    if(!!link) {
      output.url = link
    }
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
