import React, { useState, useRef, useEffect } from 'react';
import {
    User, BookOpen, Calendar, Award, MessageCircle, Settings,
    LogOut, Play, Download, Upload, Clock, Trophy, Star,
    ChevronRight, Bell, Search, Filter, Grid, List,
    BarChart3, Target, CheckCircle, AlertCircle, Menu, X,
    FileText, Video, PenTool, HelpCircle, Zap, TrendingUp,
    Mail, Phone, MapPin, Edit3, Eye, ArrowRight, Plus
} from 'lucide-react';

const StudentDashboard = () => {
    // Mock data
    const mockStudent = {
        _id: "student123",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1-555-123-4567",
        location: "New York, USA",
        bio: "Passionate learner interested in technology and science.",
        joinDate: "2024-01-15T00:00:00Z",
        totalCourses: 5,
        completedCourses: 2,
        totalPoints: 1500,
        currentStreak: 7
    };

    const mockCourses = [
        {
            _id: "course1",
            title: "Introduction to Programming",
            description: "Learn the basics of programming with Python.",
            instructor: "Dr. Alice Smith",
            category: "Programming",
            level: "Beginner",
            status: "ongoing",
            progress: 60,
            completedModules: 3,
            modules: 5,
            duration: "6 weeks",
            assignments: [
                { _id: "assign1", title: "Python Basics", dueDate: "2025-07-10T23:59:59Z", status: "pending" },
                { _id: "assign2", title: "Data Structures", dueDate: "2025-07-15T23:59:59Z", status: "submitted" }
            ],
            materials: ["Lecture Slides.pdf", "Python Cheat Sheet.pdf"],
            nextSession: "2025-07-01T14:00:00Z"
        },
        {
            _id: "course2",
            title: "Web Development Fundamentals",
            description: "Build modern websites with HTML, CSS, and JavaScript.",
            instructor: "Prof. Bob Johnson",
            category: "Web Development",
            level: "Intermediate",
            status: "completed",
            progress: 100,
            completedModules: 8,
            modules: 8,
            duration: "8 weeks",
            assignments: [
                { _id: "assign3", title: "Portfolio Website", dueDate: "2025-06-20T23:59:59Z", status: "submitted" }
            ],
            materials: ["HTML Guide.pdf", "CSS Flexbox Tutorial.pdf"],
            nextSession: null
        },
        {
            _id: "course3",
            title: "Data Science Basics",
            description: "Explore data analysis and visualization techniques.",
            instructor: "Dr. Carol White",
            category: "Data Science",
            level: "Beginner",
            status: "not_started",
            progress: 0,
            completedModules: 0,
            modules: 6,
            duration: "5 weeks",
            assignments: [],
            materials: ["Data Analysis Intro.pdf"],
            nextSession: "2025-07-05T10:00:00Z"
        }
    ];

    const mockCertificates = [
        { _id: "cert1", title: "Certificate of Completion: Web Development Fundamentals", issueDate: "2025-06-25T00:00:00Z" }
    ];

    const mockAchievements = [
        { _id: "achieve1", title: "First Course Completed", description: "Completed your first course on EduPortal.", icon: "🏆", unlocked: true },
        { _id: "achieve2", title: "7-Day Streak", description: "Maintained a 7-day learning streak.", icon: "🔥", unlocked: true },
        { _id: "achieve3", title: "Master Learner", description: "Complete 5 courses to unlock this badge.", icon: "🌟", unlocked: false }
    ];

    const mockEvents = [
        { _id: "event1", title: "Python Workshop", type: "workshop", date: "2025-07-02T00:00:00Z", time: "14:00" },
        { _id: "event2", title: "Live Q&A Session", type: "live_session", date: "2025-07-03T00:00:00Z", time: "16:00" },
        { _id: "event3", title: "Assignment Deadline", type: "assignment", date: "2025-07-10T00:00:00Z", time: "23:59" }
    ];

    const mockNotifications = [
        { _id: "notif1", message: "New assignment posted for Introduction to Programming.", type: "assignment", time: "2025-06-28T10:00:00Z" },
        { _id: "notif2", message: "You earned a certificate for Web Development Fundamentals!", type: "grade", time: "2025-06-25T12:00:00Z" },
        { _id: "notif3", message: "New live session scheduled for Data Science Basics.", type: "announcement", time: "2025-06-27T09:00:00Z" }
    ];

    const mockAttendance = [
        { _id: "attend1", courseId: "course1", date: "2025-06-25T00:00:00Z", present: true },
        { _id: "attend2", courseId: "course1", date: "2025-06-26T00:00:00Z", present: false },
        { _id: "attend3", courseId: "course2", date: "2025-06-20T00:00:00Z", present: true }
    ];

    // State variables
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [student, setStudent] = useState(null);
    const [courses, setCourses] = useState(mockCourses);
    const [certificates, setCertificates] = useState(mockCertificates);
    const [achievements, setAchievements] = useState(mockAchievements);
    const [events, setEvents] = useState(mockEvents);
    const [attendance, setAttendance] = useState(mockAttendance);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [feedbackForm, setFeedbackForm] = useState({ courseId: '', type: 'General Feedback', message: '' });
    const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '', location: '', bio: '' });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [bmiForm, setBmiForm] = useState({ weight: '', height: '' });
    const [bmiResult, setBmiResult] = useState(null);
    const fileInputRef = useRef(null);

    // Initialize data
    useEffect(() => {
        // Simulate data loading
        console.log('Initializing mock data...');
        try {
            setLoading(true);
            // Set mock data directly
            setStudent(mockStudent);
            setCourses(mockCourses);
            setCertificates(mockCertificates);
            setAchievements(mockAchievements);
            setEvents(mockEvents);
            setNotifications(mockNotifications);
            setAttendance(mockAttendance);
            setProfileForm({
                name: mockStudent.name,
                email: mockStudent.email,
                phone: mockStudent.phone || '',
                location: mockStudent.location || '',
                bio: mockStudent.bio || ''
            });
            console.log('Mock student data set:', mockStudent);
        } catch (err) {
            setError('Failed to initialize data');
            console.error('Error initializing data:', err);
        } finally {
            setLoading(false);
            console.log('Loading complete, student state:', student);
        }
    }, []); // Empty dependency array ensures this runs once on mount

    // Feedback submission
    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        try {
            const newNotification = {
                _id: `notif${notifications.length + 1}`,
                message: `Feedback submitted: ${feedbackForm.message}`,
                type: 'feedback',
                time: new Date().toISOString()
            };
            setNotifications([...notifications, newNotification]);
            setFeedbackForm({ courseId: '', type: 'General Feedback', message: '' });
            alert('Feedback submitted successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    // Profile update
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            setStudent({
                ...student,
                name: profileForm.name,
                email: profileForm.email,
                phone: profileForm.phone,
                location: profileForm.location,
                bio: profileForm.bio
            });
            alert('Profile updated successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    // Password update
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError('New passwords do not match');
            return;
        }
        try {
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            alert('Password updated successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    // Assignment submission
    const handleAssignmentSubmit = async (courseId, assignmentId) => {
        if (!fileInputRef.current?.files?.[0]) {
            setError('Please select a file to upload');
            return;
        }
        try {
            const updatedCourses = courses.map(course => {
                if (course._id === courseId) {
                    return {
                        ...course,
                        assignments: course.assignments.map(assignment =>
                            assignment._id === assignmentId
                                ? { ...assignment, status: 'submitted' }
                                : assignment
                        )
                    };
                }
                return course;
            });
            setCourses(updatedCourses);
            alert('Assignment submitted successfully!');
            fileInputRef.current.value = '';
        } catch (err) {
            setError(err.message);
        }
    };

    // BMI calculation
    const handleBmiSubmit = (e) => {
        e.preventDefault();
        const weight = parseFloat(bmiForm.weight);
        const height = parseFloat(bmiForm.height) / 100;
        if (isNaN(weight) || isNaN(height) || height <= 0) {
            setError('Please enter valid weight and height');
            return;
        }
        const bmi = (weight / (height * height)).toFixed(1);
        let category = '';
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi >= 18.5 && bmi < 25) category = 'Normal';
        else if (bmi >= 25 && bmi < 30) category = 'Overweight';
        else category = 'Obese';
        setBmiResult({ value: bmi, category });
        setError(null);
    };

    // Filter courses
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || course.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    // Status badge helper
    const getStatusBadge = (status) => {
        const statusConfig = {
            ongoing: { color: 'bg-blue-100 text-blue-800', text: 'Ongoing' },
            completed: { color: 'bg-green-100 text-green-800', text: 'Completed' },
            not_started: { color: 'bg-gray-100 text-gray-800', text: 'Not Started' }
        };
        return statusConfig[status] || statusConfig.not_started;
    };

    // Render functions
    const renderDashboard = () => (
        <div className="space-y-6">
            {error && <p className="text-red-600">{error}</p>}
            {loading || !student ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : (
                <>
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold mb-2">Welcome back, {student.name}! 👋</h1>
                            <p className="text-indigo-100 mb-4">Ready to continue your learning journey?</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-indigo-100">Active Courses</p>
                                            <p className="text-2xl font-bold">{courses.filter(c => c.status === 'ongoing').length}</p>
                                        </div>
                                        <BookOpen className="h-8 w-8 text-indigo-200" />
                                    </div>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-indigo-100">Overall Progress</p>
                                            <p className="text-2xl font-bold">{Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / (courses.length || 1))}%</p>
                                        </div>
                                        <Target className="h-8 w-8 text-indigo-200" />
                                    </div>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-indigo-100">Learning Streak</p>
                                            <p className="text-2xl font-bold">{student.currentStreak} days</p>
                                        </div>
                                        <Zap className="h-8 w-8 text-indigo-200" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Rest of the dashboard content */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <button onClick={() => setActiveTab('courses')} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                                    <BookOpen className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold">My Courses</p>
                                    <p className="text-sm text-gray-500">View all courses</p>
                                </div>
                            </div>
                        </button>
                        <button onClick={() => setActiveTab('attendance')} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                                    <Calendar className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold">Attendance</p>
                                    <p className="text-sm text-gray-500">Track sessions</p>
                                </div>
                            </div>
                        </button>
                        <button onClick={() => setActiveTab('certificates')} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
                            <div className="flex items-center space-x-3">
                                <div className="bg-yellow-100 p-3 rounded-lg group-hover:bg-yellow-200 transition-colors">
                                    <Award className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold">Certificates</p>
                                    <p className="text-sm text-gray-500">View achievements</p>
                                </div>
                            </div>
                        </button>
                        <button onClick={() => setActiveTab('support')} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
                            <div className="flex items-center space-x-3">
                                <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                                    <MessageCircle className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold">Support</p>
                                    <p className="text-sm text-gray-500">Get help</p>
                                </div>
                            </div>
                        </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                                Recent Activity
                            </h3>
                            <div className="space-y-3">
                                {notifications.slice(0, 3).map(notification => (
                                    <div key={notification._id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className={`p-2 rounded-full ${notification.type === 'assignment' ? 'bg-orange-100' :
                                            notification.type === 'grade' ? 'bg-green-100' :
                                                notification.type === 'feedback' ? 'bg-purple-100' : 'bg-blue-100'
                                            }`}>
                                            {notification.type === 'assignment' && <PenTool className="h-4 w-4 text-orange-600" />}
                                            {notification.type === 'grade' && <Star className="h-4 w-4 text-green-600" />}
                                            {notification.type === 'feedback' && <MessageCircle className="h-4 w-4 text-purple-600" />}
                                            {notification.type === 'announcement' && <Bell className="h-4 w-4 text-blue-600" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{notification.message}</p>
                                            <p className="text-xs text-gray-500">{new Date(notification.time).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <Calendar className="h-5 w-5 text-green-600 mr-2" />
                                Upcoming Events
                            </h3>
                            <div className="space-y-3">
                                {events.slice(0, 3).map(event => (
                                    <div key={event._id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-full ${event.type === 'live_session' ? 'bg-red-100' :
                                                event.type === 'assignment' ? 'bg-orange-100' : 'bg-purple-100'
                                                }`}>
                                                {event.type === 'live_session' && <Video className="h-4 w-4 text-red-600" />}
                                                {event.type === 'assignment' && <PenTool className="h-4 w-4 text-orange-600" />}
                                                {event.type === 'workshop' && <Trophy className="h-4 w-4 text-purple-600" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{event.title}</p>
                                                <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-gray-400" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <BarChart3 className="h-5 w-5 text-indigo-600 mr-2" />
                            Learning Progress
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {courses.filter(c => c.status === 'ongoing').map(course => (
                                <div key={course._id} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-sm">{course.title}</h4>
                                        <span className="text-sm text-gray-500">{course.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${course.progress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500">{course.completedModules} of {course.modules} modules completed</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    const renderCourses = () => (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-2xl font-bold">My Courses</h2>
                    <p className="text-gray-600">Manage and track your learning journey</p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="not_started">Not Started</option>
                    </select>
                    <div className="flex border border-gray-300 rounded-lg">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400'}`}
                        >
                            <Grid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400'}`}
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredCourses.map(course => (
                    <div
                        key={course._id}
                        className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group ${viewMode === 'list' ? 'flex' : ''}`}
                        onClick={() => setSelectedCourse(course)}
                    >
                        <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}>
                            <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
                                <div className="absolute inset-0 bg-black/20"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-white">
                                        <BookOpen className="h-12 w-12 mx-auto mb-2" />
                                        <p className="font-semibold">{course.category}</p>
                                    </div>
                                </div>
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(course.status).color}`}>
                                        {getStatusBadge(course.status).text}
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                                        {course.level}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 flex-1">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="font-semibold text-lg group-hover:text-indigo-600 transition-colors">
                                    {course.title}
                                </h3>
                                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                            </div>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                            <div className="flex items-center text-sm text-gray-500 mb-3">
                                <User className="h-4 w-4 mr-1" />
                                <span>{course.instructor}</span>
                            </div>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Progress</span>
                                    <span className="font-medium">{course.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${course.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>{course.completedModules}/{course.modules} modules</span>
                                <span>{course.duration}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderCourseDetails = () => {
        if (!selectedCourse) return null;
        return (
            <div className="space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                    <button
                        onClick={() => setSelectedCourse(null)}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        <ArrowRight className="h-5 w-5 rotate-180" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
                        <p className="text-gray-600">by {selectedCourse.instructor}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="text-center">
                            <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                                <Target className="h-8 w-8 text-indigo-600" />
                            </div>
                            <p className="font-semibold">{selectedCourse.progress}%</p>
                            <p className="text-sm text-gray-600">Completed</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                                <BookOpen className="h-8 w-8 text-green-600" />
                            </div>
                            <p className="font-semibold">{selectedCourse.completedModules}/{selectedCourse.modules}</p>
                            <p className="text-sm text-gray-600">Modules</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                                <Clock className="h-8 w-8 text-yellow-600" />
                            </div>
                            <p className="font-semibold">{selectedCourse.duration}</p>
                            <p className="text-sm text-gray-600">Duration</p>
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${selectedCourse.progress}%` }}
                        ></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <FileText className="h-5 w-5 text-indigo-600 mr-2" />
                                Course Syllabus
                            </h3>
                            <div className="space-y-3">
                                {Array.from({ length: selectedCourse.modules }, (_, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i < selectedCourse.completedModules
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {i < selectedCourse.completedModules ? <CheckCircle className="h-4 w-4" /> : i + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium">Module {i + 1}: Topic {i + 1}</p>
                                                <p className="text-sm text-gray-500">
                                                    {i < selectedCourse.completedModules ? 'Completed' : 'Not started'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                                                <Video className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                                                <Download className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <PenTool className="h-5 w-5 text-orange-600 mr-2" />
                                Assignments
                            </h3>
                            <div className="space-y-3">
                                {selectedCourse.assignments.map((assignment) => (
                                    <div key={assignment._id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                                        <div>
                                            <p className="font-medium">{assignment.title}</p>
                                            <p className="text-sm text-gray-500">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${assignment.status === 'submitted'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-orange-100 text-orange-800'
                                                }`}>
                                                {assignment.status === 'submitted' ? 'Submitted' : 'Pending'}
                                            </span>
                                            {assignment.status === 'pending' && (
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                                                >
                                                    Submit
                                                </button>
                                            )}
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                className="hidden"
                                                onChange={() => handleAssignmentSubmit(selectedCourse._id, assignment._id)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                                    <Play className="h-4 w-4" />
                                    <span>Continue Learning</span>
                                </button>
                                <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                                    <Download className="h-4 w-4" />
                                    <span>Download Materials</span>
                                </button>
                                <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                                    <MessageCircle className="h-4 w-4" />
                                    <span>Ask Question</span>
                                </button>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <Download className="h-5 w-5 text-green-600 mr-2" />
                                Materials
                            </h3>
                            <div className="space-y-2">
                                {selectedCourse.materials.map((material, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <FileText className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm">{material}</span>
                                        </div>
                                        <Download className="h-4 w-4 text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {selectedCourse.nextSession && (
                            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-6 text-white">
                                <h3 className="text-lg font-semibold mb-2 flex items-center">
                                    <Video className="h-5 w-5 mr-2" />
                                    Next Live Session
                                </h3>
                                <p className="text-red-100 mb-3">{new Date(selectedCourse.nextSession).toLocaleString()}</p>
                                <button className="w-full bg-white/20 backdrop-blur-sm py-2 px-4 rounded-lg hover:bg-white/30 transition-colors">
                                    Join Session
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderAttendance = () => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const attendanceRate = attendance.length > 0
            ? Math.round((attendance.filter(a => a.present).length / attendance.length) * 100)
            : 0;

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Attendance Tracking</h2>
                        <p className="text-gray-600">Monitor your class participation</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{attendanceRate}%</p>
                            <p className="text-sm text-gray-600">Overall Attendance</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4">Monthly View - {today.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="p-2 text-center font-medium text-gray-600 text-sm">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: daysInMonth }, (_, i) => {
                            const day = i + 1;
                            const date = new Date(currentYear, currentMonth, day);
                            const attendanceRecord = attendance.find(a => new Date(a.date).toDateString() === date.toDateString());
                            const isPresent = attendanceRecord?.present;
                            const isToday = date.toDateString() === today.toDateString();

                            return (
                                <div
                                    key={day}
                                    className={`p-3 text-center text-sm rounded-lg border ${isToday
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : isPresent
                                            ? 'border-green-200 bg-green-50 text-green-800'
                                            : 'border-red-200 bg-red-50 text-red-800'
                                        }`}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-center space-x-6 mt-6 text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-green-200 rounded"></div>
                            <span>Present</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-red-200 rounded"></div>
                            <span>Absent</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-indigo-200 rounded"></div>
                            <span>Today</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4">Course-wise Attendance</h3>
                    <div className="space-y-4">
                        {courses.filter(c => c.status === 'ongoing' || c.status === 'completed').map(course => {
                            const courseAttendance = attendance.filter(a => a.courseId === course._id);
                            const presentCount = courseAttendance.filter(a => a.present).length;
                            const totalSessions = courseAttendance.length || 1;
                            const percentage = Math.round((presentCount / totalSessions) * 100);

                            return (
                                <div key={course._id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                                    <div>
                                        <p className="font-medium">{course.title}</p>
                                        <p className="text-sm text-gray-500">{course.instructor}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-lg">{percentage}%</p>
                                        <p className="text-sm text-gray-500">{presentCount}/{totalSessions} sessions</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderCertificates = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Certificates & Achievements</h2>
                <p className="text-gray-600">Your learning accomplishments</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
                    <Trophy className="h-8 w-8 mb-2" />
                    <p className="text-2xl font-bold">{certificates.length}</p>
                    <p className="text-yellow-100">Certificates Earned</p>
                </div>
                <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 text-white">
                    <Target className="h-8 w-8 mb-2" />
                    <p className="text-2xl font-bold">{student?.totalPoints || 0}</p>
                    <p className="text-green-100">Total Points</p>
                </div>
                <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl p-6 text-white">
                    <Zap className="h-8 w-8 mb-2" />
                    <p className="text-2xl font-bold">{student?.currentStreak || 0}</p>
                    <p className="text-purple-100">Day Streak</p>
                </div>
                <div className="bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl p-6 text-white">
                    <Star className="h-8 w-8 mb-2" />
                    <p className="text-2xl font-bold">{achievements.filter(a => a.unlocked).length}</p>
                    <p className="text-indigo-100">Badges Earned</p>
                </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">My Certificates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certificates.map(cert => (
                        <div key={cert._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h4 className="font-semibold text-lg">{cert.title}</h4>
                                    <p className="text-gray-600">Issued on {new Date(cert.issueDate).toLocaleDateString()}</p>
                                </div>
                                <Award className="h-8 w-8 text-yellow-500" />
                            </div>
                            <div className="flex space-x-3">
                                <button className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                                    <Download className="h-4 w-4 inline mr-2" />
                                    Download PDF
                                </button>
                                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                    <Eye className="h-4 w-4 inline" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Achievement Badges</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {achievements.map(achievement => (
                        <div
                            key={achievement._id}
                            className={`p-4 rounded-lg border-2 text-center ${achievement.unlocked
                                ? 'border-green-200 bg-green-50'
                                : 'border-gray-200 bg-gray-50 opacity-60'
                                }`}
                        >
                            <div className="text-4xl mb-2">{achievement.icon}</div>
                            <h4 className="font-semibold">{achievement.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                            {achievement.unlocked && (
                                <div className="mt-2">
                                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderSupport = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Support & Feedback</h2>
                <p className="text-gray-600">Get help and share your feedback</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                    <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <MessageCircle className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Live Chat</h3>
                    <p className="text-sm text-gray-600 mb-4">Get instant help from our support team</p>
                    <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        Start Chat
                    </button>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                    <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <HelpCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">FAQ</h3>
                    <p className="text-sm text-gray-600 mb-4">Find answers to common questions</p>
                    <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                        Browse FAQ
                    </button>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                    <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Mail className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Email Support</h3>
                    <p className="text-sm text-gray-600 mb-4">Send us a detailed message</p>
                    <button className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                        Send Email
                    </button>
                </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Submit Feedback</h3>
                <form className="space-y-4" onSubmit={handleFeedbackSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={feedbackForm.courseId}
                            onChange={(e) => setFeedbackForm({ ...feedbackForm, courseId: e.target.value })}
                        >
                            <option value="">Select a course</option>
                            {courses.map(course => (
                                <option key={course._id} value={course._id}>{course.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Type</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={feedbackForm.type}
                            onChange={(e) => setFeedbackForm({ ...feedbackForm, type: e.target.value })}
                        >
                            <option>General Feedback</option>
                            <option>Course Content</option>
                            <option>Technical Issue</option>
                            <option>Instructor Feedback</option>
                            <option>Suggestion</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                        <textarea
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Share your feedback or ask a question..."
                            value={feedbackForm.message}
                            onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                        ></textarea>
                    </div>
                    <button className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
                        Submit Feedback
                    </button>
                </form>
            </div>
        </div>
    );

    const renderProfile = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Profile Settings</h2>
                <p className="text-gray-600">Manage your account information</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-6 mb-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {student?.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">{student?.name}</h3>
                        <p className="text-gray-600">{student?.email}</p>
                        <p className="text-sm text-gray-500">Member since {new Date(student?.joinDate).toLocaleDateString()}</p>
                    </div>
                </div>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleProfileSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={profileForm.name}
                                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={profileForm.email}
                                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                            <input
                                type="tel"
                                value={profileForm.phone}
                                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <input
                                type="text"
                                value={profileForm.location}
                                onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                            <textarea
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Tell us about yourself..."
                                value={profileForm.bio}
                                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                            ></textarea>
                        </div>
                    </div>
                    <div className="flex justify-end mt-6 md:col-span-2">
                        <button className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
                <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <input
                            type="password"
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <button className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition-colors">
                        Update Password
                    </button>
                </form>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                    BMI Calculator
                </h3>
                <form className="space-y-4" onSubmit={handleBmiSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                            <input
                                type="number"
                                placeholder="Enter weight in kg"
                                value={bmiForm.weight}
                                onChange={(e) => setBmiForm({ ...bmiForm, weight: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                            <input
                                type="number"
                                placeholder="Enter height in cm"
                                value={bmiForm.height}
                                onChange={(e) => setBmiForm({ ...bmiForm, height: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                        Calculate BMI
                    </button>
                    {bmiResult && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <p className="text-lg font-semibold">Your BMI: {bmiResult.value}</p>
                            <p className="text-sm text-gray-600">Category: {bmiResult.category}</p>
                            <p className="text-xs text-gray-500 mt-2">
                                BMI Categories: Underweight (&lt;18.5), Normal (18.5-24.9), Overweight (25-29.9), Obese (≥30)
                            </p>
                        </div>
                    )}
                </form>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Learning Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border border-gray-100 rounded-lg">
                        <p className="text-2xl font-bold text-indigo-600">{student?.totalCourses || 0}</p>
                        <p className="text-sm text-gray-600">Total Courses</p>
                    </div>
                    <div className="text-center p-4 border border-gray-100 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{student?.completedCourses || 0}</p>
                        <p className="text-sm text-gray-600">Completed</p>
                    </div>
                    <div className="text-center p-4 border border-gray-100 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">{student?.totalPoints || 0}</p>
                        <p className="text-sm text-gray-600">Points Earned</p>
                    </div>
                    <div className="text-center p-4 border border-gray-100 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{student?.currentStreak || 0}</p>
                        <p className="text-sm text-gray-600">Day Streak</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'courses', label: 'My Courses', icon: BookOpen },
        { id: 'attendance', label: 'Attendance', icon: Calendar },
        { id: 'certificates', label: 'Certificates', icon: Award },
        { id: 'support', label: 'Support', icon: MessageCircle },
        { id: 'profile', label: 'Profile', icon: Settings }
    ];

    const renderContent = () => {
        if (selectedCourse) return renderCourseDetails();
        switch (activeTab) {
            case 'dashboard': return renderDashboard();
            case 'courses': return renderCourses();
            case 'attendance': return renderAttendance();
            case 'certificates': return renderCertificates();
            case 'support': return renderSupport();
            case 'profile': return renderProfile();
            default: return renderDashboard();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h1 className="text-xl font-bold">Student Portal</h1>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>
            <div className="flex">
                <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:transition-none flex flex-col h-full`}>
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-indigo-600">EduPortal</h2>
                        <p className="text-sm text-gray-600">Student Dashboard</p>
                    </div>
                    {loading || !student ? (
                        <div className="p-4 border-b border-gray-200">
                            <p className="text-gray-500 text-sm">Loading profile...</p>
                        </div>
                    ) : (
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {student.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{student.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{student.email}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <nav className="p-4 space-y-2 flex-1">
                        {sidebarItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setSelectedCourse(null);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === item.id
                                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
                {sidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}
                <div className="flex-1 lg:ml-0 p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;