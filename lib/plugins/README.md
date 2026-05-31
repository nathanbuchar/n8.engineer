# Plugins

Plugins are the core mechanism for extending the build system. They can fetch data, transform content, perform file operations, or execute any custom logic during (or immediately after) the build process.

## Overview

A plugin is a function that returns an object with optional lifecycle methods:

```javascript
function myPlugin(opts) {
  return {
    async run(ctx, builder) {
      // Runs before targets are rendered
      // Mutate ctx to add data for templates
    },
    
    async afterBuild(ctx, builder) {
      // Runs after all targets are built
      // Used for cleanup, watching, etc.
    }
  };
}
```

## Lifecycle Methods

### `run(ctx, builder)`

Called during the build process, before any targets are rendered. This is where you:
- Fetch data from APIs
- Transform or process data
- Add data to the build context

**Parameters:**
- `ctx` - Shared context object that accumulates data from all plugins
- `builder` - The Builder instance

**Example:**
```javascript
async run(ctx) {
  const posts = await fetchBlogPosts();
  ctx.posts = posts; // Now available in all templates
}
```

### `afterBuild(ctx, builder)`

Called after all targets have been rendered. This is where you:
- Clean up temporary files
- Watch for file changes
- Run post-processing tasks

**Parameters:**
- `ctx` - The final, frozen build context
- `builder` - The Builder instance

**Example:**
```javascript
async afterBuild(ctx) {
  console.log(`Built ${ctx.pages.length} pages`);
  await generateSitemap(ctx.pages);
}
```

## Context Flow

The build context (`ctx`) is a shared object that flows through all plugins:

1. **Starts empty** - `ctx = {}`
2. **Plugin 1** adds data - `ctx.pages = [...]`
3. **Plugin 2** adds data - `ctx.navLinks = [...]`
4. **Plugin 3** can use both - `ctx.siteMap = buildMap(ctx.pages, ctx.navLinks)`
5. **Templates** receive the complete context

**Key Points:**
- Plugins run **sequentially** in the order defined in `config.js`
- Each plugin receives the same `ctx` object
- Mutate `ctx` directly - don't return anything from `run()`
- Later plugins can access data added by earlier plugins
- Plugin order matters!

## Writing a Plugin

### Basic Structure

```javascript
import createDebug from 'debug';

const debug = createDebug('lib:plugins:myPlugin');

/**
 * Does something useful.
 *
 * @param {Object} opts
 * @param {string} opts.someOption
 * @returns {Plugin}
 * @example
 * plugins: [
 *   myPlugin({
 *     someOption: 'value',
 *   }),
 * ]
 */
function myPlugin(opts) {
  return {
    async run(ctx) {
      debug('Fetching data...');
      
      const data = await fetchData(opts);
      
      Object.assign(ctx, {
        myData: data,
      });
      
      debug('Data fetched successfully');
    },
  };
}

export default myPlugin;
```

### Best Practices

1. **Accept options as a parameter** - Make your plugin configurable
2. **Use debug logging** - Import and use the `debug` package with the `lib:plugins:*` scope for logging
3. **Document with JSDoc** - Include parameter types and usage examples
4. **Mutate context directly** - Use `Object.assign(ctx, { ... })` or `ctx.key = value`
5. **Handle errors gracefully** - Wrap async operations in try-catch when needed
6. **Keep plugins focused** - One plugin should do one thing well
7. **Consider plugin order** - Document if your plugin depends on data from other plugins

### Plugin Patterns

**Data Fetching Plugin:**
```javascript
function apiPlugin(opts) {
  return {
    async run(ctx) {
      const data = await fetch(opts.url).then((resp) => resp.json());
      ctx[opts.key] = data;
    },
  };
}
```

**Side Effect Plugin:**
```javascript
function cleanPlugin(dir) {
  return {
    async run() {
      await fs.rm(dir, { recursive: true, force: true });
    },
  };
}
```

**Post-Build Plugin:**
```javascript
function notifyPlugin(opts) {
  return {
    async afterBuild(ctx) {
      await sendNotification({
        message: `Built ${ctx.pages.length} pages`,
        webhook: opts.webhookUrl,
      });
    },
  };
}
```

**Conditional Plugin:**
```javascript
function devOnlyPlugin(opts) {
  return {
    async run(ctx) {
      if (!opts.enabled) return;
      
      // Only runs when enabled
      ctx.devData = await fetchDevData();
    },
  };
}
```

## Adding Your Plugin to Config

1. Create your plugin file in `lib/plugins/myPlugin.js`
2. Import it in `config.js`:
   ```javascript
   import myPlugin from '#lib/plugins/myPlugin.js';
   ```
3. Add it to the plugins array:
   ```javascript
   export default {
     plugins: [
       myPlugin({ option: 'value' }),
       // ... other plugins
     ],
   };
   ```

## Common Patterns

### Composing Plugins

Plugins can run other plugins internally:

```javascript
function composedPlugin(opts) {
  return {
    async run(ctx) {
      // Run multiple plugins together
      await Builder.runPlugins([
        contentful(opts.contentfulConfig),
        tickets(),
      ], ctx);
    },
  };
}
```

### Conditional Execution

```javascript
function conditionalPlugin(opts) {
  return {
    async run(ctx) {
      if (!opts.enabled) return;
      if (!ctx.someRequiredData) {
        throw new Error('Missing required data');
      }
      
      // Proceed with plugin logic
    },
  };
}
```

## Further Reading

- See `example.js` for a complete template
- Check existing plugins for real-world examples
- Read `lib/builder.js` to understand the build system
- Refer to the main README for context and target configuration
