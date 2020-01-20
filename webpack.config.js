const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const SvgSpriteHtmlWebpackPlugin = require('svg-sprite-html-webpack');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin } = require('webpack');

const fs = require('fs');
const mdIt = require('markdown-it');
const mdItAnchor = require('markdown-it-anchor');
const mdItSub = require('markdown-it-sub');
const mdItSup = require('markdown-it-sup');
const mdItDeflist = require('markdown-it-deflist');
const mdItFootnote = require('markdown-it-footnote');
const mdItToc = require('markdown-it-table-of-contents');
const mdItKatex = require('markdown-it-katex');
const path = require('path');

const nodeEnv = process.env.NODE_ENV || 'development';
const isDebug = nodeEnv === 'development';

const pages = fs.readdirSync('src/pages').reduce((acc, page) => ({
  ...acc,
  [page]: path.join(__dirname, 'src/pages', page, 'index.js'),
}), {});

module.exports = {
  mode: nodeEnv,
  devtool: isDebug ? 'inline-source-map' : false,
  entry: pages,
  output: {
    path: path.resolve('dist'),
    publicPath: '/',
    filename: '[name]-[contenthash].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(woff(2)?|ttf|eot|svg|png|jpe?g|gif|txt)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            esModule: false,
          },
        }],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['IE >= 9'],
                },
              }],
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-export-default-from',
            ],
          },
        },
      },
      {
        test: /\.pug$/,
        use: ['html-loader', {
          loader: 'pug-html-loader',
          options: {
            basedir: path.resolve('src'),
            filters: {
              md(text, options) {
                const md = mdIt({
                  linkify: true,
                  breaks: true,
                  html: true,
                  typographer: true,
                  ...options,
                });

                md.use(mdItAnchor);
                md.use(mdItSub);
                md.use(mdItSup);
                md.use(mdItDeflist);
                md.use(mdItFootnote);
                md.use(mdItToc);
                md.use(mdItKatex);

                return md.render(text);
              },
            },
          },
        }],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', MiniCSSExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.svg$/,
        use: SvgSpriteHtmlWebpackPlugin.getLoader(),
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new DefinePlugin({
      __IS_DEBUG: JSON.stringify(isDebug),
    }),
    new MiniCSSExtractPlugin({
      filename: '[name]-[contenthash].css',
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve('src/static'),
        to: path.resolve('dist'),
      },
    ]),
    ...Object.keys(pages).map((page) => {
      return new HTMLWebpackPlugin({
        template: path.resolve(`src/pages/${page}/index.pug`),
        filename: path.resolve(`dist/${page}/index.html`),
        chunks: [page],
      });
    }),
    // Must come after HTMLWebpackPlugin definition.
    new SvgSpriteHtmlWebpackPlugin({
      generateSymbolId(svgFilePath, _svgHash, _svgContent) {
        return path.parse(svgFilePath).name;
      },
    }),
  ],
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      common: path.resolve('src/common'),
      pages: path.resolve('src/pages'),
    },
  },
};
