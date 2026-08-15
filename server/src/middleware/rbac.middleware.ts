import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || (!req.user.isAdmin && req.user.role !== 'ADMIN')) {
    return res.status(403).json({
      status: 'error',
      code: 'FORBIDDEN',
      message: 'Access denied. Administrative privileges required.'
    });
  }
  next();
}

export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || (!allowedRoles.includes(req.user.role) && !req.user.isAdmin)) {
      return res.status(403).json({
        status: 'error',
        code: 'FORBIDDEN',
        message: `Access denied. Requires one of: ${allowedRoles.join(', ')}`
      });
    }
    next();
  };
}
