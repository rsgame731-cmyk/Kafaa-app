import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { logger } from './utils/logger';
import { apiRateLimiter } from './middleware/rateLimit';

// Import Route Modules
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import jobRoutes from './routes/job.routes';
import postRoutes from './routes/post.routes';
import connectionRoutes from './routes/connection.routes';
import messageRoutes from './routes/message.routes';
import serviceRoutes from './routes/service.routes';
import notificationRoutes from './routes/notification.routes';
import storageRoutes from './routes/storage.routes';
import aiRoutes from './routes/ai.routes';
import adminRoutes from './routes/admin.routes';
import healthRoutes from './routes/health.routes';

const app = express();
const server = http.createServer(app);

// 1. Helmet Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://*.supabase.co"]
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. Strict CORS Configuration
const allowedOrigins = [env.CORS_ORIGIN, 'http://localhost:3000', 'http://127.0.0.1:3000'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS Policy: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Body Parsing & Cookies
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// 4. Rate Limiting
app.use('/api', apiRateLimiter);

// 5. Mount API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// 6. Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled Server Error', err);
  return res.status(err.status || 500).json({
    status: 'error',
    code: err.code || 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred safely' : err.message
  });
});

// 7. WebSockets Server Integration
const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

io.on('connection', (socket) => {
  logger.info('WebSocket client connected', { socketId: socket.id });

  socket.on('join_conversation', (room) => {
    socket.join(room);
  });

  socket.on('send_message', (data) => {
    io.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    logger.info('WebSocket client disconnected', { socketId: socket.id });
  });
});

// Start Server
const PORT = env.PORT;
server.listen(PORT, () => {
  logger.info(`🚀 Kafa'a Production Server with Supabase Storage running safely on port ${PORT}`);
});

export { app, server };
