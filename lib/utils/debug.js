/**
 * Debug utilities.
 *
 * Provides configured debug loggers for different parts of
 * the application. Use DEBUG=site:* environment variable
 * to enable logging.
 *
 * @author Nate Meyer <hi@n8.engineer>
 * @module lib/utils/debug
 */

import debug from 'debug';

/**
 * Debug logger for site-wide logging.
 *
 * @type {debug.Debugger}
 */
const siteDebug = debug('site');

/**
 * Creates a namespaced debug logger extending the
 * site logger.
 *
 * @param {string} namespace
 * @param {string} [delimeter]
 * @returns {debug.Debugger}
 * @example
 * import { createDebug } from '#lib/utils/debug.js';
 * const debug = createDebug('component');
 * debug('Message here');
 */
export const createDebug = (...args) => siteDebug.extend(...args);
