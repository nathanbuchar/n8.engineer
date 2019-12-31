import { ensureArray, isHTMLElement } from './utils';

class Instance {

  /**
   * @type {Map}
   */
  static instances = new Map();

  /**
   * Returns the base selector for this module.
   *
   * @returns {Object}
   * @abstract
   */
  static getBaseSelector() {
    throw new Error('getBaseSelector() must be implemented by subclass');
  }

  /**
   * Gets the module instance of a given element, if it
   * exists.
   *
   * @param {HTMLElement} elem
   * @returns {?Instance}
   * @final
   */
  static getInstance(elem) {
    return this.instances.get(elem);
  }

  /**
   * Deletes the module instance of a given element, if it
   * exists.
   *
   * @param {HTMLElement} elem
   * @returns {void}
   * @final
   */
  static deleteInstance(elem) {
    const instance = this.getInstance(elem);

    if (instance) {
      this.instances.delete(elem);

      if (typeof instance.dispose === 'function') {
        instance.dispose();
      }
    }
  }

  /**
   * Initializes modules for all elements.
   *
   * @param {HTMLElement|HTMLElement[]|NodeList} elems
   * @param {Object} [opts={}]
   * @returns {void}
   * @final
   */
  static initialize(elems, opts = {}) {
    ensureArray(elems).forEach((elem) => {
      if (isHTMLElement(elem)) {
        if (!this.instances.has(elem)) {
          this.instances.set(elem, new this(elem, opts));
        }
      }
    });
  }

  /**
   * Initializes all matching modules within the given
   * context.
   *
   * @param {HTMLElement|HTMLDocument} [ctx=document]
   * @param {Object} [opts={}]
   * @returns {void}
   * @final
   */
  static initializeAll(ctx = document, opts = {}) {
    const selector = this.getBaseSelector();
    const nodeList = ctx.querySelectorAll(selector);

    this.initialize(nodeList, opts);
  }

  /**
   * Initialize all matching modules within the given
   * context when the browser has a moment of idle time.
   *
   * @param {HTMLElement|HTMLDocument} [ctx]
   * @param {Object} [opts]
   * @returns {Promise}
   * @final
   */
  static initializeAllWhenIdle(...args) {
    return new Promise((resolve) => {
      requestIdleCallback(() => {
        this.initializeAll(...args);
        resolve();
      });
    });
  }
}

export default Instance;
