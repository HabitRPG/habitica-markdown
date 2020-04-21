const markdownit = require('markdown-it');
const linkifyImagesPlugin = require('markdown-it-linkify-images');
const linkAttributesPlugin = require('markdown-it-link-attributes');
const emojiPlugin = require('habitica-markdown-emoji');

const mentionsPlugin = require('./lib/mentionsPlugin');

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

/*
 * Uses `linkify` to test whether the @mention is part of a link or e-mail address
 */
function isLinkOrEmail (text) {
  // Using match i.o. test since test is approximation only (Doesn't discard www.google.com@user)
  const match = md.linkify.match(text);
  return match && match[0].text === text;
}

md.isLinkOrEmail = isLinkOrEmail;

module.exports = md;
