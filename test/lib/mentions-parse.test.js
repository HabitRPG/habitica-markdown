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

  it('doesn\'t find separate @ to be mentions', () => {
    const text = 'You know we\'ll find this @ home';

    const mentionTokens = findMentionTokens(md.parse(text));

    expect(mentionTokens.length).to.equal(0);
  });

  it('parses multiple mention tokens embedded in different blocks', () => {
    const text = 'first paragraph @user1\n\nsecond paragraph @user2\n- list item\n- @user3';

    const mentionTokens = findMentionTokens(md.parse(text));

    expect(mentionTokens.length).to.equal(3);
    expect(mentionTokens.map(t => t.content)).to.deep.equal(['@user1', '@user2', '@user3']);
  });

  it('does not parse mentions in e-mail addresses', () => {
    const text = 'send an e-mail to nevermind@user.com';

    const mentionTokens = findMentionTokens(md.parse(text));

    expect(mentionTokens.length).to.equal(0);
  });

  it('parses mentions in e-mail addresses with underscore', () => {
    const text = 'please contact@_user_.I think I missed some spaces';

    const token = findMentionTokens(md.parse(text))[0];

    expect(token.type).to.equal('mention');
    expect(token.content).to.equal('@_user_');
  });

  it('does parse mentions before forgotten spaces after dots', () => {
    const text = 'Here it might look like an e-mail to @user.It is just a typo!';

    const token = findMentionTokens(md.parse(text))[0];

    expect(token.type).to.equal('mention');
    expect(token.content).to.equal('@user');
  });

  it('parses mentions in links correctly', () => {
    const text = '[website of @user](http://for.sure.it/is/awesome)';

    const linkTokens = md.parse(text)[1].children;

    expect(linkTokens.length).to.equal(4);
    const mentionToken = linkTokens[2];
    expect(mentionToken.type).to.equal('mention');
    expect(mentionToken.content).to.equal('@user');
    expect(linkTokens[1].content).to.equal('website of ');
  });

  // issue: https://github.com/HabitRPG/habitica/issues/10924
  it('does not parse mentions in urls', () => {
    const text = 'http://noblogsite.com/@user/awesome-blog-post-we-all-should-read';

    const mentionTokens = findMentionTokens(md.parse(text));

    expect(mentionTokens.length).to.equal(0);
  });

  // issue https://github.com/HabitRPG/habitica/issues/12033
  it('does not emphasize user mentions', () => {
    const emphasisTypes = ['em_open', 'em_close', 'strong_open', 'strong_close'];
    const text = '@_spider_ @__bigger-spider__';

    const tokens = md.parse(text);
    const mentionTokens = findMentionTokens(tokens);

    expect(mentionTokens[0].content).to.equal('@_spider_');
    expect(mentionTokens[1].content).to.equal('@__bigger-spider__');
    expect(findAllTokenTypes(tokens).map(t => t.type)).to.not.include(emphasisTypes);
  });

  // issue: https://github.com/HabitRPG/habitica/issues/11504
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
