import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('4000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string().default('postgresql://postgres.namyvyecysndjqzmlvpb:Slimane055%40@db.namyvyecysndjqzmlvpb.supabase.co:5432/postgres'),
  JWT_SECRET: z.string().default('kafaa_dev_super_secret_key_change_in_prod_2026_dz'),
  JWT_REFRESH_SECRET: z.string().default('kafaa_dev_refresh_secret_key_change_in_prod_2026_dz'),
  CORS_ORIGIN: z.string().default('*')
});

export const env = envSchema.parse(process.env);
