const createMdInstance = require('./lib/util/createMdInstance');

const withMentions = require('./lib/withMentions');
const unsafe = require('./lib/unsafe');

const md = createMdInstance();

md.unsafeHTMLRender = (text, env) => unsafe.render(text, env);
md.renderWithMentions = (text, env) => withMentions.render(text, env);

module.exports = md;
