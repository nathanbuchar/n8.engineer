# btoa/atob in Node
###### Mar 3, 2020

I love using `window.btoa` and its counterpart `window.atob`. One of my favorite real-world examples of how `window.btoa` can be used is the [Emojic 8 Ball](https://xkcd.com/1525/) by XKCD. If you ask it a question, you can see that a long, base-64 encoded hash is appended to the URL.

Decoding this string back into UTF-8…

```js
window.atob(window.location.hash.substr(1));
// expected output: "{\"q\":\"how will I die?\",\"a\":[\"&#x1F401;\",\"&#x1F4BA;\"]}"
```

It's stringified JSON in base-64 stored in the location hash! That's super neat. This allows us to share the URL with anyone and they'll see exactly what we see, because the state is all neatly compressed into the URL. I believe I used this same methodology when building the [Hennessy Engraver modal](/hennessy/#engraver) several years ago.

However, I sometimes find myself needing to convert UTF-8 strings into base-64 and back in Node instead of in the browser, but unlike in the browser, in Node there is no global `window` object so many functions (like `window.btoa`) are simply not available.

There are `btoa` and `atob` npm packages that one can install, but it seems unnecessary to me to install 3rd-party libraries for what should be a trivial utility function.

So, here's how `window.btoa` can be emulated in Node:

```js
Buffer.from(str, 'utf8').toString('base64');
```

To convert back to UTF-8, `window.atob` can be emulated via:

```js
Buffer.from(str, 'base64').toString('utf8');
```

Short and simple.
