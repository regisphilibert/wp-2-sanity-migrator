//import { stripHtml } from "../../utils/stripHtml.js"

export default {
  deserialize(el, next, block) {
    if (typeof el.tagName == "undefined") {
      return undefined
    }
    if (el.tagName.toLowerCase() !== 'figure') {
      return undefined
    }
    const image = el.querySelector('img')
    if(!image) {
      return undefined
    }
    let src = image.getAttribute("src")
    let caption
    let publicSrc
    if(src.includes('holder.gif')) {
      return undefined
    }
    if (src.includes('http')) {
      publicSrc = src
      if (!publicSrc.includes('//reellifeinmontreal.wordpress.com')) {
        return undefined
      }
    }
    if(image.getAttribute('data-orig-file')) {
      publicSrc = image.getAttribute('data-orig-file')
    }
    const figcaption  = el.querySelector('figcaption')
    if(figcaption) {
      caption = figcaption.innerHTML
    }
    return block({
      _type: "image",
      _sanityAsset: `image@${publicSrc}`,
      caption,
    })
  }
}