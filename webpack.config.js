const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const SvgSpriteHtmlWebpackPlugin = require('svg-sprite-html-webpack');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin } = require('webpack');

const fs = require('fs');
const hljs = require('highlight.js');
const mdIt = require('markdown-it');
const mdItAnchor = require('markdown-it-anchor');
const mdItFootnote = require('markdown-it-footnote');
const mdItSub = require('markdown-it-sub');
const mdItSup = require('markdown-it-sup');
const mdItToc = require('markdown-it-table-of-contents');
const path = require('path');

const nodeEnv = process.env.NODE_ENV || 'development';
const isDebug = nodeEnv === 'development';

const pages = fs.readdirSync('src/pages').map((id) => {
  const pathToPage = path.join(__dirname, 'src/pages', id);
  const pathToConfig = path.join(pathToPage, 'config.json');
  const config = require(pathToConfig);

  return {
    id,
    config: {
      ...config,
      entry: config.entry.map((file) => {
        return path.join(pathToPage, file);
      }),
    },
  };
});

module.exports = {
  mode: nodeEnv,
  devtool: isDebug ? 'inline-source-map' : false,
  entry: pages.reduce((entries, page) => ({ ...entries, [page.id]: page.config.entry }), {}),
  output: {
    path: path.resolve('dist'),
    publicPath: '/',
    filename: 'assets/js/[name].[contenthash].bundle.js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          name: 'vendor',
          chunks: 'all',
          test: /node_modules/,
          priority: 40,
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 20,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: 'assets/img/[name].[ext]',
            esModule: false,
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf)$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: 'assets/fonts/[name].[ext]',
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
                    return '';
                  },
                  ...options,
                });

                md.use(mdItAnchor, { permalink: true });
                md.use(mdItFootnote);
                md.use(mdItSub);
                md.use(mdItSup);
                md.use(mdItToc, { includeLevel: [2, 3] });

                return md.render(text);
              },
            },
          },
        }],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCSSExtractPlugin.loader,
          'css-loader',
          'resolve-url-loader',
          'sass-loader',
        ],
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
      filename: 'assets/css/[name].[contenthash].css',
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve('src/static'),
        to: path.resolve('dist'),
      },
    ], {
      // resolve conflict with `CopyWebpackPlugin`
      // via https://github.com/webpack-contrib/copy-webpack-plugin/issues/261#issuecomment-552550859
      copyUnmodified: true,
    }),
    ...pages.map((page) => {
      return new HTMLWebpackPlugin({
        template: path.join(__dirname, 'src/pages', page.id, page.config.template),
        filename: path.join(__dirname, 'dist', page.config.filename),
        chunks: [
          'vendor',
          'common',
          page.id,
        ],
      });
    }),
    // Must come after HTMLWebpackPlugin definition.
    new SvgSpriteHtmlWebpackPlugin({
      includeFiles: [
        'src/common/svg/*.svg',
      ],
      generateSymbolId(svgFilePath) {
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
