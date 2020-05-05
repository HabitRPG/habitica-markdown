const createMdInstance = require('./lib/util/createMdInstance');

const withMentions = require('./withMentions');
const unsafe = require('./unsafe');

const md = createMdInstance();

md.unsafeHTMLRender = (text, env) => unsafe.render(text, env);
md.renderWithMentions = (text, env) => withMentions.render(text, env);

module.exports = md;
