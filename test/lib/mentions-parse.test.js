'use strict';

const { findMentionTokens, findAllTokenTypes } = require('../helper');
const md = require('../..');

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

  // fixes issue https://github.com/HabitRPG/habitica/issues/12033
  it('does not emphasize user mentions', () => {
    const emphasis_types = ['em_open', 'em_close', 'strong_open', 'strong_close'];
    const text = '@_spider_ @__bigger-spider__';

    const tokens = md.parse(text);
    const mentionTokens = findMentionTokens(tokens);

    expect(mentionTokens[0].content).to.equal('@_spider_');
    expect(mentionTokens[1].content).to.equal('@__bigger-spider__');
    expect(findAllTokenTypes(tokens).map(t => t.type)).to.not.include(emphasis_types);
  });

  // fixes issue: https://github.com/HabitRPG/habitica/issues/11504
  describe('mentionParser ignoring code blocks', () => {
    it('does not parse mentions in inline code blocks', () => {
      const text = '`@user`';

      const mentionTokens = findMentionTokens(md.parse(text));

      expect(mentionTokens.length).to.equal(0);
    });

    it('does parse mentions behind inline code blocks', () => {
      const text = '`@user1` @user2';

      const mentionTokens = findMentionTokens(md.parse(text));

      expect(mentionTokens.length).to.equal(1);
      expect(mentionTokens[0].content).to.equal('@user2');
    });

    it('does not parse mentions in backtick fenced code blocks', () => {
      const text = '```infoString with @user\ncode line for @user2\n```';

      const mentionTokens = findMentionTokens(md.parse(text));

      expect(mentionTokens.length).to.equal(0);
    });

    it('does not parse mentions in whirl fenced code blocks', () => {
      const text = '~~~~\ncode line for @user1 with ``` backticks @user2\n~~~~';

      const mentionTokens = findMentionTokens(md.parse(text));

      expect(mentionTokens.length).to.equal(0);
    });

    it('does not parse mentions in indented code blocks', () => {
      const text = '    code line for @user';

      const mentionTokens = findMentionTokens(md.parse(text));

      expect(mentionTokens.length).to.equal(0);
    });

    it('does parse mentions in indented list items', () => {
      const text = '- item level 1\n  - item level 2\n    - item level 3 @user';

      const mentionTokens = findMentionTokens(md.parse(text));

      expect(mentionTokens.length).to.equal(1);
      expect(mentionTokens[0].content).to.equal('@user');
    });
  });
});
