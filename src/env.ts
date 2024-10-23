// src/utils/env.ts
export const getApiUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    throw new Error('VITE_API_URL is not defined in the environment variables');
  }
  return apiUrl;
};
