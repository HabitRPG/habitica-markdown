const createMdInstance = require('./lib/util/createMdInstance');

const withMentions = require('./withMentions');
const unsafe = require('./unsafe');
const emojiDefs = require('./lib/data/full.json');

const MELIOR_IMG_URL = 'https://s3.amazonaws.com/habitica-assets/cdn/emoji/melior.png';

const md = createMdInstance();

md.unsafeHTMLRender = (text, env) => unsafe.render(text, env);
md.renderWithMentions = (text, env) => withMentions.render(text, env);

md.emojiDefs = Object.assign({}, emojiDefs, { melior: 'melior' });
md.customEmojis = {
  melior: MELIOR_IMG_URL,
};

module.exports = md;
