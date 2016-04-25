var markdownitEmoji = require('markdown-it-emoji');

// https://github.com/markdown-it/markdown-it-emoji/tree/4d5f6af1b6efb0975dae2ac51dbe6252636724aa#change-output
function emojiPlugin (md) {
  md.use(markdownitEmoji);
  md.renderer.rules.emoji = function markdownEmojiRules (token, idx) {
    var emoji = token[idx];
    var src = 'https://s3.amazonaws.com/habitica-assets/cdn/emoji/' + emoji.markup + '.png';
    var style = 'height: 1.5em; width: 1.5em';
    return '<img class="habitica-emoji" style="' + style + '" src="' + src + '" alt="' + emoji.markup + '">';
  };
}

module.exports = emojiPlugin;
