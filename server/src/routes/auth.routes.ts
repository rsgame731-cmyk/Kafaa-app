import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/rateLimit';
import { validateRequest } from '../middleware/validate.middleware';
import { supabaseAdmin } from '../config/supabase';
import { logger } from '../utils/logger';

const router = Router();

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
    const now = new Date().toISOString();

    // Check if user already exists
    const { data: existingUser, error: checkErr } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (checkErr && checkErr.code !== 'PGRST116') {
      logger.error('Error checking existing user in Supabase', checkErr);
    }

    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        code: 'USER_EXISTS',
        message: 'An account with this email address already exists.'
      });
    }

    const passwordHash = await hashPassword(password);
    const userId = randomUUID();
    const profileId = randomUUID();

    // Create User record
    const { data: newUser, error: userCreateErr } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        email,
        passwordHash,
        role,
        verified: false,
        isAdmin: false,
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now
      })
      .select()
      .single();

    if (userCreateErr) {
      logger.error('Failed to create user in Supabase', userCreateErr);
      return res.status(500).json({ status: 'error', message: 'Failed to create user account' });
    }

    // Create Profile record
    const { data: newProfile, error: profileCreateErr } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: profileId,
        userId,
        fullName,
        headline: headline || `${role} @ ${wilaya}`,
        wilaya,
        city,
        country: 'Algeria',
        about: 'Algerian professional member on Kafa\'a.',
        skills: JSON.stringify(['Management', 'Professional']),
        createdAt: now,
        updatedAt: now
      })
      .select()
      .single();

    if (profileCreateErr) {
      logger.error('Failed to create profile in Supabase', profileCreateErr);
    }

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
          profile: newProfile || {
            fullName,
            headline: headline || `${role} @ ${wilaya}`,
            wilaya,
            city,
            country: 'Algeria'
          }
        }
      }
    });
  } catch (error) {
    logger.error('Registration failed safely', error);
    return res.status(500).json({ status: 'error', message: 'Registration failed safely' });
  }
});

// 2. LOGIN (With rate limiting)
router.post('/login', authRateLimiter, validateRequest(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { data: user, error: userErr } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (userErr || !user) {
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

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('userId', user.id)
      .maybeSingle();

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
          profile: profile || null
        }
      }
    });
  } catch (error) {
    logger.error('Authentication failed in login', error);
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
    const userId = req.user!.userId;

    const { data: user, error: userErr } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (userErr || !user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const [profileRes, expRes, eduRes] = await Promise.all([
      supabaseAdmin.from('profiles').select('*').eq('userId', userId).maybeSingle(),
      supabaseAdmin.from('experiences').select('*').eq('userId', userId),
      supabaseAdmin.from('educations').select('*').eq('userId', userId)
    ]);

    return res.json({
      status: 'success',
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        verified: user.verified,
        isAdmin: user.isAdmin,
        profile: profileRes.data || null,
        experiences: expRes.data || [],
        education: eduRes.data || []
      }
    });
  } catch (error) {
    logger.error('Failed to fetch me user data', error);
    return res.status(500).json({ status: 'error', message: 'Failed to fetch user data' });
  }
});

export default router;
