import writeFile from "./utils/writeFile.js";
import fetch from "./utils/fetch.js";


const per_page = 100

const run = async () => {
  let index = 1
  let entries
  do {
    entries = await fetch(`media?per_page=${per_page}&page=${index}`)
    if (entries && entries.length) {
      writeFile(entries, `./data/media/store_${index}.json`)
    }
    index++
  } while (entries && entries.length === per_page)
  console.log('All good')
}

run()