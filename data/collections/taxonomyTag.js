import transformerTerm from '#transformers/term.js'

export default {
  type: 'taxonomyTag',
  transformer: transformerTerm,
  endpoints: [
    'tags/?per_page=100'
  ]
}
