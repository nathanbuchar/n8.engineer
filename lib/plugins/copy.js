/**
 * Copy plugin.
 *
 * @author Nate Meyer <hi@n8.engineer>
 * @module lib/plugins/copy
*/

import fs from 'fs';

/**
 * Recursively copies a file or directory.
 *
 * @param {Object} target
 * @param {string} target.from
 * @param {string} target.to
 * @returns {Plugin}
 * @example
 * plugins: [
 *   copy({
 *     from: 'src/static',
 *     to: 'dist',
 *   }),
 * ]
 */
function copyPlugin(target) {
  return {
    async run() {
      return new Promise((resolve, reject) => {
        fs.mkdir(target.to, { recursive: true }, (err) => {
          if (err) return reject(err);

          fs.cp(target.from, target.to, {
            recursive: true,
            force: true,
          }, (err) => {
            if (err) return reject(err);
            resolve();
          });
        });
      });
    },
  };
}

export default copyPlugin;
