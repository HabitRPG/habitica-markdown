const createMdInstance = require('./lib/util/createMdInstance');
const mentionsPlugin = require('./lib/mentionsPlugin');

module.exports = createMdInstance().use(mentionsPlugin);
