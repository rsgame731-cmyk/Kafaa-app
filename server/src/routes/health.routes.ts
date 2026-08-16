import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';

const router = Router();

// Liveness check
router.get('/', (req: Request, res: Response) => {
  return res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Readiness check (Database check)
router.get('/ready', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin.from('users').select('id').limit(1);
    if (error) throw error;
    return res.json({ status: 'ready', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    return res.status(503).json({ status: 'unhealthy', database: 'disconnected' });
  }
});

export default router;
