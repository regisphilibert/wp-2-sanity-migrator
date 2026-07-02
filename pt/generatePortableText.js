import { JSDOM } from "jsdom";
import { Schema } from '@sanity/schema';
import { htmlToBlocks } from '@sanity/block-tools';
import imageRule from './rules/image.js';
import shortcodeRule from './rules/shortcode.js';
import figureRule from './rules/figure.js';
import galleryRule from './rules/gallery.js';
import htmlRule from './rules/html.js';
import audioRule from './rules/audio.js';
import alignRule from './rules/align.js';
import hideIndentRule from "./rules/hideIndent.js";
import hideRule from "./rules/hide.js"
import dropcapRule from "./rules/dropcap.js";
export default function(html) {
  // Start with compiling a schema we can work against
  const defaultSchema = Schema.compile({
    name: 'myBlog',
    types: [
      {
        type: 'object',
        name: 'blogPost',
        fields: [
          {
            title: 'Body',
            name: 'body',
            type: 'array',
            of: [
              {type: 'image'},
              {
                title: 'Block',
                type: 'block',
                // Styles let you set what your user can mark up blocks with. These
                // correspond with HTML tags, but you can set any title or value
                // you want and decide how you want to deal with it where you want to
                // use your content.
                of: [
                  // Please remove if not needed.
                  // defineArrayMember({type: "pt.insertMeta"})
                ],
                styles: [
                  { title: 'Normal', value: 'normal' },
                  { title: 'H1', value: 'h1' },
                  { title: 'H2', value: 'h2' },
                  { title: 'H3', value: 'h3' },
                  { title: 'H4', value: 'h4' },
                  { title: 'Quote', value: 'blockquote' },
                  { title: 'Code', value: 'code'},
                ],
                lists: [
                  { title: 'Bullet', value: 'bullet' },
                  {title: 'Numbered', value: 'number'},
                ],
                // Marks let you mark up inline text in the block editor.
                marks: {
                  // Decorators usually describe a single property – e.g. a typographic
                  // preference or highlighting by editors.
                  decorators: [
                    { title: 'Strong', value: 'strong' },
                    { title: 'Emphasis', value: 'em' },
                    { title: 'Code', value: 'code'},
                    { title: "Strike", value: "strike-through" }
                  ],
                }
              }
            ],
          },
        ],
      },
    ],
  })

  const blockContentType = defaultSchema
    .get('blogPost')
    .fields.find((field) => field.name === 'body').type

  const wrappedHTML = `<html><body>${html}</body></html>`
  const blocks = htmlToBlocks(
    wrappedHTML,
    blockContentType,
    {
      parseHtml: (html) => new JSDOM(html).window.document,
      rules: [
        htmlRule,
        imageRule,
        shortcodeRule,
        audioRule,
        hideIndentRule,
        hideRule,
        dropcapRule,
        galleryRule,
        alignRule,
        figureRule,
      ]
    }
  )
  return blocks
}