import Instance from './instance';

class Module extends Instance {

  /**
   * The base element for this module.
   *
   * @type {HTMLElement}
   * @private
   */
  _baseElem;

  /**
   * The options passed to this module.
   *
   * @type {Object}
   * @private
   */
  _opts;

  /**
   * Creates a new module instance.
   *
   * @param {HTMLElement} baseElem
   * @param {Object} [opts={}]
   * @constructor
   */
  constructor(baseElem, opts = {}) {
    super();

    this._baseElem = baseElem;
    this._opts = opts;
  }

  /**
   * Disposes the module from memory by nullifying all
   * references and listeners.
   *
   * @returns {void}
   * @protected
   */
  dispose() {
    this._baseElem = null;
    this._opts = null;
  }

  /**
   * Returns the base element for this module,
   *
   * @returns {HTMLElement}
   * @public
   */
  get baseElem() {
    return this._baseElem;
  }

  /**
   * Returns the options passed to this module,
   *
   * @returns {Object}
   * @public
   */
  get opts() {
    return this._opts;
  }
}

export default Module;
