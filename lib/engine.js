import nunjucks from './nunjucks.js';

class Engine {

  /**
   * Renders a template with context.
   *
   * @static
   * @param {string} template
   * @param {Object} ctx
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
  }
}

export default Engine;