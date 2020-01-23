/**
 * Invokes a function when the JavaScript runtime event
 * loop enters the Timer phase.
 *
 * @param {Function} fn
 * @param {Object} [context=null]
 * @returns {void}
 */
function cast(fn, context = null) {
  setTimeout(() => {
    fn.call(context);
  }, 0);
}

export default cast;
