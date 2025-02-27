/**
 * API version constants
 * Used for consistent API versioning across the application
 */

export const API_VERSIONS = {
  V1: 'v1',
} as const;

/**
 * Get the full API path for a specific version and endpoint
 * @param version The API version to use
 * @param endpoint The endpoint path (without leading slash)
 * @returns The complete API path
 */
export const getVersionedPath = (
  version: (typeof API_VERSIONS)[keyof typeof API_VERSIONS],
  endpoint: string
): string => {
  return `/${version}/${endpoint}`;
};

// Current API version to use by default
export const CURRENT_API_VERSION = API_VERSIONS.V1; 