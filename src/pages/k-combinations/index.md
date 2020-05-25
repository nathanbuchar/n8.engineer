# K-combinations
###### May 10, 2016

This is a utility function I've been slowly improving on over time. I've never actually had any use for it (well, maybe once?), but I love how elegant the solution is: substantial logic jam-packed into only four lines using nothing but vanilla JavaScript array methods, and yet in spite of this the syntax is completely clean and readable.

## Implementation

```js
/**
 * Returns the set of all possible k-combinations for all
 * elements within the given array, including the empty set.
 *
 * @param {any[]} arr
 * @returns {Array.<any[]>}
 */
function kCombinations(set) {
  return set.reduce((acc, item) => [
    ...acc,
    ...acc.map((c) => [...c, item]),
  ], [[]]);
}
```

Example:

```js
kCombinations(['a', 'b', 'c']);
// expected output: [[], ["a"], ["b"], ["a", "b"], ["c"], ["a", "c"], ["b", "c"], ["a", "b", "c"]]
```
