const woo_consumer_key = 'ck_4b60d14365aa8bf7725f8917f537479eebfb870c'
const woo_consumer_secret = 'cs_0378e132f0cd29946ccd4cd3ca141a73408071f7'

export default {
  domain: 'https://public-api.wordpress.com/rest/v1.1/sites/reellifeinmontreal.wordpress.com',
  woo_consumer_key,
  woo_consumer_secret,
  event_endpoint: '/tribe/events/v1/events?start_date=1990-08-03',
  venue_endpoint: '/tribe/events/v1/venues.js',
  woo_endpoint: '/wc/v3',
  woo_params: new URLSearchParams({
    consumer_key: woo_consumer_key,
    consumer_secret: woo_consumer_secret
  })
}