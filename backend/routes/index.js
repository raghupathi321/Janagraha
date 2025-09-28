const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const {
    Student,
    Course,
    Certificate,
    Achievement,
    Event,
    Notification,
    Attendance,
    Feedback,
    AssignmentSubmission
} = require('../models');

const JWT_SECRET = 'your_jwt_secret_key'; // Replace with a secure key in production

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access token required' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = user;
        next();
    });
};

// Login
router.post('/login', [
    body('email').isEmail(),
    body('password').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
        const student = await Student.findOne({ email });
        if (!student) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: student._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get student profile
router.get('/students/me', authenticateToken, async (req, res) => {
    try {
        const student = await Student.findById(req.user.id).select('-password');
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update student profile
router.put('/students/me', authenticateToken, [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('phone').optional().isMobilePhone(),
    body('location').optional(),
    body('bio').optional()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const student = await Student.findByIdAndUpdate(
            req.user.id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).select('-password');
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update student password
router.put('/students/password', authenticateToken, [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { currentPassword, newPassword } = req.body;
    try {
        const student = await Student.findById(req.user.id);
        const isMatch = await bcrypt.compare(currentPassword, student.password);
        if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

        student.password = await bcrypt.hash(newPassword, 10);
        await student.save();
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get courses
router.get('/courses', authenticateToken, async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get certificates
router.get('/certificates', authenticateToken, async (req, res) => {
    try {
        const certificates = await Certificate.find({ studentId: req.user.id });
        res.json(certificates);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get achievements
router.get('/achievements', authenticateToken, async (req, res) => {
    try {
        const achievements = await Achievement.find({ studentId: req.user.id });
        res.json(achievements);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get events
router.get('/events', authenticateToken, async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get notifications
router.get('/notifications', authenticateToken, async (req, res) => {
    try {
        const notifications = await Notification.find({ studentId: req.user.id }).sort({ time: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get attendance
router.get('/attendance', authenticateToken, async (req, res) => {
    try {
        const attendance = await Attendance.find({ studentId: req.user.id });
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit feedback
router.post('/feedback', authenticateToken, [
    body('type').notEmpty(),
    body('message').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const feedback = new Feedback({
            studentId: req.user.id,
            courseId: req.body.courseId || null,
            type: req.body.type,
            message: req.body.message
        });
        await feedback.save();
        res.json({ message: 'Feedback submitted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit assignment
router.post('/assignments/submit', authenticateToken, (req, res) => {
    // Multer middleware is applied in server.js for this route
    const { courseId, assignmentId } = req.body;
    if (!req.file) return res.status(400).json({ message: 'File is required' });

    try {
        Course.findById(courseId).then(course => {
            if (!course) return res.status(404).json({ message: 'Course not found' });

            const assignment = course.assignments.find(a => a.id === assignmentId);
            if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

            assignment.status = 'submitted';
            course.save().then(() => {
                const submission = new AssignmentSubmission({
                    studentId: req.user.id,
                    courseId,
                    assignmentId,
                    filePath: req.file.path
                });
                submission.save().then(() => res.json(course))
                    .catch(err => res.status(500).json({ message: 'Server error' }));
            }).catch(err => res.status(500).json({ message: 'Server error' }));
        }).catch(err => res.status(500).json({ message: 'Server error' }));
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;