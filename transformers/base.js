import generatePortableText from '#pt/generatePortableText.js'
import getMedia from '#utils/getMedia.js'
import getID from '#utils/getID.js'
import getTitle from '#utils/getTitle.js'
import formatDate from '#utils/formatDate.js'

export default  (entry, type) => {
  const image = entry.featured_media && getMedia(entry.featured_media)
  //const enableSharing = entry.jetpack_sharing_enabled && entry.jetpack_sharing_enabled
  return {
    _id: getID(entry.ID, type),
    _type: type,
    title: getTitle(entry.title),
    publishedAt: formatDate(entry.date),
    ...(!!image ? {image} : {}),
    //enableSharing,
    slug: {
      _type: 'slug',
      current: entry.slug
    },
    ...(entry.content ? {body: generatePortableText(entry.content.rendered)} : {}),
    ...(entry.description ? {description: generatePortableText(entry.description)} :
      entry.excerpt ? {description: generatePortableText(entry.excerpt)} : {}
  )
  }
}