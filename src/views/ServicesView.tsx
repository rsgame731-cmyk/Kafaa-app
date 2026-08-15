import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { MOCK_SERVICES } from '../data/algerianData';
import { useLanguage } from '../context/LanguageContext';
import { Service } from '../types';
import { Star, MapPin, Clock, Wrench, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ServicesView: React.FC = () => {
  const { t } = useLanguage();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isHired, setIsHired] = useState(false);

  const categories = ['All', 'Web Development', 'Design', 'Translation', 'Marketing', 'Architecture'];

  const filteredServices = MOCK_SERVICES.filter(s => 
    selectedCategory === 'All' || s.category === selectedCategory
  );

  return (
    <div className="py-6 px-4 max-w-md mx-auto space-y-5 animate-fade-in pb-28">
      {/* Title */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-brand-cream">
          {t('services')}
        </h1>
        <p className="text-xs text-brand-muted">
          Find & hire verified Algerian freelancers in DZD.
        </p>
      </div>

      {/* Categories Horizontal Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
              selectedCategory === cat
                ? 'bg-brand-bronze text-brand-cream border-brand-bronze'
                : 'bg-brand-surface text-brand-muted border-brand-border hover:text-brand-cream'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="space-y-4">
        {filteredServices.map((service) => (
          <Card
            key={service.id}
            hoverable
            onClick={() => {
              setSelectedService(service);
              setIsHired(false);
            }}
            className="p-0 overflow-hidden border-brand-border/80"
          >
            <div className="h-36 w-full relative">
              <img src={service.thumbnail} alt={service.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-transparent to-transparent" />
              <div className="absolute top-3 left-3 ltr:left-3 rtl:right-3">
                <Badge variant="dark">{service.category}</Badge>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <h3 className="text-sm font-semibold text-brand-cream">{service.title}</h3>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-brand-border/40">
                <div className="flex items-center gap-2">
                  <Avatar src={service.providerAvatar} alt={service.providerName} size="sm" />
                  <div>
                    <span className="font-semibold text-brand-cream block">{service.providerName}</span>
                    <span className="text-[10px] text-brand-muted">{service.wilaya}, Algeria</span>
                  </div>
                </div>

                <div className="text-right rtl:text-left">
                  <span className="text-[10px] text-brand-muted uppercase block">Starting from</span>
                  <span className="text-sm font-bold text-brand-bronze">
                    {service.startingPriceDZD.toLocaleString()} DZD
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{service.rating}</span>
                  <span className="text-brand-muted text-[10px]">({service.reviewsCount} reviews)</span>
                </div>
                <Button variant="outline" size="sm">
                  View Service
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* SERVICE DETAIL MODAL */}
      {selectedService && (
        <Modal
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          title="Service Proposal"
        >
          <div className="space-y-4 text-left rtl:text-right">
            <div className="flex items-center gap-3 pb-3 border-b border-brand-border/60">
              <Avatar src={selectedService.providerAvatar} alt={selectedService.providerName} size="lg" />
              <div>
                <h3 className="text-sm font-bold text-brand-cream">{selectedService.providerName}</h3>
                <p className="text-xs text-brand-bronze font-medium">{selectedService.providerRole}</p>
                <div className="flex items-center gap-1 text-xs text-brand-muted mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{selectedService.wilaya}, Algeria</span>
                </div>
              </div>
            </div>

            <h2 className="text-base font-semibold text-brand-cream">{selectedService.title}</h2>

            <Card className="bg-brand-surface p-3.5 flex justify-between items-center text-xs">
              <span className="text-brand-muted">Delivery Timeline</span>
              <span className="font-semibold text-brand-cream flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-bronze" /> {selectedService.deliveryDays} Days
              </span>
            </Card>

            <div className="text-right rtl:text-left py-2">
              <span className="text-xs text-brand-muted">Total Investment:</span>
              <p className="text-xl font-extrabold text-brand-bronze">
                {selectedService.startingPriceDZD.toLocaleString()} DZD
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => setIsHired(true)}
              >
                {isHired ? "Proposal Request Sent to Expert ✓" : "Hire Professional"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
