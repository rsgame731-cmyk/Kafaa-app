// Production API Client with Automatic Authorization & Token Refresh
const env = (import.meta as any).env || {};
const API_BASE_URL = env.VITE_API_URL ? `${env.VITE_API_URL}/api` : 'http://localhost:4000/api';

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
    } catch (error) {
      console.warn(`[ApiClient Network Fallback] Server request to ${endpoint} failed:`, error);
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
