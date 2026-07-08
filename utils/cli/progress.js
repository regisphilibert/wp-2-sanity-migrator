import logUpdate from 'log-update'
import pc from 'picocolors'
import badge from './badge.js'

// Collapses the wall of one-line-per-request fetch logging into a single
// live-updating line per collection (badge while in progress), which
// resolves into one permanent, bar-prefixed summary line when that
// collection finishes — same shape as export.js/scripts/viewReadable.js's
// output. Errors are `persist()`ed so they stay in scrollback without
// breaking the live line that resumes after them.

let state = null

const render = () => {
  const { type, requests, cacheHits } = state
  const cacheNote = cacheHits ? pc.dim(` (${cacheHits} cached)`) : ''
  logUpdate(`${badge(type)} ${pc.dim(`fetching · request ${requests}${cacheNote}`)}`)
}

export const start = (type) => {
  state = { type, requests: 0, cacheHits: 0, startedAt: performance.now() }
  render()
}

export const tick = ({ cached = false } = {}) => {
  if (!state) return
  state.requests++
  if (cached) state.cacheHits++
  render()
}

export const error = (url) => {
  logUpdate.persist(pc.red(`  ✗ ${url}`))
}

export const finish = (entryCount) => {
  if (!state) return
  const elapsed = ((performance.now() - state.startedAt) / 1000).toFixed(1)
  logUpdate.persist(`${pc.dim('┃')} ${pc.bold(state.type)}  ${pc.green(`${entryCount} entries`)} ${pc.dim(`· ${elapsed}s`)}`)
  state = null
}
