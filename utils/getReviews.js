import store_1 from '../data/reviews/store_1.json' with { type: "json" }
import store_2 from '../data/reviews/store_2.json' with { type: "json" }
import store_3 from '../data/reviews/store_3.json' with { type: "json" }
import store_4 from '../data/reviews/store_4.json' with { type: "json" }
import store_5 from '../data/reviews/store_5.json' with { type: "json" }
import store_6 from '../data/reviews/store_6.json' with { type: "json" }
import store_7 from '../data/reviews/store_7.json' with { type: "json" }
import store_8 from '../data/reviews/store_8.json' with { type: "json" }
import store_9 from '../data/reviews/store_9.json' with { type: "json" }
import store_10 from '../data/reviews/store_10.json' with { type: "json" }
import store_11 from '../data/reviews/store_11.json' with { type: "json" }
import store_12 from '../data/reviews/store_12.json' with { type: "json" }
import store_13 from '../data/reviews/store_13.json' with { type: "json" }
import store_14 from '../data/reviews/store_14.json' with { type: "json" }
import store_15 from '../data/reviews/store_15.json' with { type: "json" }
import store_16 from '../data/reviews/store_16.json' with { type: "json" }
import store_17 from '../data/reviews/store_17.json' with { type: "json" }

const reviews = [
  ...store_1,
  ...store_2,
  ...store_3,
  ...store_4,
  ...store_5,
  ...store_6,
  ...store_7,
  ...store_8,
  ...store_9,
  ...store_10,
  ...store_11,
  ...store_12,
  ...store_13,
  ...store_14,
  ...store_15,
  ...store_16,
  ...store_17,
]
export default (id) => {
  const reviewsFound = reviews.filter(r => r.acf && r.acf.related_author_or_book && r.acf.related_author_or_book.includes(id))
  return reviewsFound.length && reviewsFound.map(r => r.id)
}
