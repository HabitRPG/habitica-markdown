'use strict';

require('../helper');
const md = require('../..');

describe('mentionRender', () => {
  it('renders a @user mention in a span', () => {
    const text = '@user';

    const result = md.render(text);

    expect(result).to.equal('<p><span class="at-text">@user</span></p>\n');
  });

  it('renders a current @user mention highlighted in a span', () => {
    const text = '@user';

    const result = md.render(text, {userName: 'user'});

    expect(result).to.equal('<p><span class="at-text at-highlight">@user</span></p>\n');
  });

  it('renders a current @displayName mention highlighted in a span', () => {
    const text = '@displayName';

    const result = md.render(text, {displayName: 'displayName'});

    expect(result).to.equal('<p><span class="at-text at-highlight">@displayName</span></p>\n');
  });

  it('doesn\'t render a mention in a link', () => {
    const text = 'http://www.google.com/@displayName';

    const result = md.render(text, {displayName: 'displayName'});

    expect(result).to.equal('<p><a href="http://www.google.com/@displayName" target="_blank" ' +
      'rel="noopener">http://www.google.com/@displayName</a></p>\n');
  });

  it('doesn\'t render spans in normal text', () => {
    const text = 'There are no mentions here!';

    const result = md.render(text, {displayName: 'displayName'});

    expect(result).to.equal('<p>There are no mentions here!</p>\n');
  });

  it('does not render spans in html when rendering with html enabled', () => {
    const text = '<bar attr="@user">';

    const result = md.unsafeHTMLRender(text);

    expect(result).to.equal('<bar attr="@user">');
  });

  it('renders spans in html when rendering with html disabled', () => {
    const text = '<bar attr="@user">';

    const result = md.render(text);

    expect(result).to.equal('<p>&lt;bar attr=&quot;<span class="at-text">@user</span>&quot;&gt;</p>\n');
  });
});
