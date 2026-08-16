import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { useApp } from '../context/AppContext';
import { FileText, FolderPlus, Trophy, Briefcase, Wrench, Calendar, Image, ArrowLeft } from 'lucide-react';

export const CreateView: React.FC = () => {
  const { user, addPost, setActiveTab, isCreateModalOpen, setIsCreateModalOpen, showToast } = useApp();
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

    if (selectedType === 'Post' || selectedType === 'Project' || selectedType === 'Achievement') {
      addPost({
        id: `post_${Date.now()}`,
        authorId: user.id,
        authorName: user.name,
        authorTitle: user.headline,
        authorAvatar: user.avatar,
        authorWilaya: user.wilaya,
        authorVerified: user.verified,
        content: `[${selectedType.toUpperCase()}] ${postContent}`,
        image: postImage || undefined,
        likesCount: 1,
        commentsCount: 0,
        repostsCount: 0,
        postedAt: 'Just now',
        isLiked: true
      });
    } else {
      showToast(`${selectedType} listing published to Kafa'a marketplace`, 'success');
    }

    setPostContent('');
    setPostImage('');
    setIsCreateModalOpen(false);
    setActiveTab('home');
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    // Explicitly stays on CreateView grid selection screen
  };

  return (
    <div className="py-6 px-4 max-w-md mx-auto space-y-5 animate-view-transition pb-28">
      {/* Title */}
      <div className="text-center space-y-1">
        <div className="w-10 h-10 rounded-2xl bg-brand-surface border border-brand-bronze/40 flex items-center justify-center text-brand-bronze mx-auto mb-2 shadow-bronze-glow">
          ✦
        </div>
        <h1 className="text-2xl font-bold text-brand-cream">
          Create
        </h1>
        <p className="text-xs text-brand-muted max-w-xs mx-auto">
          What would you like to share or create today?
        </p>
      </div>

      {/* Options Grid (Selection Screen) */}
      <div className="grid grid-cols-2 gap-3">
        {createTypes.map((item) => (
          <Card
            key={item.id}
            hoverable
            onClick={() => {
              setSelectedType(item.id);
              setIsCreateModalOpen(true);
            }}
            className="p-4 flex flex-col justify-between space-y-3 border-brand-border/80 hover:border-brand-bronze/60 cursor-pointer btn-press bronze-glow-hover"
          >
            <div className="p-2.5 rounded-card bg-brand-dark border border-brand-border w-fit shadow-inner">
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
        onClose={handleCloseModal}
        title={`Publish ${selectedType}`}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border border-brand-border" />
            <div>
              <h4 className="text-xs font-semibold text-brand-cream">{user.name}</h4>
              <span className="text-[10px] text-brand-bronze font-medium">Posting to Algerian Professional Network</span>
            </div>
          </div>

          <textarea
            rows={5}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder={
              selectedType === 'Service'
                ? "Describe the consulting or freelance service you offer in DZD..."
                : selectedType === 'Job'
                ? "Describe the role, requirements, and Wilaya location..."
                : "Write your professional post, insight or announcement..."
            }
            className="w-full bg-brand-surface border border-brand-border text-brand-cream placeholder-brand-muted text-xs sm:text-sm rounded-input p-3.5 focus:outline-none focus:border-brand-bronze resize-none"
          />

          <Input
            label="Media Image URL (Optional)"
            placeholder="https://..."
            icon={<Image className="w-4 h-4" />}
            value={postImage}
            onChange={(e) => setPostImage(e.target.value)}
          />

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-3 bg-brand-surface hover:bg-brand-elevated border border-brand-border text-brand-muted hover:text-brand-cream rounded-button text-xs font-medium transition-colors flex items-center gap-1 btn-press"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handlePublish}
              disabled={!postContent.trim()}
            >
              Publish {selectedType}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

