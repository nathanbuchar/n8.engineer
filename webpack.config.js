const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const SvgSpriteHtmlWebpackPlugin = require('svg-sprite-html-webpack');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const { DefinePlugin } = require('webpack');

const fs = require('fs');
const hljs = require('highlight.js');
const mdIt = require('markdown-it');
const mdItAnchor = require('markdown-it-anchor');
const mdItFootnote = require('markdown-it-footnote');
const mdItKatex = require('markdown-it-katex');
const mdItSub = require('markdown-it-sub');
const mdItSup = require('markdown-it-sup');
const mdItToc = require('markdown-it-table-of-contents');
const path = require('path');

const nodeEnv = process.env.NODE_ENV || 'development';
const isDebug = nodeEnv === 'development';

const pages = fs.readdirSync('src/pages').reduce((acc, page) => {
  const pathToPage = path.join(__dirname, 'src/pages', page);

  return {
    ...acc,
    [page]: [
      path.join(pathToPage, 'index.js'),
      path.join(pathToPage, 'index.scss'),
    ],
  };
}, {});

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
        test: /\.(png|jpe?g)$/i,
        use: 'responsive-loader',
      },
      {
        test: /\.(woff2?|ttf|eot|svg|gif|txt)$/i,
        use: {
          loader: 'file-loader',
          options: {
            esModule: false,
          },
        },
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
                  highlight(str, lang) {
                    if (lang && hljs.getLanguage(lang)) {
                      try {
                        return hljs.highlight(lang, str, true).value;
                      } catch (_err) {
                        // Do nothing.
                      }
                    }

                    return ''; // use external default escaping
                  },
                  ...options,
                });

                md.use(mdItAnchor);
                md.use(mdItFootnote);
                md.use(mdItKatex);
                md.use(mdItSub);
                md.use(mdItSup);
                md.use(mdItToc);

                return md.render(text);
              },
            },
          },
        }],
      },
      {
        test: /\.scss$/,
        use: [MiniCSSExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.svg$/,
        use: SvgSpriteHtmlWebpackPlugin.getLoader(),
      },
    ],
  },
  plugins: [
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
