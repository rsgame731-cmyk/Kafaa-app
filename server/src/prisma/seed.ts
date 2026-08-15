import { createClient } from '@supabase/supabase-js';
import argon2 from 'argon2';
import { randomUUID } from 'crypto';

const now = new Date().toISOString();

const SUPABASE_URL = 'https://namyvyecysndjqzmlvpb.supabase.co';
const SUPABASE_SERVICE_KEY = 'sb_publishable_Vr5Cgo3xZl46IfsI_2Gq7A_-BJqKohJ';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const AHMED_ID = '11111111-1111-1111-1111-111111111111';
const ADMIN_ID  = '22222222-2222-2222-2222-222222222222';
const YASSIR_ID = '33333333-3333-3333-3333-333333333333';
const SONATRACH_ID = '44444444-4444-4444-4444-444444444444';
const JOB_ID = '55555555-5555-5555-5555-555555555555';

async function main() {
  console.log('🌱 Seeding Kafa\'a Supabase database...');

  const hash = await argon2.hash('Kafa2026!AlgeriaSecure', { type: argon2.argon2id });

  // ─── 1. Users ─────────────────────────────────────────────────────────────
  const { error: u1 } = await supabase.from('users').upsert({
    id: AHMED_ID, username: 'ahmed_benali', email: 'ahmed.benali@kafaa.dz',
    phone: '+213550123456', passwordHash: hash,
    firstName: 'Ahmed', lastName: 'Benali',
    role: 'USER', verified: true, isAdmin: false,
    status: 'ACTIVE', createdAt: now, updatedAt: now
  }, { onConflict: 'id' });
  if (u1) console.error('User 1:', u1.message); else console.log('✅ Ahmed Benali user');

  const { error: u2 } = await supabase.from('users').upsert({
    id: ADMIN_ID, username: 'kafaa_admin', email: 'admin@kafaa.dz',
    passwordHash: hash, firstName: 'Kafaa', lastName: 'Admin',
    role: 'ADMIN', verified: true, isAdmin: true,
    status: 'ACTIVE', createdAt: now, updatedAt: now
  }, { onConflict: 'id' });
  if (u2) console.error('User 2:', u2.message); else console.log('✅ Admin user');

  // ─── 2. Profiles ──────────────────────────────────────────────────────────
  const { error: p1 } = await supabase.from('profiles').upsert({
    id: randomUUID(), userId: AHMED_ID,
    fullName: 'Ahmed Benali',
    headline: 'Senior Full-Stack Developer & Tech Lead @ Yassir',
    about: 'Architecting cloud-native web systems & microservices.',
    wilaya: 'Algiers', city: 'Bab Ezzouar', country: 'Algeria',
    industry: 'Software Engineering',
    availability: 'Looking for new opportunities',
    remoteAvailability: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    connectionsCount: 482, followersCount: 1240,
    profileViews: 340, profileCompletion: 68,
    profileVisibility: 'PUBLIC',
    skills: JSON.stringify(['TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker']),
    createdAt: now, updatedAt: now
  }, { onConflict: 'userId' });
  if (p1) console.error('Profile 1:', p1.message); else console.log('✅ Ahmed profile');

  const { error: p2 } = await supabase.from('profiles').upsert({
    id: randomUUID(), userId: ADMIN_ID,
    fullName: 'Kafaa Governance', headline: 'Platform Security & Verification',
    wilaya: 'Algiers', city: 'Algiers Center', country: 'Algeria',
    industry: 'Security & Moderation', availability: 'Unavailable',
    remoteAvailability: false, profileVisibility: 'PUBLIC',
    skills: JSON.stringify(['Security', 'Governance']),
    createdAt: now, updatedAt: now
  }, { onConflict: 'userId' });
  if (p2) console.error('Profile 2:', p2.message); else console.log('✅ Admin profile');

  // ─── 3. Companies ─────────────────────────────────────────────────────────
  const { error: c1 } = await supabase.from('companies').upsert({
    id: YASSIR_ID, name: 'Yassir', slug: 'yassir-tech',
    description: 'Leading super-app in North Africa: ride-hailing, food delivery & fintech.',
    industry: 'Super App / FinTech', wilaya: 'Algiers', city: 'Algiers',
    website: 'https://yassir.com', verificationStatus: 'VERIFIED',
    companySize: '500-1000', createdAt: now, updatedAt: now
  }, { onConflict: 'id' });
  if (c1) console.error('Company 1:', c1.message); else console.log('✅ Yassir company');

  const { error: c2 } = await supabase.from('companies').upsert({
    id: SONATRACH_ID, name: 'Sonatrach Energy Group', slug: 'sonatrach-energy',
    description: 'State-owned oil and gas enterprise of Algeria, driving digital transformation.',
    industry: 'Energy & Infrastructure', wilaya: 'Algiers', city: 'Algiers',
    website: 'https://sonatrach.dz', verificationStatus: 'VERIFIED',
    companySize: '10000+', createdAt: now, updatedAt: now
  }, { onConflict: 'id' });
  if (c2) console.error('Company 2:', c2.message); else console.log('✅ Sonatrach company');

  // ─── 4. Jobs ──────────────────────────────────────────────────────────────
  const { error: j1 } = await supabase.from('jobs').upsert({
    id: JOB_ID, companyId: YASSIR_ID, createdBy: ADMIN_ID,
    title: 'Senior Frontend Developer (React / Next.js)',
    description: 'Craft responsive web applications for millions of Algerian users.',
    employmentType: 'FULL_TIME', workMode: 'HYBRID',
    wilaya: 'Algiers', city: 'Algiers',
    salaryMin: 180000, salaryMax: 260000, currency: 'DZD',
    experienceLevel: 'Senior', status: 'ACTIVE',
    requirements: JSON.stringify(['5+ years React & TypeScript', 'SSR & performance optimization']),
    tags: JSON.stringify(['React', 'Next.js', 'TypeScript']),
    applicantsCount: 34, postedAt: now
  }, { onConflict: 'id' });
  if (j1) console.error('Job 1:', j1.message); else console.log('✅ Frontend job');

  // ─── 5. Posts ─────────────────────────────────────────────────────────────
  const { error: po1 } = await supabase.from('posts').insert({
    id: randomUUID(), authorId: AHMED_ID,
    content: 'Just launched our open-source Arabic LLM fine-tuning dataset for North African dialectal variations (Darja). Excited to see Algerian developers build local AI! 🇩🇿⚡',
    wilaya: 'Algiers', visibility: 'PUBLIC', createdAt: now, updatedAt: now
  });
  if (po1 && po1.code !== '23505') console.error('Post 1:', po1.message); else console.log('✅ Post created');

  // ─── 6. Services ──────────────────────────────────────────────────────────
  const { error: s1 } = await supabase.from('services').insert({
    id: randomUUID(), providerId: AHMED_ID,
    title: 'High-Performance Full-Stack Web App Development',
    category: 'Web Development',
    startingPriceDZD: 45000, rating: 4.9,
    reviewsCount: 38, deliveryDays: 7, createdAt: now
  });
  if (s1 && s1.code !== '23505') console.error('Service 1:', s1.message); else console.log('✅ Service created');

  // ─── 7. Courses ───────────────────────────────────────────────────────────
  const { error: co1 } = await supabase.from('courses').insert([
    {
      id: randomUUID(), title: 'AI Engineering for Algerian Developers',
      category: 'Artificial Intelligence', instructor: 'Dr. Karim Bensalem',
      duration: '12 weeks', lessonsCount: 48, level: 'Advanced', createdAt: now
    },
    {
      id: randomUUID(), title: 'French for Executive Professionals',
      category: 'Language', instructor: 'Prof. Marie Dumont',
      duration: '8 weeks', lessonsCount: 32, level: 'Intermediate', createdAt: now
    },
    {
      id: randomUUID(), title: 'English for Algerian Career Builders',
      category: 'Language', instructor: 'John Mitchell',
      duration: '10 weeks', lessonsCount: 40, level: 'Beginner', createdAt: now
    }
  ]);
  if (co1 && co1.code !== '23505') console.error('Courses:', co1.message); else console.log('✅ Courses created');

  console.log('\n🎉 Kafa\'a Supabase database seeded successfully!');
}

main().catch((e) => { console.error('❌ Fatal seed error:', e); process.exit(1); });
