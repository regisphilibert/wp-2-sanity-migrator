export default {
  deserialize(el, next, block) {
    if (typeof el.tagName == "undefined") {
      return undefined
    }

    if (el.tagName.toLowerCase() != 'p') {
      return undefined
    }

    if(el.style.textIndent) {
      const number = parseInt(el.style.textIndent, 10); // Extracts the integer part
      if(number > 0) {
        const xString = "x".repeat(number * 2);

        return block({
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              marks: [
                "hide"
              ],
              text: xString
            },
            ...next(el.childNodes)
          ],
        })
      }

    }
    return undefined
  }
}