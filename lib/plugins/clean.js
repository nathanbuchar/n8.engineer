/**
 * Clean plugin.
 *
 * @author Nate Meyer <hi@n8.engineer>
 * @module lib/plugins/clean
*/

import fs from 'fs';

/**
 * Recursively deletes a directory.
 *
 * @param {string} dest
 * @returns {Plugin}
 * @example
 * plugins: [
 *   clean('dist'),
 * ]
 */
function cleanPlugin(dest) {
  return {
    async run() {
      return new Promise((resolve, reject) => {
        fs.rm(dest, {
          recursive: true,
          force: true,
        }, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    },
  };
}

export default cleanPlugin;
