import { apiClient } from './client';

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const data = await apiClient.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    if (data.accessToken) {
      apiClient.setAccessToken(data.accessToken);
    }
    return data;
  },

  register: async (payload: any) => {
    const data = await apiClient.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (data.accessToken) {
      apiClient.setAccessToken(data.accessToken);
    }
    return data;
  },

  logout: async () => {
    try {
      await apiClient.request('/auth/logout', { method: 'POST' });
    } finally {
      apiClient.setAccessToken(null);
    }
  },

  getMe: async () => {
    return apiClient.request('/auth/me');
  }
};
