/**
 * Render plugin here
 */

function renderMentions (tokens, id, _, env) { // eslint-disable-line
  return '<span class="at-text">' + tokens[id].content + '</span>';
}

module.exports = renderMentions;