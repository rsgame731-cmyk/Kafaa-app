import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';

const router = Router();
const prisma = new PrismaClient();

const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().optional(),
    headline: z.string().optional(),
    title: z.string().optional(),
    bio: z.string().optional(),
    wilaya: z.string().optional(),
    city: z.string().optional(),
    skills: z.array(z.string()).optional()
    // Explicitly excludes role, verified, isAdmin to prevent Mass Assignment Escalation!
  })
});

// 1. SEARCH / LIST USERS
router.get('/', async (req, res) => {
  try {
    const wilaya = req.query.wilaya as string;
    const search = req.query.search as string;

    const profiles = await prisma.profile.findMany({
      where: {
        ...(wilaya && wilaya !== 'All' ? { wilaya } : {}),
        ...(search ? {
          OR: [
            { fullName: { contains: search } },
            { headline: { contains: search } },
            { title: { contains: search } }
          ]
        } : {})
      },
      take: 20,
      include: {
        user: {
          select: {
            id: true,
            role: true,
            verified: true
          }
        }
      }
    });

    return res.json({ status: 'success', data: profiles });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Failed to fetch profiles' });
  }
});

// 2. GET SINGLE USER PROFILE (IDOR Safe: Public data only)
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        role: true,
        verified: true,
        profile: true,
        experiences: true,
        education: true
      }
    });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    return res.json({ status: 'success', data: user });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Error retrieving profile' });
  }
});

// 3. UPDATE OWN PROFILE (IDOR Protected & Mass Assignment Safe)
router.patch('/profile', authenticateJWT, validateRequest(updateProfileSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const currentUserId = req.user!.userId;
    const { fullName, headline, title, bio, wilaya, city, skills } = req.body;

    const updatedProfile = await prisma.profile.update({
      where: { userId: currentUserId },
      data: {
        ...(fullName && { fullName }),
        ...(headline && { headline }),
        ...(title && { title }),
        ...(bio && { bio }),
        ...(wilaya && { wilaya }),
        ...(city && { city }),
        ...(skills && { skills: JSON.stringify(skills) })
      }
    });

    return res.json({ status: 'success', data: updatedProfile });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Failed to update profile' });
  }
});

export default router;
