export default {
  deserialize(el, next, block) {
    let align
    if (typeof el.tagName == "undefined") {
      return undefined
    }

    if (el.tagName.toLowerCase() != 'p') {
      return undefined
    }

    // Check if the element is empty
    if (el.className.includes('p-section-break')) {
      align = "center"
    }
    if(el.style.textAlign && ["right", "center"].includes(el.style.textAlign)) {
      align = el.style.textAlign
    }

    if(align) {
      return block({
        _type: 'block',
        style: align,
        children: next(el.childNodes)
      })
    }
    return undefined
  }
}