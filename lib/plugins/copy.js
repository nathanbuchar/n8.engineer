import fs from 'fs';

/**
 * A plugin which recursively copies a file or directory to
 * another location.
 *
 * @example
 * 
 * plugins: [
 *   copy({
 *     from: 'src/static', 
 *     to: 'dist',
 *   }),
 * ]
 *  
 * @param {Object} target
 * @param {string} target.from
 * @param {string} target.to
 * @returns {Plugin}
 */
function copyPlugin(target) {
  return async () => {
    await new Promise((resolve, reject) => {
      fs.cp(target.from, target.to, { recursive: true }, (err) => {
        if (err && err.code !== 'ENOENT') {
          reject(err);
        } else {
          console.log(`Copied "${target.from}" to "${target.to}"`);
          resolve();
        }
      });
    });
  };
}

export default copyPlugin;
