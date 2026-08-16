import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';

const router = Router();
const prisma = new PrismaClient();

const createPostSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Post content cannot be empty').max(3000, 'Post content exceeds maximum length'),
    imageUrl: z.string().url().optional().or(z.literal('')),
    wilaya: z.string().default('Algiers')
  })
});

// 1. GET FEED WITH CURSOR PAGINATION (High-performance, no unbounded queries)
router.get('/feed', async (req, res) => {
  try {
    const cursor = req.query.cursor as string;
    const limit = Math.min(parseInt((req.query.limit as string) || '10'), 30);

    const posts = await prisma.post.findMany({
      take: limit + 1, // Fetch one extra to determine next cursor
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            role: true,
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
        },
        _count: {
          select: { reactions: true, comments: true }
        }
      }
    });

    let nextCursor: string | null = null;
    if (posts.length > limit) {
      const nextItem = posts.pop();
      nextCursor = nextItem?.id || null;
    }

    return res.json({
      status: 'success',
      data: {
        posts,
        nextCursor
      }
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Failed to fetch feed' });
  }
});

// 2. CREATE POST
router.post('/', authenticateJWT, validateRequest(createPostSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { content, imageUrl, wilaya } = req.body;
    const authorId = req.user!.userId;

    const post = await prisma.post.create({
      data: {
        authorId,
        content,
        imageUrl: imageUrl || null,
        wilaya: wilaya || 'Algiers'
      },
      include: {
        author: {
          select: {
            id: true,
            verified: true,
            profile: true
          }
        }
      }
    });

    return res.status(201).json({ status: 'success', data: post });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Failed to create post' });
  }
});

// 3. TOGGLE LIKE / REACTION
router.post('/:id/like', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = req.user!.userId;

    const existingReaction = await prisma.reaction.findUnique({
      where: { postId_userId: { postId, userId } }
    });

    if (existingReaction) {
      await prisma.reaction.delete({
        where: { id: existingReaction.id }
      });
      return res.json({ status: 'success', liked: false });
    } else {
      await prisma.reaction.create({
        data: { postId, userId, type: 'LIKE' }
      });
      return res.json({ status: 'success', liked: true });
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Failed to toggle reaction' });
  }
});

// 4. GET COMMENTS FOR A POST
router.get('/:id/comments', async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            verified: true,
            profile: {
              select: {
                fullName: true,
                headline: true,
                avatarUrl: true
              }
            }
          }
        }
      }
    });

    return res.json({ status: 'success', data: comments });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Failed to fetch comments' });
  }
});

// 5. POST A COMMENT
router.post('/:id/comments', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;
    const authorId = req.user!.userId;

    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ status: 'error', message: 'Comment content cannot be empty' });
    }

    const newComment = await prisma.comment.create({
      data: {
        postId,
        authorId,
        content: content.trim()
      },
      include: {
        author: {
          select: {
            id: true,
            verified: true,
            profile: {
              select: {
                fullName: true,
                headline: true,
                avatarUrl: true
              }
            }
          }
        }
      }
    });

    return res.status(201).json({ status: 'success', data: newComment });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Failed to create comment' });
  }
});

export default router;

