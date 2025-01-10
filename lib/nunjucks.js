import nunjucks from 'nunjucks';

import markdown from './markdown.js';

const env = nunjucks.configure('src');

env.addGlobal('env', {
  origin: process.env.ORIGIN,
});

env.addFilter('markdown', (str) => {
  return markdown.render(str);
});

env.addFilter('markdownInline', (str) => {
  return markdown.renderInline(str);
});

env.addFilter('selectByField', (items, field) => {
  return items.filter((item) => {
    return Boolean(item.fields[field]);
  });
});

env.addFilter('dateToUTC', (datetime) => {
  const date = new Date(datetime);

  return date.toUTCString();
});

export default env;
