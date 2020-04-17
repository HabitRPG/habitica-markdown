import markdownit from 'markdown-it';
import linkifyImagesPlugin from 'markdown-it-linkify-images';
import linkAttributesPlugin from 'markdown-it-link-attributes';
import emojiPlugin from 'habitica-markdown-emoji';

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
    .use(emojiPlugin);

  return md;
}

const md = createMdInstance();
const mdUnsafe = createMdInstance({
  html: true,
});

md.unsafeHTMLRender = function unsafeHTMLRender (markdown) {
  return mdUnsafe.render(markdown);
};

export default md;
