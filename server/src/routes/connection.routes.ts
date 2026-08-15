import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';

const router = Router();
const prisma = new PrismaClient();

const sendConnectionSchema = z.object({
  body: z.object({
    receiverId: z.string().uuid('Invalid recipient ID')
  })
});

// 1. GET CONNECTIONS LIST
router.get('/', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const connections = await prisma.connection.findMany({
      where: {
        OR: [
          { requesterId: userId, status: 'ACCEPTED' },
          { receiverId: userId, status: 'ACCEPTED' }
        ]
      },
      include: {
        requester: { select: { id: true, verified: true, profile: true } },
        receiver: { select: { id: true, verified: true, profile: true } }
      }
    });

    const formatted = connections.map(c => {
      const partner = c.requesterId === userId ? c.receiver : c.requester;
      return {
        connectionId: c.id,
        partnerId: partner.id,
        fullName: partner.profile?.fullName,
        headline: partner.profile?.headline,
        avatarUrl: partner.profile?.avatarUrl,
        wilaya: partner.profile?.wilaya,
        verified: partner.verified
      };
    });

    return res.json({ status: 'success', data: formatted });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Failed to fetch connections' });
  }
});

// 2. SEND CONNECTION REQUEST (Race-condition protected via compound unique constraint)
router.post('/request', authenticateJWT, validateRequest(sendConnectionSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requesterId = req.user!.userId;
    const { receiverId } = req.body;

    if (requesterId === receiverId) {
      return res.status(400).json({ status: 'error', message: 'Cannot connect with yourself' });
    }

    const connection = await prisma.$transaction(async (tx) => {
      const existing = await tx.connection.findFirst({
        where: {
          OR: [
            { requesterId, receiverId },
            { requesterId: receiverId, receiverId: requesterId }
          ]
        }
      });

      if (existing) {
        throw new Error('CONNECTION_EXISTS');
      }

      const conn = await tx.connection.create({
        data: { requesterId, receiverId, status: 'PENDING' }
      });

      // Notification
      await tx.notification.create({
        data: {
          userId: receiverId,
          type: 'CONNECTION_REQUEST',
          title: 'New Connection Request',
          body: 'An Algerian professional wants to connect with you on Kafa\'a.'
        }
      });

      return conn;
    });

    return res.status(201).json({ status: 'success', data: connection });
  } catch (error: any) {
    if (error.message === 'CONNECTION_EXISTS') {
      return res.status(409).json({ status: 'error', message: 'Connection request already exists' });
    }
    return res.status(500).json({ status: 'error', message: 'Failed to send connection request' });
  }
});

// 3. ACCEPT / DECLINE CONNECTION
router.patch('/:id/respond', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const connectionId = req.params.id;
    const userId = req.user!.userId;
    const { action } = req.body; // ACCEPT or DECLINE

    const connection = await prisma.connection.findUnique({ where: { id: connectionId } });
    if (!connection || connection.receiverId !== userId) {
      return res.status(403).json({ status: 'error', message: 'Unauthorized connection response' });
    }

    if (action === 'ACCEPT') {
      const updated = await prisma.$transaction(async (tx) => {
        const conn = await tx.connection.update({
          where: { id: connectionId },
          data: { status: 'ACCEPTED' }
        });

        // Increment connection counts
        await tx.profile.update({ where: { userId: conn.requesterId }, data: { connectionsCount: { increment: 1 } } });
        await tx.profile.update({ where: { userId: conn.receiverId }, data: { connectionsCount: { increment: 1 } } });

        return conn;
      });
      return res.json({ status: 'success', data: updated });
    } else {
      await prisma.connection.delete({ where: { id: connectionId } });
      return res.json({ status: 'success', message: 'Connection request declined' });
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Failed to process connection response' });
  }
});

export default router;
