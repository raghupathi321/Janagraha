const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Project = require('../models/Project'); // Adjust path as necessary
const authMiddleware = require('../middleware/authMiddleware'); // Adjust path as necessary
const mongoose = require('mongoose');

// --- Multer Configuration for File Uploads ---
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'Uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Created upload directory: ${uploadDir}`);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/png", "image/jpeg", "image/gif",
        "video/mp4", "video/quicktime", "video/webm",
        "application/pdf",
        "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "audio/mpeg", "audio/wav", "audio/ogg",
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Allowed: Images, Videos, PDFs, Word Docs, Audio."), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB file size limit
});

// --- Initial Project Data Seeding (for development) ---
// IMPORTANT: Updated `status` enum values and `step` to `currentStepIndex`
const seedProjects = async () => {
    try {
        const projectCount = await Project.countDocuments();
        if (projectCount === 0) {
            console.log('No projects found, seeding initial data...');
            const initialProjects = [
                {
                    userId: new mongoose.Types.ObjectId(),
                    name: "Team Innovators",
                    project: "Smart Waste Management System",
                    school: "Metropolis High School",
                    members: 4,
                    status: "draft", // Changed from "in-progress" to "draft"
                    currentStepIndex: 5, // Changed from "step" to "currentStepIndex"
                    submittedAt: null,
                    isSubmitted: false,
                    overallProgress: 100,
                    steps: [
                        { id: 1, title: "Identify a Civic Problem", description: "Identified excessive landfill waste as a major urban problem. Investigated local waste disposal habits and current recycling infrastructure.", status: "Completed", location: "Downtown Recycling Center", affectedPopulation: "Urban Residents", tags: ["waste", "environment"], urgency: "high" },
                        { id: 2, title: "Study the Problem", description: "Conducted surveys and interviews with residents and waste management officials. Researched existing smart waste solutions globally. Analyzed waste composition data.", status: "Completed", keyFindings: "Lack of citizen engagement, inefficient sorting at source, overflow of bins.", researchMethods: ["survey", "interview"], dataCollected: "Waste composition, resident feedback" },
                        { id: 3, title: "Propose a Solution", description: "Developing a proposal for an IoT-enabled smart bin system with automated compaction and real-time fill level monitoring. Aiming for public and private partnerships.", status: "Completed", solutionType: "Technological Infrastructure", timeline: "6 months", budget: "$50,000", resources: ["IoT sensors", "funding"] },
                        { id: 4, title: "Engage Stakeholders", description: "Planned meetings with municipal waste department and local community leaders to gather feedback and support.", status: "Completed", stakeholders: ["Municipal Waste Dept", "Community Leaders"], meetingDates: ["2025-05-10", "2025-05-20"], feedback: "Positive reception, concerns about cost." },
                        { id: 5, title: "Implement Solution", description: "Future plans involve pilot project implementation in selected neighborhoods, followed by city-wide rollout based on success metrics.", status: "Completed", implementationDate: "2026-01-01", outcomes: "Reduced overflow, improved recycling rates.", lessons: "Pilot project crucial.", nextSteps: "Secure phase 2 funding." }
                    ]
                },
                {
                    userId: new mongoose.Types.ObjectId(),
                    name: "Green Future",
                    project: "Community Garden & Composting Initiative",
                    school: "Eco University",
                    members: 5,
                    status: "submitted", // Changed from "completed" to "submitted"
                    currentStepIndex: 5, // Changed from "step"
                    submittedAt: new Date(),
                    isSubmitted: true,
                    overallProgress: 100,
                    steps: [
                        { id: 1, title: "Identify a Civic Problem", description: "Identified lack of green spaces and food waste as dual problems in urban areas. Focused on creating sustainable food sources locally.", status: "Completed", location: "City Park", affectedPopulation: "Local Community", tags: ["sustainability", "food security"], urgency: "medium" },
                        { id: 2, title: "Study the Problem", description: "Researched soil quality, community interest, and successful urban gardening models. Found a strong desire for green spaces.", status: "Completed", keyFindings: "High demand for fresh produce, significant food waste from households.", researchMethods: ["community survey"], dataCollected: "Interest levels, waste volume" },
                        { id: 3, title: "Propose a Solution", description: "Proposed a community-managed garden with integrated composting units for local food waste, providing nutrient-rich soil.", status: "Completed", solutionType: "Community-based Environmental Solution", timeline: "3 months", budget: "$10,000", resources: ["land", "volunteers"] },
                        { id: 4, title: "Engage Stakeholders", description: "Secured partnerships with local government, community centers, and volunteer groups. Gathered extensive feedback on garden design and rules.", status: "Completed", stakeholders: ["Local Gov", "Community Centers"], meetingDates: ["2024-11-15"], feedback: "Positive reception, suggestions for water conservation and pest control." },
                        { id: 5, title: "Implement Solution", description: "Successfully established the community garden. Initial harvests are underway, and composting units are operational. Regular workshops for residents initiated.", status: "Completed", implementationDate: "2025-03-01", outcomes: "Increased local food security, reduced landfill waste, enhanced community cohesion.", lessons: "Community engagement is key.", nextSteps: "Expand garden area." }
                    ]
                },
                {
                    userId: new mongoose.Types.ObjectId(),
                    name: "Civic Coders",
                    project: "Local Election Transparency Platform",
                    school: "Algorithm Academy",
                    members: 3,
                    status: "draft", // Changed from "pending" to "draft"
                    currentStepIndex: 1, // Changed from "step"
                    submittedAt: null,
                    isSubmitted: false,
                    overallProgress: 0,
                    steps: [
                        { id: 1, title: "Identify a Civic Problem", description: "Identified low voter turnout and public distrust in local elections due to perceived lack of transparency.", status: "Not Started", location: "Municipal Election Office", affectedPopulation: "Voters and Citizens", tags: ["democracy", "transparency"], urgency: "high" },
                        { id: 2, title: "Study the Problem", description: "", status: "Not Started", researchMethods: [], dataCollected: "", keyFindings: "" },
                        { id: 3, title: "Propose a Solution", description: "", status: "Not Started", solutionType: "", timeline: "", budget: "", resources: [] },
                        { id: 4, title: "Engage Stakeholders", description: "", status: "Not Started", stakeholders: [], meetingDates: [], feedback: "" },
                        { id: 5, title: "Implement Solution", description: "", status: "Not Started", implementationDate: "", outcomes: "", lessons: "", nextSteps: "" }
                    ]
                }
            ];
            await Project.insertMany(initialProjects);
            console.log('Initial projects seeded successfully.');
        }
    } catch (error) {
        console.error('Error seeding projects:', error);
    }
};

// Call the seed function when this module is loaded (e.g., on server start)
seedProjects();

// --- Project Management Routes ---

// @route   GET /api/projects/me
// @desc    Get the authenticated user's project
// @access  Private (User/Team Member only)
router.get("/me", authMiddleware, async (req, res, next) => {
    try {
        const project = await Project.findOne({ userId: req.user.id });
        if (!project) {
            return res.status(404).json({ success: false, message: "No project found for this user" });
        }
        res.status(200).json({ success: true, project });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/projects
// @desc    Create a new project for the authenticated user
// @access  Private (User/Team Member only)
router.post("/", authMiddleware, async (req, res, next) => {
    try {
        const { name, project: projectName, school, members } = req.body;

        const existingProject = await Project.findOne({ userId: req.user.id });
        if (existingProject) {
            return res.status(400).json({ success: false, message: "You already have an existing project. You can only create one." });
        }

        // Define initial steps with default empty values for ALL fields present in schema
        const initialSteps = [
            { id: 1, title: "Identify a Civic Problem", description: "", status: "Not Started", photos: [], videos: [], reports: [], audio: null, location: "", affectedPopulation: "", tags: [], urgency: "medium" },
            { id: 2, title: "Study the Problem", description: "", status: "Not Started", photos: [], videos: [], reports: [], audio: null, researchMethods: [], dataCollected: "", keyFindings: "" },
            { id: 3, title: "Propose a Solution", description: "", status: "Not Started", photos: [], videos: [], reports: [], audio: null, solutionType: "", timeline: "", budget: "", resources: [] },
            { id: 4, title: "Engage Stakeholders", description: "", status: "Not Started", photos: [], videos: [], reports: [], audio: null, stakeholders: [], meetingDates: [], feedback: "" },
            { id: 5, title: "Implement Solution", description: "", status: "Not Started", photos: [], videos: [], reports: [], audio: null, implementationDate: "", outcomes: "", lessons: "", nextSteps: "" },
        ];

        const newProject = new Project({
            userId: req.user.id,
            name: name || "Untitled Team",
            project: projectName || "Untitled Project",
            school: school || "Unknown School",
            members: members || 1,
            steps: initialSteps,
            currentStepIndex: 1, // Use new name
            status: "draft", // Use new enum value
            isSubmitted: false,
            lastSaved: new Date(),
            overallProgress: 0,
        });

        await newProject.save();
        res.status(201).json({ success: true, project: newProject });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = {};
            for (let field in error.errors) {
                validationErrors[field] = error.errors[field].message;
            }
            return res.status(400).json({ success: false, message: "Validation Error", errors: validationErrors });
        }
        next(error);
    }
});

// @route   PUT /api/projects/:id
// @desc    Update an existing project (project details and step content)
// @access  Private (User/Team Member only, must own the project)
router.put("/:id", authMiddleware, async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        if (project.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Forbidden: You do not own this project" });
        }
        if (project.isSubmitted) {
            return res.status(400).json({ success: false, message: "Cannot update a submitted project" });
        }

        // Destructure all expected fields from the request body
        const { steps, name, project: projectName, school, members, currentStepIndex } = req.body; // Added currentStepIndex

        // Update top-level project fields if provided in the request body
        if (name !== undefined) project.name = name;
        if (projectName !== undefined) project.project = projectName;
        if (school !== undefined) project.school = school;
        if (members !== undefined) project.members = members;
        // Update currentStepIndex if provided
        if (currentStepIndex !== undefined) project.currentStepIndex = currentStepIndex;

        if (steps && Array.isArray(steps)) {
            if (steps.length !== 5 || !steps.every(s => typeof s.id === 'number' && s.id >= 1 && s.id <= 5)) {
                return res.status(400).json({ success: false, message: "Invalid steps array structure or content. Expected 5 steps with IDs 1-5." });
            }

            const incomingStepsMap = new Map(steps.map(s => [s.id, s]));

            project.steps = project.steps.map(existingStep => {
                const updatedData = incomingStepsMap.get(existingStep.id);
                if (updatedData) {
                    const newStep = {
                        ...existingStep.toObject(),
                        ...updatedData,
                        status: ["Not Started", "In Progress", "Completed"].includes(updatedData.status) ? updatedData.status : existingStep.status,
                        urgency: ["low", "medium", "high"].includes(updatedData.urgency) ? updatedData.urgency : existingStep.urgency,
                    };

                    newStep.photos = Array.isArray(updatedData.photos) ? updatedData.photos : (existingStep.photos || []);
                    newStep.videos = Array.isArray(updatedData.videos) ? updatedData.videos : (existingStep.videos || []);
                    newStep.reports = Array.isArray(updatedData.reports) ? updatedData.reports : (existingStep.reports || []);
                    newStep.tags = Array.isArray(updatedData.tags) ? updatedData.tags : (existingStep.tags || []);
                    newStep.researchMethods = Array.isArray(updatedData.researchMethods) ? updatedData.researchMethods : (existingStep.researchMethods || []);
                    newStep.resources = Array.isArray(updatedData.resources) ? updatedData.resources : (existingStep.resources || []);
                    newStep.stakeholders = Array.isArray(updatedData.stakeholders) ? updatedData.stakeholders : (existingStep.stakeholders || []);
                    newStep.meetingDates = Array.isArray(updatedData.meetingDates) ? updatedData.meetingDates : (existingStep.meetingDates || []);

                    newStep.audio = updatedData.audio || null;

                    newStep.description = (typeof updatedData.description === 'string') ? updatedData.description.trim() : (existingStep.description || '');
                    newStep.location = (typeof updatedData.location === 'string') ? updatedData.location.trim() : (existingStep.location || '');
                    newStep.affectedPopulation = (typeof updatedData.affectedPopulation === 'string') ? updatedData.affectedPopulation.trim() : (existingStep.affectedPopulation || '');
                    newStep.dataCollected = (typeof updatedData.dataCollected === 'string') ? updatedData.dataCollected.trim() : (existingStep.dataCollected || '');
                    newStep.keyFindings = (typeof updatedData.keyFindings === 'string') ? updatedData.keyFindings.trim() : (existingStep.keyFindings || '');
                    newStep.solutionType = (typeof updatedData.solutionType === 'string') ? updatedData.solutionType.trim() : (existingStep.solutionType || '');
                    newStep.timeline = (typeof updatedData.timeline === 'string') ? updatedData.timeline.trim() : (existingStep.timeline || '');
                    newStep.budget = (typeof updatedData.budget === 'string') ? updatedData.budget.trim() : (existingStep.budget || '');
                    newStep.feedback = (typeof updatedData.feedback === 'string') ? updatedData.feedback.trim() : (existingStep.feedback || '');
                    newStep.implementationDate = (typeof updatedData.implementationDate === 'string') ? updatedData.implementationDate.trim() : (existingStep.implementationDate || '');
                    newStep.outcomes = (typeof updatedData.outcomes === 'string') ? updatedData.outcomes.trim() : (existingStep.outcomes || '');
                    newStep.lessons = (typeof updatedData.lessons === 'string') ? updatedData.lessons.trim() : (existingStep.lessons || '');
                    newStep.nextSteps = (typeof updatedData.nextSteps === 'string') ? updatedData.nextSteps.trim() : (existingStep.nextSteps || '');

                    return newStep;
                }
                return existingStep;
            });
        }

        // Recalculate overall project status and progress based on updated steps
        const completedStepsCount = project.steps.filter(s => s.status === "Completed").length;
        if (completedStepsCount === project.steps.length) {
            project.status = "submitted"; // All steps completed, ready for submission or already submitted
        } else if (completedStepsCount > 0) {
            project.status = "draft"; // At least one step completed, but not all. It's a draft.
        } else {
            project.status = "draft"; // No steps completed, still a draft.
        }
        project.overallProgress = Math.round((completedStepsCount / project.steps.length) * 100);
        project.lastSaved = new Date();

        await project.save();
        res.status(200).json({ success: true, project });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = {};
            for (let field in error.errors) {
                validationErrors[field] = error.errors[field].message;
            }
            return res.status(400).json({ success: false, message: "Validation Error", errors: validationErrors });
        }
        next(error);
    }
});

// @route   POST /api/projects/:id/upload
// @desc    Upload files (photos, videos, reports, audio) to a specific project step
// @access  Private (User/Team Member only, must own the project)
router.post("/:id/upload", authMiddleware, upload.fields([
    { name: "photos", maxCount: 10 },
    { name: "videos", maxCount: 5 },
    { name: "reports", maxCount: 5 },
    { name: "audio", maxCount: 1 },
]), async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const stepId = parseInt(req.body.stepId);

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        if (project.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Forbidden: You do not own this project" });
        }
        if (project.isSubmitted) {
            return res.status(400).json({ success: false, message: "Cannot upload files to a submitted project" });
        }

        if (!Number.isInteger(stepId) || stepId < 1 || stepId > project.steps.length) {
            return res.status(400).json({ success: false, message: "Invalid step ID provided for upload" });
        }

        const step = project.steps.find(s => s.id === stepId);
        if (!step) {
            return res.status(400).json({ success: false, message: "Project step not found" });
        }

        const files = req.files;

        if (files.photos) {
            const newPhotos = files.photos.map(file => ({
                name: file.originalname,
                url: `/uploads/${file.filename}`,
                size: file.size,
                type: file.mimetype,
            }));
            step.photos.push(...newPhotos);
        }
        if (files.videos) {
            const newVideos = files.videos.map(file => ({
                name: file.originalname,
                url: `/uploads/${file.filename}`,
                size: file.size,
                type: file.mimetype,
            }));
            step.videos.push(...newVideos);
        }
        if (files.reports) {
            const newReports = files.reports.map(file => ({
                name: file.originalname,
                url: `/uploads/${file.filename}`,
                size: file.size,
                type: file.mimetype,
            }));
            step.reports.push(...newReports);
        }
        if (files.audio && files.audio.length > 0) {
            if (step.audio && step.audio.url) {
                const oldFilePath = path.join(uploadDir, path.basename(step.audio.url));
                if (fs.existsSync(oldFilePath)) {
                    fs.unlink(oldFilePath, (err) => {
                        if (err) console.error(`Error deleting old audio file ${oldFilePath}:`, err);
                        else console.log(`Successfully deleted old audio file: ${oldFilePath}`);
                    });
                }
            }
            step.audio = {
                name: files.audio[0].originalname,
                url: `/uploads/${files.audio[0].filename}`,
                size: files.audio[0].size,
                type: files.audio[0].mimetype,
            };
        }

        if (step.status === "Not Started" && (files.photos?.length || files.videos?.length || files.reports?.length || (files.audio?.length > 0))) {
            step.status = "In Progress";
        }

        project.lastSaved = new Date();
        await project.save();
        res.status(200).json({ success: true, message: "Files uploaded successfully", project });
    } catch (error) {
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ success: false, message: error.message });
        }
        if (error.message === "Invalid file type. Allowed: Images, Videos, PDFs, Word Docs, Audio.") {
            return res.status(400).json({ success: false, message: error.message });
        }
        next(error);
    }
});

// @route   DELETE /api/projects/:id/files
// @desc    Delete a specific file (photo, video, report, or audio) from a project step
// @access  Private (User/Team Member only, must own the project)
router.delete("/:id/files", authMiddleware, async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const { stepId, field, fileIndex } = req.body;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        if (project.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Forbidden: You do not own this project" });
        }
        if (project.isSubmitted) {
            return res.status(400).json({ success: false, message: "Cannot delete files from a submitted project" });
        }

        if (!Number.isInteger(stepId) || stepId < 1 || stepId > project.steps.length) {
            return res.status(400).json({ success: false, message: "Invalid step ID" });
        }
        if (!["photos", "videos", "reports", "audio"].includes(field)) {
            return res.status(400).json({ success: false, message: "Invalid file field specified" });
        }

        const step = project.steps.find(s => s.id === stepId);
        if (!step) {
            return res.status(400).json({ success: false, message: "Project step not found" });
        }

        let fileToDeleteUrl = null;

        if (field === "audio") {
            if (step.audio && step.audio.url) {
                fileToDeleteUrl = step.audio.url;
                step.audio = null;
            }
        } else {
            if (!Array.isArray(step[field])) {
                return res.status(400).json({ success: false, message: `Invalid field type for ${field}` });
            }
            if (!Number.isInteger(fileIndex) || fileIndex < 0 || fileIndex >= step[field].length) {
                return res.status(400).json({ success: false, message: "Invalid file index" });
            }
            fileToDeleteUrl = step[field][fileIndex].url;
            step[field].splice(fileIndex, 1);
        }

        if (fileToDeleteUrl) {
            const filePath = path.join(uploadDir, path.basename(fileToDeleteUrl));
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Error deleting physical file ${filePath}:`, err);
                    } else {
                        console.log(`Successfully deleted physical file: ${filePath}`);
                    }
                });
            } else {
                console.warn(`Attempted to delete file, but it did not exist on disk: ${filePath}`);
            }
        } else {
            console.log(`No file reference found to delete for stepId ${stepId}, field ${field}, index ${fileIndex}.`);
        }

        project.lastSaved = new Date();
        await project.save();
        res.status(200).json({ success: true, message: "File deleted successfully", project });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/projects/:id/submit
// @desc    Submit a project for final evaluation
// @access  Private (User/Team Member only, must own the project)
router.post("/:id/submit", authMiddleware, async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        if (project.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Forbidden: You do not own this project" });
        }
        if (project.isSubmitted) {
            return res.status(400).json({ success: false, message: "Project already submitted" });
        }

        const { name, project: projectName, school, members, steps } = req.body;

        const errors = {};

        // 1. Validate top-level project fields (Frontend requirements)
        if (!name || !name.trim()) { errors.name = "Team name is required."; }
        if (!projectName || !projectName.trim()) { errors.project = "Project title is required."; }
        if (!school || !school.trim()) { errors.school = "School name is required."; }
        if (!Number.isInteger(members) || members < 1) { errors.members = "Number of members is required and must be at least 1."; }

        // 2. Validate steps structure and required fields
        if (!steps || !Array.isArray(steps) || steps.length !== 5) {
            errors.steps = "Invalid steps data. Expected an array of 5 steps.";
        } else {
            steps.forEach(step => {
                // All steps must have a description
                if (!step.description || !step.description.trim()) {
                    errors[`step_${step.id}_description`] = `Description for step ${step.id} is required.`;
                }

                // All steps must be marked as 'Completed'
                if (step.status !== "Completed") {
                    errors[`step_${step.id}_status`] = `Step ${step.id} "${step.title}" must be marked as "Completed" to submit.`;
                }

                // Step-specific required fields (matching frontend validation)
                if (step.id === 1) {
                    if (!step.location || !step.location.trim()) { errors[`step_${step.id}_location`] = "Location is required."; }
                    if (!step.affectedPopulation || !step.affectedPopulation.trim()) { errors[`step_${step.id}_affectedPopulation`] = "Affected population is required."; }
                }
                if (step.id === 2) {
                    if (!step.keyFindings || !step.keyFindings.trim()) { errors[`step_${step.id}_keyFindings`] = "Key findings are required."; }
                    if (!step.dataCollected || !step.dataCollected.trim()) { errors[`step_${step.id}_dataCollected`] = "Data collected is required."; }
                }
                if (step.id === 3) {
                    if (!step.solutionType || !step.solutionType.trim()) { errors[`step_${step.id}_solutionType`] = "Solution type is required."; }
                    if (!step.timeline || !step.timeline.trim()) { errors[`step_${step.id}_timeline`] = "Timeline is required."; }
                    if (!step.budget || !step.budget.trim()) { errors[`step_${step.id}_budget`] = "Budget is required."; }
                }
                if (step.id === 4) {
                    if (!step.feedback || !step.feedback.trim()) { errors[`step_${step.id}_feedback`] = "Stakeholder feedback is required."; }
                }
                if (step.id === 5) {
                    if (!step.outcomes || !step.outcomes.trim()) { errors[`step_${step.id}_outcomes`] = "Outcomes are required."; }
                    if (!step.implementationDate || !step.implementationDate.trim()) { errors[`step_${step.id}_implementationDate`] = "Implementation date is required."; }
                }

                // Additional checks for files/arrays to ensure they are *arrays* if they exist
                if (step.photos && !Array.isArray(step.photos)) { errors[`step_${step.id}_photos`] = `Photos data invalid for step ${step.id}.`; }
                if (step.videos && !Array.isArray(step.videos)) { errors[`step_${step.id}_videos`] = `Videos data invalid for step ${step.id}.`; }
                if (step.reports && !Array.isArray(step.reports)) { errors[`step_${step.id}_reports`] = `Reports data invalid for step ${step.id}.`; }
                if (step.audio && (typeof step.audio !== 'object' || !step.audio.url)) { errors[`step_${step.id}_audio`] = `Audio data invalid for step ${step.id}.`; }
                if (step.tags && !Array.isArray(step.tags)) { errors[`step_${step.id}_tags`] = `Tags data invalid for step ${step.id}.`; }
                if (step.researchMethods && !Array.isArray(step.researchMethods)) { errors[`step_${step.id}_researchMethods`] = `Research methods data invalid for step ${step.id}.`; }
                if (step.resources && !Array.isArray(step.resources)) { errors[`step_${step.id}_resources`] = `Resources data invalid for step ${step.id}.`; }
                if (step.stakeholders && !Array.isArray(step.stakeholders)) { errors[`step_${step.id}_stakeholders`] = `Stakeholders data invalid for step ${step.id}.`; }
                if (step.meetingDates && !Array.isArray(step.meetingDates)) { errors[`step_${step.id}_meetingDates`] = `Meeting dates data invalid for step ${step.id}.`; }
            });
        }

        // If any errors were found, return them to the client
        if (Object.keys(errors).length > 0) {
            console.log("Backend validation errors during submission:", errors);
            return res.status(400).json({ success: false, message: "Project validation failed before submission. Please fix all listed errors.", errors });
        }

        // If validation passes, update the project in the database
        Object.assign(project, { name, project: projectName, school, members, steps });

        project.isSubmitted = true;
        project.status = "submitted"; // Update overall status to 'submitted' as per schema
        project.currentStepIndex = project.steps.length; // Set to 5 (max step)
        project.submittedAt = new Date();
        project.lastSaved = new Date();

        await project.save();

        res.status(200).json({ success: true, message: "Project submitted successfully!", project });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = {};
            for (let field in error.errors) {
                validationErrors[field] = error.errors[field].message;
            }
            console.error("Mongoose Validation Error during submission:", validationErrors);
            return res.status(400).json({ success: false, message: "Validation Error during database save.", errors: validationErrors });
        }
        next(error);
    }
});

module.exports = router;