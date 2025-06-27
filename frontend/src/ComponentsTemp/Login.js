
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff, Mail, Lock, LogIn, XCircle } from "lucide-react";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        user: null,
        token: null,
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log("Decoded token on mount:", decoded);
                if (decoded.exp * 1000 > Date.now()) {
                    setAuthState({
                        isAuthenticated: true,
                        user: {
                            id: decoded.id,
                            email: decoded.email || "",
                            role: decoded.role || "user",
                            name: decoded.name || "",
                        },
                        token,
                    });
                } else {
                    console.log("Token expired at:", new Date(decoded.exp * 1000));
                    localStorage.removeItem("token");
                    localStorage.removeItem("rememberLogin");
                }
            } catch (error) {
                console.error("Token decoding error:", error.message);
                localStorage.removeItem("token");
                localStorage.removeItem("rememberLogin");
            }
        }
    }, []);

    useEffect(() => {
        if (authState.isAuthenticated && authState.user) {
            const from = location.state?.from?.pathname || (authState.user.role === "admin" ? "/judging-dashboard" : "/");
            console.log("Redirecting to:", from);
            navigate(from, {
                replace: true,
                state: {
                    message: `Welcome back, ${authState.user.name || "User"}! ${authState.user.role === "admin" ? "Admin dashboard" : "User dashboard"} loaded.`,
                    user: authState.user,
                },
            });
        }
    }, [authState, navigate, location]);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        if (errors[field] || errors.submit) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
                submit: "",
            }));
        }
    };

    const checkServerAvailability = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/health", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const body = await response.text();
            console.log("Health check response:", { status: response.status, body });
            return response.ok;
        } catch (error) {
            console.error("Server health check failed:", error.message);
            return false;
        }
    };

    const authenticateUser = async (email, password) => {
        try {
            const isServerUp = await checkServerAvailability();
            if (!isServerUp) {
                return { success: false, message: "Server is not responding. Please try again later." };
            }

            console.log("Sending login request with payload:", { email, password });
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log("Login API response:", { status: response.status, body: data });

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || `Login failed with status ${response.status}. Please check your credentials.`,
                };
            }

            return {
                success: true,
                user: data.user,
                token: data.token,
            };
        } catch (error) {
            console.error("Login network error:", error.message);
            return { success: false, message: `Network error: ${error.message}` };
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        const newErrors = {};
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!validateEmail(formData.email)) newErrors.email = "Please enter a valid email address";
        if (!formData.password.trim()) newErrors.password = "Password is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        try {
            const authResult = await authenticateUser(formData.email, formData.password);
            console.log("Auth result:", authResult);

            if (authResult.success) {
                console.log("Login successful", authResult.user);
                localStorage.setItem("token", authResult.token);
                console.log("Stored token:", localStorage.getItem("token"));
                window.dispatchEvent(new Event("storage"));
                setAuthState({
                    isAuthenticated: true,
                    user: {
                        id: authResult.user.id,
                        email: authResult.user.email || "",
                        role: authResult.user.role || "user",
                        name: authResult.user.name || "",
                    },
                    token: authResult.token,
                });
                if (rememberMe) {
                    localStorage.setItem("rememberLogin", "true");
                } else {
                    localStorage.removeItem("rememberLogin");
                }
            } else {
                setErrors({ submit: authResult.message });
            }
        } catch (error) {
            console.error("Unexpected login error:", error.message);
            setErrors({ submit: "Something went wrong. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    if (authState.isAuthenticated) {
        return (
            <div className="flex justify-center items-center py-8 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 min-h-screen">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-100 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Redirecting to {authState.user?.role === "admin" ? "Admin Dashboard" : "Dashboard"}...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center py-8 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 min-h-screen">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Welcome Back!
                    </h2>
                    <p className="text-gray-600 mt-2">Sign in to your account</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${errors.email ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            autoComplete="username"
                            disabled={isLoading}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <XCircle className="w-3 h-3 mr-1" />
                                {errors.email}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Lock className="w-4 h-4 inline mr-2" />
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${errors.password ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                                autoComplete="current-password"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                <XCircle className="w-3 h-3 mr-1" />
                                {errors.password}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                disabled={isLoading}
                            />
                            <span className="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                        <button
                            type="button"
                            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                            onClick={() => alert("Forgot password feature would be implemented here")}
                            disabled={isLoading}
                        >
                            Forgot password?
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Signing In...
                            </div>
                        ) : (
                            <div className="flex items-center justify-center">
                                <LogIn className="w-5 h-5 mr-2" />
                                Sign In
                            </div>
                        )}
                    </button>
                    {errors.submit && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm flex items-center">
                                <XCircle className="w-4 h-4 mr-2" />
                                {errors.submit}
                            </p>
                        </div>
                    )}
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <button
                            onClick={() => navigate("/signup")}
                            className="text-blue-600 font-semibold ml-1 hover:text-blue-700 hover:underline transition-colors"
                            disabled={isLoading}
                        >
                            Create Account
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
