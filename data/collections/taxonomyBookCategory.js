import transformerTerm from '#transformers/term.js'

export default {
  type: 'taxonomyBookCategory',
  transformer: transformerTerm,
  endpoints: [
    'product_cat/?per_page=100'
  ]
}
