import loadStoreFiles from './loadStoreFiles.js'

const medias = loadStoreFiles('media')

export default (id) => {
  const media = medias.find(entry => entry.id == id)
  if(media) {
    const url = media.source_url
    const caption = media.caption && media.caption.rendered && media.caption.rendered.replace(/(<([^>]+)>)/gi, "")
    if(media.media_type == 'file') {
      return {
        _type: 'file',
        _sanityAsset: `file@${url}`
      }
    } else {
      return {
        _type: 'image',
        _sanityAsset: `image@${url}`,
        ...(caption ? {caption} : {})
      }
    }
  } else {
    return false
  }
}