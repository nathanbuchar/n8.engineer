import nunjucks from 'nunjucks';
import { decode } from 'html-entities';

import markdown from './markdown.js';

const env = nunjucks.configure('src');

env.addGlobal('ctx', function () {
  return this.ctx;
});

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

env.addFilter('debug', function (obj) {
  const str = `<pre>${env.filters.dump(obj, 2)}</pre>`;

  return env.filters.safe(str);
});

env.addFilter('unescape', (str) => {
  return env.filters.safe(decode(str));
});

export default env;
