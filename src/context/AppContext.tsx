import React, { createContext, useContext, useState, useEffect } from 'react';
import { NavTab, Job, Post, Service, UserProfile, NotificationItem, CommentItem } from '../types';
import { CURRENT_USER, MOCK_POSTS_EN, MOCK_POSTS_AR, MOCK_NOTIFICATIONS } from '../data/algerianData';
import { useLanguage } from '../context/LanguageContext';
import { authApi } from '../api/auth.api';
import { jobsApi } from '../api/jobs.api';
import { postsApi } from '../api/posts.api';
import { Toast, ToastMessage } from '../components/Toast';

const INITIAL_COMMENTS: Record<string, CommentItem[]> = {
  post_1: [
    {
      id: 'c_101',
      postId: 'post_1',
      authorId: 'usr_2',
      authorName: 'Yassine Brahimi',
      authorTitle: 'Senior Cloud Architect @ Sonatrach',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      authorVerified: true,
      content: 'Mabrouk! Great initiative for Algerian software engineers. Looking forward to integrating this across regional teams.',
      createdAt: '2h ago'
    },
    {
      id: 'c_102',
      postId: 'post_1',
      authorId: 'usr_3',
      authorName: 'Meriem Saidi',
      authorTitle: 'Tech Recruiter @ Yassir',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      authorVerified: false,
      content: 'Excellent post. We are hiring senior React and Node.js engineers in Algiers and Oran. Reach out!',
      createdAt: '1h ago'
    }
  ],
  post_2: [
    {
      id: 'c_103',
      postId: 'post_2',
      authorId: 'usr_4',
      authorName: 'Karim Zerrouki',
      authorTitle: 'DevOps Lead @ Ooredoo Algeria',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      authorVerified: true,
      content: 'Congratulations on this milestone! Tech ecosystem in Algeria is growing rapidly.',
      createdAt: '3h ago'
    }
  ]
};

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isAuthenticated: boolean;
  isSplashActive: boolean;
  loginUser: (credentials: { email: string; password: string }) => Promise<void>;
  registerUser: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    wilaya: string;
    city: string;
    role: string;
  }) => Promise<void>;
  logoutUser: () => Promise<void>;
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
  commentsMap: Record<string, CommentItem[]>;
  getCommentsForPost: (postId: string) => CommentItem[];
  addCommentToPost: (postId: string, text: string) => Promise<void>;
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
  toast: ToastMessage | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  clearToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<NavTab>('welcome');
  const [user, setUser] = useState<UserProfile>(CURRENT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isSplashActive, setIsSplashActive] = useState<boolean>(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS_EN);
  const { language } = useLanguage();

  useEffect(() => {
    setPosts(language === 'ar' ? MOCK_POSTS_AR : MOCK_POSTS_EN);
  }, [language]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWilayaFilter, setSelectedWilayaFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deviceViewMode, setDeviceViewMode] = useState<'mobile' | 'responsive'>('responsive');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ id: `toast_${Date.now()}`, message, type });
  };

  const clearToast = () => {
    setToast(null);
  };

  // Protected navigation handler
  const setActiveTab = (tab: NavTab) => {
    const protectedTabs: NavTab[] = ['home', 'profile', 'messages', 'create', 'notifications', 'settings', 'admin'];
    if (!isAuthenticated && protectedTabs.includes(tab)) {
      showToast('Please sign in to access this section of Kafa\'a', 'info');
      setActiveTabState('welcome');
      return;
    }
    setActiveTabState(tab);
  };

  // Initialize App (Splash duration + session restoration + backend sync)
  useEffect(() => {
    let isMounted = true;
    const initApp = async () => {
      const startTime = Date.now();

      try {
        // Attempt session restoration via API client
        const storedToken = localStorage.getItem('kafaa_access_token');
        if (storedToken) {
          const userData = await authApi.getMe();
          if (userData && isMounted) {
            setIsAuthenticated(true);
            if (userData.profile) {
              setUser({
                ...CURRENT_USER,
                id: userData.id || CURRENT_USER.id,
                name: userData.profile.fullName || CURRENT_USER.name,
                headline: userData.profile.headline || CURRENT_USER.headline,
                wilaya: userData.profile.wilaya || CURRENT_USER.wilaya,
                city: userData.profile.city || CURRENT_USER.city,
                verified: userData.verified ?? CURRENT_USER.verified
              });
            }
            setActiveTabState('home');
          }
        }
      } catch (err) {
        // Token invalid or server offline -> fallback safely
        localStorage.removeItem('kafaa_access_token');
      }

      // Sync feed posts if backend available
      try {
        const livePosts = await postsApi.getFeed();
        if (livePosts && Array.isArray(livePosts.posts) && livePosts.posts.length > 0 && isMounted) {
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
      } catch {
        // Retain mock posts fallback
      }

      // Guarantee minimum splash screen duration (2.2 seconds) for smooth visual experience
      const elapsed = Date.now() - startTime;
      const minSplashTime = 2200;
      const remainingTime = Math.max(0, minSplashTime - elapsed);

      setTimeout(() => {
        if (isMounted) {
          setIsSplashActive(false);
        }
      }, remainingTime);
    };

    initApp();

    return () => {
      isMounted = false;
    };
  }, []);

  const loginUser = async (credentials: { email: string; password: string }) => {
    // No catch fallback: authentication errors must be surfaced to the user.
    // A failed login must NEVER grant access.
    const response = await authApi.login(credentials);
    setIsAuthenticated(true);
    if (response?.user?.profile) {
      setUser({
        ...CURRENT_USER,
        id: response.user.id,
        name: response.user.profile.fullName || CURRENT_USER.name,
        headline: response.user.profile.headline || CURRENT_USER.headline,
        wilaya: response.user.profile.wilaya || CURRENT_USER.wilaya,
        city: response.user.profile.city || CURRENT_USER.city,
        verified: response.user.verified ?? true
      });
    }
    showToast('Welcome back to Kafa\'a!', 'success');
    setActiveTabState('home');
  };

  const registerUser = async (payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    wilaya: string;
    city: string;
    role: string;
  }) => {
    // No catch fallback: registration errors must be surfaced to the user.
    // A failed registration must NEVER grant access.
    const fullName = `${payload.firstName} ${payload.lastName}`.trim();
    const response = await authApi.register({
      email: payload.email,
      password: payload.password,
      fullName,
      wilaya: payload.wilaya,
      city: payload.city,
      role: payload.role.toUpperCase().replace(/\s+/g, '_')
    });
    setIsAuthenticated(true);
    setUser({
      ...CURRENT_USER,
      id: response?.user?.id || `usr_${Date.now()}`,
      name: fullName,
      headline: `${payload.role} in ${payload.wilaya}`,
      wilaya: payload.wilaya,
      city: payload.city,
      verified: false
    });
    showToast('Account created successfully!', 'success');
    setActiveTabState('home');
  };

  const logoutUser = async () => {
    try {
      await authApi.logout();
    } catch {
      // Clear token locally
      localStorage.removeItem('kafaa_access_token');
    } finally {
      setIsAuthenticated(false);
      showToast('Logged out of Kafa\'a', 'info');
      setActiveTabState('welcome');
    }
  };

  const addPost = async (newPost: Post) => {
    setPosts([newPost, ...posts]);
    showToast('Post published to Kafa\'a community!', 'success');
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
        const isSaved = !p.isSaved;
        showToast(isSaved ? 'Post saved to bookmarks' : 'Post removed from saved', 'info');
        return { ...p, isSaved };
      }
      return p;
    }));
  };

  const toggleSaveJob = (jobId: string) => {
    if (savedJobIds.includes(jobId)) {
      setSavedJobIds(savedJobIds.filter(id => id !== jobId));
      showToast('Job removed from saved list', 'info');
    } else {
      setSavedJobIds([...savedJobIds, jobId]);
      showToast('Job saved to your bookmarks', 'success');
    }
  };

  const applyToJob = async (jobId: string) => {
    if (!appliedJobIds.includes(jobId)) {
      setAppliedJobIds([...appliedJobIds, jobId]);
      showToast('Application submitted successfully!', 'success');
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

  const [commentsMap, setCommentsMap] = useState<Record<string, CommentItem[]>>(INITIAL_COMMENTS);

  const getCommentsForPost = (postId: string): CommentItem[] => {
    return commentsMap[postId] || [];
  };

  const addCommentToPost = async (postId: string, text: string) => {
    const newComment: CommentItem = {
      id: `c_${Date.now()}`,
      postId,
      authorId: user.id,
      authorName: user.name,
      authorTitle: user.headline,
      authorAvatar: user.avatar,
      authorVerified: user.verified,
      content: text,
      createdAt: 'Just now'
    };

    setCommentsMap(prev => ({
      ...prev,
      [postId]: [newComment, ...(prev[postId] || [])]
    }));

    // Update comments count on post
    setPosts(prevPosts =>
      prevPosts.map(p => (p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
    );

    showToast('Comment posted successfully!', 'success');

    try {
      await postsApi.addComment(postId, text);
    } catch {
      // Local optimistic state retained safely
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        user,
        setUser,
        isAuthenticated,
        isSplashActive,
        loginUser,
        registerUser,
        logoutUser,
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
        commentsMap,
        getCommentsForPost,
        addCommentToPost,
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
        setDeviceViewMode,
        toast,
        showToast,
        clearToast
      }}
    >
      {children}
      <Toast toast={toast} onClose={clearToast} />
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

