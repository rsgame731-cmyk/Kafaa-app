// Production API Client with Automatic Authorization & Token Refresh
const env = (import.meta as any).env || {};

function resolveApiBaseUrl(): string {
  const customUrl = env.VITE_API_URL?.trim();
  if (customUrl) {
    const clean = customUrl.replace(/\/+$/, '');
    return clean.endsWith('/api') ? clean : `${clean}/api`;
  }

  if (typeof window !== 'undefined') {
    const { hostname, port } = window.location;
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:4000/api';
    }
  }

  return '/api';
}

const API_BASE_URL = resolveApiBaseUrl();

class ApiClient {
  private accessToken: string | null = null;

  public setAccessToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      localStorage.setItem('kafaa_access_token', token);
    } else {
      localStorage.removeItem('kafaa_access_token');
    }
  }

  public getAccessToken(): string | null {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('kafaa_access_token');
    }
    return this.accessToken;
  }

  public async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAccessToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>)
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include'
      });

      if (response.status === 401 && endpoint !== '/auth/login' && endpoint !== '/auth/refresh') {
        // Attempt Token Refresh
        const refreshSuccess = await this.refreshToken();
        if (refreshSuccess) {
          // Retry original request with new token
          headers['Authorization'] = `Bearer ${this.getAccessToken()}`;
          const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: 'include'
          });
          const retryData = await retryResponse.json();
          return retryData.data || retryData;
        }
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data.data || data;
    } catch (error: any) {
      console.warn(`[ApiClient Network Fallback] Server request to ${endpoint} failed:`, error);
      if (error?.message === 'Failed to fetch' || error?.name === 'TypeError') {
        throw new Error('Unable to connect to backend server. Please verify backend URL and CORS settings.');
      }
      throw error;
    }
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok && data.data?.accessToken) {
        this.setAccessToken(data.data.accessToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

export const apiClient = new ApiClient();
