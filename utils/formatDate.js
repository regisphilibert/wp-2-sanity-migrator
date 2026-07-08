export default (input = false) => {
  if(!input) {
    return input
  }
  // Some WP date fields (e.g. ACF date_picker, some Tribe Events setups)
  // come back as a bare YYYYMMDD string with no separators, which Date
  // can't parse on its own — insert them before handing off to Date.
  const normalized = /^\d{8}$/.test(input)
    ? `${String(input).slice(0, 4)}-${String(input).slice(4, 6)}-${String(input).slice(6, 8)}`
    : input
  return new Date(normalized).toISOString()
}