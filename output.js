const { woo_consumer_key, woo_consumer_secret } = require('./data/config.rscdsmtl.js')
const getTitle = require('./utils/getTitle.js')
//const getVariationsEndpoints = require('./utils/getVariationsEndpoints.js')
const run = async () => {
  const title = 'Joan Silber, author of <em>Improvement</em> and <em>Secrets of Happiness</em> &amp; more'
  console.log(getTitle(title))
}

run()