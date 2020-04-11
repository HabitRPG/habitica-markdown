// Optional surrounding capturing group to detect matches in e-mail addresses
var mentionRegex = /(?:\W|(\w))?(@[\w-]+)(\.\w)?/;
var whiteSpaceRegex = /\s+/;

var notInLinkSignifiers = [
  'link_close',
  'paragraph_open',
  'ordered_list_open',
  'bullet_list_open',
  'blockquote_open',
];

function inLinkText (tokens) {
  // Walk backwards up the stack, not concerned with children since they belong in a different block
  for (var i = tokens.length - 1; i >= 0; i--) {
    var tokenType = tokens[i].type;

    // If first link token found is open, a link is open
    if (tokenType === 'link_open') {
      return true;
    // As soon as we find a link close or block open we know we're not in a link
    } else if (notInLinkSignifiers.includes(tokenType)) {
      return false;
    }
  }
  return false;
}

function inLinkifyLink (position, fullText, linkify) {
  if (fullText[position - 1] === ' ') { // Quick check for performance
    return false;
  }
  var textWords = fullText.substr(0, position).split(whiteSpaceRegex);
  var prefix = textWords[textWords.length - 1];

  return linkify.test(prefix);
}

function parseMentions (state, silent) {
  if (state.src[state.pos] !== '@' ||
        inLinkText(state.tokens) ||
        inLinkifyLink(state.pos, state.src, state.md.linkify)) {
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
