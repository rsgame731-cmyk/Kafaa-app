import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { useApp } from '../context/AppContext';
import { FileText, FolderPlus, Trophy, Briefcase, Wrench, Calendar, Sparkles, Image } from 'lucide-react';

export const CreateView: React.FC = () => {
  const { user, addPost, setActiveTab, isCreateModalOpen, setIsCreateModalOpen } = useApp();
  const [selectedType, setSelectedType] = useState<string>('Post');
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState('');

  const createTypes = [
    { id: 'Post', title: 'Post', desc: 'Share an insight, career update or Darja tech thought', icon: <FileText className="w-5 h-5 text-brand-bronze" /> },
    { id: 'Project', title: 'Project Showcase', desc: 'Showcase your software, design or engineering work', icon: <FolderPlus className="w-5 h-5 text-brand-bronze" /> },
    { id: 'Achievement', title: 'Milestone / Award', desc: 'Celebrate a degree, certification or promotion', icon: <Trophy className="w-5 h-5 text-brand-bronze" /> },
    { id: 'Job', title: 'Job Opportunity', desc: 'Share an open position in your company', icon: <Briefcase className="w-5 h-5 text-brand-bronze" /> },
    { id: 'Service', title: 'Freelance Service', desc: 'Offer your consulting expertise in DZD', icon: <Wrench className="w-5 h-5 text-brand-bronze" /> },
    { id: 'Event', title: 'Professional Event', desc: 'Host a tech meet-up or workshop in Algeria', icon: <Calendar className="w-5 h-5 text-brand-bronze" /> }
  ];

  const handlePublish = () => {
    if (!postContent.trim()) return;

    addPost({
      id: `post_${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorTitle: user.headline,
      authorAvatar: user.avatar,
      authorWilaya: user.wilaya,
      authorVerified: user.verified,
      content: postContent,
      image: postImage || undefined,
      likesCount: 1,
      commentsCount: 0,
      repostsCount: 0,
      postedAt: 'Just now',
      isLiked: true
    });

    setPostContent('');
    setPostImage('');
    setIsCreateModalOpen(false);
    setActiveTab('home');
  };

  return (
    <div className="py-6 px-4 max-w-md mx-auto space-y-5 animate-fade-in pb-28">
      {/* Title */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-brand-cream">
          Create
        </h1>
        <p className="text-xs text-brand-muted">
          Share your professional journey with Algeria.
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-3">
        {createTypes.map((item) => (
          <Card
            key={item.id}
            hoverable
            onClick={() => {
              setSelectedType(item.id);
              setIsCreateModalOpen(true);
            }}
            className="p-4 flex flex-col justify-between space-y-3 border-brand-border/80 hover:border-brand-bronze/50"
          >
            <div className="p-2.5 rounded-card bg-brand-dark border border-brand-border w-fit">
              {item.icon}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-brand-cream">{item.title}</h3>
              <p className="text-[11px] text-brand-muted leading-tight mt-0.5">{item.desc}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* CREATE MODAL COMPOSER */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={`Publish ${selectedType}`}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border border-brand-border" />
            <div>
              <h4 className="text-xs font-semibold text-brand-cream">{user.name}</h4>
              <span className="text-[10px] text-brand-bronze font-medium">Posting to Algeria Community</span>
            </div>
          </div>

          <textarea
            rows={5}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Write your professional post or announcement..."
            className="w-full bg-brand-surface border border-brand-border text-brand-cream placeholder-brand-muted text-xs sm:text-sm rounded-input p-3.5 focus:outline-none focus:border-brand-bronze resize-none"
          />

          <Input
            label="Image URL (Optional)"
            placeholder="https://..."
            icon={<Image className="w-4 h-4" />}
            value={postImage}
            onChange={(e) => setPostImage(e.target.value)}
          />

          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handlePublish}
              disabled={!postContent.trim()}
            >
              Publish Post
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
