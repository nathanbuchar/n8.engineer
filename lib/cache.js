/**
 * Cache utility.
 *
 * @author Nate Meyer <hi@n8.engineer>
 * @module lib/cache
*/

import fs from 'fs';
import path from 'path';

import { CACHE_DIR } from '#lib/constants.js';
import { createDebug } from '#lib/utils/debug.js';

const debug = createDebug('cache');

/**
 * @typedef {Object} CacheConfig
 * @property {string} key
 * @property {boolean} [enabled=true]
 * @property {number} [ttl]
 */

/**
 * File-backed cache with TTL. Wrap any async data-fetching
 * function with `wrap()` to transparently read from or
 * write to `.cache/<key>.json`.
 *
 * @param {CacheConfig} config
 * @example
 * const cache = new Cache({ key: 'blog', enabled: isDev });
 * const data = await cache.wrap(() => fetchBlogPosts());
 */
class Cache {

  /** @type {CacheConfig} */
  config;

  /** @type {string} */
  pathToCacheFile;

  /**
   * Create a new cache instance.
   *
   * @param {CacheConfig} config
   * @returns {Cache}
   */
  constructor(config) {
    this.config = {
      enabled: true,
      ttl: 24 * 60 * 60 * 1000, // one day
      ...config,
    };

    this.pathToCacheFile = path.join(CACHE_DIR, `${this.config.key}.json`);
  }

  /**
   * Saves data to cache.
   *
   * @param {Object} data
   * @returns {Promise<void>}
   */
  async saveCache(data) {
    const { key, ttl } = this.config;
    const cached = JSON.stringify({
      key,
      ttl,
      expires: Date.now() + ttl,
      data,
    });

    await fs.promises.mkdir(CACHE_DIR, { recursive: true });
    await fs.promises.writeFile(this.pathToCacheFile, cached);
  }

  /**
   * Loads cached data.
   *
   * @async
   * @returns {Promise<Object>}
   */
  async loadCache() {
    const data = await fs.promises.readFile(this.pathToCacheFile, 'utf8');
    const cache = JSON.parse(data);

    return cache;
  };

  /**
   * Wraps data fetching with caching.
   *
   * @param {Function} hydrate
   * @returns {Promise<Object>}
   */
  async wrap(hydrate) {
    const { key, enabled } = this.config;

    if (!enabled) {
      // If caching is disabled, fetch directly
      debug('Cache is disabled for "%s". Hydrating…', key);
      return hydrate();
    }

    const cacheExists = fs.existsSync(this.pathToCacheFile);

    // Check if cache exists and is fresh
    if (cacheExists) {
      const cache = await this.loadCache();

      if (Date.now() <= cache.expires) {
        debug('Valid cache found for "%s"', key);
        return cache.data;
      }
    }

    // Cache doesn't exist or is expired - fetch and save
    debug('Cache is expired or doesn\'t exist for "%s". Hydrating…', key);
    const data = await hydrate();
    await this.saveCache(data);
    return data;
  }
}

export default Cache;
