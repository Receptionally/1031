/**
 * Utility functions for environment-related operations
 */

/**
 * Checks if the application is running in development mode
 */
export function isDevelopment(): boolean {
  return import.meta.env.DEV;
}

/**
 * Checks if the application is running in production mode
 */
export function isProduction(): boolean {
  return import.meta.env.PROD;
}

/**
 * Gets the current environment name
 */
export function getEnvironment(): 'development' | 'production' {
  return isDevelopment() ? 'development' : 'production';
}

/**
 * Checks if a specific feature flag is enabled
 */
export function isFeatureEnabled(featureFlag: string): boolean {
  return import.meta.env[`VITE_FEATURE_${featureFlag.toUpperCase()}`] === 'true';
}

/**
 * Gets an environment variable with validation
 */
export function getEnvVar(key: string, required = true): string {
  const value = import.meta.env[key];
  if (!value && required) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || '';
}

/**
 * Safely gets an environment variable with a default value
 */
export function getEnvVarSafe(key: string, defaultValue: string): string {
  return import.meta.env[key] || defaultValue;
}