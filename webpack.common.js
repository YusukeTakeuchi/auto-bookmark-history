const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  //mode: 'development',
  //devtool: 'inline-source-map',

  entry: {
      bg: './src/bg/bg.ts',
      'pages/options/index': './src/pages/options/index.tsx'
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
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ]
  },

  plugins: [
    new MonacoWebpackPlugin({
      languages: ['javascript']
    })
  ]
};