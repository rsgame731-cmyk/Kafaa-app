import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';

const router = Router();
const prisma = new PrismaClient();

const createProposalSchema = z.object({
  body: z.object({
    amountDZD: z.number().positive()
  })
});

// 1. LIST SERVICES
router.get('/', async (req, res) => {
  try {
    const category = req.query.category as string;

    const services = await prisma.service.findMany({
      where: {
        ...(category && category !== 'All' ? { category } : {})
      },
      include: {
        provider: {
          select: {
            id: true,
            verified: true,
            profile: {
              select: {
                fullName: true,
                headline: true,
                avatarUrl: true,
                wilaya: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ status: 'success', data: services });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Failed to fetch services' });
  }
});

// 2. SUBMIT SERVICE PROPOSAL / HIRE REQUEST
router.post('/:id/proposals', authenticateJWT, validateRequest(createProposalSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const serviceId = req.params.id;
    const buyerId = req.user!.userId;
    const { amountDZD } = req.body;

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return res.status(404).json({ status: 'error', message: 'Service not found' });
    }

    if (service.providerId === buyerId) {
      return res.status(400).json({ status: 'error', message: 'Cannot hire yourself for your own service' });
    }

    const proposal = await prisma.proposal.create({
      data: {
        serviceId,
        buyerId,
        amountDZD,
        status: 'PENDING'
      }
    });

    // Notify provider
    await prisma.notification.create({
      data: {
        userId: service.providerId,
        type: 'SERVICE_PROPOSAL',
        title: 'New Service Proposal',
        body: `You received a new proposal of ${amountDZD.toLocaleString()} DZD for ${service.title}`
      }
    });

    return res.status(201).json({ status: 'success', data: proposal });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Failed to submit proposal' });
  }
});

export default router;
