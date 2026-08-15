import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';

const router = Router();
const prisma = new PrismaClient();

const sendMessageSchema = z.object({
  body: z.object({
    receiverId: z.string().uuid('Invalid recipient ID'),
    text: z.string().min(1, 'Message text cannot be empty').max(2000)
  })
});

// 1. GET CONVERSATIONS LIST FOR LOGGED IN USER (Strict privacy guard)
router.get('/conversations', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, profile: { select: { fullName: true, avatarUrl: true, headline: true } } } },
        receiver: { select: { id: true, profile: { select: { fullName: true, avatarUrl: true, headline: true } } } }
      }
    });

    // Group messages into distinct conversations
    const convMap = new Map();
    for (const msg of messages) {
      const partner = msg.senderId === userId ? msg.receiver : msg.sender;
      if (!convMap.has(partner.id)) {
        convMap.set(partner.id, {
          partnerId: partner.id,
          partnerName: partner.profile?.fullName || 'Algerian Professional',
          partnerAvatar: partner.profile?.avatarUrl,
          partnerHeadline: partner.profile?.headline,
          lastMessage: msg.text,
          lastMessageTime: msg.createdAt,
          unreadCount: (!msg.isRead && msg.receiverId === userId) ? 1 : 0
        });
      }
    }

    return res.json({ status: 'success', data: Array.from(convMap.values()) });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Failed to fetch conversations' });
  }
});

// 2. GET MESSAGES WITH A SPECIFIC USER (IDOR & Membership Guarded)
router.get('/:partnerId', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const partnerId = req.params.partnerId;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });

    // Mark unread messages as read
    await prisma.message.updateMany({
      where: { senderId: partnerId, receiverId: userId, isRead: false },
      data: { isRead: true }
    });

    return res.json({ status: 'success', data: messages });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Failed to retrieve messages' });
  }
});

// 3. SEND DIRECT MESSAGE
router.post('/', authenticateJWT, validateRequest(sendMessageSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const senderId = req.user!.userId;
    const { receiverId, text } = req.body;

    if (senderId === receiverId) {
      return res.status(400).json({ status: 'error', message: 'Cannot send message to yourself' });
    }

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        text,
        isRead: false
      }
    });

    return res.status(201).json({ status: 'success', data: message });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Failed to send message' });
  }
});

export default router;
