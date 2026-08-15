import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { useLanguage } from '../context/LanguageContext';
import { UserPlus, Check, MapPin, Users } from 'lucide-react';

interface TalentCard {
  id: string;
  name: string;
  role: string;
  wilaya: string;
  avatar: string;
  mutualConnections: number;
  verified: boolean;
}

export const NetworkView: React.FC = () => {
  const { t } = useLanguage();
  const [connectedIds, setConnectedIds] = useState<string[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([]);

  const talents: TalentCard[] = [
    {
      id: "tal_1",
      name: "Sara Benmoussa",
      role: "Lead UI/UX Architect @ TechDz",
      wilaya: "Oran",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      mutualConnections: 12,
      verified: true
    },
    {
      id: "tal_2",
      name: "Karim Brahimi",
      role: "AI Research Scientist @ CDTA",
      wilaya: "Algiers",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      mutualConnections: 24,
      verified: true
    },
    {
      id: "tal_3",
      name: "Yassine Kasmi",
      role: "Founder @ DzStartups Hub",
      wilaya: "Constantine",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      mutualConnections: 8,
      verified: false
    },
    {
      id: "tal_4",
      name: "Amel Khelifi",
      role: "Senior Cloud & DevOps Engineer",
      wilaya: "Sétif",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      mutualConnections: 19,
      verified: true
    }
  ];

  const handleToggleConnect = (id: string) => {
    if (connectedIds.includes(id)) {
      setConnectedIds(connectedIds.filter(i => i !== id));
    } else {
      setConnectedIds([...connectedIds, id]);
    }
  };

  return (
    <div className="py-6 px-4 max-w-md mx-auto space-y-5 animate-fade-in pb-28">
      {/* Title */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-brand-cream">
          {t('network')}
        </h1>
        <p className="text-xs text-brand-muted">
          People worth knowing in Algeria.
        </p>
      </div>

      {/* Talent Cards Grid */}
      <div className="space-y-3.5">
        {talents.map((talent) => {
          const isConnected = connectedIds.includes(talent.id);
          return (
            <Card key={talent.id} className="p-5 border-brand-border/80 flex flex-col justify-between space-y-3">
              <div className="flex items-start gap-3.5">
                <Avatar src={talent.avatar} alt={talent.name} verified={talent.verified} size="lg" />
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-semibold text-brand-cream">{talent.name}</h3>
                    <Badge variant="dark" className="text-[10px] py-0 px-1.5">{talent.wilaya}</Badge>
                  </div>
                  <p className="text-xs text-brand-muted">{talent.role}</p>
                  <div className="flex items-center gap-1 text-[11px] text-brand-bronze pt-0.5">
                    <Users className="w-3 h-3" />
                    <span>{talent.mutualConnections} mutual connections in Algeria</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-brand-border/40">
                <Button
                  variant={isConnected ? "secondary" : "primary"}
                  size="sm"
                  fullWidth
                  onClick={() => handleToggleConnect(talent.id)}
                >
                  {isConnected ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Pending
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <UserPlus className="w-3.5 h-3.5" /> Connect
                    </span>
                  )}
                </Button>

                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
