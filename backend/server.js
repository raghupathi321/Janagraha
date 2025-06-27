
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const evaluationRoutes = require('./routes/evaluations');
dotenv.config();
const app = express();



// Validate critical environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    console.error(`Missing environment variables: ${missingEnvVars.join(', ')}`);
    process.exit(1);
}

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());

// Serve static files from Uploads directory
const uploadDir = path.join(__dirname, 'Uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir, {
    setHeaders: (res) => {
        res.set('X-Content-Type-Options', 'nosniff');
    }
}));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
});

// Mount Routes
let projectRoutes, authRoutes;
try {
    projectRoutes = require('./routes/projects');
    authRoutes = require('./routes/auth');
    console.log('Project routes loaded:', !!projectRoutes);
    console.log('Auth routes loaded:', !!authRoutes);
} catch (error) {
    console.error('Error loading routes:', error.message);
    process.exit(1);
}
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/evaluations', evaluationRoutes);
// Catch-all for undefined routes
app.use((req, res) => {
    console.log(`Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ message: 'Route not found' });
});

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(`Server error: ${err.message}\nStack: ${err.stack}`);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});