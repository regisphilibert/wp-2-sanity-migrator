import fetch from '../utils/fetch.js'
import base from '../transformers/base.js'
import rels from '../transformers/rels.js'
import getSourcesFromString from '../utils/getSourcesFromString.js'

export default async () => {
  const [entry] = await fetch('pages/23')
  let galleries = []
  let gallery_pages_endoints = [
    'pages/958', // Images by Juergen Frank
    'pages/233', // Images bt Christian Steiner
    'pages/234', // Images by Peter Schaaf
  ]
  for (const endpoint of gallery_pages_endoints) {
    const [page] = await fetch(endpoint)
    if(page.content.rendered){
      const sources = getSourcesFromString(page.content.rendered)
      galleries.push({
        title: page.title.rendered,
        images: sources.map(src => ({
          _type: 'image',
          _sanityAsset: `image@${src}`,
        }))
      })
    }
  }
  const bottom = base(entry, 'pageAbout')
  delete bottom.publishedAt
  return [{
    ...bottom,
    _id: 'pageAbout',
    persons: rels([
      26,
      25,
      27,
      24,
    ], 'person'),
    galleries
  }]
}