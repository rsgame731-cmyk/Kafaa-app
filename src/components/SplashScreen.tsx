import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC = () => {
  const [progress, setProgress] = useState(15);
  const [statusMessage, setStatusMessage] = useState('Initializing Kafa\'a platform...');

  useEffect(() => {
    const t1 = setTimeout(() => {
      setProgress(45);
      setStatusMessage('Restoring session & security credentials...');
    }, 600);

    const t2 = setTimeout(() => {
      setProgress(85);
      setStatusMessage('Connecting to Algerian professional network...');
    }, 1400);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStatusMessage('Welcome');
    }, 1900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#0c0d10] text-brand-cream flex flex-col items-center justify-between p-8 select-none animate-fade-scale">
      <div className="w-full flex justify-between items-center opacity-60">
        <span className="text-[11px] font-mono tracking-widest text-brand-bronze uppercase">KAFA'A v1.0.0</span>
        <span className="text-[11px] font-mono tracking-widest text-brand-muted uppercase">ALGERIA 🇩🇿</span>
      </div>

      {/* Center Brand Identity */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-sm">
        <div className="relative group">
          <div className="absolute -inset-4 bg-brand-bronze/20 rounded-full blur-2xl animate-pulse-glow" />
          <div className="relative w-20 h-20 rounded-2xl bg-brand-surface border-2 border-brand-bronze/60 flex items-center justify-center text-brand-bronze text-4xl font-bold shadow-bronze-glow">
            ك
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-brand-cream font-sans">
            Kafa'a <span className="text-brand-bronze font-normal text-lg">كفاءة</span>
          </h1>
          <p className="text-xs text-brand-muted uppercase tracking-[0.25em] font-medium">
            Algerian Professional Network
          </p>
        </div>
      </div>

      {/* Progress & Status */}
      <div className="w-full max-w-xs space-y-3 text-center pb-6">
        <div className="w-full h-1.5 bg-brand-surface rounded-full overflow-hidden border border-brand-border/60">
          <div
            className="h-full bg-brand-bronze shadow-bronze-glow transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[11px] text-brand-muted font-mono tracking-wide h-4">
          {statusMessage}
        </p>
      </div>
    </div>
  );
};
