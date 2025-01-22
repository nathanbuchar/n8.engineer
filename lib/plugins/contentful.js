/**
 * @typedef {Object} Source
 * @prop {string} key
 * @prop {string} contentType
 */

/**
 * A plugin which fetches entries from Contentful.
 * 
 * @example
 * 
 * plugins: [
 *   contentful([
 *     {
  *      key: 'pages',
  *      contentType: 'page',
 *     },
 *   ]),
 * ]
 * 
 * @param {Object} opts
 * @param {ContentfulClientApi} opts.client
 * @param {Source[]} opts.sources
 * @retuns {Plugin}
 */
function contentfulPlugin({ client, sources }) {
  return async (config, ctx) => {
    const dataArr = await Promise.all([
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

    // Convert data tuples to object.
    const data = Object.fromEntries(dataArr);

    // Add data to ctx.
    Object.assign(ctx, data);
  };
}

export default contentfulPlugin;