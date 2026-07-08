import transformerTerm from '#transformers/term.js'

export default {
  type: 'taxonomyCategory',
  transformer: transformerTerm,
  endpoints: [
    'categories/?per_page=100'
  ]
}
