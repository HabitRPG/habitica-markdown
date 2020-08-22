const { expect } = require('chai');
const { findMentionTokens, findAllTokenTypes } = require('../helper');
const md = require('../../withMentions');
const unsafe = require('../../unsafe');

describe('mentionsPlugin', () => {
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

    it('does not parse mentions in e-mail addresses ending in punctuation', () => {
      const text = 'send an e-mail to nevermind@user.com!';

      const mentionTokens = findMentionTokens(md.parse(text));

      expect(mentionTokens.length).to.equal(0);
    });

    it('parses mentions in e-mail addresses with underscore', () => {
      const text = 'please contact@_user_.I think I missed some spaces';

      const token = findMentionTokens(md.parse(text))[0];

      expect(token.type).to.equal('mention');
      expect(token.content).to.equal('@_user_');
    });

    it('parses consecutive mentions', () => {
      const text = '@user1@user2@user3';

      const mentionTokens = findMentionTokens(md.parse(text));

      expect(mentionTokens.length).to.equal(3);
      expect(mentionTokens.map(t => t.content)).to.deep.equal(['@user1', '@user2', '@user3']);
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

    it('does not parse mentions in autolinks', () => {
      const text = '<ssh://user@localhost>';

      const mentionTokens = findMentionTokens(md.parse(text));

      expect(mentionTokens.length).to.equal(0);
    });

    it('parses mentions in html since it\'s turned off', () => {
      const text = '<bar attr="@user">';

      const token = findMentionTokens(md.parse(text))[0];

      expect(token.type).to.equal('mention');
      expect(token.content).to.equal('@user');
    });

    // issue: https://github.com/HabitRPG/habitica/issues/10924
    it('does not parse mentions in urls', () => {
      const text = 'http://noblogsite.com/@user/awesome-blog-post-we-all-should-read';

      const mentionTokens = findMentionTokens(md.parse(text));

      expect(mentionTokens.length).to.equal(0);
    });

    it('parses mentions directly after urls that are only domain names', () => {
      const text = 'www.google.com@user';

      const mentionTokens = findMentionTokens(md.parse(text));

      expect(mentionTokens.length).to.equal(1);
      expect(mentionTokens[0].content).to.equal('@user');
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

  describe('mentionsRender', () => {
    it('renders a @user mention in a span', () => {
      const text = '@user';

      const result = md.render(text);

      expect(result).to.equal('<p><span class="at-text">@user</span></p>\n');
    });

    it('renders a current @user mention highlighted in a span', () => {
      const text = '@user';

      const result = md.render(text, { userName: 'user' });

      expect(result).to.equal('<p><span class="at-text at-highlight">@user</span></p>\n');
    });

    it('renders a current @displayName mention highlighted in a span', () => {
      const text = '@displayName';

      const result = md.render(text, { displayName: 'displayName' });

      expect(result).to.equal('<p><span class="at-text at-highlight">@displayName</span></p>\n');
    });

    it('doesn\'t render a mention in a link', () => {
      const text = 'http://www.google.com/@displayName';

      const result = md.render(text, { displayName: 'displayName' });

      expect(result).to.equal('<p><a href="http://www.google.com/@displayName" target="_blank" '
        + 'rel="noopener">http://www.google.com/@displayName</a></p>\n');
    });

    it('doesn\'t render spans in normal text', () => {
      const text = 'There are no mentions here!';

      const result = md.render(text, { displayName: 'displayName' });

      expect(result).to.equal('<p>There are no mentions here!</p>\n');
    });

    // Habitica issue https://github.com/HabitRPG/habitica/issues/12272
    it('doesn\'t render spans for preceding @ signs', () => {
      const text = 'There are multiple @ signs @ this text before a @mention!';

      const result = md.render(text);

      expect(result).to.equal('<p>There are multiple @ signs @ this text before a <span class="at-text">@mention</span>!</p>\n');
    });

    it('does not render spans in html when rendering with html enabled', () => {
      const text = '<bar attr="@user">';

      const result = unsafe.render(text);

      expect(result).to.equal('<bar attr="@user">');
    });

    it('renders spans in html when rendering with html disabled', () => {
      const text = '<bar attr="@user">';

      const result = md.render(text);

      expect(result).to.equal('<p>&lt;bar attr=&quot;<span class="at-text">@user</span>&quot;&gt;</p>\n');
    });
  });
});
