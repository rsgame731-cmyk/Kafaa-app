import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/rbac.middleware';

const router = Router();
const prisma = new PrismaClient();

// ADMIN ONLY GUARD ON ALL ADMIN ENDPOINTS
router.use(authenticateJWT, requireAdmin);

// 1. GET PENDING VERIFICATIONS QUEUE
router.get('/verifications', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const unverifiedUsers = await prisma.user.findMany({
      where: { verified: false },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        profile: true
      }
    });

    return res.json({ status: 'success', data: unverifiedUsers });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Failed to fetch verification queue' });
  }
});

// 2. APPROVE USER VERIFICATION BADGE
router.post('/verifications/:userId/approve', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.params.userId },
      data: { verified: true }
    });

    // Audit action
    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: `APPROVED_VERIFICATION_FOR_${req.params.userId}`,
        ipAddress: req.ip
      }
    });

    return res.json({ status: 'success', message: 'User verification approved', data: updatedUser });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Verification approval failed' });
  }
});

// 3. SYSTEM ANALYTICS
router.get('/analytics', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalJobs = await prisma.job.count();
    const totalCompanies = await prisma.company.count();
    const totalPosts = await prisma.post.count();

    return res.json({
      status: 'success',
      data: {
        totalUsers,
        totalJobs,
        totalCompanies,
        totalPosts,
        uptime: '99.9%'
      }
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Analytics retrieval failed' });
  }
});

export default router;
