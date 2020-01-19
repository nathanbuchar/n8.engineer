/**
 * Use Google Analytics to track events.
 *
 * @param {string} category - Typically the object that was interacted with (ex. 'Video')
 * @param {string} action - The type of interaction (ex. 'play')
 * @param {string} [label] - Useful for categorizing events (ex. 'Fall Campaign')
 * @param {number} [value] - A numeric value associated with the event (ex. 42)
 * @returns {void}
 */
export function sendEvent(...args) {
  try {
    window.ga('send', 'event', ...args);
  } catch (err) {
    // Fail silently.
    // User may be using an ad blocker.
  }
}
