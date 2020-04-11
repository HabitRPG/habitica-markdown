// Optional surrounding capturing group to detect matches in e-mail addresses
// For explanation of regex see https://regex101.com/r/GxTszJ/2
var mentionRegex = /(?:[\s\.]|([^\s\.]))?(@[\w-]+)(\.\w)?/;
var whiteSpaceRegex = /\s+/;

function inLinkifyLink (position, fullText, linkify) {
  if (fullText[position - 1] === ' ') { // Quick check for performance
    return false;
  }
  var textWords = fullText.substr(0, position).split(whiteSpaceRegex);
  var prefix = textWords[textWords.length - 1];

  // If all the characters from the last whitespace character up to this mention are
  // a valid linkify link, the mention is also part of the linkify link
  return linkify.test(prefix);
}

// See `mentionRegex` explanation at https://regex101.com/r/GxTszJ/2 for why this indicates e-mail
function isEmail (match) {
  return match[1] && match[3];
}

function parseMentions (state, silent) {
  if (state.src[state.pos] !== '@' || inLinkifyLink(state.pos, state.src, state.md.linkify)) {
    return false;
  }

  // include character before mention to check for e-mail matches
  var text = state.src.slice(Math.max(state.pos - 1, 0));
  var match = text.match(mentionRegex);

  if (!match || isEmail(match)) {
    return false;
  }
  var mention = match[2];
  state.pos = state.pos + mention.length;

  if (!silent) {
    var token = state.push('mention', 'span', 0);
    token.content = mention;
    token.attrSet('class', 'at-text');
  }

  return true;
}

module.exports = parseMentions;
