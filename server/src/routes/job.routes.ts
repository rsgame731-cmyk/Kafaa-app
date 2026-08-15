import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';

const router = Router();
const prisma = new PrismaClient();

const createJobSchema = z.object({
  body: z.object({
    companyId: z.string().uuid('Invalid company ID'),
    title: z.string().min(3, 'Job title is required'),
    wilaya: z.string().default('Algiers'),
    worktype: z.enum(['ONSITE', 'HYBRID', 'REMOTE']).default('HYBRID'),
    contractType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE']).default('FULL_TIME'),
    salaryMinDZD: z.number().positive(),
    salaryMaxDZD: z.number().positive(),
    experienceLevel: z.string().default('Mid'),
    description: z.string().min(10, 'Job description required'),
    requirements: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([])
  })
});

// 1. GET ALL JOBS
router.get('/', async (req, res) => {
  try {
    const wilaya = req.query.wilaya as string;
    const worktype = req.query.worktype as string;

    const jobs = await prisma.job.findMany({
      where: {
        ...(wilaya && wilaya !== 'All' ? { wilaya } : {}),
        ...(worktype && worktype !== 'All' ? { worktype } : {})
      },
      include: { company: true },
      orderBy: { postedAt: 'desc' }
    });

    return res.json({ status: 'success', data: jobs });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Failed to fetch jobs' });
  }
});

// 2. GET SINGLE JOB DETAIL
router.get('/:id', async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id },
      include: { company: true }
    });

    if (!job) {
      return res.status(404).json({ status: 'error', message: 'Job opportunity not found' });
    }

    return res.json({ status: 'success', data: job });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Failed to fetch job details' });
  }
});

// 3. CREATE JOB (Recruiter / Company Guarded)
router.post('/', authenticateJWT, validateRequest(createJobSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { companyId, title, wilaya, worktype, contractType, salaryMinDZD, salaryMaxDZD, experienceLevel, description, requirements, tags } = req.body;

    const job = await prisma.job.create({
      data: {
        companyId,
        title,
        wilaya,
        worktype,
        contractType,
        salaryMinDZD,
        salaryMaxDZD,
        experienceLevel,
        description,
        requirements: JSON.stringify(requirements),
        tags: JSON.stringify(tags)
      },
      include: { company: true }
    });

    return res.status(201).json({ status: 'success', data: job });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Failed to create job posting' });
  }
});

// 4. APPLY TO JOB (Race condition safe via Prisma Transactions & unique constraint)
router.post('/:id/apply', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const jobId = req.params.id;
    const userId = req.user!.userId;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return res.status(404).json({ status: 'error', message: 'Job not found' });
    }

    // Execute atomic transaction
    const application = await prisma.$transaction(async (tx) => {
      const existing = await tx.application.findUnique({
        where: { jobId_userId: { jobId, userId } }
      });

      if (existing) {
        throw new Error('ALREADY_APPLIED');
      }

      const app = await tx.application.create({
        data: { jobId, userId, status: 'PENDING' }
      });

      await tx.job.update({
        where: { id: jobId },
        data: { applicantsCount: { increment: 1 } }
      });

      return app;
    });

    return res.status(201).json({ status: 'success', data: application });
  } catch (error: any) {
    if (error.message === 'ALREADY_APPLIED') {
      return res.status(409).json({ status: 'error', code: 'DUPLICATE', message: 'You have already applied to this job' });
    }
    return res.status(500).json({ status: 'error', message: 'Application processing failed' });
  }
});

// 5. MY APPLICATIONS
router.get('/applications/my', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.user!.userId },
      include: { job: { include: { company: true } } },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ status: 'success', data: applications });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Failed to fetch applications' });
  }
});

export default router;
