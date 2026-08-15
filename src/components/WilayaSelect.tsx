import React from 'react';
import { WILAYAS_LIST } from '../data/algerianData';
import { useLanguage } from '../context/LanguageContext';

interface WilayaSelectProps {
  value: string;
  onChange: (wilayaName: string) => void;
  label?: string;
  includeAll?: boolean;
}

export const WilayaSelect: React.FC<WilayaSelectProps> = ({
  value,
  onChange,
  label = "Wilaya",
  includeAll = false
}) => {
  const { language } = useLanguage();

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-medium uppercase tracking-wider text-brand-muted">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-brand-surface border border-brand-border text-brand-cream text-sm rounded-input py-3 px-4 focus:outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze transition-colors cursor-pointer"
      >
        {includeAll && <option value="All">All 58 Wilayas (الكل)</option>}
        {WILAYAS_LIST.map((w) => {
          const displayName = language === 'ar' ? `${w.code}. ${w.nameAr}` : language === 'fr' ? `${w.code}. ${w.nameFr}` : `${w.code}. ${w.nameEn}`;
          return (
            <option key={w.code} value={w.nameEn}>
              {displayName}
            </option>
          );
        })}
      </select>
    </div>
  );
};
