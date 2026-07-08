// Queues messages to print together at the end of the run instead of
// wherever they happen to occur — call this from a transformer, a getter,
// anywhere, when something's worth flagging (a missing field, a fallback
// being used, etc.) without derailing whoever's reading the log mid-run.
// Also avoids corrupting utils/progress.js's live-updating line: a plain
// console.log from inside a transformer, running between progress ticks,
// would confuse log-update's cursor tracking.

const notices = []

export default (message) => {
  notices.push(message)
}

export const flush = () => {
  const collected = [...notices]
  notices.length = 0
  return collected
}
