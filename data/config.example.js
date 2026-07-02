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
  })
}
