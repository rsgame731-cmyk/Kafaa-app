import { createClient } from '@supabase/supabase-js';

const meta = import.meta as unknown as { env?: Record<string, string> };
const supabaseUrl = meta.env?.VITE_SUPABASE_URL || 'https://namyvyecysndjqzmlvpb.supabase.co';
const supabaseAnonKey = meta.env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Vr5Cgo3xZl46IfsI_2Gq7A_-BJqKohJ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
