/**
 * CLI argument utilities.
 *
 * @author Nate Meyer <hi@n8.engineer>
 * @module lib/utils/args
 */

/**
 * Returns true if the given flag was passed as a
 * CLI argument.
 *
 * @param {string} flag
 * @returns {boolean}
 * @example
 * hasFlag('--watch') // node build.js --watch → true
 */
export const hasFlag = (flag) => {
  return process.argv.includes(flag);
};
