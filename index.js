const markdownit = require('markdown-it');
const linkifyImagesPlugin = require('markdown-it-linkify-images');
const linkAttributesPlugin = require('markdown-it-link-attributes');
const emojiPlugin = require('habitica-markdown-emoji');

var mentionsPlugin = require('./lib/mentionsPlugin');

function createMdInstance (options) {
  const mdOptions = options || {};
  mdOptions.linkify = mdOptions.linkify || true;

  const md = markdownit(mdOptions)
    .use(linkAttributesPlugin, {
      attrs: {
        target: '_blank',
        rel: 'noopener',
      },
    })
    .use(linkifyImagesPlugin, {
      target: '_blank',
      linkClass: 'markdown-img-link',
      imgClass: 'markdown-img',
    })
    .use(emojiPlugin)
    .use(mentionsPlugin);

  return md;
}

const md = createMdInstance();
const mdUnsafe = createMdInstance({
  html: true,
});

md.unsafeHTMLRender = function unsafeHTMLRender (markdown, env) {
  return mdUnsafe.render(markdown, env);
};

module.exports = md;
