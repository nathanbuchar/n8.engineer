const CopyPlugin = require('copy-webpack-plugin');
const HTMLPlugin = require('html-webpack-plugin');
const SvgSpriteHtmlPlugin = require('svg-sprite-html-webpack');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin } = require('webpack');

const glob = require('glob');
const hljs = require('highlight.js');
const mdIt = require('markdown-it');
const mdItFootnote = require('markdown-it-footnote');
const mdItKatex = require('markdown-it-katex');
const mdItSub = require('markdown-it-sub');
const mdItSup = require('markdown-it-sup');
const mdItToc = require('markdown-it-table-of-contents');
const path = require('path');

const nodeEnv = process.env.NODE_ENV || 'development';
const isDebug = nodeEnv === 'development';

const pages = glob.sync('src/pages/**/page.json', { absolute: true }).map((page) => {
  const { dir } = path.parse(page);
  const config = require(page);

  return {
    ...config,
    template: path.join(dir, config.template),
    entry: config.entry.map((e) => path.join(dir, e)),
  };
});

module.exports = {
  mode: nodeEnv,
  devtool: isDebug ? 'inline-source-map' : false,
  entry: pages.reduce((entries, { id, entry }) => ({ ...entries, [id]: entry }), {}),
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
              'markdown-it': (text, options) => {
                const md = mdIt({
                  linkify: true,
                  breaks: true,
                  html: true,
                  typographer: true,
                  highlight(str, lang) {
                    if (lang && hljs.getLanguage(lang)) {
                      try {
                        return hljs.highlight(lang, str, true).value;
                      } catch (err) {
                        // Do nothing.
                      }
                    }
                    return '';
                  },
                  ...options,
                });

                md.use(mdItKatex);
                md.use(mdItSub);
                md.use(mdItSup);
                md.use(mdItToc, { includeLevel: [2, 3] });
                md.use(mdItFootnote);

                return md.render(text);
              },
            },
            data: {
              __IS_DEBUG: JSON.stringify(isDebug),
              __NODE_ENV: JSON.stringify(nodeEnv),
            },
          },
        }],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCSSExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: SvgSpriteHtmlPlugin.getLoader(),
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new DefinePlugin({
      __IS_DEBUG: JSON.stringify(isDebug),
      __NODE_ENV: JSON.stringify(nodeEnv),
    }),
    new MiniCSSExtractPlugin({
      filename: 'assets/css/[name].[contenthash].css',
    }),
    new CopyPlugin([
      {
        from: path.resolve('src/static'),
        to: path.resolve('dist'),
      },
    ], {
      // resolve conflict with `CopyPlugin`
      // via https://github.com/webpack-contrib/copy-webpack-plugin/issues/261#issuecomment-552550859
      copyUnmodified: true,
    }),
    ...pages.map(({ id, template, filename }) => {
      return new HTMLPlugin({
        template,
        filename,
        chunks: [
          'vendor',
          'common',
          id,
        ],
      });
    }),
    // Must come after HTMLPlugin definition.
    new SvgSpriteHtmlPlugin({
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
