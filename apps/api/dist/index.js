"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const redis_1 = require("./config/redis");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const quiz_routes_1 = __importDefault(require("./routes/quiz.routes"));
const resource_routes_1 = __importDefault(require("./routes/resource.routes"));
const leaderboard_routes_1 = __importDefault(require("./routes/leaderboard.routes"));
const group_routes_1 = require("./routes/group.routes");
const meeting_routes_1 = require("./routes/meeting.routes");
const analytics_routes_1 = require("./routes/analytics.routes");
const challenge_routes_1 = require("./routes/challenge.routes");
const admin_routes_1 = require("./routes/admin.routes");
const taskReminders_1 = require("./jobs/taskReminders");
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const port = process.env.PORT || 5001;
const leaderboard_controller_1 = require("./controllers/leaderboard.controller");
// Connect to MongoDB
(0, database_1.connectDB)();
// Start background jobs
(0, taskReminders_1.startCronJobs)();
// Seed leaderboard on boot
redis_1.redis.on('ready', () => {
    leaderboard_controller_1.LeaderboardController.seedLeaderboard();
});
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs for auth routes
    message: 'Too many auth requests from this IP, please try again after 15 minutes'
});
const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
    : ['http://localhost:3000'];
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express_1.default.json());
app.use('/api/', limiter);
// Routes
app.use('/api/v1/auth', authLimiter, auth_routes_1.default);
app.use('/api/v1/tasks', task_routes_1.default);
app.use('/api/v1/notifications', notification_routes_1.default);
app.use('/api/v1/users', user_routes_1.default);
app.use('/api/v1/quizzes', quiz_routes_1.default);
app.use('/api/v1/resources', resource_routes_1.default);
app.use('/api/v1/leaderboard', leaderboard_routes_1.default);
app.use('/api/v1/groups', group_routes_1.groupRoutes);
app.use('/api/v1/meetings', meeting_routes_1.meetingRoutes);
app.use('/api/v1/analytics', analytics_routes_1.analyticsRoutes);
app.use('/api/v1/challenges', challenge_routes_1.challengeRoutes);
app.use('/api/v1/admin', admin_routes_1.adminRoutes);
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        redis: redis_1.redis.status === 'ready' ? 'connected' : 'disconnected'
    });
});
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const httpServer = http_1.default.createServer(app);
// Setup Socket.io
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
exports.io.on('connection', (socket) => {
    console.log('[Socket] User connected:', socket.id);
    socket.on('join_group', (groupId) => {
        socket.join(`group_${groupId}`);
        console.log(`[Socket] User ${socket.id} joined group ${groupId}`);
    });
    socket.on('leave_group', (groupId) => {
        socket.leave(`group_${groupId}`);
        console.log(`[Socket] User ${socket.id} left group ${groupId}`);
    });
    socket.on('send_message', (data) => {
        exports.io.to(`group_${data.groupId}`).emit('receive_message', data);
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
