import fetch from '../utils/fetch.js'
import transformer from '../transformers/venue.js'
import config from '../data/config.js'

export default async () => {
  const events = await fetch(config.event_endpoint)
  let processed_venues =  []
  let output_venues = []
  for (const event of events) {
    if(event.venue && event.venue.id) {
      if(!processed_venues.includes(event.venue.id)) {
        output_venues.push(transformer(event.venue))
        processed_venues.push(event.venue.id)
      }
    }
  }
  return output_venues
}