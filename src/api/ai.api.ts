import { apiClient } from './client';

export const aiApi = {
  askCareerAdvisor: async (prompt: string) => {
    return apiClient.request('/ai/career-advisor', {
      method: 'POST',
      body: JSON.stringify({ prompt })
    });
  }
};
