import config from '#config'
import cache from './cache.js'
import * as progress from './cli/progress.js'

// ACF (Advanced Custom Fields) always nests a WP entry's custom fields
// under `entry.acf` — the field *names* are project-specific, but that
// nesting is a structural constant of the plugin. Spread it onto the top
// level here, once, so transformers can read `entry.someField` directly
// instead of every transformer reaching into `.acf` itself. Top-level WP
// fields win on any name collision.
const normalizeAcf = (entry) => {
  if (entry && typeof entry === 'object' && entry.acf && typeof entry.acf === 'object') {
    return { ...entry.acf, ...entry }
  }
  return entry
}

// WP core's `_fields` request param is an include-list only — there's no
// core support for excluding a field while keeping everything else, and
// building an accurate per-endpoint whitelist is fragile (easy to leave out
// a field a transformer needs). So instead: drop known-bloat top-level
// fields (e.g. Yoast SEO's `yoast_head`/`yoast_head_json`) here, once, after
// the fact. Which fields to drop is project-specific — set via
// `config.excluded_fields` since not every site runs the same plugins.
const { excluded_fields = [] } = config
const stripExcludedFields = (entry) => {
  if (!excluded_fields.length || !entry || typeof entry !== 'object') {
    return entry
  }
  const stripped = { ...entry }
  for (const key of excluded_fields) {
    delete stripped[key]
  }
  return stripped
}

export default async (endpoint, { cache: useCache = true } = {}) => {
  let url = endpoint
  const { domain } = config
  if(endpoint.includes('tribe') || endpoint.includes('/wc/')) {
    url = endpoint
  }
  url = `${domain}/${url}`

  if (useCache) {
    const cached = await cache.read(url)
    if(cached) {
      progress.tick({ cached: true })
      return JSON.parse(cached)
    }
  }
  progress.tick({ cached: false })
  const res = await fetch(url);
  if (res.ok) {
      const data = await res.json();
      let output
      if(Array.isArray(data)) {
        // Self-hosted WP REST API (wp-json/wp/v2) and WooCommerce return the
        // collection as a plain array directly.
        output = data
      } else if(typeof data.events !== "undefined") {
        // The Events Calendar plugin (same shape on wp.com and self-hosted).
        output = data.events
      } else if(typeof data.venues !== "undefined") {
        output = data.venues
      } else if(typeof data.posts !== "undefined") {
        // WordPress.com v1.1 API wraps collections as { found, posts: [...] }.
        output = data.posts
      } else {
        // Single-entry response (e.g. fetching one page/post by id).
        output = [data]
      }
      output = output.map(stripExcludedFields).map(normalizeAcf)
      if (useCache) cache.write(url, output)
      return output
  } else {
    // Requesting a page past the last one is how pagination signals "no
    // more entries" (see utils/fetchPages.js) — WP core, WooCommerce, and
    // WP.com all name that error code `..._invalid_page_number`. That's
    // expected, not a real failure: cache it as an empty result (so re-runs
    // hit cache instead of re-fetching a page we already know is empty) and
    // return [] so pagination stops the same way a genuinely empty page
    // would.
    const body = await res.json().catch(() => null)
    if (body?.code?.includes('invalid_page_number')) {
      if (useCache) cache.write(url, [])
      return []
    }
    progress.error(url)
  }
}