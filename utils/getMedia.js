import store_1 from '../data/media/store_1.json' with { type: "json" };
import store_2 from '../data/media/store_2.json' with { type: "json" };
import store_3 from '../data/media/store_3.json' with { type: "json" };
import store_4 from '../data/media/store_4.json' with { type: "json" };
import store_5 from '../data/media/store_5.json' with { type: "json" };

const medias = [
  ...store_1,
  ...store_2,
  ...store_3,
  ...store_4,
  ...store_5
]

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