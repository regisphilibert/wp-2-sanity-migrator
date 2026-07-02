function getVideoIdFromUrl(url) {
  // Regex patterns for YouTube and Vimeo
  var youtubeRegex = /youtube\.com\/embed\/([\w-]+)/;
  var vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/;

  // Check YouTube
  var youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch && youtubeMatch[1]) {
    return youtubeMatch[1]; // YouTube video ID
  }

  // Check Vimeo
  var vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return vimeoMatch[1]; // Vimeo video ID
  }

  // If no match, return null
  return null;
}

//<p><iframe loading="lazy" title="Little Brown Jug" width="640" height="360" src="https://www.youtube.com/embed/00ADsMTkH08?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></p>
export default {
  deserialize(el, next, block) {
    if (typeof el.tagName == "undefined") {
      return undefined;
    }
    if (el.tagName.toLowerCase() !== 'iframe') {
      return undefined;
    }
    let url = el.getAttribute("src") || false;
    if (url) {
      if (getVideoIdFromUrl(url)) {
        return block({
          _type: "pt.video",
          videoId: getVideoIdFromUrl(url)
        });
      }
    }
    const html = el.outerHTML;
    return block({
      _type: 'pt.html',
      html
    });
  }
}