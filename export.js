
import fs from "fs"
import collections from "./data/collections/index.js"
import getDocuments from './utils/getDocuments.js'
const filepath = "./sanity_export.json"


const writeFile = (documents, filepath, readable = false) => {
  fs.writeFile(filepath, JSON.stringify(documents,  null, readable ? "\t" : null), err => {
    if (err) console.log("Error writing file:", err);
  });
}

const run = async () => {
  let documents = []
  const promisedCollections = await collections()
  for (const collection of promisedCollections) {
    const entries = await getDocuments(collection)
    documents.push(...entries)
  }

  writeFile(documents, filepath)
  writeFile(documents, './sanity_export_readable.json', true)
}

run()

