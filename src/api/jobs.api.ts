import { apiClient } from './client';

export const jobsApi = {
  getJobs: async (wilaya?: string, worktype?: string) => {
    const params = new URLSearchParams();
    if (wilaya && wilaya !== 'All') params.append('wilaya', wilaya);
    if (worktype && worktype !== 'All') params.append('worktype', worktype);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.request(`/jobs${query}`);
  },

  getJobById: async (id: string) => {
    return apiClient.request(`/jobs/${id}`);
  },

  applyToJob: async (id: string) => {
    return apiClient.request(`/jobs/${id}/apply`, {
      method: 'POST'
    });
  }
};
