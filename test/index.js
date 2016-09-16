'use strict';

require('./helper');
let md = require('../');

function runTestsForBothRenderMethods (render) {
  it('renders links with target="_blank" and rel="noopener"', function () {
    let result = md[render]('[link](https://example.com)');

    expect(result).to.contain('<a href="https://example.com" target="_blank" rel="noopener">link</a>');
  });

  it('renders images with links and classes', function () {
    let result = md[render]('![image](https://example.com/image.png)');

    expect(result).to.contain('<a href="https://example.com/image.png" class="markdown-img-link" target="_blank"><img src="https://example.com/image.png" alt="image" class="markdown-img"></a>');
  });

  it('renders text emoji (:smile:) from s3', function () {
    let result = md[render]('foo :smile: bar');

    expect(result).to.contain('foo <img class="habitica-emoji" style="height: 1.5em; width: 1.5em" src="https://s3.amazonaws.com/habitica-assets/cdn/emoji/smile.png" alt="smile"> bar');
  });

  it('renders unicode emoji from s3', function () {
    let result = md[render]('foo 👍 bar');

    expect(result).to.contain('foo <img class="habitica-emoji" style="height: 1.5em; width: 1.5em" src="https://s3.amazonaws.com/habitica-assets/cdn/emoji/thumbsup.png" alt="thumbsup"> bar');
  });

  it('does not render shortcut text emojis', function () {
    let result = md[render]('foo :) bar');

    expect(result).to.contain('foo :) bar');
  });
}

describe('Habitica Markdown', function () {
  describe('render', function () {
    runTestsForBothRenderMethods('render');

    it('does not render html', function () {
      let result = md.render('<script src="http://malicious-url.com/js.js"></script>');

      expect(result).to.contain('&lt;script src=&quot;<a href="http://malicious-url.com/js.js" target="_blank" rel="noopener">http://malicious-url.com/js.js</a>&quot;&gt;&lt;/script&gt;');
    });
  });

  describe('unsafeHTMLRender', function () {
    runTestsForBothRenderMethods('unsafeHTMLRender');

    it('does render html', function () {
      let result = md.unsafeHTMLRender('<script src="http://malicious-url.com/js.js"></script>');

      expect(result).to.contain('<script src="http://malicious-url.com/js.js"></script>');
    });
  });
});
