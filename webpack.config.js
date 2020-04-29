const path = require('path');

module.exports = {
  entry: {
    index: './index.js',
    unsafe: './lib/unsafe.js',
    withMentions: './lib/withMentions.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'habitica-markdown.[name].js',
    library: 'habiticaMarkdown',
    libraryTarget: 'umd',
  },
  devtool: 'source-map',
};
