import { Router, Response } from 'express';
import { z } from 'zod';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth.middleware';
import { aiRateLimiter } from '../middleware/rateLimit';
import { validateRequest } from '../middleware/validate.middleware';

const router = Router();

const aiPromptSchema = z.object({
  body: z.object({
    prompt: z.string().min(2, 'Prompt is required').max(1000, 'Prompt exceeds max length')
  })
});

router.post('/career-advisor', authenticateJWT, aiRateLimiter, validateRequest(aiPromptSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const rawPrompt = req.body.prompt;

    // Sanitize input against prompt injection attempts
    const sanitizedPrompt = rawPrompt.replace(/ignore previous instructions|system prompt|override/gi, '[filtered]');

    let adviceText = "";
    if (sanitizedPrompt.toLowerCase().includes('cv') || sanitizedPrompt.toLowerCase().includes('resume')) {
      adviceText = `For the Algerian engineering market: 1) Emphasize full-stack & cloud architecture projects. 2) List proficiency in Arabic, French, and English. 3) Highlight experience with high-concurrency Node.js/React architectures.`;
    } else if (sanitizedPrompt.toLowerCase().includes('interview')) {
      adviceText = `Key tips for interviews at Algerian tech enterprises: Practice system design for microservices, demonstrate understanding of local payment & logistics workflows, and prepare to explain state management in modern React.`;
    } else if (sanitizedPrompt.toLowerCase().includes('salary')) {
      adviceText = `Current engineering salary benchmarks in Algiers & Oran: Mid-Level Engineers earn 140,000 – 200,000 DZD/month; Senior Tech Leads earn 220,000 – 350,000 DZD/month.`;
    } else {
      adviceText = `Based on your professional profile on Kafa'a, we recommend expanding your skills in Docker, AWS, and Next.js to increase your visibility by 40% among recruiters in Algiers, Oran & Constantine.`;
    }

    return res.json({
      status: 'success',
      data: {
        response: adviceText
      }
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'AI processing error' });
  }
});

export default router;
