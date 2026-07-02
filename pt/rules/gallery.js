import generatePortableText from "../generatePortableText.js"
export default {
  deserialize(el, next, block) {
    if (typeof el.tagName == "undefined") {
      return undefined
    }
    if (!el.id.startsWith('soliloquy-container-')) {
      return undefined
    }

    // Assuming `el` is the container
  const images = [];
  const listItems = el.querySelectorAll('li'); // Get all li elements

  listItems.forEach(item => {
    const img = item.querySelector('img'); // Get the img element inside the li

    if (img) {
      const src = img.getAttribute('data-soliloquy-src') || img.getAttribute('src'); // Get the src or data-soliloquy-src if lazy-loaded
      const alt = img.getAttribute('alt') || ''; // Get the alt attribute, fallback to empty string if missing
      const title = img.getAttribute('title') || alt; // Get the title, or fallback to alt if title is missing

      if(src) {
        images.push({
          _type: "image",
          _sanityAsset: `image@${src}`,
          caption: generatePortableText(title || alt),
          altText: alt || title
        })
      }
    }
  });
  const parameters = {
    _type: 'pt.gallery',
    images,
  }
  return block(parameters)
  }
}