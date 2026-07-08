import writeFile from "#utils/writeFile.js";
import fetch from "#utils/fetch.js";


const per_page = 100

const run = async () => {
  let index = 1
  let entries
  do {
    entries = await fetch(`sm_reviews?per_page=${per_page}&page=${index}`, { cache: false })
    if (entries && entries.length) {
      writeFile(entries, `./data/reviews/store_${index}.json`)
    }
    index++
  } while (entries && entries.length > 0)
  console.log('All good')
}

run()