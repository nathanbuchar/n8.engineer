/**
 * Defines the iteratee callback fingerprint.
 *
 * @callback iterateeCallback
 * @param {any} item
 * @param {number} i
 * @param {Array} arr
 * @param {Function} next
 */

/**
 * Synchronously iterates over each element in an array,
 * allowing execution of aysnchronous code in the iteratee.
 *
 * @param {Array} arr
 * @param {iterateeCallback} iteratee
 * @param {Function} done
 * @returns {void}
 */
function iterate(arr, iteratee, done) {
  const len = arr.length;

  const iterator = (i) => {
    const next = i + 1 < len ? iterator.bind(null, i + 1) : done;

    if (i in arr) {
      iteratee(arr[i], i, arr, () => {
        next();
      });
    } else {
      next();
    }
  };

  iterator(0);
}

export default iterate;
