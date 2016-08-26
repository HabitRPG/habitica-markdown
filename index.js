'use strict';

var markdownit = require('markdown-it');
var linkifyImagesPlugin = require('markdown-it-linkify-images');
var linkAttributesPlugin = require('markdown-it-link-attributes');
var emojiPlugin = require('habitica-markdown-emoji');

var md = markdownit({
  linkify: true,
})
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

module.exports = md;
