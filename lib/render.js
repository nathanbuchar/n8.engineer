/**
 * Template rendering.
 *
 * Provides a Promise-based wrapper around Nunjucks
 * template rendering for the build system.
 *
 * @author Nate Meyer <hi@n8.engineer>
 * @module lib/render
 */

import nunjucks from '#lib/nunjucks.js';

/**
 * Renders a template with context.
 *
 * @param {string} template
 * @param {Context} ctx
 * @returns {Promise<string>}
 */
function render(template, ctx) {
  return new Promise((resolve, reject) => {
    nunjucks.render(template, ctx, (err, res) => {
      if (err) return reject(err);

      resolve(res);
    });
  });
}

export default render;
