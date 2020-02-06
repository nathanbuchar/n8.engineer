# K-Combinations
###### May 10, 2016

This is a utility function I've been slowly improving on over time. I've never actually had any use for it (well, maybe once?), but I love how elegant the solution is: substantial logic jam-packed into only four lines using nothing but vanilla JavaScript array methods, and yet in spite of this the syntax is completely clean and readable.

There are a million different ways to solve this, but this is my own and I'm proud of it.

## Implementation

**Jan, 2020**

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

## Archive

**Nov, 2019**

```js
function kCombinations(set) {
  return set.reduceRight((terms, element) => {
    return terms.concat(
      terms.map((term) => element + term)
    );
  }, ['']);
}
```

**Dec, 2016**

```js
function kCombinations(set) {
  let terms = [''];

  for (let i = set.length - 1; i >= 0; i--) {
    if (i in set) {
      terms = terms.concat(
        terms.map(term => set[i] + term)
      );
    }
  }

  return terms;
}
```

**Dec, 2016**

```js
function kCombinations(set) {
  let terms = [];

  for (let i = set.length - 1; i >= 0; i--) {
    if (i in set) {
      const term = set[i];
      const subset = [term];

      for (let j = 0, l = terms.length; j < l; j++) {
        subset.push(term + terms[j]);
      }

      terms = terms.concat(subset);
    }
  }

  return terms;
}
```

**Oct, 2016**

```js
function kCombinations(set) {
  const c = [];

  for (let n = 1, l = set.length; n < Math.pow(2, l); n++) {
    const d = (n >>> 0).toString(2); // Yikes! But also kinda interesting.
    const t = [];

    for (let i = 0, b = d.length; i < b; i++) {
      if (parseInt(d[i])) {
        t.push(set[l - b + i]);
      }
    }

    c.push(t.join(''));
  }

  return c;
}
```
