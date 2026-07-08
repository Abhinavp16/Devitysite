const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();
const connectMongoDB = require('./config/mongodb');

const authRoutes = require('./routes/auth');
const memoriesRoutes = require('./routes/memories');
const eventsRoutes = require('./routes/events');
const teamRoutes = require('./routes/team');
const speakersRoutes = require('./routes/speakers');
const dashboardRoutes = require('./routes/dashboard');
const publicRoutes = require('./routes/public');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'https://devityclub.com',
    'https://www.devityclub.com',
    'https://devitysite.vercel.app',
    process.env.FRONTEND_URL
].filter(Boolean);

const isAllowedOrigin = (origin) => {
    if (!origin) return true;
    if (allowedOrigins.includes(origin)) return true;

    try {
        const { hostname } = new URL(origin);
        return hostname.endsWith('.vercel.app');
    } catch (error) {
        return false;
    }
};

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
    max: process.env.RATE_LIMIT_MAX || 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    }
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
    origin: (origin, callback) => {
        const localOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
        const isAllowed = process.env.NODE_ENV === 'production'
            ? isAllowedOrigin(origin)
            : !origin || localOrigins.includes(origin);

        callback(isAllowed ? null : new Error('Not allowed by CORS'), isAllowed);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/api/db-health', async (req, res) => {
    try {
        const connection = await connectMongoDB();

        res.json({
            status: 'OK',
            database: connection.name,
            readyState: connection.readyState
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            error: 'MongoDB connection failed',
            reason: error.message,
            hint: 'Check MONGODB_URI in Vercel and allow Vercel outbound IPs in MongoDB Atlas Network Access.'
        });
    }
});

app.use('/api', async (req, res, next) => {
    try {
        await connectMongoDB();
        next();
    } catch (error) {
        next(error);
    }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/memories', memoriesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/speakers', speakersRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/public', publicRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            error: 'Invalid JSON in request body'
        });
    }
    
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            error: 'File too large'
        });
    }
    
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
});

const startServer = async () => {
    await connectMongoDB();

    app.listen(PORT, () => {
        console.log(`DevityClub Backend Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`API Base URL: http://localhost:${PORT}/api`);

        if (process.env.NODE_ENV !== 'production') {
            console.log('\nAvailable Endpoints:');
            console.log('   GET  /api/health - Health check');
            console.log('   POST /api/auth/login - Admin login');
            console.log('   GET  /api/dashboard/stats - Dashboard statistics');
            console.log('   GET  /api/memories - Get all memories');
            console.log('   POST /api/memories - Create memory');
            console.log('   GET  /api/events - Get all events');
            console.log('   POST /api/events - Create event');
            console.log('   GET  /api/team - Get all team members');
            console.log('   POST /api/team - Create team member');
            console.log('   GET  /api/speakers - Get all speakers');
            console.log('   POST /api/speakers - Create speaker');
        }
    });
};

if (require.main === module) {
    startServer().catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });
}

module.exports = app;
