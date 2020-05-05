/*
 * Uses `linkify` to test whether the @mention is part of a link or e-mail address
 */
function isLinkOrEmail (text, linkify) {
  // Using match i.o. test since test is approximation only (Doesn't discard www.google.com@user)
  const match = linkify.match(text);
  return match && match[0].text === text;
}

module.exports = isLinkOrEmail;
