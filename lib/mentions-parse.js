/**
 * Plugin to parse `@user` mentions in habitica and turn them into renderable tokens.
 */

var whiteSpaceRegex = /\s+/;

/*
 * Regular expression to match mentions and detect whether it's part of an e-mail address
 * The optional surrounding capturing groups are to detect matches in e-mail addresses.
 *
 * All parts of the following explanation between backticks are matches for the regex.
 *
 * It matches a` @user` mention including the preceding character.
 *
 * When that preceding` @character` is a space it is not captured.
 * However when th`e@preceding` character is a non-space character (can also match non-latin
 * characters for e.g. arabic e-mail addresses) we see it as a possible start of an e-mail
 * address and capture it in the prefix group.
 *
 * If the @ is in an awesom`e@email.a`ddress we capture both the preceding character and the
 * start of the followup-domain (Which can be top-level or otherwise). In this case we feel
 * confident enough that it might be an e-mail address to not highlight the user (unless
 * there's an underscore in the mention, that's not allowed in domain names).
 *
 * If the mention was followed by a new sentence of which the space at the start was
 * `@forgotton.I`t matches that but since there's no preceding match it's not considered an
 * e-mail address.
 *
 * Other characters in front of the mention also match `(@mention`) and complex e-mail addresses
 * also match t#i$1sval.id(e-mail`)@strangness.i`n.amsterdam "so i.....sss this`"@google.c`om.
 *
 * For interactive version of this explanation see https://regex101.com/r/GxTszJ/2
 */
var mentionRegex = /(?:[\s.]|([^\s.]))?(@[\w-]+)(\.[a-zA-Z0-9])?/;

function partOfLink (position, fullText, mention, linkify) {
  if (fullText.charCodeAt(position - 1) === 0x20 /* ' ' */) { // Quick check for performance
    return false;
  }
  var textWords = fullText.substr(0, position).split(whiteSpaceRegex);
  var prefix = textWords[textWords.length - 1];
  var possibleLink = prefix + mention;

  // Using match i.o. test since test is approximation only (Doesn't discard www.google.com@user)
  var match = linkify.match(possibleLink, 'url');
  return match && match[0].text === possibleLink;
}

// See `mentionRegex` explanation above for why this indicates e-mail
function isEmail (prefix, mention, suffix) {
  return prefix && suffix && !mention.includes('_');
}

function parseMentions (state, silent) {
  if (state.src.charCodeAt(state.pos) !== 0x40 /* @ */) {
    return false;
  }

  // include character before mention to check for e-mail matches
  var text = state.src.slice(Math.max(state.pos - 1, 0));
  var match = text.match(mentionRegex);
  var mention = match ? match[2] : undefined;

  if (!mention || isEmail(match[1], mention, match[3]) ||
      partOfLink(state.pos, state.src, mention, state.md.linkify)) {
    return false;
  }
  state.pos += mention.length;

  if (!silent) {
    var token = state.push('mention', 'span', 0);
    token.content = mention;
    token.attrSet('class', 'at-text');
  }

  return true;
}

module.exports = parseMentions;
