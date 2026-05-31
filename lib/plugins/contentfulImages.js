/**
 * Contentful images plugin.
 *
 * Downloads Contentful CDN images to dist then rewrites all
 * CDN URLs in ctx to local paths before templates render.
 *
 * @author Nate Meyer <hi@n8.engineer>
 * @module lib/plugins/contentfulImages
 */

import fs from 'fs';
import path from 'path';

import { CACHE_DIR } from '#lib/constants.js';
import runtime from '#lib/runtime.js';
import { createDebug } from '#lib/utils/debug.js';

const debug = createDebug('plugins:contentfulImages');

const URL_REGEX = /(\/\/images\.ctfassets\.net\/[^\s"\\?#)]+)/g;
const IMG_CACHE_DIR = path.join(CACHE_DIR, 'img');

/**
 * @typedef {Object} ContentfulImagesPluginOptions
 * @property {string} dest
 * @property {string} urlPrefix
 */

/**
 * Downloads Contentful images and rewrites CDN URLs in ctx
 * to local paths.
 *
 * @param {ContentfulImagesPluginOptions} opts
 * @returns {Plugin}
 */
function contentfulImagesPlugin(opts) {
  const { dest, urlPrefix, enableCache = true } = opts;

  /**
   * Derives a local filename from a Contentful CDN URL.
   * Pattern: //images.ctfassets.net/<space>/<asset_id>/<hash>/<filename>
   * Result: <asset_id>-<filename>
   *
   * @param {string} url
   * @returns {string}
   */
  function getLocalFilename(url) {
    const { pathname } = new URL(`https:${url}`);
    const [, , assetId, , filename] = pathname.split('/');

    return `${assetId}-${decodeURIComponent(filename)}`;
  }

  /**
   * Downloads a URL to a local file path.
   *
   * @param {string} url
   * @param {string} destPath
   * @returns {Promise<void>}
   */
  async function downloadImage(url, destPath) {
    debug('Downloading %s', url);

    const { href } = new URL(`https:${url}`);
    const response = await fetch(href);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const buffer = await response.arrayBuffer();
    await fs.promises.writeFile(destPath, Buffer.from(buffer));
  }

  return {
    async run(ctx) {
      const json = JSON.stringify(ctx);
      const urlMatches = json.matchAll(URL_REGEX);
      const urls = new Set([...urlMatches].map((match) => match[1]));
      const urlMap = new Map();

      debug('Found %d Contentful image URL(s)', urls.size);

      // No images. Exit early.
      if (urls.size === 0) return;

      // Ensure the img dir exists.
      await fs.promises.mkdir(dest, { recursive: true });

      if (enableCache) {
        await fs.promises.mkdir(IMG_CACHE_DIR, { recursive: true });
      }

      await Promise.all(
        [...urls].map(async (url) => {
          const name = getLocalFilename(url);
          const distPath = path.join(dest, name);

          try {
            if (enableCache) {
              const cachePath = path.join(IMG_CACHE_DIR, name);

              if (!fs.existsSync(cachePath)) {
                await downloadImage(url, cachePath);
              }

              await fs.promises.copyFile(cachePath, distPath);
            } else {
              await downloadImage(url, distPath);
            }

            urlMap.set(url, `${urlPrefix}/${name}`);
          } catch (err) {
            debug('Failed to download %s: %s', url, err.message);
          }
        })
      );

      if (urlMap.size === 0) return;

      // Rewrite all images.ctfassets.com URLs to point to
      // local copies instead.
      let newJson = json;
      for (const [original, local] of urlMap) {
        newJson = newJson.replaceAll(original, local);
      }

      Object.assign(ctx, JSON.parse(newJson));

      debug('Rewrote %d URL(s) to local paths', urlMap.size);
    },
  };
}

export default contentfulImagesPlugin;
