import React, { useEffect } from 'react';
import { Card } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Bell, Eye, Briefcase, UserCheck, CheckCircle2 } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationsAsRead } = useApp();
  const { t } = useLanguage();

  useEffect(() => {
    markNotificationsAsRead();
  }, []);

  return (
    <div className="py-6 px-4 max-w-md mx-auto space-y-5 animate-fade-in pb-28">
      {/* Title */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-brand-cream">
          {t('notifications')}
        </h1>
        <p className="text-xs text-brand-muted">
          Stay updated on views, job matches & connections in Algeria.
        </p>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((n) => (
          <Card key={n.id} className="p-4 flex items-start gap-3.5 border-brand-border/80">
            {n.avatar ? (
              <Avatar src={n.avatar} alt="Notification Avatar" size="md" />
            ) : (
              <div className="p-2.5 rounded-full bg-brand-bronze/15 text-brand-bronze border border-brand-bronze/30 shrink-0">
                {n.type === 'job_match' ? <Briefcase className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              </div>
            )}
            <div className="space-y-0.5">
              <h3 className="text-xs sm:text-sm font-semibold text-brand-cream">{n.title}</h3>
              <p className="text-xs text-brand-muted">{n.subtitle}</p>
              <span className="text-[10px] text-brand-muted/70 block pt-0.5">{n.time}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
