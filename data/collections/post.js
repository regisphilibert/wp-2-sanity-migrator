import config from '#config'
import base from '#transformers/base.js'

const { post_after } = config
const endpoint = post_after ? `posts?after=${post_after}` : 'posts'

const transformer = (entry, type) => {
  let association = 'news'
  if(entry.type == 'sm_notes') {
    association = 'note'
  } else if (entry.type == "sm_projects") {
    association = 'project'
  }
  return {
    ...base(entry, type),
    description: undefined,
    //association,
    //...(entry.tags ? {taxonomyTags: rels(entry.tags, 'taxonomyTag')} : {}),
   // ...(entry.categories ? {taxonomyCategories: rels(entry.categories, 'taxonomyCategory')} : {})
  }
}

export default {
  type: 'post',
  transformer,
  endpoints: [
    endpoint
  ]
}
