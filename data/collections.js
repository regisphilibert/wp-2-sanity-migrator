import config from './config.rscdsmtl.js'
import transformerPost from '../transformers/post.js'
import transformerPerson from '../transformers/person.js'
import transformerEvent from '../transformers/event.js'
import transformerBook from '../transformers/book.js'
import transformerBookEdition from '../transformers/bookEdition.js'
import transformerVenue from '../transformers/venue.js'
import transformerTerm from '../transformers/term.js'
import transformerReview from '../transformers/review.js'
import transformerPage from '../transformers/page.js'
import getVariationsEndpoints from '../utils/getVariationsEndpoints.js'
import taxonomyTerm from '../transformers/taxonomyTerm.js'
import homeGetter from '../getters/home.js'
const { woo_params, woo_endpoint } = config

const home = {
  type: 'home',
  getter: homeGetter
}
const excludes = [
  // WooCommerce...
  8, // Track Your order (empty),
  4, // Shop (empty)
  6, //Cart
  7, // Checkout
  9, // Acount
  1153, // Checkout -> Pay
  1154, // Order Received
  // The rest
  621, // Home page,
  620, // The Periodic Table (blog landing)
  5526, // Fete duplicate,
  607, // Books - Shop Page
  979, // Books Detailed Listing
]
const includes = [
  609, // About,
  665, // Contact
  4208, // Fête
]
const page = {
  type: 'page',
  transformer: transformerPage,
  endpoints: [
    `pages?per_page=100&exclude=${excludes.join(',')}`
  ]
}

const post = {
  type: 'post',
  transformer: transformerPost,
  endpoints: [
    'posts?after=2025-10-30',
  ]
}

const person = {
  type: 'person',
  transformer: transformerPerson,
  endpoints: [
   'sm_authors?per_page=100'
  ]
}


const taxonomyTerms = {
  type: 'taxonomyTerm',
  transformer: taxonomyTerm,
  endpoints: [
    'product_cat?per_page=100',
    'product_tag?per_page=100'
  ]

}

const taxonomyCategory = {
  type: 'taxonomyCategory',
  transformer: transformerTerm,
  endpoints: [
    'categories/?per_page=100'
  ]
}

const taxonomyTag = {
  type: 'taxonomyTag',
  transformer: transformerTerm,
  endpoints: [
    'tags/?per_page=100'
  ]
}

const taxonomyGenre = {
  type: 'taxonomyGenre',
  transformer: transformerTerm,
  endpoints: [
    'product_cat?include=363,50'
  ]
}

const taxonomyBookCategory = {
  type: 'taxonomyBookCategory',
  transformer: transformerTerm,
  endpoints: [
    'product_cat/?per_page=100'
  ]
}

const taxonomyBookTag = {
  type: 'taxonomyBookTag',
  transformer: transformerTerm,
  endpoints: [
    'product_tag/?per_page=100'
  ]
}

const event = {
  type: 'event',
  endpoints: [
    [config.event_endpoint + '&per_page=50', 7],
  ],
  transformer: transformerEvent
}

const venue = {
  type: 'venue',
  transformer: transformerVenue,
  endpoints: [
    [config.venue_endpoint + '?per_page=50', 6],
  ]
}

const book = {
  type: 'book',
  transformer: transformerBook,
  endpoints: [
    [`${woo_endpoint}/products?${woo_params}&per_page=100`, 2]
  ]
}

const bookEdition = async () => ({
  type: 'bookEdition',
  transformer: transformerBookEdition,
  endpoints: await getVariationsEndpoints()
})

const review = {
  type: 'review',
  transformer: transformerReview,
  endpoints: [
    ['sm_reviews?per_page=100', 17]
  ]
}



const collections = async () => ([
  //home,
  //page,
  post,
  //person,
  //event,
  //venue,
  //book,
  //await bookEdition(),
  //review,

  //taxonomyTerms,
  //taxonomyCategory,
  //taxonomyTag,
  //taxonomyGenre,
  //taxonomyBookCategory,
  //taxonomyBookTag,
])

export default async () => {
  let output = await collections()
  return output
}