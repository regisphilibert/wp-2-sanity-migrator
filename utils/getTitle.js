export default (titleInput) => {
  const replaces = [
    {
      pattern: /&amp;/g,
      replacement: '&'
    },
    {
      pattern: /&#038;/g,
      replacement: '&'
    },
    {
      pattern: /<\/?em>/g,
      replacement: '*'
    },
    {
      pattern: /<\/?i>/g,
      replacement: '*'
    },

    {
      pattern: /&#8230;/g,
      replacement: '...'
    },
    {
      pattern: /&#8217;/g,
      replacement: '’'
    },
    {
      pattern: /&#8211;/g,
      replacement: "-"
    }
  ]
  let title = titleInput
  if(typeof titleInput == "object"){
    if(titleInput.rendered !== '') {
      title = titleInput.rendered
    } else {
      title = undefined
    }
  }
  if(!!title) {
    for (const replace of replaces) {
      if(title.match(replace.pattern)) {
        title = title.replace(replace.pattern, replace.replacement)
      }
    }
    return title
  }

}