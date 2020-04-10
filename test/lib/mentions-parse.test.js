'use strict';

const helpers = require('../helper');
const md = require('../..');

const findMentionTokens = helpers.findMentionTokens;
const printAllTokens = helpers.printAllTokens; // eslint-disable-line no-unused-vars

describe('mentionParser', () => {
  it('parses a @user mention as a mention token', () => {
    const text = '@user';

    const token = findMentionTokens(md.parse(text))[0];

    expect(token.type).to.equal('mention');
    expect(token.content).to.equal('@user');
  });

  it('parses multiple mention tokens embedded in different blocks', () => {
    const text = 'first paragraph @user1\n\nsecond paragraph @user2\n- list item\n- @user3';

    const mentionTokens = findMentionTokens(md.parse(text));

    expect(mentionTokens.length).to.equal(3);
    expect(mentionTokens.map(t => t.content)).to.deep.equal(['@user1', '@user2', '@user3']);
  });

  // fixes issue: https://github.com/HabitRPG/habitica/issues/11520
  it('does not parse mentions in links', () => {
    const text = '[website of @user](http://for.sure.it/is/awesome)';

    const mentionTokens = findMentionTokens(md.parse(text));

    expect(mentionTokens.length).to.equal(0);
  });
});
