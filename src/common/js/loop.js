/**
 * @callback DoneCallback
 * @returns {void}
 */

/**
 * @callback LoopCallback
 * @param {DoneCallback}
 * @returns {void}
 */

/**
 * Request animation frame loop.
 *
 * @param {LoopCallback} fn
 * @returns {void}
 */
function loop(fn) {
  window.requestAnimationFrame(() => {
    fn(() => {
      loop(fn);
    });
  });
}

export default loop;
