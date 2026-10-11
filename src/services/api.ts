import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios';

// Backend URL configuration from environment variables with fallback
export const FASTAPI_BACKEND_URL: string =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FASTAPI_BACKEND_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  'http://localhost:8000';

// Storage keys for JWT access token
export const TOKEN_STORAGE_KEY = 'token';
export const ALT_TOKEN_STORAGE_KEY = 'stocksense_token';

/**
 * Helper to retrieve stored JWT token from localStorage
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(ALT_TOKEN_STORAGE_KEY);
};

/**
 * Helper to persist JWT token in localStorage
 */
export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(ALT_TOKEN_STORAGE_KEY, token);
};

/**
 * Helper to remove JWT token from localStorage
 */
export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(ALT_TOKEN_STORAGE_KEY);
};

/**
 * Create Axios instance connected to FASTAPI_BACKEND_URL
 */
const apiInstance: AxiosInstance = axios.create({
  baseURL: FASTAPI_BACKEND_URL,
  timeout: 30000, // 30 seconds for ML model inferencing and TreeSHAP calculations
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * REQUEST INTERCEPTOR:
 * Injects the JWT token from localStorage into the Authorization header for every request
 */
apiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getToken();

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR:
 * Handles responses and error handling for 401 Unauthorized and 500 Internal Server Error
 */
apiInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<any>) => {
    if (!error.response) {
      // Network error or server offline
      console.error('[API Network Error]: Unable to reach FastAPI backend at', FASTAPI_BACKEND_URL);
      return Promise.reject({
        status: 0,
        message: 'Network error: FastAPI server unreachable. Please verify backend is running.',
        originalError: error,
      });
    }

    const { status, data } = error.response;

    // 401 Unauthorized: Expired or invalid JWT token
    if (status === 401) {
      console.warn('[API 401 Unauthorized]: JWT token is invalid or expired. Clearing stored credentials.');
      removeToken();

      // Dispatch event to allow React components to handle redirect or show login modal
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('stocksense:unauthorized', {
            detail: {
              status: 401,
              message: data?.detail || 'Session expired. Please log in again.',
            },
          })
        );
      }

      return Promise.reject({
        status: 401,
        message: data?.detail || 'Unauthorized: Token is missing, invalid, or expired.',
        data,
      });
    }

    // 500 Internal Server Error: FastAPI unhandled exception
    if (status === 500) {
      console.error('[API 500 Server Error]: Internal server error in FastAPI service.', data);
      return Promise.reject({
        status: 500,
        message: data?.detail || 'Internal server error: The FastAPI service encountered an issue. Please try again later.',
        data,
      });
    }

    // Other status codes (e.g. 400, 403, 404, 422)
    return Promise.reject({
      status,
      message: data?.detail || data?.message || error.message || 'An error occurred during the API request.',
      data,
    });
  }
);

/**
 * Base API Service providing typed HTTP methods: get, post, put, delete
 */
export const api = {
  /**
   * HTTP GET method
   */
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiInstance.get<T>(url, config);
    return response.data;
  },

  /**
   * HTTP POST method
   */
  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiInstance.post<T>(url, data, config);
    return response.data;
  },

  /**
   * HTTP PUT method
   */
  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiInstance.put<T>(url, data, config);
    return response.data;
  },

  /**
   * HTTP DELETE method
   */
  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiInstance.delete<T>(url, config);
    return response.data;
  },

  /**
   * Raw AxiosInstance access for advanced use cases
   */
  instance: apiInstance,
};

export default api;
