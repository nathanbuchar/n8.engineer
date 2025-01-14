import md from 'markdown-it';
import mdAnchor from 'markdown-it-anchor';
import mdFootnotes from 'markdown-it-footnote';
import mdKatex from 'markdown-it-katex';
import mdToc from 'markdown-it-table-of-contents';

import highlight from './highlight.js';

const markdown = md({
  linkify: true,
  breaks: true,
  html: true,
  typographer: true,
  highlight,
});

markdown.use(mdAnchor);
markdown.use(mdKatex);

// Table of contents
markdown.use(mdToc, {
  containerHeaderHtml: "<h2>Contents</h2>",
  includeLevel: [2, 3],
});

// Footnotes
markdown.use(mdFootnotes);
markdown.renderer.rules.footnote_block_open = () => (
  '<hr/>' +
  '<h2>Footnotes</h2>\n' +
  '<section class="footnotes">\n' +
  '<ol class="footnotes-list">\n'
);
markdown.renderer.rules.footnote_block_close = () => (
  '</ol>\n' +
  '</section>\n'
);

export default markdown;
