const createMdInstance = require('./util/createMdInstance');
const mentionsPlugin = require('./mentionsPlugin');

module.exports = createMdInstance().use(mentionsPlugin);
