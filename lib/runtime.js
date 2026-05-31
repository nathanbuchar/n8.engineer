/**
 * Runtime environment utilities.
 *
 * Provides runtime environment information and flags for
 * detecting development vs production mode.
 *
 * @author Nate Meyer <hi@n8.engineer>
 * @module lib/runtime
 */

const nodeEnv = process.env.NODE_ENV;

export default {
  nodeEnv,
  isDevelopment: nodeEnv === 'development',
  isProduction: nodeEnv === 'production',
};
