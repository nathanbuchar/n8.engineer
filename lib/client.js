/**
 * Contentful CMS client.
 *
 * Configured Contentful API client for fetching content
 * from the CMS.
 *
 * @author Nate Meyer <hi@n8.engineer>
 * @module lib/client
 */

import contentful from 'contentful';

/** @type {contentful.ContentfulClientApi} */
const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  host: process.env.CONTENTFUL_HOST,
});

export default client;
