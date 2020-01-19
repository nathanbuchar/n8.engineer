# Thunk Support in React
#### Mar 9, 2019

A co-worker and I, familiar with [redux-thunk](https://github.com/reduxjs/redux-thunk), were interested in implementing a redux-like architecture for a project, but unfortunately native react hooks lack thunk support.

Basically, we wanted our actions to support returning functions which will be treated as thunks and have access to the current state. Somehow we needed to create our own reducer which augments the `dispatch` function. After much back and forth and testing, we came up with the following:

```js
import { useCallback, useRef, useState } from 'react';

/**
 * @function Thunk
 * @param {Dispatch} dispatch
 * @param {Function} getState
 * @returns {void|*}
 */

/**
 * @function Dispatch
 * @param {Object|Thunk} action
 * @returns {void|*}
 */

/**
 * Augments React's useReducer() hook so that the action
 * dispatcher supports thunks.
 *
 * @param {Function} reducer
 * @param {*} initialArg
 * @param {Function} [init]
 * @returns {[*, Dispatch]}
 */
function useThunkReducer(reducer, initialArg, init = (a) => a) {
  const [hookState, setHookState] = useState(init(initialArg));

  // State management.
  const state = useRef(hookState);
  const getState = useCallback(() => state.current, [state]);
  const setState = useCallback((newState) => {
    state.current = newState;
    setHookState(newState);
  }, [state, setHookState]);

  // Reducer.
  const reduce = useCallback((action) => {
    return reducer(getState(), action);
  }, [reducer, getState]);

  // Augmented dispatcher.
  const dispatch = useCallback((action) => {
    return typeof action === 'function'
      ? action(dispatch, getState)
      : setState(reduce(action));
  }, [getState, setState, reduce]);

  return [hookState, dispatch];
}
```

It's a drag-and-drop replacement for the `useReducer()` hook, and is fully tested. Available for download [on GitHub](https://github.com/nathanbuchar/react-hook-thunk-reducer).
