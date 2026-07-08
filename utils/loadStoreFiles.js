import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default (category) => {
  const dir = path.join(__dirname, '../data', category)
  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.json'))
    .sort((a, b) => Number(a.match(/\d+/)?.[0] ?? 0) - Number(b.match(/\d+/)?.[0] ?? 0))
    .flatMap(file => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8')))
}
