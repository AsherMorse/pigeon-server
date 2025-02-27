export const API_VERSIONS = {
  V1: 'v1',
} as const;

export const getVersionedPath = (
  version: (typeof API_VERSIONS)[keyof typeof API_VERSIONS],
  endpoint: string,
): string => {
  return `/${version}/${endpoint}`;
};

export const CURRENT_API_VERSION = API_VERSIONS.V1;
