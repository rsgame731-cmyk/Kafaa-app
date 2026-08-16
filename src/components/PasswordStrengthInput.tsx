import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Check, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PasswordStrengthInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export const evaluatePasswordStrength = (password: string) => {
  if (!password) {
    return { score: 0, label: '', color: 'bg-brand-border', suggestions: [] };
  }

  let score = 0;
  const suggestions: string[] = [];

  const hasMinLength = password.length >= 8;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isPredictable = /(1234|qwerty|password|1111|aaaa)/i.test(password);

  if (hasMinLength) score += 1;
  else suggestions.push('Use at least 8 characters');

  if (hasLower && hasUpper) score += 1;
  else if (!hasUpper) suggestions.push('Add an uppercase letter');

  if (hasNumber) score += 1;
  else suggestions.push('Add a number');

  if (hasSpecial) score += 1;
  else suggestions.push('Add a special character (e.g. !@#$)');

  if (!isPredictable && password.length >= 10) score += 1;

  let label = 'Very Weak';
  let color = 'bg-rose-500';

  if (score === 2) {
    label = 'Weak';
    color = 'bg-rose-400';
  } else if (score === 3) {
    label = 'Good';
    color = 'bg-amber-500';
  } else if (score === 4) {
    label = 'Strong';
    color = 'bg-emerald-400';
  } else if (score >= 5) {
    label = 'Very Strong';
    color = 'bg-emerald-500';
  }

  return {
    score,
    label,
    color,
    hasMinLength,
    hasLowerUpper: hasLower && hasUpper,
    hasNumber,
    hasSpecial,
    suggestions
  };
};

export const PasswordStrengthInput: React.FC<PasswordStrengthInputProps> = ({
  value,
  onChange,
  label = 'Password',
  placeholder = 'Create a secure password',
  required = true
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { isRTL } = useLanguage();

  const strength = evaluatePasswordStrength(value);

  const toggleVisibility = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPassword((prev) => !prev);
    // Retain focus on the input element seamlessly
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-medium text-brand-cream">
          {label} {required && <span className="text-brand-bronze">*</span>}
        </label>
      )}

      {/* Input Field with Show/Hide Toggle */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 ltr:left-3.5 rtl:right-3.5 text-brand-muted pointer-events-none z-10">
          <Lock className="w-4 h-4" />
        </div>
        <input
          ref={inputRef}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full bg-brand-surface border border-brand-border text-brand-cream placeholder-brand-muted text-xs sm:text-sm rounded-input ltr:pl-10 ltr:pr-12 rtl:pr-10 rtl:pl-12 py-3 focus:outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze transition-colors"
        />
        <button
          type="button"
          onMouseDown={toggleVisibility}
          onTouchStart={toggleVisibility}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="absolute top-1/2 -translate-y-1/2 right-1.5 ltr:right-1.5 rtl:left-1.5 rtl:right-auto w-9 h-9 flex items-center justify-center text-brand-muted hover:text-brand-cream rounded-full transition-colors z-10 btn-press"
          title={showPassword ? 'Hide Password' : 'Show Password'}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Live Strength Evaluation UI (Rendered when user starts typing) */}
      {value.length > 0 && (
        <div className="space-y-2 pt-1 animate-fade-scale">
          {/* Progress Bar & Label */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-brand-muted font-medium">Password Strength:</span>
            <span className={`font-semibold ${
              strength.score <= 2 ? 'text-rose-400' : strength.score === 3 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {strength.label}
            </span>
          </div>

          {/* 5-Segment Progress Bar */}
          <div className="grid grid-cols-5 gap-1.5 h-1.5 w-full bg-brand-surface rounded-full overflow-hidden p-0.5 border border-brand-border/40">
            {[1, 2, 3, 4, 5].map((segment) => (
              <div
                key={segment}
                className={`h-full rounded-full transition-all duration-300 ${
                  segment <= strength.score ? strength.color : 'bg-brand-border/40'
                }`}
              />
            ))}
          </div>

          {/* Live Checklists */}
          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] text-brand-muted">
            <div className="flex items-center gap-1">
              {strength.hasMinLength ? (
                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
              ) : (
                <X className="w-3 h-3 text-brand-muted/50 shrink-0" />
              )}
              <span className={strength.hasMinLength ? 'text-brand-cream' : ''}>Min. 8 characters</span>
            </div>

            <div className="flex items-center gap-1">
              {strength.hasLowerUpper ? (
                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
              ) : (
                <X className="w-3 h-3 text-brand-muted/50 shrink-0" />
              )}
              <span className={strength.hasLowerUpper ? 'text-brand-cream' : ''}>Upper & lower case</span>
            </div>

            <div className="flex items-center gap-1">
              {strength.hasNumber ? (
                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
              ) : (
                <X className="w-3 h-3 text-brand-muted/50 shrink-0" />
              )}
              <span className={strength.hasNumber ? 'text-brand-cream' : ''}>Numbers (0-9)</span>
            </div>

            <div className="flex items-center gap-1">
              {strength.hasSpecial ? (
                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
              ) : (
                <X className="w-3 h-3 text-brand-muted/50 shrink-0" />
              )}
              <span className={strength.hasSpecial ? 'text-brand-cream' : ''}>Special symbols (!@#$)</span>
            </div>
          </div>

          {/* Dynamic Suggestion Advice */}
          {strength.suggestions.length > 0 && (
            <p className="text-[11px] text-amber-400/90 font-medium pt-0.5">
              💡 Tip: {strength.suggestions[0]}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
