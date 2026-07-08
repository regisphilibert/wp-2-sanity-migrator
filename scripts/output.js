import config from './data/config.js'
import getTitle from './utils/getTitle.js'
//import getVariationsEndpoints from './utils/getVariationsEndpoints.js'

const { woo_consumer_key, woo_consumer_secret } = config
const run = async () => {
  const title = 'Joan Silber, author of <em>Improvement</em> and <em>Secrets of Happiness</em> &amp; more'
  console.log(getTitle(title))
}

run()