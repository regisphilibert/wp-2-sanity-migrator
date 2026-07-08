import pc from 'picocolors'

const backgrounds = {
  green: pc.bgGreen,
  yellow: pc.bgYellow,
  red: pc.bgRed,
}

// Same pill/badge shape Astro's CLI uses for its own status lines (` astro `,
// ` success `, ` action required `, etc.): a solid background block with
// padded spaces, color signaling the kind of message it's attached to.
export default (label, color = 'green') => {
  const bg = backgrounds[color] || backgrounds.green
  return bg(pc.black(pc.bold(` ${label} `)))
}
