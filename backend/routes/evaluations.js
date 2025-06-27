const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Evaluation = require('../models/Evaluation');
const Project = require('../models/Project');
const User = require('../models/User');

const router = express.Router();

// Middleware to authenticate JWT
const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Auth Middleware - Received token:', token ? 'Present' : 'Missing');
    if (!token) {
        console.log('Auth Middleware - No token provided');
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Auth Middleware - Decoded token:', decoded);
        if (!decoded.id) {
            console.log('Auth Middleware - Token missing user ID');
            return res.status(401).json({ message: 'Token missing user ID' });
        }
        const user = await User.findById(decoded.id).select('role name school');
        if (!user) {
            console.log('Auth Middleware - User not found');
            return res.status(401).json({ message: 'User not found' });
        }
        req.userId = decoded.id;
        req.userRole = user.role;
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth Middleware - Token verification error:', error.message);
        res.status(401).json({ message: error.message === 'jwt expired' ? 'Token expired, please log in again' : 'Invalid token' });
    }
};

// Middleware to restrict to judges or admins
const restrictToJudgeOrAdmin = (req, res, next) => {
    console.log('RestrictToJudgeOrAdmin - User role:', req.userRole);
    if (!['judge', 'admin'].includes(req.userRole)) {
        console.log('RestrictToJudgeOrAdmin - Access denied: Not a judge or admin');
        return res.status(403).json({ message: 'Access denied: Judges or Admins only' });
    }
    next();
};

// Validation for evaluation submission
const evaluationValidation = [
    body('projectId').custom((value) => mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid project ID'),
    body('scores')
        .isArray({ min: 5, max: 5 })
        .withMessage('Scores must be an array of 5 numbers'),
    body('scores.*').isInt({ min: 0, max: 5 }).withMessage('Each score must be an integer between 0 and 5'),
    body('comments').optional().isString().trim().isLength({ max: 1000 }).withMessage('Comments must be a string, max 1000 characters'),
];

// POST /api/evaluations
router.post(
    '/',
    [authenticate, restrictToJudgeOrAdmin, evaluationValidation],
    async (req, res) => {
        console.log('POST /api/evaluations hit');
        console.log('Received evaluation payload:', req.body);
        console.log('Authenticated judgeId:', req.userId);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { projectId, scores, comments } = req.body;

            // Verify project exists
            const project = await Project.findById(projectId);
            if (!project) {
                console.log('Project not found:', projectId);
                return res.status(404).json({ message: 'Project not found' });
            }
            if (!project.isSubmitted) {
                console.log('Project not submitted:', projectId);
                return res.status(400).json({ message: 'Project is not submitted' });
            }

            // Check if judge already evaluated this project
            const existingEvaluation = await Evaluation.findOne({ projectId, judgeId: req.userId });
            if (existingEvaluation) {
                console.log('Existing evaluation found:', existingEvaluation._id);
                return res.status(400).json({ message: 'You have already evaluated this project' });
            }

            // Create new evaluation
            const evaluation = new Evaluation({
                projectId,
                judgeId: req.userId,
                scores,
                comments,
                submittedAt: new Date(),
            });

            await evaluation.save();
            console.log('Evaluation created:', evaluation._id);

            // Update project status and step
            project.status = 'completed';
            project.step = project.steps.filter(step => step.status === 'Completed').length;
            project.lastSaved = new Date();
            await project.save();
            console.log('Project updated:', { id: projectId, status: project.status, step: project.step });

            // Format updated project data for frontend
            const updatedProject = {
                id: project._id.toString(),
                name: project.name || project.userId?.name || 'Unknown Team',
                school: project.school || 'N/A',
                step: project.step,
                status: project.status,
                members: project.members || 1,
                project: project.project || 'Untitled Project',
                steps: project.steps.map(step => ({
                    id: step.id,
                    title: step.title,
                    description: step.description || 'No description provided',
                })),
                submittedAt: project.lastSaved ? project.lastSaved.toISOString() : new Date().toISOString(),
            };

            res.status(201).json({ evaluation, project: updatedProject });
        } catch (error) {
            console.error('Create evaluation error:', error);
            if (error.code === 11000) {
                return res.status(400).json({ message: 'You have already evaluated this project' });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
);

module.exports = router;