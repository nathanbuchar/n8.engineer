# Electron Settings v4
###### May 25, 2020

I'm happy to announce the release of [Electron Settings](https://github.com/nathanbuchar/electron-settings) v4 🎉!

Electron Settings is a simple and robust settings management library for [Electron](https://electronjs.org) which allows easy persistence of user preferences and other data between app loads.

In this new version, in addition to a number of stability and quality of life improvements, the entire library has been completely rewritten in TypeScript.

Read on to learn more, or [check out the project on GitHub](https://github.com/nathanbuchar/electron-settings).


## Background

A little bit of background on the library: it was initially born from a personal need to read and write user settings in an Electron app I was building after being disappointed with the only available third-party options at the time. The first version of Electron Settings was developed in late 2015 and was heavily inspired by [Atom's](https://atom.io) internal configuration manager, which used a novel, albeit complex (yet quite performant), approach to handling user settings.

Subsequent major releases of Electron Settings were aimed at eliminating complexity to increase reliability, and simplifying the API so that the developer would be less concerned with the minutiae of how their settings are stored.

To that end, the previous version of Electron Settings did away with a lot of the fluff introduced in the prior two versions, namely the complex caching mechanics. Like Atom's implementation, a local copy of the settings would be stored in the runtime memory and reads and writes would be performed in the background and throttled so as to increase speed and limit I/O. Although this approach was very performant, it unfortunately made managing settings between renderer processes (which have their own separate memory spaces) a nightmare and would often lead to I/O collisions.

Although these releases weren't perfect, they did see a decent amount of traction in the Electron community. In fact, at the time of writing this, Electron Settings gets over 20k monthly downloads from npm, has over [550 stars](https://github.com/nathanbuchar/electron-settings/stargazers) on GitHub, and is used by over [2,000 packages](https://github.com/nathanbuchar/electron-settings/network/dependents?package_id=UGFja2FnZS0xNjI3MzMwMA%3D%3D). Moreover, Electron Settings is used in Electron's own [API Demos](https://github.com/electron/electron-api-demos) app, as well as by [Facebook's Nuclide](https://nuclide.io/).

Most notably --- and I actually found this out a week before writing this post --- Electron Settings is also used to manage settings in [Onivim](https://www.onivim.io/), a code editor which is a cross between Atom and (neo)vim. The Onivim project has just under **150k downloads** to date. It's hard to believe anything I've built has been used by that many machines, all I can say is that it's incredibly humbling.

Even so, I felt that the project was more than due for a refresh.


## A new version

I've been wanting to write a new and improved version of Electron Settings for some time now. Fortunately the library had seemed to have faired pretty well over the years despite having not been adequately maintained, but the code was old and dated and needed some love.

For Electron Settings v4, I had three major goals:

1. Rewrite the entire project in TypeScript
1. Reduce complexity
1. Improve performance by using async reads and writes

While I was at it, I also wanted to add a few minor, oft-requested, quality of life improvements.

### Rewriting in TypeScript

When it comes ot TypeScript, I feel a bit late to the game. I've always understood it in theory, but never felt really compelled to begin moving my projects over to TypeScript. Not that I always wrote perfect, type-safe code (although I always do my best), but I was a huge advocate for documenting everything using JSDoc (possibly even too much), so at on the surface it didn't really feel all that different from what I was already doing --- aside from actual type enforcement.

I have to say though, I was wrong.

TypeScript is really quite powerful, easy, and most of all fun to use. I have found myself writing better code and thinking about approaching problems differently so that my code is more type safe. I also discovered overloads, which is perfect `get()` and a few other core functions in Electron Settings which have different arities depending on what you want to do (get all settings versus a specific setting). And don't worry, I read the "Overloads and Callbacks" section of the [Do's and Don'ts of TypeScript](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html#overloads-and-callbacks). Having had previous experience with Elixir, the ability to define multiple function signatures dependent on arity is super handy.

Electron Settings v4 was my first major project in TypeScript, and I'm still learning. If you, the reader, feel comfortable with TypeScript, I would love it if you could take a quick look at the Electron Settings [source code](https://github.com/nathanbuchar/electron-settings/blob/master/src/settings.ts) and let me know if you see any common newbie mistakes or things that could be improved.

### Reducing complexity

One of the major sources of complexity in the previous three of Electron Settings were settings observers --- essentially hooks that would notify you if a setting was changed, regardless of where in the application your change took place. Although incredibly powerful, multiple settings observers would often lead to I/O collisions. Take the following for example:

```ts
// 1. Watch `foo` for changes.
settings.watch('foo', () => {
  settings.set('fooChanged', true);
});

// 2. Watch `foo.bar` for changes.
settings.watch('foo.bar', () => {
  settings.set('barChanged', true);
});

// 3. Set the value of `foo.bar`.
settings.set('foo.bar', 'qux');
```

The issue here is that although the two settings observers are watching different key paths, both still fire when `foo.bar` changes, because `bar` is a descendent of `foo`. As a result, both callbacks then attempt to write to the settings file, but because this occurs simultaneously collisions leading to malformed data are inevitable.

My stance on settings observers now is that that sort of thing should really be handled by the developer. Electron Settings' role is to act as a settings manager, not a settings nanny. While useful in many respects, I'm of the opinion nowadays that libraries shouldn't do more than they need to.

Another way Electron Settings v4 cuts down on complexity is by trimming off a few functions, namely: `getAll()`, `setAll()`, and `deleteAll()`. These methods would read and write all settings instead of just settings at a specific key path, and now they've been merged into their singular counterparts (e.g. `get()`) --- to get or set all settings, just skip the key path!

### Improving performance

The previous version of Electron Settings opted to use solely synchronous read and write functions to interact with the filesystem. Although this was beneficial in that it cut down on collisions, it came at the cost of performance, and I no longer believe it was the right choice to make. At the very least, Electron Settings should give developers the option to use async or sync functions.

So, in Electron Settings v4, all `get()`, `set()`, etc. functions return promises and are now asynchronous by default, and as an extra precaution, the settings file will also be saved atomically. The synchronous counterparts for each function are accessible by appending `sync` to the name, as is standard practice. For example, the respective synchronous function for `get()` would be `getSync()`.


### A few QOL improvements

Since Electron Settings' inception, there were a few common asks that were finally implemented in this version:

1. Access items in arrays using array syntax.

    ```ts
    await settings.get('foo.bar[1]');
    ```

1. Ability to define a key path using an array instead of just a string.

    ```ts
    await settings.get(['foo', 'bar']);
    ```

    The above is equivalent to:

    ```ts
    await settings.get('foo.bar');
    ```

1. Get and set key paths with dots in them.

    In this example, `'example.com'` is a key, not a key path!

    ```ts
    await settings.get(['sites', 'example.com']);
    ```

    In vanilla JS, this would be equivalent to:

    ```js
    obj.sites['example.com']
    ```


## Demo

So what does Electron Settings v4 look like? Here's a taste.

```ts
await settings.set('color', {
  name: 'cerulean',
  code: {
    rgb: [0, 179, 230],
    hex: '#003BE6'
  }
});

await settings.get('color.name');
// => "cerulean"

await settings.get('color.code.rgb[1]');
// => 179
```

You might also notice that new in v4 is array syntax, so now not only can you specify a key path using dot nation, but you can throw in some array accessors in there as well, like `color.code.rgb[1]` in the example above.

Now let's change the color to `sapphire` and then update the color code.

```ts
await settings.set('color.name', 'sapphire');

const c = 'code';
await settings.set(['color', c], {
  rgb: [16, 31, 134],
  hex: '#101F86'
});
```

You'll notice that the key path need not be a string, but can also be an array of key paths. This is useful if, for example, part of your key path depends on a variable.


## Documentation

The API documentation for Electron Settings v4 has been generated by [TypeDoc](https://typedoc.org/) and lives at https://electron-settings.js.org.

If you're having trouble implementing Electron Settings or just have a question, [reach out on Gitter](https://gitter.im/nathanbuchar/electron-settings)!

