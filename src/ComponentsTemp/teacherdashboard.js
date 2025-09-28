import React, { useState, useEffect, memo } from 'react';
import {
    Users, BookOpen, Heart, TrendingUp, UserPlus, Calendar, FileText, Settings, Download, Plus, Edit, Trash2, Eye, Filter, Search, Bell, DollarSign, Award, Activity, PieChart, BarChart3, CheckCircle, Star, Mail, XCircle, Save, RefreshCw
} from 'lucide-react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const AdminDashboard = () => {
    // Mock data
    const mockDashboardStats = {
        totalStudents: 120,
        totalVolunteers: 15,
        totalCourses: 10,
        weeklyLearners: 45,
        totalDonations: 500000,
        completionRate: 75,
        totalBlogs: 3
    };

    const mockStudents = [
        { id: 's1', name: 'John Doe', email: 'john.doe@example.com', course: 'Introduction to Programming', joinDate: '2024-01-15', status: 'Active' },
        { id: 's2', name: 'Jane Smith', email: 'jane.smith@example.com', course: 'Web Development', joinDate: '2024-03-10', status: 'Completed' },
        { id: 's3', name: 'Alice Johnson', email: 'alice.johnson@example.com', course: 'Data Science', joinDate: '2024-06-01', status: 'Inactive' }
    ];

    const mockCourses = [
        { id: 'c1', title: 'Introduction to Programming', instructor: 'Dr. Alice Smith', status: 'Active', enrolled: 50, completion: 60 },
        { id: 'c2', title: 'Web Development', instructor: 'Prof. Bob Johnson', status: 'Draft', enrolled: 30, completion: 80 },
        { id: 'c3', title: 'Data Science', instructor: 'Dr. Carol White', status: 'Active', enrolled: 40, completion: 45 }
    ];

    const mockVolunteers = [
        { id: 'v1', name: 'Mike Brown', role: 'Mentor', hours: 20, rating: 4.5, status: 'Active' },
        { id: 'v2', name: 'Sarah Davis', role: 'Tutor', hours: 15, rating: 4.0, status: 'Pending' },
        { id: 'v3', name: 'Tom Wilson', role: 'Coordinator', hours: 10, rating: 3.8, status: 'Active' }
    ];

    const mockDonations = [
        { id: 'd1', donor: 'Emily Clark', amount: 10000, purpose: 'Scholarship Fund', date: '2025-06-20' },
        { id: 'd2', donor: 'David Lee', amount: 25000, purpose: 'Infrastructure', date: '2025-06-15' },
        { id: 'd3', donor: 'Laura Adams', amount: 15000, purpose: 'Research Grant', date: '2025-06-10' }
    ];

    const mockBlogs = [
        { id: 'b1', title: 'Learning Python in 2025', author: 'Dr. Alice Smith', category: 'Blog', status: 'Published', date: '2025-06-01', content: 'A guide to mastering Python...' },
        { id: 'b2', title: 'Web Development Guide', author: 'Prof. Bob Johnson', category: 'Resource', status: 'Draft', date: '2025-06-05', content: 'Comprehensive resource for web dev...' },
        { id: 'b3', title: 'Data Science Basics', author: 'Dr. Carol White', category: 'Blog', status: 'Published', date: '2025-06-10', content: 'Introduction to data science...' }
    ];

    const mockAnalytics = {
        studentStatus: [
            { status: 'Active', count: 80 },
            { status: 'Inactive', count: 20 },
            { status: 'Completed', count: 20 }
        ],
        monthlyDonations: [
            { month: 'Jan', amount: 50000 },
            { month: 'Feb', amount: 75000 },
            { month: 'Mar', amount: 60000 },
            { month: 'Apr', amount: 80000 },
            { month: 'May', amount: 100000 },
            { month: 'Jun', amount: 120000 }
        ]
    };

    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [notifications, setNotifications] = useState(0);
    const [dashboardStats, setDashboardStats] = useState(mockDashboardStats);
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [donations, setDonations] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [analytics, setAnalytics] = useState(mockAnalytics);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState({ student: false, course: false, volunteer: false, donation: false, blog: false });

    // Initial form data for each section
    const initialFormData = {
        student: { name: '', email: '', course: '', joinDate: '', status: 'Active' },
        course: { title: '', instructor: '', status: 'Draft', enrolled: 0, completion: 0 },
        volunteer: { name: '', role: '', hours: 0, rating: 0, status: 'Active' },
        donation: { donor: '', amount: 0, purpose: '', date: '' },
        blog: { title: '', author: '', category: 'Blog', content: '', status: 'Draft', date: '' }
    };

    useEffect(() => {
        console.log('Initializing mock data...');
        try {
            setLoading(true);
            setDashboardStats(mockDashboardStats);
            setStudents(mockStudents);
            setCourses(mockCourses);
            setVolunteers(mockVolunteers);
            setDonations(mockDonations);
            setBlogs(mockBlogs);
            setAnalytics(mockAnalytics);
            setNotifications(mockDonations.length);
            console.log('Mock data set:', { mockDashboardStats, mockStudents, mockCourses, mockVolunteers, mockDonations, mockBlogs, mockAnalytics });
        } catch (err) {
            setError('Failed to initialize mock data');
            console.error('Error initializing data:', err);
        } finally {
            setLoading(false);
            console.log('Loading complete, notifications:', notifications);
        }
    }, []);

    useEffect(() => {
        console.log('Notifications state updated:', notifications);
    }, [notifications]);

    const handleFormSubmit = async (section, data) => {
        try {
            const newItem = {
                id: `${section[0]}${Math.random().toString(36).substr(2, 9)}`,
                ...data,
                ...(section === 'course' && { enrolled: 0, completion: 0 }),
                ...(section === 'volunteer' && { status: data.status || 'Active' }),
                ...(section === 'blog' && { date: data.date || new Date().toISOString().split('T')[0] })
            };

            if (section === 'student') setStudents([...students, newItem]);
            if (section === 'course') setCourses([...courses, newItem]);
            if (section === 'volunteer') setVolunteers([...volunteers, newItem]);
            if (section === 'donation') {
                setDonations([...donations, newItem]);
                setNotifications(notifications + 1);
            }
            if (section === 'blog') setBlogs([...blogs, newItem]);

            setShowForm(prev => ({ ...prev, [section]: false }));
        } catch (err) {
            setError(err.message || `Failed to add ${section}`);
            console.error(`Error adding ${section}:`, err);
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterStatus === 'all' || student.status === filterStatus)
    );

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterStatus === 'all' || blog.status === filterStatus)
    );

    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'courses', label: 'Course Management', icon: BookOpen },
        { id: 'volunteers', label: 'Volunteer Management', icon: Award },
        { id: 'events', label: 'Events & Workshops', icon: Calendar },
        { id: 'blog', label: 'Blog & Resources', icon: FileText },
        { id: 'donations', label: 'Donation Management', icon: DollarSign },
        { id: 'reports', label: 'Reports & Analytics', icon: PieChart },
        { id: 'settings', label: 'Site Settings', icon: Settings }
    ];

    const StatCard = ({ title, value, icon: Icon, trend, color }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    {trend && (
                        <div className="flex items-center mt-2">
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-600 font-medium">{trend}%</span>
                            <span className="text-sm text-gray-500 ml-1">vs last month</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );

    const ActionButton = ({ icon: Icon, label, onClick, variant = 'primary' }) => {
        const variants = {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white',
            secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
            danger: 'bg-red-600 hover:bg-red-700 text-white',
            success: 'bg-green-600 hover:bg-green-700 text-white'
        };

        return (
            <button
                onClick={onClick}
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${variants[variant]}`}
            >
                <Icon className="w-4 h-4 mr-2" />
                {label}
            </button>
        );
    };

    const TableRow = ({ children, onClick }) => (
        <tr
            className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            onClick={onClick}
        >
            {children}
        </tr>
    );

    const StatusBadge = ({ status }) => {
        const statusStyles = {
            Active: 'bg-green-100 text-green-800',
            Inactive: 'bg-red-100 text-red-800',
            Pending: 'bg-yellow-100 text-yellow-800',
            Completed: 'bg-blue-100 text-blue-800',
            Draft: 'bg-gray-100 text-gray-800',
            Published: 'bg-blue-100 text-blue-800'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    const FormModal = memo(({ section, title, fields, onSubmit, onCancel, initialFormData }) => {
        const [formData, setFormData] = useState(initialFormData);

        const handleFormChange = (field, value) => {
            setFormData(prev => ({ ...prev, [field]: value }));
        };

        const handleSubmit = () => {
            onSubmit(formData);
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
                    <div className="space-y-4">
                        {fields.map(({ label, name, type, options }) => (
                            <div key={name}>
                                <label className="block text-sm font-medium text-gray-700">{label}</label>
                                {type === 'select' ? (
                                    <select
                                        className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        value={formData[name] || ''}
                                        onChange={(e) => handleFormChange(name, e.target.value)}
                                    >
                                        {options.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                ) : type === 'textarea' ? (
                                    <textarea
                                        className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        value={formData[name] || ''}
                                        onChange={(e) => handleFormChange(name, e.target.value)}
                                        rows="4"
                                    />
                                ) : (
                                    <input
                                        type={type}
                                        className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        value={formData[name] || ''}
                                        onChange={(e) => handleFormChange(name, type === 'number' ? Number(e.target.value) || 0 : e.target.value)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <ActionButton icon={XCircle} label="Cancel" onClick={onCancel} variant="secondary" />
                        <ActionButton icon={Save} label="Save" onClick={handleSubmit} variant="success" />
                    </div>
                </div>
            </div>
        );
    });

    const PieChartComponent = ({ data, title }) => {
        const chartData = {
            labels: data.map(item => item.status),
            datasets: [{
                data: data.map(item => item.count),
                backgroundColor: ['#34D399', '#F87171', '#60A5FA'],
                hoverOffset: 20
            }]
        };
        const options = {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: title, font: { size: 16 } }
            }
        };
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <Pie data={chartData} options={options} />
            </div>
        );
    };

    const BarChartComponent = ({ data, title }) => {
        const chartData = {
            labels: data.map(item => item.month),
            datasets: [{
                label: 'Donations (₹)',
                data: data.map(item => item.amount),
                backgroundColor: '#3B82F6',
                borderColor: '#2563EB',
                borderWidth: 1
            }]
        };
        const options = {
            responsive: true,
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Amount (₹)' } },
                x: { title: { display: true, text: 'Month' } }
            },
            plugins: {
                legend: { display: false },
                title: { display: true, text: title, font: { size: 16 } }
            }
        };
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <Bar data={chartData} options={options} />
            </div>
        );
    };

    const renderDashboard = () => (
        <div className="space-y-6">
            {error && <p className="text-red-600">{error}</p>}
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : (
                <>
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                        <ActionButton icon={RefreshCw} label="Refresh" onClick={() => window.location.reload()} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard title="Total Students" value={dashboardStats.totalStudents.toLocaleString()} icon={Users} trend={12} color="bg-blue-500" />
                        <StatCard title="Active Volunteers" value={dashboardStats.totalVolunteers} icon={Award} trend={8} color="bg-green-500" />
                        <StatCard title="Total Courses" value={dashboardStats.totalCourses} icon={BookOpen} trend={5} color="bg-purple-500" />
                        <StatCard title="Weekly Learners" value={dashboardStats.weeklyLearners} icon={Activity} trend={15} color="bg-orange-500" />
                        <StatCard title="Total Donations" value={`₹${(dashboardStats.totalDonations / 1000).toFixed(0)}K`} icon={Heart} trend={25} color="bg-red-500" />
                        <StatCard title="Completion Rate" value={`${dashboardStats.completionRate}%`} icon={CheckCircle} trend={3} color="bg-teal-500" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                            <div className="space-y-4">
                                {donations.slice(0, 3).map(donation => (
                                    <div key={donation.id} className="flex items-center p-3 bg-green-50 rounded-lg">
                                        <Heart className="w-5 h-5 text-green-600 mr-3" />
                                        <div>
                                            <p className="font-medium text-gray-900">₹{donation.amount.toLocaleString()} donation from {donation.donor}</p>
                                            <p className="text-sm text-gray-600">{new Date(donation.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <ActionButton icon={UserPlus} label="Add Student" onClick={() => setShowForm({ ...showForm, student: true })} />
                                <ActionButton icon={Plus} label="New Course" onClick={() => setShowForm({ ...showForm, course: true })} />
                                <ActionButton icon={Calendar} label="Schedule Event" />
                                <ActionButton icon={FileText} label="Create Post" onClick={() => setShowForm({ ...showForm, blog: true })} />
                                <ActionButton icon={Download} label="Export Data" variant="secondary" />
                                <ActionButton icon={Mail} label="Send Newsletter" variant="secondary" />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    const renderUserManagement = () => (
        <div className="space-y-6">
            {showForm.student && (
                <FormModal
                    section="student"
                    title="Add New Student"
                    fields={[
                        { label: 'Name', name: 'name', type: 'text' },
                        { label: 'Email', name: 'email', type: 'email' },
                        { label: 'Course', name: 'course', type: 'text' },
                        { label: 'Join Date', name: 'joinDate', type: 'date' },
                        { label: 'Status', name: 'status', type: 'select', options: ['Active', 'Inactive', 'Completed'] }
                    ]}
                    initialFormData={initialFormData.student}
                    onSubmit={(data) => handleFormSubmit('student', data)}
                    onCancel={() => setShowForm({ ...showForm, student: false })}
                />
            )}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <ActionButton icon={UserPlus} label="Add New Student" onClick={() => setShowForm({ ...showForm, student: true })} />
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Completed">Completed</option>
                            </select>
                            <ActionButton icon={Download} label="Export" variant="secondary" />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStudents.map((student) => (
                                <TableRow key={student.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                                    <span className="text-white font-semibold">{student.name.charAt(0)}</span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                <div className="text-sm text-gray-500">{student.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.course}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={student.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(student.joinDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900"><Eye className="w-4 h-4" /></button>
                                            <button className="text-green-600 hover:text-green-900"><Edit className="w-4 h-4" /></button>
                                            <button className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </TableRow>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderCourseManagement = () => (
        <div className="space-y-6">
            {showForm.course && (
                <FormModal
                    section="course"
                    title="Create New Course"
                    fields={[
                        { label: 'Title', name: 'title', type: 'text' },
                        { label: 'Instructor', name: 'instructor', type: 'text' },
                        { label: 'Status', name: 'status', type: 'select', options: ['Active', 'Draft'] }
                    ]}
                    initialFormData={initialFormData.course}
                    onSubmit={(data) => handleFormSubmit('course', data)}
                    onCancel={() => setShowForm({ ...showForm, course: false })}
                />
            )}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
                <ActionButton icon={Plus} label="Create New Course" onClick={() => setShowForm({ ...showForm, course: true })} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                                <StatusBadge status={course.status} />
                            </div>
                            <p className="text-gray-600 mb-4">Instructor: {course.instructor}</p>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Enrolled Students</span>
                                    <span className="text-sm font-medium">{course.enrolled || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Completion Rate</span>
                                    <span className="text-sm font-medium">{course.completion || 0}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${course.completion || 0}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                    <Edit className="w-4 h-4 inline mr-1" /> Edit
                                </button>
                                <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                    <Eye className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderVolunteerManagement = () => (
        <div className="space-y-6">
            {showForm.volunteer && (
                <FormModal
                    section="volunteer"
                    title="Add New Volunteer"
                    fields={[
                        { label: 'Name', name: 'name', type: 'text' },
                        { label: 'Role', name: 'role', type: 'text' },
                        { label: 'Hours', name: 'hours', type: 'number' },
                        { label: 'Rating', name: 'rating', type: 'number' },
                        { label: 'Status', name: 'status', type: 'select', options: ['Active', 'Pending'] }
                    ]}
                    initialFormData={initialFormData.volunteer}
                    onSubmit={(data) => handleFormSubmit('volunteer', data)}
                    onCancel={() => setShowForm({ ...showForm, volunteer: false })}
                />
            )}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Volunteer Management</h1>
                <ActionButton icon={UserPlus} label="Add Volunteer" onClick={() => setShowForm({ ...showForm, volunteer: true })} />
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volunteer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {volunteers.map((volunteer) => (
                                <TableRow key={volunteer.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                                                    <span className="text-white font-semibold">{volunteer.name.charAt(0)}</span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{volunteer.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{volunteer.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{volunteer.hours}h</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                            <span className="text-sm text-gray-900">{volunteer.rating}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={volunteer.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900"><Eye className="w-4 h-4" /></button>
                                            <button className="text-green-600 hover:text-green-900"><Edit className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </TableRow>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderDonationManagement = () => (
        <div className="space-y-6">
            {showForm.donation && (
                <FormModal
                    section="donation"
                    title="Record New Donation"
                    fields={[
                        { label: 'Donor', name: 'donor', type: 'text' },
                        { label: 'Amount', name: 'amount', type: 'number' },
                        { label: 'Purpose', name: 'purpose', type: 'text' },
                        { label: 'Date', name: 'date', type: 'date' }
                    ]}
                    initialFormData={initialFormData.donation}
                    onSubmit={(data) => handleFormSubmit('donation', data)}
                    onCancel={() => setShowForm({ ...showForm, donation: false })}
                />
            )}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Donation Management</h1>
                <ActionButton icon={Plus} label="Record Donation" onClick={() => setShowForm({ ...showForm, donation: true })} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100">Total Raised</p>
                            <p className="text-3xl font-bold">₹{(dashboardStats.totalDonations / 1000).toFixed(0)}K</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-green-200" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100">This Month</p>
                            <p className="text-3xl font-bold">₹{(dashboardStats.totalDonations * 0.3 / 1000).toFixed(0)}K</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-blue-200" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100">Donors</p>
                            <p className="text-3xl font-bold">{donations.length}</p>
                        </div>
                        <Users className="w-8 h-8 text-purple-200" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100">Campaigns</p>
                            <p className="text-3xl font-bold">{Math.ceil(donations.length / 10)}</p>
                        </div>
                        <Heart className="w-8 h-8 text-orange-200" />
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Donations</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {donations.map((donation) => (
                                <TableRow key={donation.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{donation.donor}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{donation.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donation.purpose}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(donation.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900"><Mail className="w-4 h-4" /></button>
                                            <button className="text-green-600 hover:text-green-900"><Download className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </TableRow>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderBlogManagement = () => (
        <div className="space-y-6">
            {showForm.blog && (
                <FormModal
                    section="blog"
                    title="Add New Blog/Resource"
                    fields={[
                        { label: 'Title', name: 'title', type: 'text' },
                        { label: 'Author', name: 'author', type: 'text' },
                        { label: 'Category', name: 'category', type: 'select', options: ['Blog', 'Resource'] },
                        { label: 'Content', name: 'content', type: 'textarea' },
                        { label: 'Status', name: 'status', type: 'select', options: ['Draft', 'Published'] },
                        { label: 'Date', name: 'date', type: 'date' }
                    ]}
                    initialFormData={initialFormData.blog}
                    onSubmit={(data) => handleFormSubmit('blog', data)}
                    onCancel={() => setShowForm({ ...showForm, blog: false })}
                />
            )}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Blog & Resources</h1>
                <ActionButton icon={Plus} label="Add New Post" onClick={() => setShowForm({ ...showForm, blog: true })} />
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search posts..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="Published">Published</option>
                                <option value="Draft">Draft</option>
                            </select>
                            <ActionButton icon={Download} label="Export" variant="secondary" />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredBlogs.map((blog) => (
                                <TableRow key={blog.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{blog.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{blog.author}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{blog.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={blog.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(blog.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900"><Eye className="w-4 h-4" /></button>
                                            <button className="text-green-600 hover:text-green-900"><Edit className="w-4 h-4" /></button>
                                            <button className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </TableRow>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderReportsAnalytics = () => (
        <div className="space-y-6">
            {error && <p className="text-red-600">{error}</p>}
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : (
                <>
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
                        <ActionButton icon={Download} label="Export Report" variant="secondary" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <StatCard title="Total Students" value={dashboardStats.totalStudents.toLocaleString()} icon={Users} color="bg-blue-500" />
                        <StatCard title="Total Courses" value={dashboardStats.totalCourses} icon={BookOpen} color="bg-purple-500" />
                        <StatCard title="Total Donations" value={`₹${(dashboardStats.totalDonations / 1000).toFixed(0)}K`} icon={Heart} color="bg-red-500" />
                        <StatCard title="Total Posts" value={blogs.length} icon={FileText} color="bg-teal-500" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PieChartComponent data={analytics.studentStatus} title="Student Status Distribution" />
                        <BarChartComponent data={analytics.monthlyDonations} title="Monthly Donations" />
                    </div>
                </>
            )}
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return renderDashboard();
            case 'users': return renderUserManagement();
            case 'courses': return renderCourseManagement();
            case 'volunteers': return renderVolunteerManagement();
            case 'donations': return renderDonationManagement();
            case 'blog': return renderBlogManagement();
            case 'reports': return renderReportsAnalytics();
            case 'events': return <div className="text-center py-12"><Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" /><p className="text-gray-500">Events & Workshops management coming soon</p></div>;
            case 'settings': return <div className="text-center py-12"><Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" /><p className="text-gray-500">Site Settings coming soon</p></div>;
            default: return renderDashboard();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <div className="w-64 bg-white shadow-lg border-r border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    {loading ? (
                        <p className="text-gray-500 text-sm">Loading...</p>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Diksha Foundation</h2>
                                <p className="text-sm text-gray-500">Admin Panel</p>
                            </div>
                        </div>
                    )}
                </div>
                <nav className="p-4 space-y-2">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === item.id
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </div>
            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            {loading ? (
                                <p className="text-gray-500 text-sm">Loading profile...</p>
                            ) : (
                                <>
                                    <div className="relative">
                                        <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-900 transition-colors" />
                                        {notifications > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                {notifications}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm">A</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Admin User</p>
                                            <p className="text-xs text-gray-500">admin@diksha.org</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-6 overflow-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard; 