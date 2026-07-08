import generatePortableText from '#pt/generatePortableText.js'
import formatDate from '#utils/formatDate.js'
import base from '#transformers/base.js'
const transformer = (entry, type) => {
  const time_start = formatDate(entry.start_date)
  const time_end = formatDate(entry.end_date)
  let output = {
    ...base(entry, type),
    time_start,
    time_end,
    link: entry.website || undefined,
    slug: {
      _type: 'slug',
      current: entry.slug
    },

    ...(entry.description ? { body: generatePortableText(entry.description)} : {}),
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
