import fs from 'fs';

/**
 * A plugin which recursively deletes the given directory.
 *
 * @example
 * 
 * plugins: [
 *   clean('dist'),
 * ]
 *  
 * @param {string} dest
 * @returns {Plugin}
 */
function cleanPlugin(dest) {
  return async () => {
    return new Promise((resolve, reject) => {
      fs.rm(dest, { recursive: true }, (err) => {
        if (err && err.code !== 'ENOENT') {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };
}

export default cleanPlugin;