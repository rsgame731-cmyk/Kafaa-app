import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Liveness check
router.get('/', (req: Request, res: Response) => {
  return res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Readiness check (Database check)
router.get('/ready', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ status: 'ready', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    return res.status(503).json({ status: 'unhealthy', database: 'disconnected' });
  }
});

export default router;
