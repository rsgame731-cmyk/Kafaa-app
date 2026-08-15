import { apiClient } from './client';

export const postsApi = {
  getFeed: async (cursor?: string) => {
    const query = cursor ? `?cursor=${cursor}` : '';
    return apiClient.request(`/posts/feed${query}`);
  },

  createPost: async (payload: { content: string; imageUrl?: string; wilaya?: string }) => {
    return apiClient.request('/posts', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  toggleLike: async (postId: string) => {
    return apiClient.request(`/posts/${postId}/like`, {
      method: 'POST'
    });
  }
};
