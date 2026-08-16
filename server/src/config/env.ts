import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default(process.env.PORT || '4000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default((process.env.NODE_ENV as any) || 'development'),
  CLIENT_URL: z.string().default(process.env.CLIENT_URL || '*'),
  DATABASE_URL: z.string().default(process.env.DATABASE_URL || 'postgresql://postgres.namyvyecysndjqzmlvpb:Slimane055%40@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true'),
  DIRECT_URL: z.string().optional(),
  JWT_SECRET: z.string().default(process.env.JWT_SECRET || 'kafaa_cloud_jwt_secret_change_in_prod_2026_dz'),
  JWT_REFRESH_SECRET: z.string().default(process.env.JWT_REFRESH_SECRET || 'kafaa_cloud_jwt_refresh_secret_change_in_prod_2026_dz'),
  CORS_ORIGIN: z.string().default(process.env.CORS_ORIGIN || '*')
});

export const env = envSchema.parse(process.env);
