import nunjucks from './nunjucks.js';

/** @implements Engine */
class Engine {

  /**
   * Renders a template with context.
   *
   * @static
   * @param {string} template
   * @param {Context} ctx
   * @returns {Promise<string>} res
   */
  static render(template, ctx) {
    return new Promise((resolve, reject) => {
      nunjucks.render(template, ctx, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    })
  };
}

export default Engine;