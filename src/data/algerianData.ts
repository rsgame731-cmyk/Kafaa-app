import { Wilaya, UserProfile, Job, Company, Post, Service, Course, MessageConversation, NotificationItem } from '../types';

export const WILAYAS_LIST: Wilaya[] = [
  { code: 1, nameEn: "Adrar", nameAr: "أدرار", nameFr: "Adrar" },
  { code: 2, nameEn: "Chlef", nameAr: "الشلف", nameFr: "Chlef" },
  { code: 3, nameEn: "Laghouat", nameAr: "الأغواط", nameFr: "Laghouat" },
  { code: 4, nameEn: "Oum El Bouaghi", nameAr: "أم البواقي", nameFr: "Oum El Bouaghi" },
  { code: 5, nameEn: "Batna", nameAr: "باتنة", nameFr: "Batna" },
  { code: 6, nameEn: "Béjaïa", nameAr: "بجاية", nameFr: "Béjaïa" },
  { code: 7, nameEn: "Biskra", nameAr: "بسكرة", nameFr: "Biskra" },
  { code: 8, nameEn: "Béchar", nameAr: "بشار", nameFr: "Béchar" },
  { code: 9, nameEn: "Blida", nameAr: "البليدة", nameFr: "Blida" },
  { code: 10, nameEn: "Bouira", nameAr: "البويرة", nameFr: "Bouira" },
  { code: 11, nameEn: "Tamanrasset", nameAr: "تمنراست", nameFr: "Tamanrasset" },
  { code: 12, nameEn: "Tébessa", nameAr: "تبسة", nameFr: "Tébessa" },
  { code: 13, nameEn: "Tlemcen", nameAr: "تلمسان", nameFr: "Tlemcen" },
  { code: 14, nameEn: "Tiaret", nameAr: "تيارت", nameFr: "Tiaret" },
  { code: 15, nameEn: "Tizi Ouzou", nameAr: "تيزي وزو", nameFr: "Tizi Ouzou" },
  { code: 16, nameEn: "Algiers", nameAr: "الجزائر العاصمة", nameFr: "Alger" },
  { code: 17, nameEn: "Djelfa", nameAr: "الجلفة", nameFr: "Djelfa" },
  { code: 18, nameEn: "Jijel", nameAr: "جيجل", nameFr: "Jijel" },
  { code: 19, nameEn: "Sétif", nameAr: "سطيف", nameFr: "Sétif" },
  { code: 20, nameEn: "Saïda", nameAr: "سعيدة", nameFr: "Saïda" },
  { code: 21, nameEn: "Skikda", nameAr: "سكيكدة", nameFr: "Skikda" },
  { code: 22, nameEn: "Sidi Bel Abbès", nameAr: "سيدي بلعباس", nameFr: "Sidi Bel Abbès" },
  { code: 23, nameEn: "Annaba", nameAr: "عنابة", nameFr: "Annaba" },
  { code: 24, nameEn: "Guelma", nameAr: "قالمة", nameFr: "Guelma" },
  { code: 25, nameEn: "Constantine", nameAr: "قسنطينة", nameFr: "Constantine" },
  { code: 26, nameEn: "Médéa", nameAr: "المدية", nameFr: "Médéa" },
  { code: 27, nameEn: "Mostaganem", nameAr: "مستغانم", nameFr: "Mostaganem" },
  { code: 28, nameEn: "M'Sila", nameAr: "المسيلة", nameFr: "M'Sila" },
  { code: 29, nameEn: "Mascara", nameAr: "معسكر", nameFr: "Mascara" },
  { code: 30, nameEn: "Ouargla", nameAr: "ورقلة", nameFr: "Ouargla" },
  { code: 31, nameEn: "Oran", nameAr: "وهران", nameFr: "Oran" },
  { code: 32, nameEn: "El Bayadh", nameAr: "البيض", nameFr: "El Bayadh" },
  { code: 33, nameEn: "Illizi", nameAr: "إليزي", nameFr: "Illizi" },
  { code: 34, nameEn: "Bordj Bou Arréridj", nameAr: "برج بوعريريج", nameFr: "Bordj Bou Arréridj" },
  { code: 35, nameEn: "Boumerdès", nameAr: "بومرداس", nameFr: "Boumerdès" },
  { code: 36, nameEn: "El Tarf", nameAr: "الطارف", nameFr: "El Tarf" },
  { code: 37, nameEn: "Tindouf", nameAr: "تندوف", nameFr: "Tindouf" },
  { code: 38, nameEn: "Tissemsilt", nameAr: "تيسمسيلت", nameFr: "Tissemsilt" },
  { code: 39, nameEn: "El Oued", nameAr: "الوادي", nameFr: "El Oued" },
  { code: 40, nameEn: "Khenchela", nameAr: "خنشلة", nameFr: "Khenchela" },
  { code: 41, nameEn: "Souk Ahras", nameAr: "سوق أهراس", nameFr: "Souk Ahras" },
  { code: 42, nameEn: "Tipaza", nameAr: "تيبازة", nameFr: "Tipaza" },
  { code: 43, nameEn: "Mila", nameAr: "ميلة", nameFr: "Mila" },
  { code: 44, nameEn: "Aïn Defla", nameAr: "عين الدفلى", nameFr: "Aïn Defla" },
  { code: 45, nameEn: "Naâma", nameAr: "النعامة", nameFr: "Naâma" },
  { code: 46, nameEn: "Aïn Témouchent", nameAr: "عين تموشنت", nameFr: "Aïn Témouchent" },
  { code: 47, nameEn: "Ghardaïa", nameAr: "غرداية", nameFr: "Ghardaïa" },
  { code: 48, nameEn: "Relizane", nameAr: "غليزان", nameFr: "Relizane" },
  { code: 49, nameEn: "Timimoun", nameAr: "تيميمون", nameFr: "Timimoun" },
  { code: 50, nameEn: "Bordj Badji Mokhtar", nameAr: "برج باجي مختار", nameFr: "Bordj Badji Mokhtar" },
  { code: 51, nameEn: "Ouled Djellal", nameAr: "أولاد جلال", nameFr: "Ouled Djellal" },
  { code: 52, nameEn: "Béni Abbès", nameAr: "بني عباس", nameFr: "Béni Abbès" },
  { code: 53, nameEn: "In Salah", nameAr: "إن صالح", nameFr: "In Salah" },
  { code: 54, nameEn: "In Guezzam", nameAr: "إن قزام", nameFr: "In Guezzam" },
  { code: 55, nameEn: "Touggourt", nameAr: "تقرت", nameFr: "Touggourt" },
  { code: 56, nameEn: "Djanet", nameAr: "جانت", nameFr: "Djanet" },
  { code: 57, nameEn: "El M'Ghair", nameAr: "المغير", nameFr: "El M'Ghair" },
  { code: 58, nameEn: "El Meniaa", nameAr: "المنيعة", nameFr: "El Meniaa" }
];

export const CURRENT_USER: UserProfile = {
  id: "usr_ahmed_1",
  name: "Ahmed Benali",
  headline: "Senior Full-Stack Developer & Tech Lead",
  title: "Lead Engineer @ Yassir · Ex-ESI Algiers",
  wilaya: "Algiers",
  city: "Bab Ezzouar",
  country: "Algeria",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  verified: true,
  role: "Professional",
  bio: "Architecting cloud-native web systems & microservices. Passionate about empowering Algerian tech talent and mentoring the next generation of engineers across 58 Wilayas.",
  connectionsCount: 482,
  followersCount: 1240,
  profileViews: 340,
  profileCompletion: 68,
  experiences: [
    {
      id: "exp_1",
      role: "Lead Full-Stack Developer",
      company: "Yassir Tech Hub",
      location: "Algiers, Algeria (Hybrid)",
      startDate: "2023",
      endDate: "Present",
      description: "Leading a team of 8 engineers building scalable microservices and mobile APIs serving over 5M users in North Africa."
    },
    {
      id: "exp_2",
      role: "Senior Software Engineer",
      company: "Sonatrach Digital Division",
      location: "Hassi Messaoud / Algiers",
      startDate: "2021",
      endDate: "2023",
      description: "Developed enterprise asset management platforms and IoT telemetry monitoring software."
    }
  ],
  education: [
    {
      id: "edu_1",
      institution: "ESI — École Nationale Supérieure d'Informatique",
      degree: "State Engineering Degree",
      fieldOfStudy: "Software Engineering & Distributed Systems",
      startYear: "2016",
      endYear: "2021"
    }
  ],
  skills: [
    "TypeScript", "React", "Next.js", "Node.js", "NestJS", "PostgreSQL",
    "Tailwind CSS", "Docker", "AWS", "Arabic", "French", "English"
  ],
  servicesOffered: [
    "Custom Web Application Architecture",
    "Technical Audit & Performance Tuning",
    "Engineering Team Mentorship"
  ],
  projects: [
    {
      id: "proj_1",
      title: "DzTechHub — Algerian Tech Directory",
      description: "Open-source directory connecting top Algerian startups with software engineers.",
      tags: ["React", "PostgreSQL", "Tailwind CSS"]
    }
  ],
  recommendationsCount: 18
};

export const MOCK_JOBS: Job[] = [
  {
    id: "job_1",
    title: "Senior Frontend Developer (React / Next.js)",
    companyName: "Yassir",
    companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
    wilaya: "Algiers",
    worktype: "Hybrid",
    contractType: "Full-time",
    salaryMinDZD: 180000,
    salaryMaxDZD: 260000,
    tags: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    experienceLevel: "Senior",
    description: "We are seeking an outstanding Frontend Engineer to join our core product group in Algiers. You will craft responsive, accessible web applications for millions of Algerian users.",
    requirements: [
      "5+ years of experience with modern React & TypeScript",
      "Proven track record with performance optimization and SSR",
      "Fluency in French and English; Arabic is a strong plus",
      "Degree in CS from ESI, USTHB, USTO or equivalent practical experience"
    ],
    postedAt: "2 hours ago",
    applicantsCount: 34,
    verifiedCompany: true
  },
  {
    id: "job_2",
    title: "Cloud DevOps & Infrastructure Engineer",
    companyName: "Sonatrach Digital",
    companyLogo: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=200&q=80",
    wilaya: "Ouargla",
    worktype: "Onsite",
    contractType: "Full-time",
    salaryMinDZD: 220000,
    salaryMaxDZD: 320000,
    tags: ["Kubernetes", "AWS", "Terraform", "Docker"],
    experienceLevel: "Senior",
    description: "Manage mission-critical telemetry data centers and automated infrastructure deployment pipelines across Hassi Messaoud operational sites.",
    requirements: [
      "Deep experience with Kubernetes, Docker, and CI/CD pipelines",
      "Strong Linux administration and automation scripting in Python/Bash",
      "Willingness to work rotation shifts in Ouargla / Hassi Messaoud"
    ],
    postedAt: "1 day ago",
    applicantsCount: 19,
    verifiedCompany: true
  },
  {
    id: "job_3",
    title: "UI/UX Product Designer",
    companyName: "Djezzy",
    companyLogo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=200&q=80",
    wilaya: "Oran",
    worktype: "Hybrid",
    contractType: "Full-time",
    salaryMinDZD: 140000,
    salaryMaxDZD: 200000,
    tags: ["Figma", "Design Systems", "User Research", "Mobile UI"],
    experienceLevel: "Mid",
    description: "Lead visual redesigns for customer self-care portals and digital service touchpoints in Oran.",
    requirements: [
      "3+ years product design experience with Figma",
      "Portfolio demonstrating mobile-first designs & dark mode aesthetic",
      "Understanding of localized North African consumer behaviors"
    ],
    postedAt: "3 days ago",
    applicantsCount: 45,
    verifiedCompany: true
  },
  {
    id: "job_4",
    title: "Full-Stack Node.js Developer",
    companyName: "Cevital Digital",
    companyLogo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80",
    wilaya: "Béjaïa",
    worktype: "Remote",
    contractType: "Full-time",
    salaryMinDZD: 150000,
    salaryMaxDZD: 210000,
    tags: ["Node.js", "Express", "PostgreSQL", "Redis"],
    experienceLevel: "Mid",
    description: "Build robust ERP backend APIs connecting logistics, supply chain, and food processing systems.",
    requirements: [
      "Solid understanding of REST & GraphQL APIs in Node.js",
      "Experience with relational databases (PostgreSQL/MySQL)",
      "Remote work autonomy and strong communication skills"
    ],
    postedAt: "4 days ago",
    applicantsCount: 28,
    verifiedCompany: true
  }
];

export const MOCK_COMPANIES: Company[] = [
  {
    id: "comp_1",
    name: "Yassir Tech",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
    industry: "Super App / FinTech",
    wilaya: "Algiers",
    verified: true,
    employeesCount: "500-1000",
    about: "Yassir is the leading super-app in North Africa providing ride-hailing, food delivery, financial services, and logistics across Algeria, Tunisia, Morocco, and international markets.",
    website: "https://yassir.com",
    jobsCount: 14
  },
  {
    id: "comp_2",
    name: "Sonatrach Energy Group",
    logo: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=200&q=80",
    industry: "Energy & Infrastructure",
    wilaya: "Algiers",
    verified: true,
    employeesCount: "10,000+",
    about: "The national state-owned oil and gas company of Algeria, leading energy production, digital transformation, and industrial innovation.",
    website: "https://sonatrach.dz",
    jobsCount: 8
  },
  {
    id: "comp_3",
    name: "Djezzy Telecom",
    logo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=200&q=80",
    industry: "Telecommunications",
    wilaya: "Algiers",
    verified: true,
    employeesCount: "3000+",
    about: "Pioneer in mobile telecommunications and digital connectivity across all 58 Wilayas of Algeria.",
    website: "https://djezzy.dz",
    jobsCount: 5
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: "post_1",
    authorId: "usr_karim_b",
    authorName: "Karim Brahimi",
    authorTitle: "AI Research Scientist @ CDTA · Algiers",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    authorWilaya: "Algiers",
    authorVerified: true,
    content: "Just launched our new open-source Arabic LLM fine-tuning dataset built specifically for North African dialectal variations (Darja) and formal Arabic documentation. Excited to see Algerian developers build local AI applications on top of this! 🇩🇿⚡",
    likesCount: 142,
    commentsCount: 38,
    repostsCount: 19,
    postedAt: "3h ago",
    isLiked: false,
    isSaved: true
  },
  {
    id: "post_2",
    authorId: "usr_sara_b",
    authorName: "Sara Benmoussa",
    authorTitle: "Lead UI/UX Architect @ TechDz · Oran",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    authorWilaya: "Oran",
    authorVerified: true,
    content: "Minimalism is not about putting less content; it's about making space for what truly matters. Here is a sneak peek into our new dark executive design language created for Algerian professional tools. Notice the warm copper accents and centered layout rhythm.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    likesCount: 289,
    commentsCount: 64,
    repostsCount: 41,
    postedAt: "6h ago",
    isLiked: true,
    isSaved: false
  },
  {
    id: "post_3",
    authorId: "usr_yassine_k",
    authorName: "Yassine Kasmi",
    authorTitle: "Co-Founder @ DzStartups · Constantine",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    authorWilaya: "Constantine",
    authorVerified: false,
    content: "Big news for the Algerian startup ecosystem! We are hosting an upcoming developer pitch competition in Constantine next month. Over 2,000,000 DZD in grant funding for young engineers building solutions in Agritech, FinTech, and Logistics.",
    likesCount: 410,
    commentsCount: 92,
    repostsCount: 85,
    postedAt: "1d ago",
    isLiked: false,
    isSaved: false
  }
];

export const MOCK_SERVICES: Service[] = [
  {
    id: "serv_1",
    title: "High-Performance Full-Stack Web App Development",
    providerName: "Yassine Mansouri",
    providerAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    providerRole: "Full-Stack Engineer",
    wilaya: "Algiers",
    category: "Web Development",
    startingPriceDZD: 45000,
    rating: 4.9,
    reviewsCount: 38,
    deliveryDays: 7,
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "serv_2",
    title: "Mobile App Design & Dark Mode System in Figma",
    providerName: "Lina Cherif",
    providerAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    providerRole: "Senior UI/UX Designer",
    wilaya: "Oran",
    category: "Design",
    startingPriceDZD: 35000,
    rating: 5.0,
    reviewsCount: 52,
    deliveryDays: 5,
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "serv_3",
    title: "Trilingual Commercial & Legal Document Translation (AR/FR/EN)",
    providerName: "Amine Boumediene",
    providerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    providerRole: "Sworn Translator",
    wilaya: "Tlemcen",
    category: "Translation",
    startingPriceDZD: 15000,
    rating: 4.8,
    reviewsCount: 29,
    deliveryDays: 2,
    thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80"
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: "course_1",
    title: "AI Fundamentals & LLM Engineering for Algerians",
    category: "Artificial Intelligence",
    instructorName: "Dr. Khaled Rahmani",
    instructorRole: "AI Specialist & ESI Professor",
    duration: "14 hours",
    lessonsCount: 28,
    level: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    enrolledCount: 1420,
    progressPercent: 45,
    certificateProvided: true
  },
  {
    id: "course_2",
    title: "English for Technical Careers & Remote Work",
    category: "Languages & Career",
    instructorName: "Sarah Haddad",
    instructorRole: "Corporate Communication Coach",
    duration: "10 hours",
    lessonsCount: 18,
    level: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
    enrolledCount: 2890,
    progressPercent: 80,
    certificateProvided: true
  },
  {
    id: "course_3",
    title: "Building & Scaling Startups in Algeria (Law, Finance & Tech)",
    category: "Entrepreneurship",
    instructorName: "Mehdi Belkacem",
    instructorRole: "Venture Builder & Legal Advisor",
    duration: "12 hours",
    lessonsCount: 22,
    level: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80",
    enrolledCount: 950,
    progressPercent: 10,
    certificateProvided: true
  }
];

export const MOCK_CONVERSATIONS: MessageConversation[] = [
  {
    id: "conv_1",
    participantName: "Yasmine Belmadi",
    participantRole: "Senior Tech Recruiter @ Yassir",
    participantAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    participantCompany: "Yassir",
    lastMessage: "Hi Ahmed! We loved your profile and would like to schedule an interview for the Lead Architect role in Algiers.",
    lastMessageTime: "10:45 AM",
    unreadCount: 1,
    messages: [
      {
        id: "m1",
        senderId: "usr_yasmine",
        text: "Bonjour Ahmed, hope you are having a great week!",
        time: "10:40 AM",
        isMe: false
      },
      {
        id: "m2",
        senderId: "usr_yasmine",
        text: "Hi Ahmed! We loved your profile and would like to schedule an interview for the Lead Architect role in Algiers.",
        time: "10:45 AM",
        isMe: false
      }
    ]
  },
  {
    id: "conv_2",
    participantName: "Startup Algeria Hub",
    participantRole: "Official Incubator Program",
    participantAvatar: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=200&q=80",
    lastMessage: "Your application for the 2026 National Innovation Grant has passed preliminary screening.",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    messages: [
      {
        id: "m3",
        senderId: "usr_startup",
        text: "Your application for the 2026 National Innovation Grant has passed preliminary screening.",
        time: "Yesterday",
        isMe: false
      }
    ]
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_1",
    type: "view",
    title: "Sonatrach Recruiter viewed your profile",
    subtitle: "Digital Transformation Department · Algiers",
    time: "15m ago",
    read: false,
    avatar: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=100&q=80"
  },
  {
    id: "notif_2",
    type: "job_match",
    title: "New Job Match: Senior React Engineer",
    subtitle: "Yassir · 180,000 - 260,000 DZD · Algiers",
    time: "2h ago",
    read: false
  },
  {
    id: "notif_3",
    type: "connection",
    title: "Sara Benmoussa accepted your connection request",
    subtitle: "Lead UI/UX Architect @ TechDz",
    time: "1d ago",
    read: true,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"
  }
];
