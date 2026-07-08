// Relating a review back to its author/book has no generic implementation:
// the previous project matched them via an ACF field on the review entry.
// See transformers/_examples/acf.js for that mapping — re-implement the
// match here (via `loadStoreFiles('reviews')`) if the new project needs it.
export default (id) => {
  return false
}
