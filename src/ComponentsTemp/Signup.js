import React, { useState } from 'react';
import { User, Mail, Phone, Lock, GraduationCap, Users, Upload, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
    const [role, setRole] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: ''
    });

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Form submitted!');
    };

    const getRoleIcon = (roleType) => {
        switch (roleType) {
            case 'student': return <GraduationCap className="w-5 h-5" />;
            case 'volunteer': return <Users className="w-5 h-5" />;
            default: return <User className="w-5 h-5" />;
        }
    };

    const getRoleColor = (roleType) => {
        switch (roleType) {
            case 'student': return 'from-blue-500 to-cyan-500';
            case 'volunteer': return 'from-green-500 to-emerald-500';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">Join Diksha Foundation</h2>
                    <p className="text-lg text-gray-600">Create your account and start your journey with us</p>
                </div>

                {/* Main Form Card */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Role Selection Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Your Role</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {['student', 'volunteer'].map((roleType) => (
                                <label key={roleType} className="relative cursor-pointer">
                                    <input
                                        type="radio"
                                        name="role"
                                        value={roleType}
                                        checked={role === roleType}
                                        onChange={handleRoleChange}
                                        className="sr-only"
                                    />
                                    <div className={`
                                        p-4 rounded-xl border-2 transition-all duration-300 text-center
                                        ${role === roleType
                                            ? `border-transparent bg-gradient-to-r ${getRoleColor(roleType)} text-white shadow-lg transform scale-105`
                                            : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:shadow-md'
                                        }
                                    `}>
                                        <div className="flex flex-col items-center space-y-2">
                                            {getRoleIcon(roleType)}
                                            <span className="font-medium capitalize">
                                                {roleType === 'volunteer' ? 'Volunteer/Teacher' : roleType}
                                            </span>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="p-8 space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-6">
                            <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                Basic Information
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password *
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                                            placeholder="Create a strong password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Role-specific fields */}
                        {role && (
                            <div className="space-y-6 pt-6 border-t border-gray-200">
                                <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <div className={`w-2 h-2 bg-gradient-to-r ${getRoleColor(role)} rounded-full mr-3`}></div>
                                    {role.charAt(0).toUpperCase() + role.slice(1)} Details
                                </h4>

                                {role === 'student' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="form-group">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Grade/Class</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                                                placeholder="e.g., Grade 10"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                                                placeholder="Enter your school name"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Subjects</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                                                placeholder="Math, Science, English..."
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Internet Access</label>
                                            <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white">
                                                <option value="yes">Yes, I have internet access</option>
                                                <option value="no">No, I don't have internet access</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {role === 'volunteer' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="form-group">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                                                placeholder="Your current occupation"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Subjects You Can Teach</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                                                placeholder="Math, Physics, English..."
                                            />
                                        </div>
                                        <div className="form-group md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Available Time Slots</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                                                placeholder="Weekdays 6-8 PM, Weekends 10 AM-12 PM..."
                                            />
                                        </div>
                                        <div className="form-group md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">ID Proof (Optional)</label>
                                            <div className="relative">
                                                <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="file"
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={!role}
                                className={`
                                    w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform
                                    ${role
                                        ? `bg-gradient-to-r ${getRoleColor(role)} text-white hover:shadow-lg hover:scale-105 active:scale-95`
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }
                                `}
                            >
                                {role ? `Register as ${role.charAt(0).toUpperCase() + role.slice(1)}` : 'Select a role to continue'}
                            </button>
                        </div>

                        {/* Login Link */}
                        <div className="text-center pt-4 border-t border-gray-200">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <a href="/login" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                                    Login here
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;