import nunjucks from 'nunjucks';

import markdown from './markdown.js';

const env = nunjucks.configure('src', {
  autoescape: true,
});

env.addFilter('markdown', (str) => {
  return markdown.render(str);
});

env.addFilter('noHidden', (items) => {
  return items.filter((item) => {
    return !item.fields.hidden;
  });
});

env.addGlobal('env', {
  origin: process.env.ORIGIN,
});

export default env;
