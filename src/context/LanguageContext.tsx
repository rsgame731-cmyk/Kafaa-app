import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    brand_tagline: "Your professional world, built for Algeria.",
    get_started: "Get Started",
    sign_in: "Sign In",
    create_account: "Create an Account",
    good_evening: "Good evening",
    looking_for_opps: "Looking for new opportunities",
    home: "Home",
    discover: "Discover",
    create: "Create",
    messages: "Messages",
    profile: "Profile",
    jobs: "Jobs",
    talent: "Talent",
    companies: "Companies",
    services: "Services",
    learn: "Learn",
    network: "Network",
    career_ai: "Career AI",
    admin: "Admin Portal",
    settings: "Settings",
    search_placeholder: "Search people, companies, jobs in Algeria...",
    apply_now: "Apply Now",
    connect: "Connect",
    following: "Following",
    hire: "Hire Professional",
    publish: "Publish",
    complete_profile: "Complete Profile",
    progress: "Progress",
    wilaya: "Wilaya",
    salary_range: "Salary Range",
    view_job: "View Job",
    view_service: "View Service",
    verified: "Verified",
    notifications: "Notifications",
    language: "Language",
    english: "English",
    french: "Français",
    arabic: "العربية (RTL)",
    profile_strength: "Profile Strength",
    view: "View",
    comments: "Comments",
    repost: "Repost",
    like: "Like",
    saved: "Saved",
    share: "Share",
    send: "Send",
    back: "Back",
    continue: "Continue",
    step: "Step",
    of: "of",
    password: "Password",
    email: "Email",
    first_name: "First Name",
    last_name: "Last Name",
    specialization: "Specialization",
    city: "City / Commune",
    sign_out: "Sign Out"
  },
  fr: {
    brand_tagline: "Votre monde professionnel, conçu pour l'Algérie.",
    get_started: "Commencer",
    sign_in: "Se connecter",
    create_account: "Créer un compte",
    good_evening: "Bonsoir",
    looking_for_opps: "À la recherche de nouvelles opportunités",
    home: "Accueil",
    discover: "Découvrir",
    create: "Créer",
    messages: "Messages",
    profile: "Profil",
    jobs: "Emplois",
    talent: "Talents",
    companies: "Entreprises",
    services: "Services",
    learn: "Formation",
    network: "Réseau",
    career_ai: "IA Carrière",
    admin: "Portail Admin",
    settings: "Paramètres",
    search_placeholder: "Rechercher personnes, entreprises, emplois en Algérie...",
    apply_now: "Postuler",
    connect: "Se connecter",
    following: "Suivi",
    hire: "Engager l'expert",
    publish: "Publier",
    complete_profile: "Compléter le profil",
    progress: "Progression",
    wilaya: "Wilaya",
    salary_range: "Tranche de salaire",
    view_job: "Voir l'offre",
    view_service: "Voir le service",
    verified: "Vérifié",
    notifications: "Notifications",
    language: "Langue",
    english: "English",
    french: "Français",
    arabic: "العربية (RTL)",
    profile_strength: "Niveau du profil",
    view: "Voir",
    comments: "Commentaires",
    repost: "Republier",
    like: "J'aime",
    saved: "Enregistré",
    share: "Partager",
    send: "Envoyer",
    back: "Retour",
    continue: "Continuer",
    step: "Étape",
    of: "sur",
    password: "Mot de passe",
    email: "E-mail",
    first_name: "Prénom",
    last_name: "Nom",
    specialization: "Spécialisation",
    city: "Ville / Commune",
    sign_out: "Déconnexion"
  },
  ar: {
    brand_tagline: "عالمك المهني، مصمم خصيصاً للجزائر.",
    get_started: "ابدأ الآن",
    sign_in: "تسجيل الدخول",
    create_account: "إنشاء حساب جديد",
    good_evening: "مساء الخير",
    looking_for_opps: "أبحث عن فرص عمل جديدة",
    home: "الرئيسية",
    discover: "اكتشف",
    create: "إنشاء",
    messages: "الرسائل",
    profile: "الملف الشخصي",
    jobs: "الوظائف",
    talent: "الكفاءات",
    companies: "الشركات",
    services: "الخدمات",
    learn: "التعلم",
    network: "الشبكة",
    career_ai: "الذكاء المهني",
    admin: "لوحة الإدارة",
    settings: "الإعدادات",
    search_placeholder: "ابحث عن أشخاص، وظائف، شركات في الجزائر...",
    apply_now: "قدّم الآن",
    connect: "تواصل",
    following: "مُتابع",
    hire: "توظيف الخبير",
    publish: "نشر",
    complete_profile: "إكمال الملف الشخصي",
    progress: "نسبة الإكتمال",
    wilaya: "الولاية",
    salary_range: "مجال الراتب",
    view_job: "عرض الوظيفة",
    view_service: "عرض الخدمة",
    verified: "موثق",
    notifications: "الإشعارات",
    language: "اللغة",
    english: "English",
    french: "Français",
    arabic: "العربية (RTL)",
    profile_strength: "قوة الملف الشخصي",
    view: "عرض",
    comments: "التعليقات",
    repost: "إعادة نشر",
    like: "إعجاب",
    saved: "محفوظ",
    share: "مشاركة",
    send: "إرسال",
    back: "رجوع",
    continue: "متابعة",
    step: "الخطوة",
    of: "من",
    password: "كلمة المرور",
    email: "البريد الإلكتروني",
    first_name: "الاسم الأول",
    last_name: "اسم العائلة",
    specialization: "التخصص المهني",
    city: "المدينة / البلدية",
    sign_out: "تسجيل الخروج"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('kafaa_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kafaa_lang', lang);
  };

  useEffect(() => {
    const isRtl = language === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  };
  return context;
};

