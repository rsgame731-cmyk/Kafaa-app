export type Language = 'en' | 'fr' | 'ar';

export type NavTab = 
  | 'welcome'
  | 'onboarding'
  | 'home'
  | 'discover'
  | 'jobs'
  | 'network'
  | 'create'
  | 'messages'
  | 'services'
  | 'learn'
  | 'profile'
  | 'career_state'
  | 'company'
  | 'freelancer'
  | 'career_ai'
  | 'search'
  | 'notifications'
  | 'settings'
  | 'admin';

export interface Wilaya {
  code: number;
  nameEn: string;
  nameAr: string;
  nameFr: string;
}

export interface UserProfile {
  id: string;
  name: string;
  headline: string;
  title: string;
  wilaya: string;
  city: string;
  country: string;
  avatar: string;
  banner?: string;
  verified: boolean;
  role: 'Professional' | 'Student' | 'Job Seeker' | 'Freelancer' | 'Entrepreneur';
  bio: string;
  connectionsCount: number;
  followersCount: number;
  profileViews: number;
  profileCompletion: number; // e.g. 68
  experiences: Experience[];
  education: Education[];
  skills: string[];
  servicesOffered?: string[];
  projects?: Project[];
  recommendationsCount: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  logo?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  link?: string;
}

export interface Job {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  wilaya: string;
  worktype: 'Onsite' | 'Hybrid' | 'Remote';
  contractType: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  salaryMinDZD: number;
  salaryMaxDZD: number;
  tags: string[];
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  description: string;
  requirements: string[];
  postedAt: string;
  applicantsCount: number;
  verifiedCompany: boolean;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  wilaya: string;
  verified: boolean;
  employeesCount: string;
  about: string;
  website: string;
  jobsCount: number;
}

export interface CommentItem {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorTitle: string;
  authorAvatar: string;
  authorVerified?: boolean;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorTitle: string;
  authorAvatar: string;
  authorWilaya: string;
  authorVerified: boolean;
  content: string;
  image?: string;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  postedAt: string;
  isLiked?: boolean;
  isSaved?: boolean;
  commentsList?: CommentItem[];
}

export interface Service {
  id: string;
  title: string;
  providerName: string;
  providerAvatar: string;
  providerRole: string;
  wilaya: string;
  category: string;
  startingPriceDZD: number;
  rating: number;
  reviewsCount: number;
  deliveryDays: number;
  thumbnail: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  instructorName: string;
  instructorRole: string;
  duration: string;
  lessonsCount: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  enrolledCount: number;
  progressPercent?: number;
  certificateProvided: boolean;
}

export interface MessageConversation {
  id: string;
  participantName: string;
  participantRole: string;
  participantAvatar: string;
  participantCompany?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  time: string;
  isMe: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'view' | 'connection' | 'job_match' | 'application' | 'message';
  title: string;
  subtitle: string;
  time: string;
  read: boolean;
  avatar?: string;
}
