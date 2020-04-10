var mentionRegex = /@[\w-]+/;

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

    // If first link token we find is open, we're in link
    if (tokenType === 'link_open') {
      return true;
    // As soon as we find a block open
    } else if (notInLinkSignifiers.includes(tokenType)) {
      return false;
    }
  }
  return false;
}

function parseMentions (state, silent) {
  if (state.src[state.pos] !== '@' || inLinkText(state.tokens)) {
    return false;
  }
  var text = state.src.slice(state.pos);
  var mention = text.match(mentionRegex)[0];

  if (!mention) {
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
