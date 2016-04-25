'use strict';

require('./helper');
let md = require('../');

describe('Habitica Markdown', function () {
  it('renders links with target="_blank"', function () {
    let result = md.render('[link](https://example.com)');

    expect(result).to.contain('<a href="https://example.com" target="_blank">link</a>');
  });

  it('renders images with links and classes', function () {
    let result = md.render('![image](https://example.com/image.png)');

    expect(result).to.contain('<a href="https://example.com/image.png" class="markdown-img-link" target="_blank"><img src="https://example.com/image.png" alt="image" class="markdown-img"></a>');
  });
});
