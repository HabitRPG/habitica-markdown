// Optional surrounding capturing group to detect matches in e-mail addresses
// For explanation of regex see https://regex101.com/r/GxTszJ/1/
var mentionRegex = /(?:[\s\.]|(\S))?(@[\w-]+)(\.\w)?/;
var whiteSpaceRegex = /\s+/;

function inLinkifyLink (position, fullText, linkify) {
  if (fullText[position - 1] === ' ') { // Quick check for performance
    return false;
  }
  var textWords = fullText.substr(0, position).split(whiteSpaceRegex);
  var prefix = textWords[textWords.length - 1];

  return linkify.test(prefix);
}

function parseMentions (state, silent) {
  if (state.src[state.pos] !== '@' || inLinkifyLink(state.pos, state.src, state.md.linkify)) {
    return false;
  }
  // include character before mention to check for e-mail matches
  var text = state.src.slice(Math.max(state.pos - 1, 0));
  var match = text.match(mentionRegex);
  var mention = match[2];
  var isEmail = match[1] && match[3];

  if (!mention || isEmail) {
    return false;
  }

  state.pos = state.pos + mention.length;

  if (silent) {
    return true;
  }

  var token = state.push('mention', 'span', 0);
  token.content = mention;
  token.attrSet('class', 'at-text');

  return true;
}

module.exports = parseMentions;
