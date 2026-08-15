import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { MOCK_CONVERSATIONS } from '../data/algerianData';
import { useLanguage } from '../context/LanguageContext';
import { MessageConversation, ChatMessage } from '../types';
import { Send, ArrowLeft, CheckCheck } from 'lucide-react';

export const MessagesView: React.FC = () => {
  const { t } = useLanguage();
  const [conversations, setConversations] = useState<MessageConversation[]>(MOCK_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');

  const activeConv = conversations.find(c => c.id === activeConvId);

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeConvId) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'me',
      text: inputText,
      time: 'Just now',
      isMe: true
    };

    setConversations(conversations.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          lastMessage: inputText,
          lastMessageTime: 'Just now',
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));

    setInputText('');
  };

  return (
    <div className="py-6 px-4 max-w-md mx-auto space-y-5 animate-fade-in pb-28">
      {/* Title */}
      {!activeConv && (
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-brand-cream">
            {t('messages')}
          </h1>
          <p className="text-xs text-brand-muted">
            Direct messages with recruiters & Algerian leaders.
          </p>
        </div>
      )}

      {/* CONVERSATION LIST VIEW */}
      {!activeConv ? (
        <div className="space-y-3">
          {conversations.map((conv) => (
            <Card
              key={conv.id}
              hoverable
              onClick={() => setActiveConvId(conv.id)}
              className="p-4 flex items-center justify-between border-brand-border/80"
            >
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <Avatar src={conv.participantAvatar} alt={conv.participantName} size="md" />
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-brand-bronze text-brand-dark font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-brand-dark">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-brand-cream">{conv.participantName}</h3>
                    <span className="text-[10px] text-brand-muted">{conv.lastMessageTime}</span>
                  </div>
                  <p className="text-[11px] text-brand-bronze font-medium">{conv.participantRole}</p>
                  <p className="text-xs text-brand-muted/90 line-clamp-1 mt-0.5">{conv.lastMessage}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* CHAT DETAIL VIEW */
        <div className="space-y-4">
          {/* Active Chat Header */}
          <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
            <button
              onClick={() => setActiveConvId(null)}
              className="flex items-center gap-1.5 text-xs text-brand-muted hover:text-brand-cream"
            >
              <ArrowLeft className="w-4 h-4 rtl-flip" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2.5">
              <Avatar src={activeConv.participantAvatar} alt={activeConv.participantName} size="sm" />
              <div>
                <h3 className="text-xs font-semibold text-brand-cream">{activeConv.participantName}</h3>
                <span className="text-[10px] text-brand-bronze">{activeConv.participantRole}</span>
              </div>
            </div>

            <div className="w-10" />
          </div>

          {/* Messages Stream */}
          <div className="space-y-3 min-h-[350px] max-h-[450px] overflow-y-auto p-2">
            {activeConv.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-card p-3.5 text-xs leading-relaxed ${
                    msg.isMe
                      ? 'bg-brand-bronze text-brand-cream rounded-tr-none'
                      : 'bg-brand-surface text-brand-cream border border-brand-border rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-brand-muted/70 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Message Input Box */}
          <div className="flex items-center gap-2 pt-2 border-t border-brand-border/60">
            <Input
              placeholder="Write message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button variant="primary" size="md" onClick={handleSendMessage}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
