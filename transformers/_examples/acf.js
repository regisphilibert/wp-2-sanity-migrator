/*
 * Reference only — this file is never imported.
 *
 * A past migration built on ACF (Advanced Custom Fields) field groups that
 * are entirely specific to that WordPress site's setup, so the branches
 * reading them were stripped out of the live transformers to keep this
 * template unopinionated. This collects what they looked like, in case a
 * future project uses ACF again and some of this shape is worth reusing.
 *
 * utils/fetch.js now spreads `entry.acf` onto the top level of every entry
 * automatically (ACF always nests custom fields there — that part isn't
 * project-specific, only the field names are). So none of the snippets
 * below need to reach into `entry.acf` anymore — they're written assuming
 * flat access, e.g. `entry.pdf_file` rather than `entry.acf.pdf_file`.
 */

// --- transformers/base.js ---------------------------------------------------
// Attached a PDF (an ACF file field) alongside the featured image.
//
//   const file = entry.pdf_file ? getMedia(entry.pdf_file) : false
//   ...
//   ...(file ? {file} : {}),


// --- data/collections/person.js ---------------------------------------------
// Author bio fields, sourced from an ACF field group prefixed `sm_author_*`
// on the `sm_authors` custom post type.
//
//   const {
//     sm_author_first_name: firstName,
//     sm_author_last_name: lastName,
//     sm_author_website: link,
//     sm_author_twitter: twitter,
//     sm_author_facebook: facebook,
//     sm_author_testimonial: testimonial,
//   } = entry
//
//   const undefinedIfEmpty = (value) => value !== "" ? value : undefined
//
//   output.firstName = undefinedIfEmpty(firstName)
//   output.lastName = undefinedIfEmpty(lastName)
//   output.link = undefinedIfEmpty(link)
//   output.twitter = undefinedIfEmpty(twitter)
//   output.facebook = undefinedIfEmpty(facebook)
//   output.testimonial = testimonial ? generatePortableText(testimonial) : undefined


// --- data/collections/review.js ---------------------------------------------
// Attribution/source-link fields on a review entry.
//
//   const { attribution, link_to_original: link } = entry
//   if (attribution) output.title = getTitle(attribution)
//   if (link) output.url = link


// --- data/collections/book.js ------------------------------------------------
// Book metadata (page count, related author, subtitle), sourced from an ACF
// field group on the WooCommerce product's underlying WP post (looked up via
// utils/getWPBook.js — that snapshot is normalized the same way, since
// scripts/storeBooks.js also fetches through utils/fetch.js).
//
//   const wpBook = getWPBook(entry.id)
//   if (wpBook) {
//     const {
//       sm_book_page_count: pageCount,
//       related_author: author,
//       book_subtitle: subtitle,
//     } = wpBook
//     if (pageCount) output.pageCount = parseInt(pageCount)
//     if (author) output.persons = rels(author, 'person')
//     if (subtitle) output.subtitle = subtitle
//   }


// --- utils/getReviews.js ------------------------------------------------------
// Related a review back to its author/book via an ACF relationship field
// (`related_author_or_book`) on the review entry itself.
//
//   const reviews = loadStoreFiles('reviews')
//   export default (id) => {
//     const found = reviews.filter(r =>
//       r.related_author_or_book && r.related_author_or_book.includes(id)
//     )
//     return found.length && found.map(r => r.id)
//   }
