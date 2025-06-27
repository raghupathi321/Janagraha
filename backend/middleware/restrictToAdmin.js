// backend/middleware/restrictToAdmin.js
const restrictToAdmin = (req, res, next) => {
    console.log('RestrictToAdmin - User role:', req.user?.role);
    if (!req.user || req.user.role !== 'admin') {
        console.log('RestrictToAdmin - Access denied: Not an admin');
        return res.status(403).json({ success: false, errors: { submit: 'Access denied: Admins only' } });
    }
    next();
};

module.exports = restrictToAdmin;