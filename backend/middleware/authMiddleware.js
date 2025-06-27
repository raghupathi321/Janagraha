// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Auth Middleware - Received token:', token ? 'Present' : 'Missing');
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Auth Middleware - Decoded token:', decoded);
        req.user = decoded; // Attaches entire decoded token (includes id, role, etc.)
        next();
    } catch (err) {
        console.error('Auth Middleware - Token verification error:', err.message);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;