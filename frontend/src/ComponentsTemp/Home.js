import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    Users,
    Target,
    Trophy,
    Camera,
    FileText,
    Video,
    ChevronRight,
    MapPin,
    Heart,
    Lightbulb,
    Award,
    Star,
    ArrowRight,
    Play,
    BookOpen,
    MessageSquare
} from "lucide-react";

export default function HomePage() {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showVideo, setShowVideo] = useState(false);
    const [activeTab, setActiveTab] = useState('students');

    const features = [
        {
            icon: <FileText className="w-8 h-8" />,
            title: "Submit Projects",
            description: "Upload your team's journey with photos, videos, and write-ups"
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Track Progress",
            description: "Follow your team's journey through each stage of the 5-1 model"
        },
        {
            icon: <Trophy className="w-8 h-8" />,
            title: "Get Recognition",
            description: "Showcase your impact and compete for exciting prizes"
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: "Real Impact",
            description: "Solve actual problems in your community with creative solutions"
        }
    ];

    const testimonials = [
        {
            name: "Team Green Warriors",
            school: "Delhi Public School",
            text: "We transformed our school's waste management system and won the sustainability award!",
            image: "🌱"
        },
        {
            name: "Traffic Tamers",
            school: "Modern High School",
            text: "Our traffic safety campaign reached over 1000 families in our neighborhood.",
            image: "🚗"
        },
        {
            name: "Water Wizards",
            school: "St. Mary's Academy",
            text: "Installing rainwater harvesting systems was challenging but so rewarding!",
            image: "💧"
        }
    ];

    const stats = [
        { number: "10,000+", label: "Students Participated" },
        { number: "500+", label: "Projects Completed" },
        { number: "100+", label: "Schools Involved" },
        { number: "25+", label: "Cities Reached" }
    ];

    const platformFeatures = [
        {
            category: "For Students",
            items: [
                { icon: <Camera className="w-5 h-5" />, text: "Upload photos and videos of your project journey" },
                { icon: <FileText className="w-5 h-5" />, text: "Submit detailed write-ups and progress reports" },
                { icon: <Users className="w-5 h-5" />, text: "Collaborate with team members online" },
                { icon: <Trophy className="w-5 h-5" />, text: "Track your achievements and milestones" }
            ]
        },
        {
            category: "For Teachers",
            items: [
                { icon: <Target className="w-5 h-5" />, text: "Monitor student progress in real-time" },
                { icon: <MessageSquare className="w-5 h-5" />, text: "Provide guidance and feedback at each stage" },
                { icon: <BookOpen className="w-5 h-5" />, text: "Access curriculum resources and lesson plans" },
                { icon: <Award className="w-5 h-5" />, text: "Evaluate projects with structured rubrics" }
            ]
        },
        {
            category: "For Evaluators",
            items: [
                { icon: <Video className="w-5 h-5" />, text: "Review complete project documentation" },
                { icon: <Star className="w-5 h-5" />, text: "Score projects using standardized criteria" },
                { icon: <Heart className="w-5 h-5" />, text: "Identify teams needing additional support" },
                { icon: <Lightbulb className="w-5 h-5" />, text: "Discover innovative solutions and best practices" }
            ]
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {/* Hero Section */}
            <motion.section
                className="px-6 py-20 text-center max-w-7xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="mb-8">
                    <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Sparkles className="w-4 h-4" />
                        Now Available Online!
                    </div>
                    <h1 className="text-5xl sm:text-7xl font-extrabold mb-6 leading-tight">
                        <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                            Transform Your City,
                        </span>
                        <br />
                        <span className="text-purple-800">One Project at a Time!</span>
                    </h1>
                </motion.div>

                <motion.p
                    variants={itemVariants}
                    className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed"
                >
                    From hardcopy submissions to a complete digital experience! Track your team's entire journey,
                    get real-time guidance, and showcase your community impact through our new online platform.
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="flex gap-4 flex-wrap justify-center mb-16"
                >
                    <button
                        onClick={() => handleNavigation("/register")}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl shadow-xl font-semibold text-lg flex items-center gap-2 transform hover:scale-105 transition-all"
                    >
                        Start Your Journey <ArrowRight className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => setShowVideo(true)}
                        className="border-2 border-purple-500 text-purple-700 hover:bg-purple-100 px-8 py-4 rounded-2xl font-semibold text-lg flex items-center gap-2 transition-all"
                    >
                        <Play className="w-5 h-5" /> Watch Demo
                    </button>

                    <button
                        onClick={() => handleNavigation("/sample-projects")}
                        className="bg-white text-purple-700 hover:bg-gray-50 px-8 py-4 rounded-2xl font-semibold text-lg flex items-center gap-2 shadow-lg transition-all"
                    >
                        <Trophy className="w-5 h-5" /> View Success Stories
                    </button>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="text-3xl font-bold text-purple-700 mb-2">{stat.number}</div>
                            <div className="text-gray-600 font-medium">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>

            {/* Platform Features Tabs */}
            <section className="py-16 bg-white/40 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-purple-800 mb-4">
                            A Complete Digital Experience
                        </h2>
                        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                            Our online platform transforms how students, teachers, and evaluators engage with civic projects
                        </p>
                    </motion.div>

                    {/* Tab Navigation */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-white rounded-2xl p-2 shadow-lg flex gap-2">
                            {['students', 'teachers', 'evaluators'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === tab
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                                        : 'text-purple-700 hover:bg-purple-50'
                                        }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid md:grid-cols-2 lg:grid-cols-2 gap-6"
                        >
                            {platformFeatures.find(f => f.category.toLowerCase().includes(activeTab))?.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-start gap-4"
                                >
                                    <div className="text-purple-600 bg-purple-100 p-3 rounded-xl">{item.icon}</div>
                                    <div>
                                        <p className="text-gray-700 font-medium">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            {/* Core Features Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-purple-800 mb-4">
                            Everything You Need to Succeed
                        </h2>
                        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                            Our platform supports your entire journey from idea to impact
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group"
                            >
                                <div className="text-purple-600 mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-purple-800 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Journey Steps */}
            <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-purple-800 mb-4">
                            Your 5-Step Journey
                        </h2>
                        <p className="text-xl text-gray-700">
                            Follow our proven 5-1 model for maximum impact
                        </p>
                    </motion.div>

                    <div className="relative">
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-400 to-pink-400 hidden md:block"></div>

                        {[
                            { step: 1, title: "Identify", desc: "Find a real problem in your community", icon: <Target className="w-6 h-6" /> },
                            { step: 2, title: "Research", desc: "Understand the root causes deeply", icon: <BookOpen className="w-6 h-6" /> },
                            { step: 3, title: "Plan", desc: "Design your solution strategy", icon: <Lightbulb className="w-6 h-6" /> },
                            { step: 4, title: "Execute", desc: "Implement your project with documentation", icon: <Users className="w-6 h-6" /> },
                            { step: 5, title: "Reflect", desc: "Measure impact and share learnings", icon: <Award className="w-6 h-6" /> }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.2, duration: 0.6 }}
                                className={`flex items-center mb-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                            >
                                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white">
                                                {item.icon}
                                            </div>
                                            <h3 className="text-xl font-bold text-purple-800">
                                                Step {item.step}: {item.title}
                                            </h3>
                                        </div>
                                        <p className="text-gray-600">{item.desc}</p>
                                    </div>
                                </div>
                                <div className="hidden md:block w-6 h-6 bg-white border-4 border-purple-400 rounded-full relative z-10 shadow-lg"></div>
                                <div className="flex-1"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Submission Types */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-purple-800 mb-4">
                            Multiple Ways to Share Your Story
                        </h2>
                        <p className="text-xl text-gray-700">
                            Document your journey through various media formats
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Camera className="w-12 h-12" />,
                                title: "Photos",
                                description: "Capture key moments, before/after shots, and team activities",
                                color: "from-blue-500 to-cyan-500"
                            },
                            {
                                icon: <Video className="w-12 h-12" />,
                                title: "Videos",
                                description: "Record presentations, interviews, and project demonstrations",
                                color: "from-purple-500 to-pink-500"
                            },
                            {
                                icon: <FileText className="w-12 h-12" />,
                                title: "Write-ups",
                                description: "Detail your research, methodology, and impact analysis",
                                color: "from-green-500 to-teal-500"
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 text-center group"
                            >
                                <div className={`w-20 h-20 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-purple-800 mb-4">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 bg-gradient-to-r from-purple-100 to-pink-100">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-purple-800 mb-12">
                        Success Stories from Amazing Students
                    </h2>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-2xl p-8 shadow-xl"
                        >
                            <div className="text-6xl mb-4">{testimonials[currentSlide].image}</div>
                            <p className="text-lg text-gray-700 mb-4 italic">
                                "{testimonials[currentSlide].text}"
                            </p>
                            <div className="font-bold text-purple-900">{testimonials[currentSlide].name}</div>
                            <div className="text-gray-600">{testimonials[currentSlide].school}</div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-center gap-2 mt-6">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-blue-500' : 'bg-blue-300'}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Metrics */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-purple-800 mb-4">
                            Real Impact, Real Results
                        </h2>
                        <p className="text-xl text-gray-700">
                            Track and measure your project's community impact
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { metric: "Citizens Reached", value: "50,000+", icon: <Users className="w-6 h-6" /> },
                            { metric: "Problems Addressed", value: "200+", icon: <Target className="w-6 h-6" /> },
                            { metric: "Policy Changes", value: "15", icon: <FileText className="w-6 h-6" /> },
                            { metric: "Awards Won", value: "75+", icon: <Trophy className="w-6 h-6" /> }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-all"
                            >
                                <div className="text-purple-600 mb-3 flex justify-center">{item.icon}</div>
                                <div className="text-3xl font-bold text-purple-800 mb-2">{item.value}</div>
                                <div className="text-gray-600 font-medium">{item.metric}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold mb-4">
                            Ready to Make a difference?
                        </h2>
                        <p className="text-xl mb-8 opacity-90">
                            Join the movement of young changemakers transforming communities across India
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <button
                                onClick={() => handleNavigation("/register")}
                                className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all flex items-center gap-2 hover:bg-gray-50">
                                Register Your Team <Users className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleNavigation("/mentor")}
                                className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all flex items-center gap-2">
                                Become a Mentor <Heart className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleNavigation("/teacher-resources")}
                                className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 hover:text-purple-600 transition-all flex items-center gap-2">
                                Teacher Resources <BookOpen className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div >
                </div >
            </section >

        {/* Floating Mascot */ }
        < motion.div
    initial = {{ scale: 0, rotate: -180 }
}
animate = {{ scale: 1, rotate: 0 }}
transition = {{ delay: 1, type: "spring", stiffness: 120 }}
className = "fixed bottom-6 right-6 z-40 cursor-pointer"
onClick = {() => handleNavigation("/help")}
                    >
    <div className="relative group">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all">
            <span className="text-2xl">team</span>
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="w-3 h-3 text-white" />
        </div>
        <div className="absolute -top-12 -left-8 bg-purple-800 text-white px-3 py-2 rounded-xl text-sm opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
            Need help? Click me!
        </div>
    </div>
</motion.div>

            {/* Video Modal */}
            <AnimatePresence>
                {showVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowVideo(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.5 }}
                            className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-purple-800">Platform Demo Video</h3>
                                <button
                                    onClick={() => setShowVideo(false)}
                                    className="text-gray-500 hover:text-gray-700 transition-colors text-2xl"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center mb-6">
                                <div className="text-center">
                                    <Play className="w-20 h-20 text-blue-600 mx-auto mb-4" />
                                    <p className="text-lg text-gray-700 mb-2">Demo Video Coming Soon!</p>
                                    <p className="text-gray-600">See how your team can use our platform to track civic projects</p>
                                </div>
                            </div>
                            <div className="text-center">
                                <button
                                    onClick={() => {
                                        setShowVideo(false);
                                        handleNavigation("/how-it-works");
                                    }}
                                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-xl transition-all"
                                >
                                    Learn More About How It Works
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence >
        </div >
    );
}