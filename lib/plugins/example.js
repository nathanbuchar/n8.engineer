/**
 * Example plugin.
 *
 * @author Nate Meyer <hi@n8.engineer>
 * @module lib/plugins/example
*/

/**
 * Example plugin. General form:
 *
 * function plugin() {
 *   return {
 *     run() {
 *       // Do something...
 *     },
 *     afterBuild() {
 *       // Do something...
 *     },
 *   };
 * }
 *
 * @returns {Plugin}
 */
function examplePlugin() {
  return {
    // Optional. Runs before targets are rendered and may
    // be used to hydrate the render context.
    async run(ctx) {
      const widgets = await getWidgets();

      // Add widget data to context.
      Object.assign(ctx, {
        widgets,
      });
    },

    // Optional. Runs after the build is finished.
    async afterBuild() {
      // Do something...
    },
  };
}

export default examplePlugin;
