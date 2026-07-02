
export default {
  deserialize(el, next, block) {
    if(typeof el.tagName == "undefined") {
      return undefined
    }
    if (el.tagName.toLowerCase() != 'span') {
      return undefined
    }

    if(el.getAttribute('class') != "hide-it") {
      return undefined
    }

    return {
      _type: 'span',
      marks: [
        "hide"
      ],
      text: el.textContent
    }
  }
}
