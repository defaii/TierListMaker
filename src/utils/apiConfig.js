/**
 * Centralized API URL configuration
 * Resolves the API URL based on environment variables or defaults to localhost:5000 in development
 */
export const getApiUrl = () => {
  return process.env.REACT_APP_API_URL ||
    (typeof window !== 'undefined' &&
     window.location.hostname === 'localhost' &&
     window.location.port === '3000'
      ? 'http://localhost:5000'
      : '')
}
