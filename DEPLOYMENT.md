# 🚀 Kafa'a (كفاءة) — Supabase & Production Deployment Guide

This guide provides step-by-step instructions for pushing the database schema to your Supabase project (`namyvyecysndjqzmlvpb`) and deploying the full application.

---

## 📋 Configured Supabase Credentials

- **Project URL**: `https://namyvyecysndjqzmlvpb.supabase.co`
- **Publishable Key**: `sb_publishable_Vr5Cgo3xZl46IfsI_2Gq7A_-BJqKohJ`
- **Direct Connection String**: `postgresql://postgres:[YOUR-PASSWORD]@db.namyvyecysndjqzmlvpb.supabase.co:5432/postgres`

---

## STEP 1: Supabase CLI Link & Database Push

Run the following commands in your terminal to authenticate and push the schema directly to your Supabase cloud database:

```bash
# 1. Login to Supabase CLI
npx supabase login

# 2. Link local workspace to project ref
npx supabase link --project-ref namyvyecysndjqzmlvpb

# 3. Push Prisma PostgreSQL Schema directly to Supabase
npx prisma db push --schema=server/prisma/schema.prisma

# 4. Seed database with Algerian executive network data
npm run db:seed
```

> **Note**: When running `npx prisma db push`, replace `[YOUR-PASSWORD]` in `.env` with your actual Supabase database password chosen during project creation.

---

## STEP 2: Supabase Storage Buckets Setup

In your Supabase Dashboard ([https://supabase.com/dashboard/project/namyvyecysndjqzmlvpb/storage/buckets](https://supabase.com/dashboard/project/namyvyecysndjqzmlvpb/storage/buckets)), create 3 buckets:
1. `avatars` (Public)
2. `resumes` (Private / Authenticated)
3. `media` (Public)

---

## STEP 3: Frontend Deployment (Vercel / Cloudflare)

1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Set Environment Variables:
   - `VITE_SUPABASE_URL`: `https://namyvyecysndjqzmlvpb.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `sb_publishable_Vr5Cgo3xZl46IfsI_2Gq7A_-BJqKohJ`
3. Click **Deploy**.

---

## STEP 4: Backend API Deployment (Render / Railway / Docker)

1. Deploy the backend server to Render or Railway.
2. Set Environment Variables in hosting dashboard:
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: `https://your-frontend.vercel.app`
   - `DATABASE_URL`: `postgresql://postgres:[YOUR-PASSWORD]@db.namyvyecysndjqzmlvpb.supabase.co:5432/postgres`
   - `SUPABASE_URL`: `https://namyvyecysndjqzmlvpb.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY`: `sb_publishable_Vr5Cgo3xZl46IfsI_2Gq7A_-BJqKohJ`
