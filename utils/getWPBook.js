import loadStoreFiles from './loadStoreFiles.js'

const books = loadStoreFiles('books')

export default (id) => {
  const book = books.find(entry => entry.id == id)
  return book
}
