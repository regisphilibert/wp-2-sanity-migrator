import config from './data/config.js'

// Self-hosted WordPress (wp-json/wp/v2): GET {domain}/types
// -> object keyed by slug: { post: { name, slug, rest_base, ... }, ... }
const fetchSelfHosted = async (domain) => {
  const res = await fetch(`${domain}/types`)
  if (!res.ok) return null
  const data = await res.json()
  return Object.values(data).map(type => ({
    slug: type.slug,
    label: type.name,
    endpoint: type.rest_base,
  }))
}

// WordPress.com v1.1 API: GET {domain}/post-types
// -> { found, post_types: [ { name, label, ... }, ... ] }
const fetchWpCom = async (domain) => {
  const res = await fetch(`${domain}/post-types`)
  if (!res.ok) return null
  const { post_types } = await res.json()
  if (!Array.isArray(post_types)) return null
  return post_types.map(type => ({
    slug: type.name,
    label: type.label,
    endpoint: type.name,
  }))
}

const run = async () => {
  const { domain } = config
  const types = (await fetchSelfHosted(domain)) || (await fetchWpCom(domain))

  if (!types) {
    console.log(`Could not find a post types listing at ${domain} (tried both the self-hosted and wordpress.com API shapes).`)
    return
  }

  console.log(`Post types available at ${domain}:\n`)
  types.forEach(({ slug, label, endpoint }) => {
    console.log(`- ${slug}${label && label !== slug ? ` (${label})` : ''} -> endpoint: ${endpoint}`)
  })
}

run()
