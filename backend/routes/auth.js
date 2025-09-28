const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
    const { name, email, password, confirmPassword, role } = req.body;

    try {
        // Validate input
        if (!name || !email || !password || !confirmPassword || !role) {
            return res.status(400).json({ success: false, errors: { submit: "All fields are required" } });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, errors: { confirmPassword: "Passwords do not match" } });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ success: false, errors: { email: "Invalid email format" } });
        }

        // Validate name
        if (name.trim().length < 2 || !/^[a-zA-Z\s]+$/.test(name.trim())) {
            return res.status(400).json({ success: false, errors: { name: "Name must be at least 2 characters and contain only letters" } });
        }

        // Validate password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ success: false, errors: { password: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character" } });
        }

        // Validate role
        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({ success: false, errors: { role: "Invalid role selected" } });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(400).json({ success: false, errors: { email: "Email already exists" } });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role,
        });

        await user.save();

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log("User created and token generated:", { id: user._id, email: user.email, role: user.role });

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Signup error:", error.message);
        res.status(500).json({ success: false, errors: { submit: "Internal server error" } });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ success: false, errors: { submit: "Email and password are required" } });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(401).json({ success: false, errors: { submit: "Invalid email or password" } });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, errors: { submit: "Invalid email or password" } });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log("Generated token for user:", { id: user._id, email, role: user.role });

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ success: false, errors: { submit: "Internal server error" } });
    }
});

module.exports = router;