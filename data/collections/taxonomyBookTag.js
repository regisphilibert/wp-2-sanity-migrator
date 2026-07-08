import transformerTerm from '#transformers/term.js'

export default {
  type: 'taxonomyBookTag',
  transformer: transformerTerm,
  endpoints: [
    'product_tag/?per_page=100'
  ]
}
