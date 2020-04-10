'use strict';

require('../helper');
const parser = require('../../lib/mentions-parse');

describe('mentionParser', () => {
  it('parses an @user mention as a mention token', () => {
    const text = '@user';

    const result = parser(text);

    expect(result).to.deep.equal(1);
  });
});
