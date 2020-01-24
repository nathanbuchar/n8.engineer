/**
 * Ensures the given thing is an Array.
 *
 * @param {any} thing
 * @returns {any[]}
 */
export function ensureArray(thing) {
  if (Array.isArray(thing)) return thing;

  if (thing && typeof thing.length === 'number') {
    return Array.from(thing);
  }

  return [thing];
}

/**
 * Determine if the given thing is an HTMLElement.
 *
 * @param {any} thing
 * @returns {boolean}
 */
export function isHTMLElement(thing) {
  return thing instanceof Element;
}
