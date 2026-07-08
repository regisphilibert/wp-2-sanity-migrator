import config from '#config'
import transformerTerm from '#transformers/term.js'

const { taxonomyGenre_ids = [] } = config

export default {
  type: 'taxonomyGenre',
  transformer: transformerTerm,
  endpoints: [
    `product_cat?include=${taxonomyGenre_ids.join(',')}`
  ]
}
