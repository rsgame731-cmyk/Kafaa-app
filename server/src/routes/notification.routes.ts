import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// GET USER NOTIFICATIONS
router.get('/', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30
    });

    return res.json({ status: 'success', data: notifications });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Failed to fetch notifications' });
  }
});

// MARK NOTIFICATIONS AS READ
router.post('/read', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });

    return res.json({ status: 'success', message: 'Notifications marked as read' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Failed to update notifications' });
  }
});

export default router;
