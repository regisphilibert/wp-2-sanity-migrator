import fs from "fs/promises"
import pc from "picocolors"
import collections from "./data/collections/index.js"
import getDocuments from './utils/getDocuments.js'
import badge from './utils/cli/badge.js'
import { flush as flushNotices } from './utils/cli/notices.js'
const filepath = "./sanity_export.json"
const readableFilepath = "./sanity_export_readable.json"


const writeFile = async (documents, filepath, readable = false) => {
  await fs.writeFile(filepath, JSON.stringify(documents,  null, readable ? "\t" : null))
}

const run = async () => {
  const start = performance.now()
  let documents = []
  const promisedCollections = await collections()
  for (const collection of promisedCollections) {
    const entries = await getDocuments(collection)
    documents.push(...entries)
  }

  await writeFile(documents, filepath)
  await writeFile(documents, readableFilepath, true)

  const elapsed = Math.round(performance.now() - start)
  console.log('')
  console.log(`${badge('gen')} ${pc.green(`${documents.length} documents`)} ${pc.dim('written in')} ${elapsed} ${pc.dim('ms')}`)
  console.log('')
  console.log(`${pc.dim('┃')} Readable   ${pc.cyan('npm run view')}`)
  console.log('')

  const notices = flushNotices()
  if (notices.length) {
    console.log(`${badge('notices', 'yellow')} ${pc.yellow(`${notices.length} to review`)}`)
    console.log('')
    notices.forEach(message => console.log(`${pc.dim('┃')} ${message}`))
    console.log('')
  }
}

run()
