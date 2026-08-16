import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { CommentDrawer } from '../components/CommentDrawer';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Post } from '../types';
import { Heart, MessageSquare, Repeat2, Bookmark, Share2, Sparkles, PlusCircle } from 'lucide-react';

export const HomeFeedView: React.FC = () => {
  const {
    user,
    posts,
    toggleLikePost,
    toggleSavePost,
    setIsCreateModalOpen,
    setActiveTab,
    showToast,
    getCommentsForPost,
    addCommentToPost
  } = useApp();
  const { t } = useLanguage();

  const [activeCommentPost, setActiveCommentPost] = useState<Post | null>(null);
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);

  const handleCreateClick = () => {
    setActiveTab('create');
    setIsCreateModalOpen(false);
  };

  const handleOpenComments = (post: Post) => {
    setActiveCommentPost(post);
    setIsCommentDrawerOpen(true);
  };

  return (
    <div className="py-6 px-4 max-w-md mx-auto space-y-5 animate-view-transition pb-24">
      {/* Top Greeting & Status Pill */}
      <Card className="flex items-center justify-between p-4 bg-brand-surface border-brand-border">
        <div className="flex items-center gap-3">
          <div className="cursor-pointer btn-press" onClick={() => setActiveTab('profile')}>
            <Avatar src={user.avatar} alt={user.name} verified={user.verified} size="md" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-brand-cream">
              {t('good_evening')}, {user.name.split(' ')[0]} 👋
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs text-brand-muted font-medium">
                {t('looking_for_opps')}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleCreateClick}
          className="p-2.5 rounded-full bg-brand-bronze/10 text-brand-bronze border border-brand-bronze/30 hover:bg-brand-bronze/20 transition-all btn-press shadow-bronze-glow"
          title="Create Post"
        >
          <PlusCircle className="w-5 h-5" />
        </button>
      </Card>

      {/* Quick Career State Progress Banner */}
      <Card
        hoverable
        onClick={() => setActiveTab('career_state')}
        className="bg-brand-elevated border-brand-bronze/30 p-3.5 flex items-center justify-between cursor-pointer btn-press"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-bronze/15 text-brand-bronze flex items-center justify-center font-bold text-xs shadow-bronze-glow">
            {user.profileCompletion}%
          </div>
          <div>
            <span className="text-xs font-semibold text-brand-cream">Profile Strength</span>
            <p className="text-[11px] text-brand-muted">Complete details to rank higher in recruiter searches</p>
          </div>
        </div>
        <span className="text-xs text-brand-bronze font-semibold">View</span>
      </Card>

      {/* Feed Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="p-5 space-y-3.5 border-brand-border/80 bronze-glow-hover">
            {/* Author Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  src={post.authorAvatar}
                  alt={post.authorName}
                  verified={post.authorVerified}
                  size="md"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-semibold text-brand-cream">{post.authorName}</h3>
                    <Badge variant="dark" className="text-[10px] py-0 px-1.5">{post.authorWilaya}</Badge>
                  </div>
                  <p className="text-xs text-brand-muted">{post.authorTitle}</p>
                  <span className="text-[10px] text-brand-muted/70">{post.postedAt}</span>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <p className="text-xs sm:text-sm text-brand-cream/90 leading-relaxed whitespace-pre-line">
              {post.content}
            </p>

            {/* Optional Image */}
            {post.image && (
              <div className="rounded-input overflow-hidden border border-brand-border/60 my-2">
                <img src={post.image} alt="Post Attachment" className="w-full h-auto object-cover max-h-60" />
              </div>
            )}

            {/* Interaction Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-brand-border/40 text-brand-muted text-xs">
              <button
                onClick={() => toggleLikePost(post.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-brand-elevated transition-colors btn-press ${
                  post.isLiked ? 'text-brand-bronze font-semibold' : ''
                }`}
              >
                <Heart className={`w-4 h-4 transition-all ${
                  post.isLiked ? 'fill-brand-bronze text-brand-bronze animate-heart-pop' : ''
                }`} />
                <span>{post.likesCount}</span>
              </button>

              <button
                onClick={() => handleOpenComments(post)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-brand-elevated hover:text-brand-cream transition-colors btn-press"
              >
                <MessageSquare className="w-4 h-4 text-brand-bronze" />
                <span className="font-medium text-brand-cream">{post.commentsCount}</span>
              </button>

              <button
                onClick={() => showToast('Post reposted to your network profile', 'success')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-brand-elevated hover:text-brand-cream transition-colors btn-press"
              >
                <Repeat2 className="w-4 h-4" />
                <span>{post.repostsCount}</span>
              </button>

              <button
                onClick={() => toggleSavePost(post.id)}
                className={`p-1.5 rounded-full hover:bg-brand-elevated transition-colors btn-press ${
                  post.isSaved ? 'text-brand-bronze' : ''
                }`}
              >
                <Bookmark className={`w-4 h-4 transition-transform ${post.isSaved ? 'fill-brand-bronze text-brand-bronze scale-110' : ''}`} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Comments Drawer Modal */}
      <CommentDrawer
        isOpen={isCommentDrawerOpen}
        onClose={() => setIsCommentDrawerOpen(false)}
        post={activeCommentPost}
        comments={activeCommentPost ? getCommentsForPost(activeCommentPost.id) : []}
        onAddComment={addCommentToPost}
      />
    </div>
  );
};


