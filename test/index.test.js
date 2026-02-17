const { expect } = require('chai');
const md = require('..');

function runTestsForBothRenderMethods (render) {
  it('renders links with target="_blank" and rel="noopener"', () => {
    const result = md[render]('[link](https://example.com)');

    expect(result).to.contain('<a href="https://example.com" target="_blank" rel="noopener">link</a>');
  });

  it('renders images with links and classes', () => {
    const result = md[render]('![image](https://example.com/image.png)');

    expect(result).to.contain('<a href="https://example.com/image.png" class="markdown-img-link" target="_blank"><img src="https://example.com/image.png" alt="image" class="markdown-img"></a>');
  });

  it('renders text emoji (:smile:) as Unicode', () => {
    const result = md[render]('foo :smile: bar');

    expect(result).to.contain('foo 😄 bar');
  });

  it('does not render shortcut text emojis', () => {
    const result = md[render]('foo :) bar');

    expect(result).to.contain('foo :) bar');
  });

  it('renders melior emoji as img', () => {
    const result = md[render]('foo :melior: bar');

    expect(result).to.contain('foo <img class="habitica-emoji" style="height: 1.5em; width: 1.5em" src="https://s3.amazonaws.com/habitica-assets/cdn/emoji/melior.png" alt="melior"> bar');
  });
}

describe('Habitica Markdown', () => {
  describe('render', () => {
    runTestsForBothRenderMethods('render'); // eslint-disable-line mocha/no-setup-in-describe, max-len

    it('does not render html', () => {
      const result = md.render('<script src="http://malicious-url.com/js.js"></script>');

      expect(result).to.contain('&lt;script src=&quot;<a href="http://malicious-url.com/js.js" target="_blank" rel="noopener">http://malicious-url.com/js.js</a>&quot;&gt;&lt;/script&gt;');
    });
  });

  describe('unsafeHTMLRender', () => {
    runTestsForBothRenderMethods('unsafeHTMLRender'); // eslint-disable-line mocha/no-setup-in-describe, max-len

    it('does render html', () => {
      const result = md.unsafeHTMLRender('<script src="http://malicious-url.com/js.js"></script>');

      expect(result).to.contain('<script src="http://malicious-url.com/js.js"></script>');
    });
  });
});
