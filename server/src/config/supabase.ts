import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import WebSocket from 'ws';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://namyvyecysndjqzmlvpb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_publishable_Vr5Cgo3xZl46IfsI_2Gq7A_-BJqKohJ';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  ...(typeof (globalThis as any).WebSocket === 'undefined' ? { realtime: { transport: WebSocket } } : {})
});
