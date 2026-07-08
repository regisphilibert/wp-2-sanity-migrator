import generatePortableText from '#pt/generatePortableText.js'
import getMedia from '#utils/getMedia.js'
import getID from '#utils/getID.js'
import formatDate from '#utils/formatDate.js'
import rel from '#transformers/rel.js'

const transformer = (entry, type) => {
  const image = entry.featured_media && getMedia(entry.featured_media)
  const time_start = formatDate(entry.start_date)
  const time_end = formatDate(entry.end_date)
  let output = {
    _id: getID(entry.id, type),
    _type: type,
    title: entry.title,
    time_start,
    time_end,
    publishedAt: formatDate(entry.date_gmt),
    image,
    link: entry.website || undefined,
    slug: {
      _type: 'slug',
      current: entry.slug
    },

    ...(entry.description ? { body: generatePortableText(entry.description)} : {}),
    ...(entry.venue && entry.venue.id && entry.venue.id != 451 ? {
      venue: rel(entry.venue.id, 'venue')
    }: {})
  }
  return output
}

export default {
  type: 'event',
  transformer,
  endpoints: [
    ['events?per_page=100'],
  ]
}
