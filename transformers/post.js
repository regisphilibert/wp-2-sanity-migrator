import base from './base.js'
import rels from './rels.js'
export default  (entry, type) => {
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