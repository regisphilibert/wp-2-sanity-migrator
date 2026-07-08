import generatePortableText from '#pt/generatePortableText.js'

/*
 * Example getter — demonstrates the concept, not a real page. A getter is
 * any function returning an array of finished Sanity documents; used when a
 * collection doesn't come from a WordPress REST endpoint at all (a
 * hand-authored page, a document assembled from several unrelated fetches,
 * etc). data/collections/about.js wires this in via `getter` instead of the
 * usual `transformer`/`endpoints` pair — see utils/getDocuments.js for how
 * the two paths differ.
 *
 * Swap the hardcoded body below for whatever this project's About page
 * actually needs, or delete this pair of files if you don't need one.
 */
const body = `
  <p>Write the About page copy here, as plain HTML. generatePortableText()
  turns it into Sanity portable text blocks, the same way it does for
  content pulled from WordPress.</p>
`

export default () => {
  return [{
    _id: 'about',
    _type: 'page',
    title: 'About',
    slug: { _type: 'slug', current: 'about' },
    body: generatePortableText(body),
  }]
}