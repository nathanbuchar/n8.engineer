# Weighted random
###### Oct 25, 2016

The goal of this task was to design a generator function in JavaScript which yields a random value from a set based on a given probability of being chosen.

## Implementation

```js
/**
 * A generator which yields a random value from the given
 * set based on a given probability of being chosen.
 *
 * @param {Array.<[number, any]>} set
 * @yields {any}
 */
function* weightedRandom(set) {
  const len = set.length;
  const sum = set.reduce((acc, i) => acc + i[0], 0);

  while (true) {
    const target = Math.random() * sum;

    for (let i = 0, accWgt = 0; i < len; i++) {
      const [wgt, val] = set[i];

      if ((accWgt += wgt) >= target) {
        yield val;
        break;
      }
    }
  }
}
```

Example:

```js
const generator = weightedRandom([
  [0.50, 'a'],
  [0.35, 'b'],
  [0.15, 'c'],
]);

generator.next().value;
// 50% chance of returning "a"
// 35% chance of returning "b"
// 15% chance of returning "c"
```

## Testing for Randomness

Implementing the generator is one thing; what about testing it? How does one even test for randomness? Enter: [chi-squared test](https://en.wikipedia.org/wiki/Chi-squared_test).

> The **Chi-Squared Test** (also written as **χ^2^ test**) is the widely used non-parametric statistical test that describes the magnitude of discrepancy between the *observed data* and the *data expected* to be obtained with a specific hypothesis.^[https://businessjargons.com/chi-square-test.html]

First we need to determine how confident we want to be with our result. If we shoot too low, then we can't be reasonably confident that our observed data is accurate. However, if we shoot too high—say 99%—there is a good chance that our observed data will fail our hypothesis, even if our implementation is correct. Typically, 95% (`0.05`) is a pretty standard confidence level in statistics, so that's what we'll go with.

With a confidence level chosen, we need to determine the critical value.

> For hypothesis tests, a critical value tells us the boundary of how extreme a test statistic we need to reject the null hypothesis.^[https://www.thoughtco.com/critical-values-with-a-chi-square-table-3126426]

In order to determine the critical value, we also need to determine the degrees of freedom of our test. The number of degrees of freedom is simply the number of values in the final calculation of a statistic that are free to vary. In our case (chi-squared goodness of fit test), this is simply _n - 1_ where _n_ is the number of levels we are testing for.

In the following test data, we have defined three levels (viz. _foo_, _bar_, and _baz_):

```js
const testData = [
  [0.50, 'foo'],
  [0.35, 'bar'],
  [0.15, 'baz'],
];
```

Therefore, our number of degrees of freedom is 2.

Now that we have our confidence level and number of degrees of freedom, we'll reference a chi-squared table to easily determine our critical value. Using [this](https://www.medcalc.org/manual/chi-square-table.php) table, we find that our critical value for our test is `5.991`.


```js
const criticalValue = 5.991;
```

We should now have everything we need to write our test.

```js
test('should yield accurate results with 95% confidence', () => {
  const generator = weightedRandom(testData);
  const counts = new Array(testData.length).fill(0);
  const numTrials = 100000;

  // Run a number of trials to get the number of counts of
  // each value in the test data.
  for (let i = 0; i < numTrials; i++) {
    const val = generator.next().value;

    // Update count for this value.
    for (let j = 0; j < testData.length; j++) {
      if (val === testData[j][1]) {
        counts[j]++;
        break;
      }
    }
  }

  // Calculate the chi squared value from the results.
  const chiSquared = counts.reduce((acc, count, i) => {
    const expected = testData[i][0] * numTrials;
    const result = Math.pow(count - expected, 2) / expected;

    return acc + result;
  }, 0);

  expect(chiSquared).toBeLessThanOrEqual(criticalValue);
});
```
