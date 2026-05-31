/**
 * Contentful plugin.
 *
 * @author Nate Meyer <hi@n8.engineer>
 * @module lib/plugins/contentful
*/

import Cache from '#lib/cache.js';
import { createDebug } from '#lib/utils/debug.js';

const debug = createDebug('plugins:contentful');

/**
 * @typedef {Object} Source
 * @prop {string} key
 * @prop {string} contentType
 */

/**
 * Fetches entries from Contentful.
 *
 * @param {Object} opts
 * @param {ContentfulClientApi} opts.client
 * @param {Source[]} opts.sources
 * @returns {Plugin}
 * @example
 * plugins: [
 *   contentful({
 *     client,
 *     sources: [
 *       {
 *         key: 'pages',
 *         contentType: 'page',
 *       },
 *     ],
 *   }),
 * ]
 */
function contentfulPlugin(opts) {
  const { client, sources, enableCache = true } = opts;

  const cache = new Cache({
    key: 'contentful',
    enabled: enableCache,
  });

  const fetchData = async () => {
    return Promise.all([
      ...sources.map(async (source) => {
        const { key, contentType } = source;

        // Get entries data.
        const data = await client.getEntries({
          content_type: contentType,
          include: 10, // link depth
        });

        // Convert data to tuple.
        // Ex. ['pages', [{...}, ...]]
        return [key, data.items];
      }),
    ]);
  };

  return {
    async run(ctx) {
      debug('Fetching Contentful data…');

      const data = await cache.wrap(async () => {
        const dataArr = await fetchData();
        const dataObj = Object.fromEntries(dataArr);

        return dataObj;
      });

      // Add data to ctx.
      Object.assign(ctx, data);
    },
  };
}

export default contentfulPlugin;
