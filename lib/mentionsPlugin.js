/**
 * Plugin to parse `@user` mentions in habitica and turn them into renderable tokens.
 */

const isMentionInLinkOrEmail = require('./util/isLinkOrEmail');

const mentionRegex = /^@[\w-]+/;
const whiteSpaceRegex = /\s+/;

function partOfLinkOrEmail (mention, textUntilAt, textAfterAt, md) {
  if (!textUntilAt || textUntilAt.charCodeAt(textUntilAt.length - 1) === 0x20 /* ' ' */) {
    return false;
  }

  const atWord = textAfterAt.split(whiteSpaceRegex)[0];
  const preTextWords = textUntilAt.split(whiteSpaceRegex);
  const prefix = preTextWords[preTextWords.length - 1];
  const possibleLink = prefix + atWord;

  return isMentionInLinkOrEmail(mention, possibleLink, md.linkify);
}

/**
 * Checks the character at `state.src[state.pos]` to see if it's an @
 * If that's the case and it is not part of a link or an e-mail address it
 * creates a `mention` token that can be rendered by `renderMentions`
 */
function parseMentions (state, silent) {
  if (state.src.charCodeAt(state.pos) !== 0x40 /* @ */) {
    return false;
  }

  const textUntilAt = state.src.slice(0, state.pos);
  const textAfterAt = state.src.slice(state.pos);

  const match = textAfterAt.match(mentionRegex);
  if (!match || partOfLinkOrEmail(match[0], textUntilAt, textAfterAt, state.md)) {
    return false;
  }

  const mention = match[0];
  state.pos += mention.length;

  if (!silent) {
    const token = state.push('mention', 'span', 0);
    token.content = mention;
    token.attrSet('class', 'at-text');
  }

  return true;
}

/**
 * Renders `mention` tokens into html spans with optional classes dependent on
 * the `userName` and `displayName`
 */
function renderMentions (tokens, id, _, env) {
  const mention = tokens[id].content;
  const mentionedText = mention.slice(1); // Remove @
  const isCurrentUserMention = mentionedText === env.userName || mentionedText === env.displayName;
  const highlight = isCurrentUserMention ? ' at-highlight' : '';

  return `<span class="at-text${highlight}">${mention}</span>`;
}

function mentionsPlugin (md) {
  md.inline.ruler.push('mentions', parseMentions);
  md.renderer.rules.mention = renderMentions;
}

module.exports = mentionsPlugin;
