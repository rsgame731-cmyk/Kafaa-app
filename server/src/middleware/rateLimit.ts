import rateLimit from 'express-rate-limit';

// Auth routes: Stricter limits to prevent brute-force attacks (5 attempts per 15 mins)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    code: 'TOO_MANY_REQUESTS',
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  }
});

// General API rate limiter
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Rate limit exceeded. Please slow down your requests.'
  }
});

// AI Advisor rate limiter
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: {
    status: 'error',
    code: 'AI_RATE_LIMIT',
    message: 'Career AI request limit reached. Please wait a minute.'
  }
});
