const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'habitica-markdown.js',
    library: 'habiticaMarkdown',
    libraryTarget: 'umd',
  },
  devtool: 'source-map',
};
