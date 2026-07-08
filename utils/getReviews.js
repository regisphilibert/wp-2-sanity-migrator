import loadStoreFiles from './loadStoreFiles.js'

const reviews = loadStoreFiles('reviews')
export default (id) => {
  const reviewsFound = reviews.filter(r => r.acf && r.acf.related_author_or_book && r.acf.related_author_or_book.includes(id))
  return reviewsFound.length && reviewsFound.map(r => r.id)
}
