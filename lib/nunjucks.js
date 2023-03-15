import nunjucks from 'nunjucks';

import markdown from './markdown.js';

const env = nunjucks.configure('src');

/**
 * Environment globals.
 */
env.addGlobal('env', {
  origin: process.env.ORIGIN,
});

/**
 * Renders markdown via markdown-it.
 */
env.addFilter('markdown', (str) => {
  return markdown.render(str);
});

/**
 * Selects items in an array based on the value of one of
 * their fields.
 */
 env.addFilter('selectByField', (items, field) => {
  return items.filter((item) => {
    return Boolean(item.fields[field]);
  });
});


/**
 * Formats a full datetime string into a friendly date in
 * the form YYYY-MM-DD.
 */
env.addFilter('friendlyDate', (datetime) => {
  const date = new Date(datetime);

  const mm = date.toLocaleDateString('en-US', { month: '2-digit' });
  const dd = date.toLocaleDateString('en-US', { day: '2-digit' });
  const yyyy = date.toLocaleDateString('en-US', { year: 'numeric' });

  return `${yyyy}-${mm}-${dd}`;
});

export default env;
