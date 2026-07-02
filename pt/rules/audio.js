export default {
  deserialize(el, next, block) {
  if (typeof el.tagName == "undefined") {
    return undefined
  }

  if (el.tagName.toLowerCase() != 'a') {
    return undefined
  }
  const href = el.getAttribute("href")
  if (href && href.endsWith('.mp3')) {
    return block({
      _type: 'pt.audio',
      file: {
        _sanityAsset: `file@${href}`,
      }
    })
  } else {
    return undefined
  }
}}