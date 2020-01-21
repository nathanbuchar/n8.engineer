# Iterate
###### Feb 10, 2016

`iterate` is a utility function that allows for execution of asynchronous code in the iteratee, waiting for each iteration to finish before moving on. This was inspired by the _plugin_ interface of the Node.js server framework Hapi. Hapi plugins historically had the following structure:

```js
function myPlugin(server, options, next) {
  doSomethingAsynchronous(() => {
    next();
  });
}
```

The next plugin in the queue won't be registered until the preceding plugin calls `next()`. My goal was to implement a similar functionality for arrays, like `forEach`, but with an extra `next` parameter passed to the iteratee.

## Implementation

```js
/**
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
```

Example:

```js
const arr = ['foo', 'bar', 'baz'];

console.log('start');

iterate(arr, (item, i, arr, next) => {
  setTimeout(() => {
    console.log(item);
    next();
  }, 1000);
}, () => {
  console.log('finish');
});
```
```
> +0s "start"
> +1s "foo"
> +1s "bar"
> +1s "baz"
> +0s "finish"
```
