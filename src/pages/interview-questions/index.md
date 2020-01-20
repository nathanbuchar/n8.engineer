# Interview Questions
###### Revised Jan, 2020

## Vanilla JavaScript

### Context

* Can you tell me what the `this` keyword refers to?

  * (In the browser) What does it refer to outside of a Function or Class?

  * What about in Node.js?

    * Do you have any experience with Node.js?

* Can you describe for me the difference between `bind` and `call`?

  * And how does `call` differ from `apply`?

* Can you describe a situation when you might use `bind`?

* Can you explain to me the difference between an arrow function and an anonymous function?

### Event Handling and Callbacks

* Can you give me an example of when you might use `event.preventDefault()`?

* Have you heard the term "event bubbling" before? What is it?

  * How can I prevent an event from "bubbling" up the DOM?

### Writing Modern Code

* `let` was introduced in ES6. Are there actually any differences between `var` and `let`?

* If I declare an array as a `const`, will JavaScript throw an error if I push to it? Why or why not?

* Can you describe for me one way to clone an Object?

* What is the difference between a shallow clone and a deep clone?

* Are you familiar with the term "array-like"? Can you describe it for me?

  * What is an example of an array-like Object?

  * What is one way to transform an array-like object into a true array?

### Debouncing, Throttling, and Performance

* Can you think of any issues with registering a scroll event listener on the window?

  * How might you minimize performance issues?

* Have you heard of "debouncing" before? Can you explain it for me?

* What is the difference between a callback that is debounced versus one that is throttled?

### Odds and Ends

* Are you familiar with JSDoc?

  * Do you have your own style for documenting your functions? What is it?

* Have you used other HTML templating languages before? Which were your favorites?

* Have you heard of V8? What is it?


## React

### Lifecycle

* Can you describe the React Component lifecycle to me?

  * Can you think of any issues with using `componentWillMount`?

* What does `componentShouldUpdate` do?

  * What does it return by default?

### Component State

* In React, how do I update a component's state?

* Will a property be deleted if I don't specify it in the Object I pass to `setState()`?

* What happens if I pass in a Function instead of an Object as the first argument to `setState()`?

* What does the second parameter of `setState()` do?

* Is `setState()` synchronous?

  * What can I do to guarantee that when I access a component's state using `this.state` it is up-to-date?

    * Can you think of any lifecycle methods?

### Performance

* What is a `React.PureComponent`?

* Can you think of any performance problems that may be caused by using `bind` or arrow functions in a React Component's `render` method?

  * How should you properly bind callbacks instead?

* Can you think of any performance problems that may be caused by passing an arrow function as a prop to a child component?


## Problem Solving

* Let's say you come across an array method called `Array.squeeze()` that you've never heard of before. Which resources would you consult to familiarize yourself with it?

* What if it doesn't exist on MDN?

* Can you tell me about a project you've worked on where you learned a lot about something you weren't initially very familiar with?
