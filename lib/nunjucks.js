/**
 * Nunjucks template environment configuration.
 *
 * Configures the Nunjucks templating engine with custom
 * globals, filters, and utilities for the build system.
 *
 * @author Nate Meyer <hi@n8.engineer>
 * @module lib/nunjucks
*/

import nunjucks from 'nunjucks';
import { decode } from 'html-entities';

import * as constants from '#lib/constants.js';
import markdown from '#lib/markdown.js';

// =========================================================
// ENVIRONMENT
// =========================================================

/** @type {nunjucks.NunjucksEnvironment} */
const env = nunjucks.configure(constants.SRC_DIR, {
  noCache: true,
});

// =========================================================
// GLOBALS
// =========================================================

/**
 * Returns the current Nunjucks context.
 *
 * @param {Object} [extraContext={}]
 * @returns {Object}
 * @example
 * {{ ctx() | dump }}
 */
env.addGlobal('ctx', function () {
  return this.ctx;
});

/**
 * Returns selected properties from the current Node
 * environment.
 *
 * @returns {Object}
 * @example
 * {{ env | dump }}
 */
env.addGlobal('env', {
  origin: process.env.ORIGIN,
});

// =========================================================
// FILTERS
// =========================================================

/**
 * Renders markdown to HTML.
 *
 * @param {string} str
 * @returns {string}
 * @example
 * {{ "# Heading" | markdown | safe }}
 */
env.addFilter('markdown', (str) => {
  return markdown.render(str);
});

/**
 * Renders inline markdown without wrapping `<p>` tags.
 *
 * @param {string} str
 * @returns {string}
 * @example
 * {{ "# Heading" | markdownInline | safe }}
 */
env.addFilter('markdownInline', (str) => {
  return markdown.renderInline(str);
});

/**
 * Filters an array given the truthiness of a given field.
 *
 * @param {Array} items
 * @param {string} field
 * @returns {Array}
 * @example
 * {% for page in pages | selectByField('blogPost') %}
 */
env.addFilter('selectByField', (items, field) => {
  return items.filter((item) => {
    return Boolean(item.fields[field]);
  });
});

/**
 * Converts a date time string into a UTC string.
 *
 * @param {string} datetime
 * @returns {string}
 * @example
 * <time datetime="{{ post.fields.date | dateToUTC }}">
 */
env.addFilter('dateToUTC', (datetime) => {
  const date = new Date(datetime);

  return date.toUTCString();
});

/**
 * Dumps object wrapped in `<pre>` tags.
 *
 * @param {Object} obj
 * @returns {string}
 * @example
 * {{ ctx() | debug }}
 */
env.addFilter('debug', function (obj) {
  const str = `<pre>${env.filters.dump(obj, 2)}</pre>`;

  return env.filters.safe(str);
});

/**
 * Unescapes html entities.
 *
 * @param {string} str
 * @returns {string}
 * @example
 * {{ title | unescape }}
 */
env.addFilter('unescape', (str) => {
  return env.filters.safe(decode(str));
});

export default env;
