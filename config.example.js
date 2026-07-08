// Copy this file to `config.js` and fill in the values for the project you're
// migrating. `config.js` is gitignored so real credentials never get committed.

// WooCommerce REST API credentials.
// Generate these in the source WordPress site's admin under:
// WooCommerce > Settings > Advanced > REST API > Add key
// (requires at least Read access)
const woo_consumer_key = 'ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
const woo_consumer_secret = 'cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'

export default {
  // Base URL of the source WordPress REST API, with no trailing slash.
  // For a WordPress.com-hosted site this looks like:
  //   https://public-api.wordpress.com/rest/v1.1/sites/<your-site>.wordpress.com
  // For a self-hosted site this is usually:
  //   https://<your-domain>/wp-json
  domain: 'https://public-api.wordpress.com/rest/v1.1/sites/your-site.wordpress.com',

  woo_consumer_key,
  woo_consumer_secret,

  // Endpoint (relative to `domain`) for The Events Calendar plugin's events.
  // The `start_date` param limits how far back events are fetched.
  // Omit/adjust this (and `venue_endpoint` below) if the site doesn't use
  // The Events Calendar / Event Tickets plugin.
  event_endpoint: '/tribe/events/v1/events?start_date=1990-01-01',

  // Endpoint (relative to `domain`) for The Events Calendar plugin's venues.
  venue_endpoint: '/tribe/events/v1/venues.js',

  // Base path for the WooCommerce REST API. Omit/adjust if the site doesn't
  // sell products through WooCommerce.
  woo_endpoint: '/wc/v3',

  // Query string appended to WooCommerce REST API requests for auth.
  // Leave as-is; it's derived from the credentials above.
  woo_params: new URLSearchParams({
    consumer_key: woo_consumer_key,
    consumer_secret: woo_consumer_secret
  }),

  // Which data/collections/*.js entries to run for this project, by name.
  // See the registry in data/collections/index.js for the full list of
  // available names (post, page, event, venue, book, review, taxonomy*, ...).
  enabled_collections: [
    'post',
  ],

  // --- Below: knobs read by specific data/collections/*.js files. Only ---
  // --- fill in the ones for collections you actually enabled above.    ---

  // WP page IDs to leave out of the `page` collection.
  // page_excluded_ids: [4, 6, 7],

  // WP page IDs that must be included in the `page` collection regardless
  // of other filtering (not read by the current `page` collection, but
  // available for a project that needs it).
  // page_included_ids: [609, 665],

  // Only migrate posts published after this date (YYYY-MM-DD). Omit to
  // pull all posts.
  // post_after: '2025-01-01',

  // WooCommerce product_cat term IDs that make up the `taxonomyGenre`
  // collection.
  // taxonomyGenre_ids: [363, 50],
}
