/**
 * Plugin to parse `@user` mentions in habitica and turn them into renderable tokens.
 */

var mentionRegex = /@[\w-]+/;
var whiteSpaceRegex = /\s+/;

function partOfLinkOrEmail (pretext, text, md) {
  if (!pretext || pretext.charCodeAt(pretext.length - 1) === 0x20 /* ' ' */) {
    return false;
  }

  var atWord = text.split(whiteSpaceRegex)[0];
  var preTextWords = pretext.split(whiteSpaceRegex);
  var prefix = preTextWords[preTextWords.length - 1];
  var possibleLink = prefix + atWord;

  return md.isLinkOrEmail(possibleLink);
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

  var text = state.src.slice(state.pos);
  var match = text.match(mentionRegex);

  if (!match || partOfLinkOrEmail(state.src.substr(0, state.pos), text, state.md)) {
    return false;
  }
  var mention = match[0];
  state.pos += mention.length;

  if (!silent) {
    var token = state.push('mention', 'span', 0);
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
  var mention = tokens[id].content;
  var mentionedText = mention.slice(1); // Remove @
  var isCurrentUserMention = mentionedText === env.userName || mentionedText === env.displayName;
  var highlight = isCurrentUserMention ? ' at-highlight' : '';

  return '<span class="at-text' + highlight + '">' + mention + '</span>';
}

function mentionsPlugin (md) {
  md.inline.ruler.push('mentions', parseMentions);
  md.renderer.rules.mention = renderMentions;
}

module.exports = mentionsPlugin;
