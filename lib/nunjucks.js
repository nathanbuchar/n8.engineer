import nunjucks from 'nunjucks';

import markdown from './markdown.js';

const env = nunjucks.configure('src', {
  autoescape: true,
});

env.addFilter('markdown', (str) => {
  return markdown.render(str);
});

env.addFilter('selectByField', (items, field) => {
  return items.filter((item) => {
    return Boolean(item.fields[field]);
  });
});

env.addFilter('friendlyDate', (datetime) => {
  const date = new Date(datetime);

  const mm = date.toLocaleDateString('en-US', { month: '2-digit' });
  const dd = date.toLocaleDateString('en-US', { day: '2-digit' });
  const yyyy = date.toLocaleDateString('en-US', { year: 'numeric' });

  return `${yyyy}-${mm}-${dd}`;
});

env.addGlobal('env', {
  origin: process.env.ORIGIN,
});

export default env;
