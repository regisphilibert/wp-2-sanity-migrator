/**
What We want to return
{
  _type: image
  _sanityAsset: image@https://www.joinproviders.com/uploads/blog-tax-safe-graphic.jpg
}
 */

//import { stripHtml } from "../../utils/stripHtml.js";

export default {
  deserialize(el, next, block) {
    if (typeof el.tagName == "undefined") {
      return undefined
    }

    if (el.tagName.toLowerCase() != 'img') {
      return undefined
    }

    if(el.parentNode.tagName.toLowerCase() == "figure") {
      return undefined
    }

    // Don't run if part of a soliloquy gallery (gallery rule will take care of it)
    if (el.closest('.soliloquy-outer-container')) {
      return undefined;
    }

    let src = el.getAttribute("src")
    let publicSrc
    let caption
    if(src.includes('holder.gif')) {
      return undefined
    }
    if (src.includes('http')) {
      publicSrc = src
      if (!publicSrc.includes('//shanendoah.wpenginepowered.com')) {
        return undefined
      }
    } else {
      src = src.replace('/uploads', '')
      publicSrc = `https://shanendoah.wpenginepowered.com/${src}`
    }
    if (el.getAttribute("data-caption")) {
      caption = el.getAttribute("data-caption")
    }

    if(el.nextElementSibling && el.nextElementSibling.tagName.toLowerCase() == "figcaption") {
      //caption = stripHtml(el.nextElementSibling.innerHTML, ['em', 'strong'])
    }
    return block({
      _type: "image",
      _sanityAsset: `image@${publicSrc}`,
      caption,
    })
  }
}