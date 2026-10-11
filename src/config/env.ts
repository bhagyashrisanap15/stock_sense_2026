/**
 * StockSense AI - Client-Side Environment Configuration
 * 
 * Safely accesses and types Vite client environment variables (VITE_*)
 */

export const env = {
  /**
   * Base API URL for Axios client requests
   * Default: http://localhost:8000/api/v1
   */
  API_BASE_URL:
    (import.meta.env?.VITE_API_BASE_URL as string) ||
    'http://localhost:8000/api/v1',

  /**
   * Root URL for Python FastAPI ML / SHAP microservice
   * Default: http://localhost:8000
   */
  FASTAPI_BACKEND_URL:
    (import.meta.env?.VITE_FASTAPI_BACKEND_URL as string) ||
    (import.meta.env?.VITE_API_BASE_URL ? (import.meta.env.VITE_API_BASE_URL as string).replace(/\/api\/v1\/?$/, '') : null) ||
    'http://localhost:8000',

  /**
   * App URL
   */
  APP_URL: (import.meta.env?.VITE_APP_URL as string) || '',

  /**
   * Development mode flag
   */
  IS_DEV: import.meta.env?.DEV ?? false,

  /**
   * Production mode flag
   */
  IS_PROD: import.meta.env?.PROD ?? false,
} as const;

export default env;
