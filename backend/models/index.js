const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    location: String,
    bio: String,
    joinDate: { type: Date, default: Date.now },
    totalCourses: { type: Number, default: 0 },
    completedCourses: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 }
});

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    instructor: String,
    category: String,
    level: String,
    status: { type: String, enum: ['ongoing', 'completed', 'not_started'], default: 'not_started' },
    progress: { type: Number, default: 0 },
    modules: Number,
    completedModules: { type: Number, default: 0 },
    duration: String,
    assignments: [{
        id: String,
        title: String,
        dueDate: Date,
        status: { type: String, enum: ['pending', 'submitted'], default: 'pending' }
    }],
    materials: [String],
    nextSession: Date
});

const certificateSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    title: String,
    issueDate: Date
});

const achievementSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    title: String,
    description: String,
    icon: String,
    unlocked: { type: Boolean, default: false }
});

const eventSchema = new mongoose.Schema({
    title: String,
    type: { type: String, enum: ['live_session', 'assignment', 'workshop'] },
    date: Date,
    time: String
});

const notificationSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    type: { type: String, enum: ['assignment', 'grade', 'announcement'] },
    message: String,
    time: { type: Date, default: Date.now }
});

const attendanceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    date: Date,
    present: Boolean
});

const feedbackSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
    type: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});

const assignmentSubmissionSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    assignmentId: String,
    filePath: String,
    submittedAt: { type: Date, default: Date.now }
});

module.exports = {
    Student: mongoose.model('Student', studentSchema),
    Course: mongoose.model('Course', courseSchema),
    Certificate: mongoose.model('Certificate', certificateSchema),
    Achievement: mongoose.model('Achievement', achievementSchema),
    Event: mongoose.model('Event', eventSchema),
    Notification: mongoose.model('Notification', notificationSchema),
    Attendance: mongoose.model('Attendance', attendanceSchema),
    Feedback: mongoose.model('Feedback', feedbackSchema),
    AssignmentSubmission: mongoose.model('AssignmentSubmission', assignmentSubmissionSchema)
};