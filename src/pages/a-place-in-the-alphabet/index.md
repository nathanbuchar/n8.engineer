# A Place in the Alphabet
#### Nov 9, 2018

## Background

For the holidays in 2018, Will Shortz, crossword editor at the New York Times, [challenged readers](https://www.nytimes.com/crosswords/alphabet2018) to be part of the NYT's special "Puzzle Mania!" section.

> Dear Puzzler,
>
> This is Will Shortz, crossword editor at The New York Times.
>
> During the past two years, just before Christmas, The Times has published a special section devoted to puzzles called “Puzzle Mania!”
>
> Now we're preparing a new “Puzzle Mania!” section, which will appear on Sunday, Dec. 16, and we'd like to invite you to participate by helping us create a puzzle that will appear in this year's “Puzzle Mania!”

## The Challenge

The challenge was to write a sentence in which the place in the alphabet of the first letter of each word is the same as that word’s length. In other words, if a one-letter word is used, it has to be “a”; a two-letter word has to start with “b”; a three-letter word has to start with “c” etc.

Examples:

- Historic Essen, Germany, digs modernization.
- Georgia highways can be horrible every Friday.
- Interview a daft lexicologist!

## Implementation

I'm a software engineer. I figured it couldn't be too hard to determine if a word is valid. This is what I came up with:

```js
/**
 * Validates a word by checking that its length is equal to
 * the alphabetical position of its fist letter.
 *
 * @param {string} word
 * @returns {boolean}
 */
function isWordValid(word) {
  const charCodeOffset = 97;
  const firstLetterCharCode = word.toLowerCase().charCodeAt(0);
  const firstLetterAlphabetPos = firstLetterCharCode - charCodeOffset + 1;

  return firstLetterAlphabetPos === word.length;
}
```

Now I just need words to test. Turns out that a list of most (?) words in the English language are [available on GitHub](https://github.com/dwyl/english-words)! After downloading `words.txt`, I now have a list of English words, but somehow I need to pipe them through my validator. I've worked with [Node.js streams](https://nodejs.org/api/stream.html) before, but this was my first time implementing a _transform_ stream.

The following will pipe `words.txt` as chunks into a custom stream transformer I wrote, validate each word, and then write all valid words to `words_valid.txt`:

```js
const { Transform } = require('stream');

const filterWords = new Transform({
  transform(chunk, encoding, callback) {
    // Split each line into an array of words.
    const words = chunk.toString().split('\r\n');

    words.forEach((word) => {
      // There are some words in the list that have punctuation.
      // Let's avoid those.
      if (!/!(\w|\.)/.test(word)) {
        if (isWordValid(word)) {
          this.push(word);
          this.push('\n');
        }
      }
    });

    callback();
  }
});

const readable = fs.createReadStream('./words.txt');
const writable = fs.createWriteStream('./words_valid.txt');

readable.pipe(filterWords).pipe(writable);
```

This is great! Now I have a list of words that we can use to try to form sentences for "Puzzle Mania!". Here are a couple interesting words my program found:

* straightforwardness
* ureteropyelonephritis

And here's the best sentence I came up with:

* Intricate flames glowing magnificently.

It's not bad! Then I thought about taking this one step further: what if I only limited myself to words tweeted by [@realDonaldTrump](https://twitter.com/realdonaldtrump)?


### Trump Tweets

I found a website which compiled all of Mr. Trump's tweets in a consumable format, so I downloaded them and parsed through the file using a similar algorithm to the one above. I also allowed for at-mentions (@) and hashtags (#), because why not? I found 2,006 valid "words" (misspellings, abbreviations, hyperbole, mentions, hashtags, etc), and managed to come up with the following, arguably amazing, sentences:

* hahahaha goodbye @SenatorJeffSessions! #PlayTheTrumpCard
* Fueled by ignorance: #MeetTheTrumps
* DACA favors immigrant interests
* A genuine future every family can enjoy #hardwork

I never did end up submitting any of the sentences I found. But, damn, I sure had a good time finding them!
