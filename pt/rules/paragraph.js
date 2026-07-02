export default {
  deserialize(el, next, block) {
    if (typeof el.tagName == "undefined") {
      return undefined
    }

    if (el.tagName.toLowerCase() != 'p') {
      return undefined
    }

    // Check if the element is empty
    if (!el.childNodes || el.childNodes.length === 0) {
      return {}; // or handle empty element case
    }

  }
}