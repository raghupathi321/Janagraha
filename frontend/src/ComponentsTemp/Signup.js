import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff, User, Mail, Lock, Shield, CheckCircle, XCircle } from "lucide-react";

function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Password strength validation
    const validatePassword = (password) => {
        const minLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return {
            minLength,
            hasUpper,
            hasLower,
            hasNumber,
            hasSpecial,
            isStrong: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
        };
    };

    // Email validation
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email.trim());
        console.log(`Validating email: ${email.trim()}, Result: ${isValid}`); // Debug log
        return isValid;
    };

    // Name validation
    const validateName = (name) => {
        return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
    };

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear specific error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    // Real-time validation
    const getFieldErrors = () => {
        const newErrors = {};

        // Name validation
        if (formData.name && !validateName(formData.name)) {
            newErrors.name = "Name must be at least 2 characters and contain only letters";
        }

        // Email validation
        if (formData.email && !validateEmail(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Password validation
        if (formData.password && !validatePassword(formData.password).isStrong) {
            newErrors.password = "Password must meet all requirements";
        }

        // Confirm password validation
        if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        return newErrors;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        // Validate all fields
        const fieldErrors = {};

        // Check for empty required fields
        if (!formData.name.trim()) {
            fieldErrors.name = "Name is required";
        } else if (!validateName(formData.name)) {
            fieldErrors.name = "Name must be at least 2 characters and contain only letters";
        }
        if (!formData.email.trim()) {
            fieldErrors.email = "Email is required";
        } else if (!validateEmail(formData.email)) {
            fieldErrors.email = "Please enter a valid email address";
        }
        if (!formData.password) {
            fieldErrors.password = "Password is required";
        } else if (!validatePassword(formData.password).isStrong) {
            fieldErrors.password = "Password must meet all requirements";
        }
        if (!formData.confirmPassword) {
            fieldErrors.confirmPassword = "Confirm password is required";
        } else if (formData.password !== formData.confirmPassword) {
            fieldErrors.confirmPassword = "Passwords do not match";
        }
        if (!["user", "admin"].includes(formData.role)) {
            fieldErrors.role = "Invalid role selected";
        }

        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            setIsLoading(false);
            return;
        }

        try {
            const email = formData.email.toLowerCase().trim();
            console.log(`Sending signup request for email: ${email}`); // Debug log
            const response = await fetch("http://localhost:5000/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                    role: formData.role,
                }),
            });

            const data = await response.json();
            console.log("Backend response:", data); // Debug log

            if (!response.ok) {
                const errorMessage =
                    data.errors?.email ||
                    data.errors?.submit ||
                    Object.values(data.errors || {})[0] ||
                    "Signup failed. Please try again.";
                setErrors({ submit: errorMessage });
                setIsLoading(false);
                return;
            }

            // Store token in localStorage
            // In Signup.js, handleSignup
            localStorage.setItem("token", data.token);
            window.dispatchEvent(new Event("storage")); // Trigger storage event

            // Decode token to get user role
            const decoded = jwtDecode(data.token);

            // Role-based redirection
            if (decoded.role === "admin") {
                navigate("/judging-dashboard", {
                    replace: true,
                    state: {
                        message: `Welcome aboard, ${data.user.name}! Your admin account has been created successfully.`,
                        user: data.user,
                    },
                });
            } else {
                navigate("/", {
                    replace: true,
                    state: {
                        message: `Welcome to our platform, ${data.user.name}! Your account has been created successfully.`,
                        user: data.user,
                    },
                });
            }
        } catch (error) {
            console.error("Signup error:", error);
            setErrors({
                submit: "Network error. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const passwordStrength = validatePassword(formData.password);

    return (
        <div className="flex justify-center items-center py-8 px-4 bg-gradient-to-br from-yellow-50 via-orange-50 to-indigo-100 min-h-screen">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                        Create Account
                    </h2>
                    <p className="text-gray-600 mt-2">Join our platform today</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-5">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <User className="w-4 h-4 inline mr-2" />
                            Full Name
                        </label>
                        <input
                            type="text"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all ${errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
                                }`}
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <XCircle className="w-3 h-3 mr-1" />
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all ${errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                                }`}
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <XCircle className="w-3 h-3 mr-1" />
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Lock className="w-4 h-4 inline mr-2" />
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all ${errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
                                    }`}
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <Eye className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {formData.password && (
                            <div className="mt-2 space-y-1">
                                <div className="text-xs space-y-1">
                                    <div className={`flex items-center ${passwordStrength.minLength ? "text-green-600" : "text-gray-500"}`}>
                                        {passwordStrength.minLength ? (
                                            <CheckCircle className="w-3 h-3 mr-2" />
                                        ) : (
                                            <XCircle className="w-3 h-3 mr-2" />
                                        )}
                                        At least 8 characters
                                    </div>
                                    <div className={`flex items-center ${passwordStrength.hasUpper ? "text-green-600" : "text-gray-500"}`}>
                                        {passwordStrength.hasUpper ? (
                                            <CheckCircle className="w-3 h-3 mr-2" />
                                        ) : (
                                            <XCircle className="w-3 h-3 mr-2" />
                                        )}
                                        One uppercase letter
                                    </div>
                                    <div className={`flex items-center ${passwordStrength.hasLower ? "text-green-600" : "text-gray-500"}`}>
                                        {passwordStrength.hasLower ? (
                                            <CheckCircle className="w-3 h-3 mr-2" />
                                        ) : (
                                            <XCircle className="w-3 h-3 mr-2" />
                                        )}
                                        One lowercase letter
                                    </div>
                                    <div className={`flex items-center ${passwordStrength.hasNumber ? "text-green-600" : "text-gray-500"}`}>
                                        {passwordStrength.hasNumber ? (
                                            <CheckCircle className="w-3 h-3 mr-2" />
                                        ) : (
                                            <XCircle className="w-3 h-3 mr-2" />
                                        )}
                                        One number
                                    </div>
                                    <div className={`flex items-center ${passwordStrength.hasSpecial ? "text-green-600" : "text-gray-500"}`}>
                                        {passwordStrength.hasSpecial ? (
                                            <CheckCircle className="w-3 h-3 mr-2" />
                                        ) : (
                                            <XCircle className="w-3 h-3 mr-2" />
                                        )}
                                        One special character
                                    </div>
                                </div>
                            </div>
                        )}
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <XCircle className="w-3 h-3 mr-2" />
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Lock className="w-4 h-4 inline mr-2" />
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all ${errors.confirmPassword ? "border-red-500 bg-red-50" : "border-gray-300"
                                    }`}
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <Eye className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <XCircle className="w-3 h-3 mr-2" />
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* Role Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Shield className="w-4 h-4 inline mr-2" />
                            Account Type
                        </label>
                        <select
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all bg-white"
                            value={formData.role}
                            onChange={(e) => handleInputChange("role", e.target.value)}
                        >
                            <option value="user">User Account</option>
                            <option value="admin">Admin Account</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.role === "admin"
                                ? "Admin accounts have full access to judging dashboard and management features"
                                : "User accounts have access to standard platform features"}
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Creating Account...
                            </div>
                        ) : (
                            "Create Account"
                        )}
                    </button>

                    {/* Error Message */}
                    {errors.submit && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm flex items-center">
                                <XCircle className="w-4 h-4 mr-2" />
                                {errors.submit}
                            </p>
                        </div>
                    )}
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?
                        <button
                            onClick={() => navigate("/login")}
                            className="text-yellow-600 font-semibold ml-1 hover:text-yellow-700 hover:underline transition-colors"
                        >
                            Sign In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;