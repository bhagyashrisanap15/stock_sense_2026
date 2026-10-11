import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios';

// Storage key constant for the JWT access token
export const AUTH_TOKEN_KEY = 'stocksense_token';
export const AUTH_REFRESH_TOKEN_KEY = 'stocksense_refresh_token';

// Read API base URL from Vite environment or default to FastAPI endpoint
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * Custom Error interface representing FastAPI error responses
 */
export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]> | Array<{ loc: string[]; msg: string; type: string }>;
  timestamp?: string;
}

/**
 * Token management helpers
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  return Boolean(getAuthToken());
};

/**
 * Create base Axios instance configured for FastAPI / Node.js backend
 */
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for ML/TreeSHAP computation
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Client-Platform': 'StockSense-Web-v2.4',
  },
});

/**
 * REQUEST INTERCEPTOR:
 * Attaches JWT Bearer authentication token from localStorage to outgoing requests
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getAuthToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Optional trace ID for FastAPI request tracing
    if (config.headers && !config.headers['X-Request-ID']) {
      config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR:
 * Handles global error statuses (401 Unauthorized, 403, 422 FastAPI validation errors, 500)
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return pristine response
    return response;
  },
  (error: AxiosError<any>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (!error.response) {
      // Network error or backend offline
      const networkError: ApiErrorResponse = {
        message: 'Unable to connect to StockSense AI backend. Please verify FastAPI server is running.',
        statusCode: 0,
      };
      return Promise.reject(networkError);
    }

    const { status, data } = error.response;

    // Handle 401 Unauthorized (Expired / Invalid Token)
    if (status === 401) {
      removeAuthToken();

      // Dispatch custom window event so React UI can prompt re-login without hard reload
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('stocksense:auth-expired', { detail: { status } }));
      }
    }

    // Parse FastAPI / Pydantic 422 Unprocessable Entity error structure
    let formattedMessage = 'An unexpected error occurred.';
    if (data?.detail) {
      if (typeof data.detail === 'string') {
        formattedMessage = data.detail;
      } else if (Array.isArray(data.detail)) {
        // Pydantic validation error array: [{ loc: ['body', 'symbol'], msg: 'field required' }]
        formattedMessage = data.detail
          .map((errItem: any) => `${errItem.loc?.join('.') || 'field'}: ${errItem.msg}`)
          .join(', ');
      }
    } else if (data?.message) {
      formattedMessage = data.message;
    }

    const normalizedError: ApiErrorResponse = {
      message: formattedMessage,
      statusCode: status,
      errors: data?.errors || (Array.isArray(data?.detail) ? data.detail : undefined),
      timestamp: new Date().toISOString(),
    };

    return Promise.reject(normalizedError);
  }
);

/**
 * Base API Service wrapper with typed HTTP utility methods
 */
export const apiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.get<T, AxiosResponse<T>>(url, config).then((res) => res.data),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.post<T, AxiosResponse<T>>(url, data, config).then((res) => res.data),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.put<T, AxiosResponse<T>>(url, data, config).then((res) => res.data),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.patch<T, AxiosResponse<T>>(url, data, config).then((res) => res.data),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.delete<T, AxiosResponse<T>>(url, config).then((res) => res.data),

  // Direct access to underlying AxiosInstance if needed
  instance: axiosInstance,
};

export default apiClient;
