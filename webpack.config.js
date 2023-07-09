const path = require('path');

module.exports = {
  mode: 'development',

  devtool: 'inline-source-map',

  entry: {
      //popoup: './src/popup/popup.tsx',
      bg: './src/bg/bg.ts',
      //"bookmarks/index": './src/bookmarks/index.tsx'
      //options: './src/options/options.ts',
  },

  output: {
    path: path.join(__dirname, 'web-ext', 'out'),
    filename: '[name].js',
  },

  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules'),
    ]
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  "firefox": "111",
                },
              }
            ],
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
        },
      }
    ]
  }
};