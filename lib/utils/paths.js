/**
 * Path utilities.
 *
 * Provides helper functions for constructing paths relative
 * to project directories (src, dist).
 *
 * @author Nate Meyer <hi@n8.engineer>
 * @module lib/utils/paths
 */

import path from 'path';

import { DIST_DIR, SRC_DIR } from '#lib/constants.js';

/**
 * Constructs a normalized path relative to the dist directory.
 *
 * @param {string[]} [paths]
 * @returns {string}
 * @example
 * dist('index.html')
 * // => "dist/index.html"
 */
export const dist = (...paths) => {
  return path.normalize(path.join(DIST_DIR, ...paths));
};

/**
 * Constructs a normalized path relative to the src directory.
 *
 * @param {string[]} [paths]
 * @returns {string}
 * @example
 * src('templates/page.njk')
 * // => "src/templates/page.njk"
 */
export const src = (...paths) => {
  return path.normalize(path.join(SRC_DIR, ...paths));
};
