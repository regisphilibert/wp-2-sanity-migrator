import fs from 'fs'
import http from 'http'
import path from 'path'
import pc from 'picocolors'
import badge from '#utils/cli/badge.js'

// Serves sanity_export_readable.json over local HTTP and prints a real
// http://localhost link — unlike a file:// link, http:// always opens in
// the browser (the OS routes that protocol there, full stop), rather than
// deferring to whatever app owns the .json extension on this machine (a
// full editor like VS Code, which can choke on a multi-MB file). Runs as
// its own script rather than inside export.js so `npm run gen`'s
// `node export.js && ... json2nd` chain doesn't have to wait on it.

const filepath = path.resolve('./sanity_export_readable.json')
const TIMEOUT_MS = 5 * 60 * 1000

if (!fs.existsSync(filepath)) {
  console.log('sanity_export_readable.json not found — run `npm run gen` first.')
  process.exit(1)
}

const server = http.createServer((req, res) => {
  if (req.url === '/favicon.ico') {
    res.writeHead(404)
    res.end()
    return
  }
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
  fs.createReadStream(filepath).pipe(res)
  res.on('finish', () => server.close())
})

server.listen(0, () => {
  const { port } = server.address()
  const url = `http://localhost:${port}/`
  console.log('')
  console.log(`${badge('view')} ${pc.dim('serving readable export')}`)
  console.log('')
  console.log(`${pc.dim('┃')} Local      ${pc.cyan(url)}`)
  console.log(`${pc.dim('┃')} ${pc.dim('cmd/ctrl+click to open — closes once viewed, or after 5 min')}`)
  console.log('')
})

const timeout = setTimeout(() => {
  console.log(pc.dim('Timed out waiting — closing.'))
  server.close()
}, TIMEOUT_MS)

server.on('close', () => {
  clearTimeout(timeout)
  process.exit(0)
})
