/**
 * Watch plugin.
 *
 * @author Nate Meyer <hi@n8.engineer>
 * @module lib/plugins/watch
*/

import fs from 'fs';

import { createDebug } from '#lib/utils/debug.js';

const debug = createDebug('plugins:watch');

/**
 * Watches a directory for changes.
 *
 * @param {Object} opts
 * @param {string} opts.dir
 * @param {boolean} [opts.enabled]
 * @param {Function} opts.handler
 * @returns {Plugin}
 * @example
 * plugins: [
 *   watch({
 *     dir: 'src',
 *     async handler(ctx, builder) {
 *       await builder.build();
 *     },
 *   }),
 * ]
 */
function watchPlugin(opts) {
  let watcher = null;
  let running = false;
  let queued = false;

  const handleChange = async (event, ctx, builder) => {
    if (running) {
      queued = true;
      return;
    }

    running = true;
    queued = false;

    try {
      await opts.handler(ctx, builder);
    } finally {
      running = false;
      if (queued) {
        handleChange(event, ctx, builder);
      }
    }
  };

  return {
    async afterBuild(ctx, builder) {
      if (watcher) return;
      if (opts.enabled === false) return;

      debug('Watching for changes…');

      watcher = fs.watch(opts.dir, { recursive: true });

      watcher.on('change', (event) => {
        debug('Changes detected. Running change handler…');
        handleChange(event, ctx, builder);
      });

      process.on('SIGINT', () => {
        if (watcher) watcher.close();
        process.exit();
      });

      // Keep watching indefinitely.
      await new Promise(() => { });
    },
  };
}

export default watchPlugin;
