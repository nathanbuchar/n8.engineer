import hljs from 'highlight.js';
import md from 'markdown-it';
import mdAnchor from 'markdown-it-anchor';
import mdFootnotes from 'markdown-it-footnote';
import mdKatex from 'markdown-it-katex';
import mdToc from 'markdown-it-table-of-contents';

const markdown = md({
  linkify: true,
  breaks: true,
  html: true,
  typographer: true,
  highlight(code, language) {
    if (language && hljs.getLanguage(language)) {
      try {
        return hljs.highlight(code, {
          language,
        }).value;
      } catch (err) {
        // Do nothing.
      }
    }
    return '';
  },
});

markdown.use(mdAnchor);
markdown.use(mdFootnotes);
markdown.use(mdKatex);
markdown.use(mdToc, {
  containerHeaderHtml: "<h2>Contents</h2>",
  includeLevel: [2, 3],
});

markdown.renderer.rules.footnote_block_open = () => (
  '<hr/>' +
  '<h2>References</h2>\n' +
  '<section class="footnotes">\n' +
  '<ol class="footnotes-list">\n'
);

export default markdown;
