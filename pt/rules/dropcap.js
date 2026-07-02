export default {
  deserialize(el, next, block) {
    if(typeof el.tagName == "undefined") {
      return undefined
    }
    if (el.tagName.toLowerCase() != 'span') {
      return undefined
    }

    if(el.getAttribute('class') != "dropcaps") {
      return undefined
    }

    return {
      _type: 'span',
      marks: [
        "dropcap"
      ],
      text: el.textContent
    }
  }
}