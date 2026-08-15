import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Send, Bot, User, FileText, Briefcase, Award, Zap } from 'lucide-react';

interface AIMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

export const CareerAIView: React.FC = () => {
  const { user } = useApp();
  const { t } = useLanguage();

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "m_welcome",
      sender: "ai",
      text: `Salutations ${user.name}! I am Career AI, your dedicated executive advisor for the Algerian job market. How can I assist your career roadmap today?`
    }
  ]);
  const [inputText, setInputText] = useState('');

  const quickPrompts = [
    { label: "Analyze my CV", icon: <FileText className="w-3.5 h-3.5" /> },
    { label: "Prepare for interview", icon: <Award className="w-3.5 h-3.5" /> },
    { label: "Find skill gaps in Algiers", icon: <Zap className="w-3.5 h-3.5" /> },
    { label: "Find top jobs for me", icon: <Briefcase className="w-3.5 h-3.5" /> }
  ];

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: AIMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: promptText
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      let replyText = "";
      if (promptText.includes("CV")) {
        replyText = `I analyzed your profile as ${user.headline} based in ${user.wilaya}. Your technical stack (React, Node.js, PostgreSQL) is strong! Recommendation: Add certifications in Docker & Cloud Architecture to qualify for top-tier senior roles in Algiers paying 250,000+ DZD/month.`;
      } else if (promptText.includes("interview")) {
        replyText = `For technical interviews at Algerian companies like Yassir or Sonatrach: 1) Be prepared for system design questions on microservices. 2) Practice explaining architecture in English and French. 3) Showcase previous projects built for North African market scale.`;
      } else if (promptText.includes("skill gaps")) {
        replyText = `Current high-demand technical skills in Algeria: 1. Cloud Native Kubernetes. 2. AI fine-tuning for Arabic/Darja dialect. 3. FinTech compliance. You currently hold 68% match rate for senior roles!`;
      } else {
        replyText = `Based on your Wilaya (${user.wilaya}) and background, I matched 3 senior positions offering 180,000 – 260,000 DZD/month. Would you like me to submit your application draft?`;
      }

      setMessages(prev => [...prev, {
        id: `ai_${Date.now()}`,
        sender: "ai",
        text: replyText
      }]);
    }, 800);
  };

  return (
    <div className="py-6 px-4 max-w-md mx-auto space-y-4 animate-fade-in pb-28 min-h-[85vh] flex flex-col justify-between">
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-bronze/15 border border-brand-bronze/40 text-brand-bronze text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Career AI Advisor</span>
          </div>
          <h1 className="text-xl font-bold text-brand-cream pt-1">
            Algerian Career Intelligence
          </h1>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="grid grid-cols-2 gap-2">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(p.label)}
              className="flex items-center gap-2 p-2.5 rounded-card bg-brand-surface border border-brand-border/80 hover:border-brand-bronze/50 text-xs text-brand-cream text-left rtl:text-right transition-all group"
            >
              <div className="p-1.5 rounded-full bg-brand-dark text-brand-bronze group-hover:bg-brand-bronze group-hover:text-brand-cream transition-colors">
                {p.icon}
              </div>
              <span className="font-medium text-[11px]">{p.label}</span>
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div className="space-y-3 max-h-[380px] overflow-y-auto p-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`p-2 rounded-full shrink-0 ${m.sender === 'ai' ? 'bg-brand-bronze/20 text-brand-bronze border border-brand-bronze/40' : 'bg-brand-elevated text-brand-cream border border-brand-border'}`}>
                {m.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <Card
                className={`p-3.5 max-w-[85%] text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-brand-bronze text-brand-cream border-brand-bronze/60'
                    : 'bg-brand-surface text-brand-cream/90 border-brand-border/80'
                }`}
              >
                {m.text}
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="flex items-center gap-2 pt-2 border-t border-brand-border/60">
        <Input
          placeholder="Ask Career AI anything about jobs, CVs, salaries in Algeria..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt(inputText)}
        />
        <Button variant="primary" size="md" onClick={() => handleSendPrompt(inputText)}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
