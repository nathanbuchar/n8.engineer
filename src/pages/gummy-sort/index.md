# Gummy Sort
#### May 3, 2018

Ever since I was a kid, I would always eat a packet of [Welch's fruit snacks](https://welchsfruitsnacks.com/) by first pouring all the gummies out on to the table and rearranging them such that they were arranged in what I believed to be the "most distributed" way possible. It's a bit hard to explain as it's done solely by intuition, but say I have three strawberry gummies 🍓 and two peach gummies 🍑, the most distributed way to eat them would be 🍓🍑🍓🍑🍓, not, say, 🍓🍓🍓🍑🍑 or any other combination. Every packet of Welch's fruit snacks has a variable number of strawberries, oranges, peaches, raspberries, and grapes, so there's no one-size-fits-all solution.

We have Welch's fruit snacks in stock at my office and I still practice this idiosyncratic ritual, but lately I've wondered if my arrangements are the "best"—analytically speaking. So I attempted to write an algorithm to sort my gummies for me.

Turns out this is an NP-hard problem: as the number of gummies increases, the computation time increases exponentially, but for small sample sizes (_n < 15_), it's OK. Here's an example:

```js
gummySort({ '🍓': 6, '🍑': 2, '🍇': 4, '🍊': 1 });
```

```js
{
  // ...
  permutationsAnalyzed: 180180,
  numSolutions: 1,
  minEntropy: 1.11501,
  solutions: [ '🍓🍇🍓🍑🍇🍓🍊🍓🍇🍑🍓🍇🍓' ]
}
```

I should note that `solutions` is an array, because, in many cases, there is more than one ideal solution (i.e., they all have the same entropy).

I won't even attempt to explain the code below—but it works! Introducing `gummy-sort.js`:

```js
/**
 * @typedef {Object.<number>} Seed
 */

/**
 * @typedef {Object.<Tree|string>} Tree
 */

/**
 * @typedef {string[]} Permutation
 */

/**
 * Generates a tree where every flat path to the terminal
 * nodes is a unique permutation of the given seed data.
 *
 *           [aab]
 *            / \
 *           /   \
 *          a     b
 *         / \     \
 *        a   b     a
 *       /     \     \
 *      b       a     a
 *
 * @example
 *
 *   getPermutationalTree({ a: 2, b: 1})
 *   // => { a: { a: { b: {} }, b: { a: {} } }, b: { a: { a: {} } } }
 *
 * @param {Seed} seed
 * @returns {Tree}
 */
function getPermutationalTree(seed) {
  return Object.entries(seed).reduce((acc, [key, val]) => {
    if (!acc[key] && val > 0) {
      acc[key] = getPermutationalTree({
        ...seed,
        [key]: seed[key] - 1,
      });
    }

    return acc;
  }, {});
}

/**
 * Traverses the tree and returns an array of all possible
 * flat paths from the roots to the terminal nodes of the
 * given tree. We use this to get the set of all unique
 * permutations for the given seed data from the parsed
 * permutation tree.
 *
 *            / \
 *           /   \
 *          a     b
 *         / \     \
 *        a   b     a
 *       /     \     \
 *      b       a     a
 *      |       |     |
 *    [aab]   [aba] [baa]
 *
 * @example
 *
 *   getTreePaths({ a: { a: { b: {} }, b: { a: {} } }, b: { a: { a: {} } } })
 *   // => [["a", "a", "b"], ["a", "b", "a"], ["b", "a", "a"]]
 *
 * @param {Tree} tree
 * @param {Permutation[]} [root]
 * @returns {Permutation[]}
 */
function getTreePaths(tree, root = []) {
  return Object.entries(tree).reduce((acc, [key, val]) => {
    const keys = Object.keys(val);
    const path = root.concat([key]);

    if (keys.length) {
      return acc.concat(getTreePaths(val, path));
    }

    return acc.concat([path]);
  }, []);
}

/**
 * Gets all unique permutations from the given dataset.
 *
 * @example
 *
 *   getUniquePermutationsFromData({ a: 1, b: 2 });
 *   // => [["a", "b", "b"], ["b", "a", "b"], ["b", "b", "a"]]
 *
 * @param {Seed} seed
 * @returns {Permutation[]}
 */
function getUniquePermutationsFromData(seed) {
  const tree = getPermutationalTree(seed);
  const paths = getTreePaths(tree);

  return paths;
}

/**
 * Calculates the value of a given number rounded to the
 * given number of decimal places, or two decimal places by
 * default.
 *
 * @example
 *
 *   calculateRoundedValue(1.4354);
 *   // => 1.44
 *
 * @param {number} val
 * @param {number} [numDecimalPlaces=2]
 * @returns {number}
 */
function calculateRoundedValue(val, numDecimalPlaces = 2) {
  const factor = 10 ** numDecimalPlaces;
  const roundedValue = Math.round(val * factor) / factor;

  return roundedValue;
}

/**
 * Calculates the sum of all values within the given set.
 *
 * @example
 *
 *   calculateSum([1, 2, 6]);
 *   // => 9
 *
 * @param {number[]} set
 * @returns {number}
 */
function calculateSum(set) {
  return set.reduce((total, val) => total + val, 0);
}

/**
 * Calculates the average value within the given set.
 *
 * @example
 *
 *   calculateAverage([1, 2, 6]);
 *   // => 3
 *
 * @param {number[]} set
 * @returns {number}
 */
function calculateAverage(set) {
  return calculateSum(set) / set.length;
}

/**
 * Calculates the squared difference from the mean of all
 * values in the given set.
 *
 * @example
 *
 *   calculateSquaredDistanceFromMean([1, 2, 6]);
 *   // => [4, 1, 9]
 *
 * @param {number[]} set
 * @returns {number}
 */
function calculateSquaredDistanceFromMean(set) {
  const mean = calculateAverage(set);

  return set.map((val) => {
    const distance = val - mean;
    const distanceSqd = distance * distance;

    return distanceSqd;
  });
}

/**
 * Calculates the average value of the squared differences
 * from the mean of all values in the given set.
 *
 * @example
 *
 *   calculateAverageSquaredDistanceFromMean([1, 2, 6]);
 *   // => 4.6666...
 *
 * @param {number[]} set
 * @returns {number}
 */
function calculateAverageSquaredDistanceFromMean(set) {
  const squaredDists = calculateSquaredDistanceFromMean(set);
  const squaredDistsAvg = calculateAverage(squaredDists);

  return squaredDistsAvg;
}

/**
 * Calculates the standard deviation of the values in the
 * given set.
 *
 * @example
 *
 *   calculateStandardDeviation([1, 2, 6]);
 *   // => 2.1602...
 *
 * @param {number[]} set
 * @returns {number}
 */
function calculateStandardDeviation(set) {
  const squaredDistsAvg = calculateAverageSquaredDistanceFromMean(set);
  const stdDev = Math.sqrt(squaredDistsAvg);

  return stdDev;
}

/**
 * Calculates the median value of the given set. This
 * function assumes the the set is already sorted in
 * ascending or descending order!
 *
 * @example
 *
 *   1. calculateMedian([1, 2, 3]);
 *
 *               |
 *         [1,   2,   3]
 *               |
 *               |
 *           median = 2
 *
 *
 *   2. calculateMedian([2, 4, 7, 9]);
 *
 *                  |
 *         [2,   4, | 7,   9]
 *                  |
 *                  |
 *            median = 5.5
 *
 *
 * @param {number[]} set
 * @returns {number}
 */
function calculateMedian(set) {
  const len = set.length;

  if (len % 2 === 0) {
    const midpoint = len / 2;

    return calculateAverage([set[midpoint - 1], set[midpoint]]);
  }

  return set[(len - 1) / 2];
}

/**
 * Calculates the relative skew of the median index in the
 * set from the midpoint of an array with the given length.
 * Returns a number indicating the closeness to the
 * midpoint of an array with the given length. The closer
 * this number is to 0, the more balanced the set is.
 *
 * Given: [a, a, b]
 *
 *   [a]
 *
 *                   Midpoint index
 *                    of set = 1
 *                         |
 *                         |
 *     Median index  __    |
 *     of [a] = 0.5    \   |
 *                      |  |
 *                      |  |
 *                   0  |  1    2     <- index
 *                ======|==|========
 *                  [a, |  a,   b]    <- given set
 *                   \__|_/|
 *                      |  |
 *                      |  |
 *
 *                      |__|
 *                        \
 *                          Distance of median index of
 *                          [a] from midpoint of set.
 *
 *
 *      skew = index_median_[a] - index_midpoint
 *           = 0.5 - 1
 *           = -0.5
 *
 * @example
 *
 *   1. calculateSkewOfMedianIndexFromSetMidpoint([0, 2, 4], 5)
 *      // => 0
 *
 *   2. calculateSkewOfMedianIndexFromSetMidpoint([0, 1, 2], 5);
 *      // => -0.5
 *
 *   3. calculateSkewOfMedianIndexFromSetMidpoint([2, 3, 4], 5);
 *      // => 0.5
 *
 * @param {number[]} indexes
 * @param {number} setLen
 * @returns {number}
 */
function calculateSkewOfMedianIndexFromSetMidpoint(indexes, setLen) {
  let med;

  if (setLen > 1) {
    med = calculateMedian(indexes);
  } else {
    med = indexes[0];
  }

  return med - ((setLen - 1) / 2);
}

/**
 * Calculates the absolute skew of the median index in the
 * set from the midpoint of an array with the given length.
 *
 * @example
 *
 *   1. calculateAbsSkewOfMedianIndexFromSetMidpoint([0, 2, 4], 5)
 *      // => 0
 *
 *   2. calculateAbsSkewOfMedianIndexFromSetMidpoint([0, 1, 2], 5);
 *      // => 0.5
 *
 *   3. calculateAbsSkewOfMedianIndexFromSetMidpoint([2, 3, 4], 5);
 *      // => 0.5
 *
 * @param {number[]} indexes
 * @param {number} setLen
 * @returns {number}
 */
function calculateAbsSkewOfMedianIndexFromSetMidpoint(indexes, setLen) {
  const relSkew = calculateSkewOfMedianIndexFromSetMidpoint(indexes, setLen);
  const absSkew = Math.abs(relSkew);

  return absSkew;
}

/**
 * Gets the indexes of the target type within the given
 * permutation.
 *
 * @example
 *
 *   1. getIndexesOfTargetValueWithinSet(['a', 'b', 'a'], 'a')
 *      // => [0, 2]
 *
 *   2. getIndexesOfTargetValueWithinSet(['a', 'b', 'a'], 'b')
 *      // => [1]
 *
 * @param {Array} set
 * @param {any} targetVal
 * @returns {number[]}
 */
function getIndexesOfTargetValueWithinSet(set, targetVal) {
  return set.reduce((indexes, val, i) => {
    if (val === targetVal) indexes.push(i);

    return indexes;
  }, []);
}

/**
 * Gets the distances between indexes within a set of the
 * given length.
 *
 * @example
 *
 *   1. getDistancesBetweenIndexesWithinSet([0, 2], 3)
 *      // => [1, 0]
 *
 *   2. getDistancesBetweenIndexesWithinSet([1], 3)
 *      // => [2]
 *
 * @param {number[]} indexes
 * @param {number} setLen
 * @returns {number[]}
 */
function getDistancesBetweenIndexesWithinSet(indexes, setLen) {
  return indexes.reduce((distances, val, i) => {
    if (i === indexes.length - 1) {
      distances.push(setLen - 1 - val + indexes[0]);
    } else {
      distances.push(indexes[i + 1] - val - 1);
    }

    return distances;
  }, []);
}

/**
 * Calculates the entropy of a given permutation from the
 * given set of data. Takes into consideration the average
 * standard deviation between like items, as well as the
 * skew of like data types from the midpoint of the array.
 * An entropy of 0 is a perfectly balanced permutation,
 * the closer to 0 the better.
 *
 * Given: [a, a, b]
 *
 *                     Midpoint
 *                      of set
 *                         |
 *                      1  |  0
 *                    /    |/
 *                -->|---->|--------  <- Std deviation of the
 *                         |             distance between all
 *                         |       2     [a] = 0.5
 *                         |     /
 *                ------------->|---  <- Std deviation of the
 *                         |             distance between all
 *                         |             [b] = 0
 *                      |  |    |
 *                   0  |  1    2     <- index
 *                ======|==|====|===
 *                  [a, |  a,   b]    <- given set
 *                   \__|_/|    |
 *                      |  |    |
 *                      |  |    |
 *
 *                      |__|\___|
 *                        \   \
 *                         \   Skew of [b] = 1
 *                          \
 *                           Skew of [a] = -0.5
 *
 *
 *      Average std deviation = 0.25
 *      Average skew = 0
 *
 *      Entropy = Average std deviation + average skew
 *              = 0.25 + 0
 *              = 0.25
 *
 *
 * @example
 *
 *   1. calculatePermutationEntropy(["a", "b", "b"], { a: 1, b: 2 });
 *      // => 0.8125
 *
 *   2. calculatePermutationEntropy(["b", "a", "b"], { a: 1, b: 2 });
 *      // => 0.125
 *
 * @param {Permutation} permutation
 * @param {Seed} seed
 * @returns {number}
 */
function calculatePermutationEntropy(permutation, seed) {
  const stdDevsOfDistances = [];
  const stdDevsOfIndexes = [];
  const skews = [];

  Object.keys(seed).forEach((key) => {
    const indexes = getIndexesOfTargetValueWithinSet(permutation, key);
    const distances = getDistancesBetweenIndexesWithinSet(indexes, permutation.length);
    const stdDevOfIndexes = calculateStandardDeviation(indexes);
    const stdDevOfDistances = calculateStandardDeviation(distances);
    const skew = calculateAbsSkewOfMedianIndexFromSetMidpoint(indexes, permutation.length);

    stdDevsOfIndexes.push(stdDevOfIndexes);
    stdDevsOfDistances.push(stdDevOfDistances);
    skews.push(skew);
  });

  const avgStdDevsOfIndexes = calculateAverage(stdDevsOfIndexes);
  const avgStdDevOfDistances = calculateAverage(stdDevsOfDistances);
  const avgOfSkews = calculateAverage(skews);
  const entropy = avgOfSkews + (avgStdDevOfDistances * avgStdDevsOfIndexes);

  return calculateRoundedValue(entropy, 5);
}

/**
 * Sorts a set of data in the most "balanced" way possible.
 * Balanced meaning that the average of the standard
 * deviation between like data types, and the average
 * distance of the median indexes from the middle of a
 * given permutation are as low as possible. Returns an
 * array of optimal solutions.
 *
 * @example
 *
 *   1. gummySort({ a: 2, b: 2, c: 1});
 *      // => [["a", "b", "c", "a", "b"], ["b", "a", "c", "b", "a"]]
 *
 *   2. gummySort({ a: 3, b: 2 });
 *      //=> [["a", "b", "a", "b", "a"]]
 *
 * @param {Seed} seed
 * @returns {Object}
 */
function gummySort(seed) {
  const permutations = getUniquePermutationsFromData(seed);

  let minEntropy;
  let solutions = [];
  for (let i = 0, len = permutations.length; i < len; i++) {
    const permutation = permutations[i];
    const entropy = calculatePermutationEntropy(permutation, seed);

    if (!solutions.length || entropy < minEntropy) {
      solutions = [permutation.join('')];
      minEntropy = entropy;
    } else if (entropy === minEntropy) {
      solutions.push(permutation.join(''));
    }
  }

  return {
    input: seed,
    permutationsAnalyzed: permutations.length,
    numSolutions: solutions.length,
    minEntropy,
    solutions,
  };
}
```
