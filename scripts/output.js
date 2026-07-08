import getTitle from '#utils/getTitle.js'

const run = async () => {
  const title = 'Joan Silber, author of <em>Improvement</em> and <em>Secrets of Happiness</em> &amp; more'
  console.log(getTitle(title))
}

run()