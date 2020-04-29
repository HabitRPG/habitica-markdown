
const markdownit = require('markdown-it');
const linkifyImagesPlugin = require('markdown-it-linkify-images');
const linkAttributesPlugin = require('markdown-it-link-attributes');
const emojiPlugin = require('habitica-markdown-emoji');

const isLinkOrEmail = require('./isLinkOrEmail');

module.exports = options => {
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
    .use(emojiPlugin);

  md.isLinkOrEmail = text => isLinkOrEmail(text, md.linkify);

  return md;
};
