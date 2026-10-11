import { apiClient, setAuthToken, removeAuthToken } from './apiClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const authService = {
  /**
   * Log in user and persist JWT token
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (response?.accessToken) {
      setAuthToken(response.accessToken);
    }
    return response;
  },

  /**
   * Register new user
   */
  async register(userData: RegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    if (response?.accessToken) {
      setAuthToken(response.accessToken);
    }
    return response;
  },

  /**
   * Get authenticated user profile
   */
  async getProfile(): Promise<any> {
    return await apiClient.get('/auth/me');
  },

  /**
   * Log out user and clear persisted tokens
   */
  logout(): void {
    removeAuthToken();
  },
};

export default authService;
