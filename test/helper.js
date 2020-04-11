/**
 * Do something for all tokens in depth-first order.
 */
function forAllTokens (tokens, processToken) {
  const [head, ...tail] = tokens;

  if (head) {
    processToken(head);

    if (head.children) {
      forAllTokens(head.children, processToken);
    }
    forAllTokens(tail, processToken);
  }
}

function findMentionTokens (tokens) {
  const result = [];
  forAllTokens(tokens, token => {
    if (token.type === 'mention') {
      result.push(token);
    }
  });

  return result;
}

function findAllTokenTypes (tokens) {
  const result = [];
  forAllTokens(tokens, token => {
    result.push(token.type);
  });

  return result;
}

module.exports = { findMentionTokens, findAllTokenTypes };
