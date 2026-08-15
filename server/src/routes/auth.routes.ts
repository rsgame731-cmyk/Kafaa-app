import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/rateLimit';
import { validateRequest } from '../middleware/validate.middleware';

const router = Router();
const prisma = new PrismaClient();

const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid Algerian email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    fullName: z.string().min(2, 'Full name required'),
    headline: z.string().optional(),
    wilaya: z.string().default('Algiers'),
    city: z.string().default('Bab Ezzouar'),
    role: z.enum(['PROFESSIONAL', 'STUDENT', 'JOB_SEEKER', 'FREELANCER', 'ENTREPRENEUR']).default('PROFESSIONAL')
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
  })
});

// 1. REGISTER
router.post('/register', validateRequest(registerSchema), async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, headline, wilaya, city, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        code: 'USER_EXISTS',
        message: 'An account with this email address already exists.'
      });
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
        verified: false,
        isAdmin: false,
        profile: {
          create: {
            fullName,
            headline: headline || `${role} @ ${wilaya}`,
            title: `${role} in Algeria`,
            wilaya,
            city,
            country: 'Algeria',
            bio: 'Algerian professional member on Kafa\'a.',
            skills: JSON.stringify(['Management', 'Professional'])
          }
        }
      },
      include: { profile: true }
    });

    const tokenPayload = { userId: newUser.id, role: newUser.role, isAdmin: newUser.isAdmin };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    return res.status(201).json({
      status: 'success',
      data: {
        accessToken,
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          verified: newUser.verified,
          profile: newUser.profile
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Registration failed safely' });
  }
});

// 2. LOGIN (With rate limiting)
router.post('/login', authRateLimiter, validateRequest(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      });
    }

    const isValidPassword = await verifyPassword(user.passwordHash, password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      });
    }

    const tokenPayload = { userId: user.id, role: user.role, isAdmin: user.isAdmin };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    return res.json({
      status: 'success',
      data: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          verified: user.verified,
          profile: user.profile
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Authentication failed' });
  }
});

// 3. REFRESH TOKEN
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ status: 'error', message: 'Refresh token missing' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken({ userId: decoded.userId, role: decoded.role, isAdmin: decoded.isAdmin });
    const newRefreshToken = generateRefreshToken({ userId: decoded.userId, role: decoded.role, isAdmin: decoded.isAdmin });

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.cookie('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    return res.json({ status: 'success', data: { accessToken: newAccessToken } });
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Invalid refresh token' });
  }
});

// 4. LOGOUT
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('refresh_token');
  res.clearCookie('access_token');
  return res.json({ status: 'success', message: 'Logged out successfully' });
});

// 5. GET CURRENT USER (Protected)
router.get('/me', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: { profile: true, experiences: true, education: true }
    });

    if (!user) {
      return res.status(444).json({ status: 'error', message: 'User not found' });
    }

    return res.json({
      status: 'success',
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        verified: user.verified,
        isAdmin: user.isAdmin,
        profile: user.profile,
        experiences: user.experiences,
        education: user.education
      }
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Failed to fetch user data' });
  }
});

export default router;
