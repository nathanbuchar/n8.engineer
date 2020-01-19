# K-Combinations
#### May 10, 2016

> In mathematics, a **combination** is a selection of items from a collection, such that (unlike permutations) the order of selection does not matter. For example, given three fruits, say an apple, an orange and a pear, there are three combinations of two that can be drawn from this set: an apple and a pear; an apple and an orange; or a pear and an orange. More formally, a k-**combination** of a set *S* is a subset of *k* distinct elements of *S*.

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
// => [[], ["a"], ["b"], ["a", "b"], ["c"], ["a", "c"], ["b", "c"], ["a", "b", "c"]]
```
