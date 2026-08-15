import React, { createContext, useContext, useState, useEffect } from 'react';
import { NavTab, Job, Post, Service, UserProfile, NotificationItem } from '../types';
import { CURRENT_USER, MOCK_JOBS, MOCK_POSTS, MOCK_NOTIFICATIONS } from '../data/algerianData';
import { authApi } from '../api/auth.api';
import { jobsApi } from '../api/jobs.api';
import { postsApi } from '../api/posts.api';

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  selectedJob: Job | null;
  setSelectedJob: (job: Job | null) => void;
  selectedCompanyId: string | null;
  setSelectedCompanyId: (id: string | null) => void;
  selectedServiceId: string | null;
  setSelectedServiceId: (id: string | null) => void;
  posts: Post[];
  addPost: (post: Post) => void;
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  savedJobIds: string[];
  toggleSaveJob: (jobId: string) => void;
  appliedJobIds: string[];
  applyToJob: (jobId: string) => void;
  notifications: NotificationItem[];
  markNotificationsAsRead: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedWilayaFilter: string;
  setSelectedWilayaFilter: (wilaya: string) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  deviceViewMode: 'mobile' | 'responsive';
  setDeviceViewMode: (mode: 'mobile' | 'responsive') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('welcome');
  const [user, setUser] = useState<UserProfile>(CURRENT_USER);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWilayaFilter, setSelectedWilayaFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deviceViewMode, setDeviceViewMode] = useState<'mobile' | 'responsive'>('responsive');

  // Sync with live backend API on mount if available
  useEffect(() => {
    async function syncBackend() {
      try {
        const livePosts = await postsApi.getFeed();
        if (livePosts && Array.isArray(livePosts.posts) && livePosts.posts.length > 0) {
          const formattedPosts = livePosts.posts.map((p: any) => ({
            id: p.id,
            authorId: p.authorId,
            authorName: p.author?.profile?.fullName || 'Algerian Member',
            authorTitle: p.author?.profile?.headline || 'Professional',
            authorAvatar: p.author?.profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            authorWilaya: p.wilaya || 'Algiers',
            authorVerified: p.author?.verified || false,
            content: p.content,
            image: p.imageUrl || undefined,
            likesCount: p._count?.reactions || 0,
            commentsCount: p._count?.comments || 0,
            repostsCount: 0,
            postedAt: 'Live',
            isLiked: false
          }));
          setPosts(formattedPosts);
        }
      } catch (err) {
        // Fallback to local state if server offline
      }
    }

    syncBackend();
  }, []);

  const addPost = async (newPost: Post) => {
    setPosts([newPost, ...posts]);
    try {
      await postsApi.createPost({
        content: newPost.content,
        imageUrl: newPost.image,
        wilaya: newPost.authorWilaya
      });
    } catch {
      // Local state retained
    }
  };

  const toggleLikePost = async (postId: string) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1
        };
      }
      return p;
    }));

    try {
      await postsApi.toggleLike(postId);
    } catch {
      // Retain optimistic UI
    }
  };

  const toggleSavePost = (postId: string) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return { ...p, isSaved: !p.isSaved };
      }
      return p;
    }));
  };

  const toggleSaveJob = (jobId: string) => {
    if (savedJobIds.includes(jobId)) {
      setSavedJobIds(savedJobIds.filter(id => id !== jobId));
    } else {
      setSavedJobIds([...savedJobIds, jobId]);
    }
  };

  const applyToJob = async (jobId: string) => {
    if (!appliedJobIds.includes(jobId)) {
      setAppliedJobIds([...appliedJobIds, jobId]);
    }
    try {
      await jobsApi.applyToJob(jobId);
    } catch {
      // Retain optimistic state
    }
  };

  const markNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        user,
        setUser,
        selectedJob,
        setSelectedJob,
        selectedCompanyId,
        setSelectedCompanyId,
        selectedServiceId,
        setSelectedServiceId,
        posts,
        addPost,
        toggleLikePost,
        toggleSavePost,
        savedJobIds,
        toggleSaveJob,
        appliedJobIds,
        applyToJob,
        notifications,
        markNotificationsAsRead,
        searchQuery,
        setSearchQuery,
        selectedWilayaFilter,
        setSelectedWilayaFilter,
        isCreateModalOpen,
        setIsCreateModalOpen,
        deviceViewMode,
        setDeviceViewMode
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
