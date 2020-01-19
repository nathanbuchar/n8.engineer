# Iterate (Async)
#### Aug 8, 2018

This is an `async`/`await` implementation of my [iterate](/iterate) utility from 2016.

## Implementation

```js
/**
 * @callback iterateeCallback
 * @param {any} item
 * @param {number} i
 * @param {Array} arr
 */

/**
 * Synchronously iterates over each element in an array,
 * allowing execution of aysnchronous code in the iteratee.
 *
 * @param {Array} arr
 * @param {iterateeCallback} iteratee
 * @returns {Promise}
 */
function iterate(arr, iteratee) {
  const len = arr.length;

  const iterator = async (i) => {
    if (i < len) {
      if (i in arr) {
        await iteratee(arr[i], i, arr);
      }

      await iterator(i + 1);
    }
  };

  return iterator(0);
}
```
