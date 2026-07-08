import getID from '#utils/getID.js'
import getMedia from '#utils/getMedia.js'
import getWPBook from '#utils/getWPBook.js'
import getVariationsEndpoints from '#utils/getVariationsEndpoints.js'

const getBinding = (string) => {
  const mapping = {
    'Ebook': 'ebook',
    'Trade Paper': 'paperback',
    'Trade Cloth': 'hardcover'
  }
  const output = 'hardcover'
  if(!!mapping[string]) {
    output = mapping[string]
  }
  return output
}

const transformer = (entry, type) => {
  const output = {
    _id: getID(entry.id, type),
    _type: type,
  }

  const { attributes, sku, price, parent_id } = entry
  const book = parent_id && getWPBook(parent_id)
  if(book) {
    if(!!book.featured_media) {
      output.image = getMedia(book.featured_media)
    }
    if(!!book.date) {
      output.pubdate = book.date
    }
    if(!!book.description) {
      output.description = book.description
    }
  }
  if(!!attributes && !!attributes[0]){
    if(!!attributes[0].option) {
      output.binding = getBinding(attributes[0].option)
    }
  }
  if(!!sku) {
    output.isbn = sku
  }
  if(!!price){
    output.salesData = {
      price_us: parseFloat(price)
    }
  }
  return output
}

export default async () => ({
  type: 'bookEdition',
  transformer,
  endpoints: await getVariationsEndpoints()
})
