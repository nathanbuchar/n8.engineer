const markdownIt = require('markdown-it');

module.exports = {
  basedir: 'src',
  locals: {
    // foo: 'bar',
  },
  filters: {
    markdown: (text, _options) => (
      markdownIt({
        linkify: true,
        breaks: true,
        html: true,
        typographer: true,
      }).render(text)
    ),
  },
};
