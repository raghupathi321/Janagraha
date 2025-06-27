const mongoose = require('mongoose');

// Schema for attached files within a project step
const fileSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Original file name
    url: { type: String, required: true },  // URL to access the file (e.g., /uploads/image.jpg)
    size: { type: Number },                 // File size in bytes
    type: { type: String },                 // Mime type (e.g., image/jpeg, video/mp4)
}, { _id: false }); // Do not create a separate _id for subdocuments (files)

// Schema for individual steps within a civic project
const projectStepSchema = new mongoose.Schema({
    id: { type: Number, required: true }, // Step number (1, 2, 3, 4, 5)
    title: { type: String, required: true, trim: true }, // Title of the step (e.g., "Identify a Civic Problem")
    description: { type: String, default: '', trim: true }, // Detailed description for the step

    // Status of the step, essential for frontend progress tracking and submission validation
    status: {
        type: String,
        enum: ["Not Started", "In Progress", "Completed"],
        default: "Not Started",
    },

    // Arrays for multiple file uploads per type
    photos: [fileSchema],
    videos: [fileSchema],
    reports: [fileSchema],

    // Single audio file (if only one is allowed per step)
    audio: fileSchema,

    // Step 1 specific fields
    location: { type: String, default: '', trim: true },
    affectedPopulation: { type: String, default: '', trim: true },
    tags: { type: [String], default: [] }, // Array of strings for tags
    urgency: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
    },

    // Step 2 specific fields
    researchMethods: { type: [String], default: [] }, // Array of strings for research methods
    dataCollected: { type: String, default: '', trim: true },
    keyFindings: { type: String, default: '', trim: true },

    // Step 3 specific fields
    solutionType: { type: String, default: '', trim: true },
    timeline: { type: String, default: '', trim: true },
    budget: { type: String, default: '', trim: true },
    resources: { type: [String], default: [] }, // Array of strings for resources

    // Step 4 specific fields
    stakeholders: { type: [String], default: [] }, // Array of strings for stakeholders
    meetingDates: { type: [String], default: [] }, // Array of strings (ISO dates or custom format)
    feedback: { type: String, default: '', trim: true },

    // Step 5 specific fields
    implementationDate: { type: String, default: '', trim: true }, // Storing as string for flexibility (e.g., "Q3 2025" or "2025-09-01")
    outcomes: { type: String, default: '', trim: true },
    lessons: { type: String, default: '', trim: true },
    nextSteps: { type: String, default: '', trim: true },
}, { _id: false }); // Do not create a separate _id for subdocuments (steps)

// Main Project Schema
const projectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required for a project'],
        unique: true, // A user can only have one active project at a time
    },
    name: {
        type: String,
        required: [true, 'Team name is required'],
        trim: true,
        maxlength: [100, 'Team name cannot exceed 100 characters'],
    },
    project: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true,
        maxlength: [200, 'Project title cannot exceed 200 characters'],
    },
    school: {
        type: String,
        required: [true, 'School is required'],
        trim: true,
        maxlength: [100, 'School name cannot exceed 100 characters'],
    },
    members: {
        type: Number,
        required: [true, 'Number of members is required'],
        min: [1, 'Must have at least 1 member'],
    },

    // Overall project status
    status: {
        type: String,
        enum: ['draft', 'submitted', 'evaluated'], // Changed 'pending' to 'draft' for clarity
        default: 'draft',
    },

    // Tracks the current step the user is working on (for UI guidance)
    currentStepIndex: { // Renamed from 'step' to 'currentStepIndex' for better clarity with array indexing
        type: Number,
        required: true,
        min: [1, 'Current step must be at least 1'],
        max: [5, 'Current step cannot exceed 5'],
        default: 1,
    },

    submittedAt: {
        type: Date,
        default: null, // Will be set when the project is finally submitted
    },
    isSubmitted: {
        type: Boolean,
        default: false, // Flag to indicate if the project has been formally submitted
    },
    lastSaved: {
        type: Date,
        default: Date.now, // Timestamp of the last automatic or manual save
    },
    overallProgress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0, // Calculated percentage based on completed steps
    },

    // Embedded document array for the project's steps
    steps: [projectStepSchema],

    // --- Removed Evaluation Related Fields ---
    // These fields are better suited for a separate 'Evaluation' model
    // to allow for multiple evaluations, different evaluators, etc.
    // evaluationsCount: { type: Number, default: 0 },
    // totalOriginalityScore: { type: Number, default: 0 },
    // totalCommunityImpactScore: { type: Number, default: 0 },
    // totalClarityScore: { type: Number, default: 0 },
    // totalTeamworkScore: { type: Number, default: 0 },
    // totalFeasibilityScore: { type: Number, default: 0 },
    // averageOriginalityScore: { type: Number, default: 0 },
    // averageCommunityImpactScore: { type: Number, default: 0 },
    // averageClarityScore: { type: Number, default: 0 },
    // averageTeamworkScore: { type: Number, default: 0 },
    // averageFeasibilityScore: { type: Number, default: 0 },
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

module.exports = mongoose.model('Project', projectSchema);