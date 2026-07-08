import config from '#config'
import page from './page.js'
import post from './post.js'
import person from './person.js'
import event from './event.js'
import venue from './venue.js'
import book from './book.js'
import bookEdition from './bookEdition.js'
import review from './review.js'
import taxonomyTerms from './taxonomyTerms.js'
import taxonomyCategory from './taxonomyCategory.js'
import taxonomyTag from './taxonomyTag.js'
import taxonomyGenre from './taxonomyGenre.js'
import taxonomyBookCategory from './taxonomyBookCategory.js'
import taxonomyBookTag from './taxonomyBookTag.js'

// Every collection this template knows how to build, keyed by the name
// used in config.js's `enabled_collections`. Add a new file here (and to
// this registry) to make a new content type available across projects;
// which of these actually run for a given project is controlled entirely
// by config.js, not by editing this file.
const registry = {
  page,
  post,
  person,
  event,
  venue,
  book,
  bookEdition,
  review,
  taxonomyTerms,
  taxonomyCategory,
  taxonomyTag,
  taxonomyGenre,
  taxonomyBookCategory,
  taxonomyBookTag,
}

export default async () => {
  const enabled = config.enabled_collections || []
  const collections = []

  for (const name of enabled) {
    const entry = registry[name]
    if (!entry) {
      console.warn(`config.enabled_collections references unknown collection "${name}"`)
      continue
    }
    collections.push(typeof entry === 'function' ? await entry() : entry)
  }

  return collections
}
