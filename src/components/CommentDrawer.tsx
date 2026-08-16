import React, { useState } from 'react';
import { Post, CommentItem } from '../types';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { X, Send, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CommentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  comments: CommentItem[];
  onAddComment: (postId: string, text: string) => Promise<void>;
}

export const CommentDrawer: React.FC<CommentDrawerProps> = ({
  isOpen,
  onClose,
  post,
  comments,
  onAddComment
}) => {
  const { user } = useApp();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !post) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    try {
      await onAddComment(post.id, trimmed);
      setCommentText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm animate-fade-scale">
      {/* Click Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-brand-dark border border-brand-border/80 rounded-t-[24px] sm:rounded-[24px] p-4 sm:p-5 shadow-elevated flex flex-col max-h-[85vh] z-10 animate-view-transition">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-border/60 pb-3 mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-bronze" />
            <h3 className="text-sm font-semibold text-brand-cream">
              Comments ({comments.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-brand-muted hover:text-brand-cream hover:bg-brand-surface rounded-full transition-colors btn-press"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Post Snippet */}
        <div className="bg-brand-surface border border-brand-border/40 rounded-card p-3 mb-3 text-xs shrink-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Avatar src={post.authorAvatar} alt={post.authorName} size="sm" verified={post.authorVerified} />
            <div>
              <span className="font-semibold text-brand-cream block leading-tight">{post.authorName}</span>
              <span className="text-[10px] text-brand-muted">{post.postedAt}</span>
            </div>
          </div>
          <p className="text-brand-muted line-clamp-2 leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* Comments Feed */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 my-1 min-h-[160px]">
          {comments.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-brand-surface border border-brand-border/60 text-brand-muted flex items-center justify-center mx-auto">
                💬
              </div>
              <p className="text-xs text-brand-cream font-medium">No comments yet</p>
              <p className="text-[11px] text-brand-muted">Be the first Algerian professional to start the conversation.</p>
            </div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-2.5 p-3 rounded-card bg-brand-surface/60 border border-brand-border/40">
                <Avatar src={c.authorAvatar} alt={c.authorName} size="sm" verified={c.authorVerified} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-semibold text-brand-cream truncate">{c.authorName}</h4>
                    <span className="text-[10px] text-brand-muted shrink-0">{c.createdAt}</span>
                  </div>
                  <p className="text-[11px] text-brand-muted truncate mb-1">{c.authorTitle}</p>
                  <p className="text-xs text-brand-cream/90 whitespace-pre-line leading-relaxed">
                    {c.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Composer */}
        <form onSubmit={handleSubmit} className="pt-3 border-t border-brand-border/60 flex items-center gap-2 shrink-0">
          <Avatar src={user.avatar} alt={user.name} size="sm" />
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment to this post..."
            className="flex-1 bg-brand-surface border border-brand-border/80 rounded-full px-3.5 py-2 text-xs text-brand-cream placeholder-brand-muted focus:outline-none focus:border-brand-bronze transition-colors"
          />
          <button
            type="submit"
            disabled={!commentText.trim() || isSubmitting}
            className="p-2 bg-brand-bronze hover:bg-brand-bronze-hover disabled:opacity-40 disabled:cursor-not-allowed text-brand-cream rounded-full transition-all btn-press shadow-bronze-glow shrink-0"
            title="Send Comment"
          >
            {isSubmitting ? (
              <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
