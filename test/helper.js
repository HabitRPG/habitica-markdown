/**
 * Do something for all tokens in depth-first order.
 */
function forAllTokens (tokens, processToken) {
  const [head, ...tail] = tokens;

  if (!head) {
    return;
  }

  processToken(head);

  if (head.children) {
    forAllTokens(head.children, processToken);
  }
  forAllTokens(tail, processToken);
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

function printAllTokens (tokens) {
  forAllTokens(tokens, token => {
    console.log(token); // eslint-disable-line no-console
  });
}

module.exports = { findMentionTokens, printAllTokens };
