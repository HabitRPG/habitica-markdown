'use strict';

var markdownit = require('markdown-it');
var linkifyImagesPlugin = require('markdown-it-linkify-images');
var linkAttributesPlugin = require('markdown-it-link-attributes');
var emojiPlugin = require('habitica-markdown-emoji');

function createMdInstance (options) {
  options = options || {};
  options.linkify = options.linkify || true;

  var md = markdownit(options)
    .use(linkAttributesPlugin, {
      target: '_blank',
      rel: 'noopener',
    })
    .use(linkifyImagesPlugin, {
      target: '_blank',
      linkClass: 'markdown-img-link',
      imgClass: 'markdown-img',
    })
    .use(emojiPlugin);

  return md;
}

var md = createMdInstance();
var mdUnsafe = createMdInstance({
  html: true,
});

md.unsafeHTMLRender = function unsafeHTMLRender (markdown) {
  return mdUnsafe.render(markdown);
};

module.exports = md;
