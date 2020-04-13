'use strict';

require('../helper');
const md = require('../..');

describe('mentionRender', () => {
  it('renders a @user mention in a span', () => {
    const text = '@user';

    const result = md.render(text);

    expect(result).to.equal('<p><span class="at-text">@user</span></p>\n');
  });
});
