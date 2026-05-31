/**
 * Core build system.
 *
 * Orchestrates the static site generation by running
 * plugins to gather data, rendering Nunjucks templates
 * with that data, and writing static HTML files.
 *
 * @author Nate Meyer <hi@n8.engineer>
 * @module lib/builder
 */

import fs from 'fs';
import path from 'path';

import { createDebug } from '#lib/utils/debug.js';

const debug = createDebug('builder');

/**
  * @typedef {Object} Config
  * @property {RenderFn} render
  * @property {Plugin[]} [plugins]
  * @property {Target[]} [targets]
  */

/**
  * @typedef {Function} RenderFn
  * @param {string} template
  * @param {Context} ctx
  * @returns {Promise<string>}
  */

/**
  * @typedef {Object} Plugin
  * @property {PluginMethodFn} [run]
  * @property {PluginMethodFn} [afterBuild]
  */

/**
  * @typedef {Function} PluginMethodFn
  * @param {Context} ctx
  * @param {Builder} builder
  * @returns {Promise<void>}
  */

/**
  * @typedef {Object} Target
  * @property {string} template
  * @property {string} dest
  * @property {boolean} [enabled]
  * @property {string[]|'*'} [include]
  * @property {Object} [extraContext]
  */

/**
  * @typedef {Function} TargetFn
  * @param {Context} ctx
  * @returns {Target|TargetFn|Array<Target|TargetFn>}
  */

/**
  * @typedef {Object<string, any>} Context
  */

class Builder {

  /**
   * @private
   * @type {Config}
   */
  _config;

  /**
   * Creates a new Builder instance.
   *
   * @param {Config} config
   * @returns {Builder}
   */
  constructor(config) {
    this._config = {
      plugins: [],
      targets: [],
      ...config,
    };
  }

  /**
    * Runs plugins and returns context.
    *
    * @async
    * @static
    * @param {Plugin[]} plugins
    * @param {string} [method]
    * @param {Context} [ctx]
    * @param {...*} [args]
    * @returns {Promise<void>}
    */
  static async runPlugins(plugins, method = 'run', ctx = {}, ...args) {
    for (const plugin of plugins) {
      if (method in plugin) {
        try {
          await plugin[method](ctx, ...args);
        } catch (err) {
          debug('Plugin error: %s', err);
          throw err;
        }
      }
    }

    return ctx;
  }

  /**
   * Writes file to disk.
   *
   * @async
   * @static
   * @param {string} filePath
   * @param {string} data
   * @returns {Promise<void>}
   */
  static async writeFile(filePath, data) {
    const dir = path.dirname(filePath);

    await fs.promises.mkdir(dir, { recursive: true });
    await fs.promises.writeFile(filePath, data);

    debug('Wrote file "%s"', filePath);
  }

  /**
    * Renders all targets in a target tree.
    *
    * @async
    * @static
    * @param {RenderFn} render
    * @param {Array<Target|TargetFn>} targets
    * @param {Context} ctx
    * @returns {Promise<void>}
    */
  static async renderTargets(render, targets, ctx) {
    for (const target of targets) {
      if (Array.isArray(target)) {
        await Builder.renderTargets(render, target, ctx);
      } else if (typeof target === 'function') {
        const result = await target(ctx);
        const newTarget = Array.isArray(result) ? result : [result];

        await Builder.renderTargets(render, newTarget, ctx);
      } else {
        await Builder.renderTarget(render, target, ctx);
      }
    }
  }

  /**
   * Renders a single target.
   *
   * @async
   * @static
   * @param {RenderFn} render
   * @param {Target} target
   * @param {Context} ctx
   * @returns {Promise<void>}
   */
  static async renderTarget(render, target, ctx) {
    if (target.enabled === false) return;

    const targetCtx = {};

    if (target.include) {
      if (target.include === '*') {
        Object.assign(targetCtx, ctx);
      } else if (Array.isArray(target.include)) {
        for (const key of target.include) {
          targetCtx[key] = ctx[key];
        }
      }
    }

    if (target.extraContext) {
      Object.assign(targetCtx, target.extraContext);
    }

    const html = await render(target.template, targetCtx);

    await Builder.writeFile(target.dest, html);
  }

  /**
   * Builds the site.
   *
   * @async
   * @param {Context} [ctx]
   * @returns {Promise<void>}
   */
  async build(ctx = {}) {
    const { render, plugins, targets } = this._config;

    debug('Building…');

    debug('Running plugins…');
    await Builder.runPlugins(plugins, 'run', ctx, this);

    debug('Rendering targets…');
    await Builder.renderTargets(render, targets, ctx);

    debug('Running afterBuild plugins…');
    await Builder.runPlugins(plugins, 'afterBuild', ctx, this);

    debug('Build finished');
  }
}

export default Builder;
