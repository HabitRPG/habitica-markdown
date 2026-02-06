
const markdownit = require('markdown-it');
const linkifyImagesPlugin = require('markdown-it-linkify-images');
const linkAttributesPlugin = require('markdown-it-link-attributes');
const emoji = require('markdown-it-emoji');
const emojiDefs = require('../data/full.json');

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
    .use(emoji, { defs: Object.assign({}, emojiDefs, { melior: 'melior' }), shortcuts: {} });

  md.renderer.rules.emoji = function (tokens, idx) {
    if (tokens[idx].markup === 'melior') {
      return '<img class="habitica-emoji" style="height: 1.5em; width: 1.5em" '
        + 'src="https://s3.amazonaws.com/habitica-assets/cdn/emoji/melior.png" alt="melior">';
    }
    return tokens[idx].content;
  };

  var rule = md.core.ruler.__rules__.find(function (r) { return r.name === 'emoji'; });
  var orig = rule.fn;
  rule.fn = function (state) {
    orig(state);
    for (var j = 0; j < state.tokens.length; j++) {
      if (state.tokens[j].type !== 'inline') continue;
      var tokens = state.tokens[j].children;
      if (!tokens) continue;
      var linkLevel = 0;
      for (var i = 0; i < tokens.length; i++) {
        if (tokens[i].type === 'link_open') linkLevel++;
        if (tokens[i].type === 'link_close') linkLevel--;
        if (tokens[i].type === 'emoji' && linkLevel > 0) {
          tokens[i].type = 'text';
          tokens[i].content = ':' + tokens[i].markup + ':';
          tokens[i].markup = '';
        }
      }
    }
  };

  return md;
}

module.exports = createMdInstance;
