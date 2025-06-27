// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        match: [/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: [true, 'Role is required'],
    },
    school: {
        type: String,
        default: '',
        trim: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);