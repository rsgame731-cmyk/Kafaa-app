import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('4000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  // DATABASE_URL must be set in .env — no default to avoid committing credentials
  DATABASE_URL: z.string({ required_error: 'DATABASE_URL environment variable is required' }),
  DIRECT_URL: z.string().optional(),
  // JWT secrets must be set in .env — no default to avoid committing secrets
  JWT_SECRET: z.string({ required_error: 'JWT_SECRET environment variable is required' }),
  JWT_REFRESH_SECRET: z.string({ required_error: 'JWT_REFRESH_SECRET environment variable is required' }),
  CORS_ORIGIN: z.string().default('http://localhost:3000')
});

export const env = envSchema.parse(process.env);
