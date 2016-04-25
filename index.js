'use strict';

var markdownit = require('markdown-it');
var linkifyImagesPlugin = require('markdown-it-linkify-images');
var linkTargetPlugin = require('markdown-it-link-target');
var emojiPlugin = require('./plugins/emoji');

var md = markdownit({
  linkify: true,
})
.use(linkTargetPlugin)
.use(linkifyImagesPlugin, {
  target: '_blank',
  linkClass: 'markdown-img-link',
  imgClass: 'markdown-img',
})
.use(emojiPlugin);

module.exports = md;
