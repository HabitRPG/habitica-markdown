const path = require('path');

module.exports = {
  entry: {
    index: './index.js',
    unsafe: './unsafe.js',
    withMentions: './withMentions.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'habitica-markdown.[name].js',
    library: 'habiticaMarkdown',
    libraryTarget: 'umd',
  },
  devtool: 'source-map',
};
