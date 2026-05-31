/**
 * Cache plugin.
 *
 * @author Nate Meyer <hi@n8.engineer>
 * @module lib/plugins/cache
*/

import fs from 'fs';
import path from 'path';

import { CACHE_DIR } from '#lib/constants.js';
import { createDebug } from '#lib/utils/debug.js';

const debug = createDebug('plugins:cache');

/**
 * @typedef {Object} CachePluginOptions
 * @property {string} key
 * @property {boolean} [enabled]
 * @property {number} [ttl]
 * @property {Function} hydrate
 */

/**
 * Caches plugin output with TTL.
 *
 * @param {CachePluginOptions} opts
 * @returns {Plugin}
 * @example
 * plugins: [
 *   cache({
 *     key: 'blog',
 *     hydrate() {
 *       return Builder.runPlugins([
 *         blogPosts(),
 *       ]);
 *     },
 *   }),
 * ]
 */
function cachePlugin({
  key,
  enabled = true,
  ttl = 24 * 60 * 60 * 1000, // one day
  hydrate,
}) {
  const pathToCacheFile = path.join(CACHE_DIR, `${key}.json`);

  /**
   * Saves data to cache.
   *
   * @async
   * @param {Object} data
   * @param {Object} options
   * @param {string} options.key
   * @param {number} options.ttl
   * @returns {Promise<void>}
   */
  const saveCache = async (data) => {
    const cached = JSON.stringify({
      key,
      ttl,
      expires: Date.now() + ttl,
      data,
    });

    await fs.promises.mkdir(CACHE_DIR, { recursive: true });
    await fs.promises.writeFile(pathToCacheFile, cached);
  }

  /**
   * Loads cached data.
   *
   * @returns {Promise<Object>}
   */
  const loadCache = async () => {
    const data = await fs.promises.readFile(pathToCacheFile, 'utf8');
    const cache = JSON.parse(data);

    return cache;
  };

  /**
    * Wraps data fetching with caching.
    *
    * @param {Function} hydrate - Async function that fetches data
    * @returns {Promise<Object>}
    */
  const wrap = async (hydrate) => {
    if (!enabled) {
      // If caching is disabled, fetch directly
      debug('Cache is disabled for "%s". Hydrating…', key);
      return hydrate();
    }

    const cacheExists = fs.existsSync(pathToCacheFile);

    // Check if cache exists and is fresh
    if (cacheExists) {
      const cache = await loadCache();

      if (Date.now() <= cache.expires) {
        debug('Valid cache found for "%s"', key);
        return cache.data;
      }
    }

    // Cache doesn't exist or is expired - fetch and save
    debug('Cache is expired or doesn\'t exist for "%s". Hydrating…', key);
    const data = await hydrate();
    await saveCache(data);
    return data;
  }

  return {
    async run(ctx) {
      const data = await wrap(() => hydrate());

      Object.assign(ctx, data);
    },
  };
}

export default cachePlugin;
