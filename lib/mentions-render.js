/**
 * Render plugin here
 */

function renderMentions (tokens, id, _, env) {
  var mention = tokens[id].content;
  var mentionedText = mention.slice(1); // Remove @
  var isCurrentUserMention = mentionedText === env.userName || mentionedText === env.displayName;
  var highlight = isCurrentUserMention ? ' at-highlight' : '';

  return '<span class="at-text' + highlight + '">' + mention + '</span>';
}

module.exports = renderMentions;