import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { redis } from './config/redis';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import notificationRoutes from './routes/notification.routes';
import userRoutes from './routes/user.routes';
import quizRoutes from './routes/quiz.routes';
import resourceRoutes from './routes/resource.routes';
import leaderboardRoutes from './routes/leaderboard.routes';
import { groupRoutes } from './routes/group.routes';
import { meetingRoutes } from './routes/meeting.routes';
import { analyticsRoutes } from './routes/analytics.routes';
import { challengeRoutes } from './routes/challenge.routes';
import { adminRoutes } from './routes/admin.routes';
import { startCronJobs } from './jobs/taskReminders';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

import { LeaderboardController } from './controllers/leaderboard.controller';

// Connect to MongoDB
connectDB();

// Start background jobs
startCronJobs();

// Seed leaderboard on boot
redis.on('ready', () => {
  LeaderboardController.seedLeaderboard();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs for auth routes
  message: 'Too many auth requests from this IP, please try again after 15 minutes'
});

const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim()) 
  : ['http://localhost:3000'];

app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use('/api/', limiter);

// Routes
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/resources', resourceRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);
app.use('/api/v1/groups', groupRoutes);
app.use('/api/v1/meetings', meetingRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/challenges', challengeRoutes);
app.use('/api/v1/admin', adminRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    redis: redis.status === 'ready' ? 'connected' : 'disconnected'
  });
});


export { app };

import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

const httpServer = http.createServer(app);

// Setup Socket.io
export const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('[Socket] User connected:', socket.id);

  socket.on('join_group', (groupId: string) => {
    socket.join(`group_${groupId}`);
    console.log(`[Socket] User ${socket.id} joined group ${groupId}`);
  });

  socket.on('leave_group', (groupId: string) => {
    socket.leave(`group_${groupId}`);
    console.log(`[Socket] User ${socket.id} left group ${groupId}`);
  });

  socket.on('send_message', (data: { groupId: string; message: string; sender: any; timestamp: string }) => {
    io.to(`group_${data.groupId}`).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('[Socket] User disconnected:', socket.id);
  });
});

if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(port, () => {
    console.log(`[Server]: API is running at http://localhost:${port}`);
  });
}
