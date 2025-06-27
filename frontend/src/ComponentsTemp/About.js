import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    Users,
    Target,
    Trophy,
    ChevronDown,
    ChevronUp,
    ArrowRight,
} from "lucide-react";

const AboutPage = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqs = [
        {
            question: "Who can participate in Our City, Our Challenge?",
            answer:
                "Students from grades 6 to 12 can join, working in teams with guidance from teachers and mentors.",
        },
        {
            question: "What kind of projects can we work on?",
            answer:
                "Projects can address any community issue, like waste management, traffic safety, or public health, using creative solutions.",
        },
        {
            question: "How do we get started?",
            answer:
                "Register your team on our platform, choose a problem, and follow the 5-step process to create impact!",
        },
    ];

    const timeline = [
        {
            year: "2018",
            event: "Program launched by Bala Janaagraha to empower student changemakers.",
        },
        {
            year: "2020",
            event: "Expanded to 50+ schools across 10 cities in India.",
        },
        {
            year: "2022",
            event: "Introduced digital platform for project submissions and tracking.",
        },
        {
            year: "2024",
            event: "Reached 10,000+ students and 500+ completed projects.",
        },
    ];

    const teamMembers = [
        {
            name: "Dr. Priya Sharma",
            role: "Program Director",
            image: "👩‍🏫",
            bio: "Leads the initiative with a passion for civic education.",
        },
        {
            name: "Rahul Verma",
            role: "Technology Lead",
            image: "👨‍💻",
            bio: "Oversees the digital platform for seamless user experience.",
        },
        {
            name: "Anita Desai",
            role: "Community Coordinator",
            image: "👩‍💼",
            bio: "Connects schools and communities for impactful projects.",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                className="max-w-7xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header Section */}
                <motion.div variants={itemVariants} className="text-center mb-12">
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-blue-900 mb-6 leading-tight">
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            About Our City, Our Challenge
                        </span>
                    </h1>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                        <strong>Our City, Our Challenge</strong> is an empowering civic program where students
                        identify real problems in their communities and create innovative solutions through
                        teamwork, creativity, and empathy. Join us to become a young changemaker!
                    </p>
                </motion.div>

                {/* What You’ll Learn Section */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-xl p-8 mb-12 max-w-4xl mx-auto"
                >
                    <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
                        What You’ll Learn
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                icon: <Target className="w-8 h-8 text-blue-600" />,
                                title: "Identify Problems",
                                desc: "Learn to spot and analyze real issues in your community.",
                            },
                            {
                                icon: <Users className="w-8 h-8 text-blue-600" />,
                                title: "Teamwork",
                                desc: "Collaborate effectively to design and implement solutions.",
                            },
                            {
                                icon: <Sparkles className="w-8 h-8 text-blue-600" />,
                                title: "Creativity",
                                desc: "Use innovative thinking to address challenges uniquely.",
                            },
                            {
                                icon: <Trophy className="w-8 h-8 text-blue-600" />,
                                title: "Leadership",
                                desc: "Build confidence and communication skills to lead change.",
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all"
                                whileHover={{ scale: 1.03 }}
                            >
                                <div className="flex-shrink-0">{item.icon}</div>
                                <div>
                                    <h3 className="text-lg font-semibold text-blue-800">{item.title}</h3>
                                    <p className="text-gray-600">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Program Timeline */}
                <motion.div variants={itemVariants} className="mb-12">
                    <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
                        Our Journey
                    </h2>
                    <div className="relative max-w-4xl mx-auto">
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-400 to-purple-400 hidden md:block"></div>
                        {timeline.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.2, duration: 0.6 }}
                                className={`flex items-center mb-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                            >
                                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                                    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                                        <h3 className="text-xl font-bold text-blue-800">{item.year}</h3>
                                        <p className="text-gray-600">{item.event}</p>
                                    </div>
                                </div>
                                <div className="hidden md:block w-6 h-6 bg-white border-4 border-blue-400 rounded-full relative z-10 shadow-lg"></div>
                                <div className="flex-1"></div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Meet the Team */}
                <motion.div variants={itemVariants} className="mb-12">
                    <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
                        Meet Our Team
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-center"
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="text-5xl mb-4">{member.image}</div>
                                <h3 className="text-xl font-semibold text-blue-800">{member.name}</h3>
                                <p className="text-blue-600 font-medium">{member.role}</p>
                                <p className="text-gray-600 mt-2">{member.bio}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* FAQ Section */}
                <motion.div variants={itemVariants} className="mb-12 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                className="bg-white rounded-xl shadow-lg overflow-hidden"
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                            >
                                <button
                                    className="w-full p-4 flex justify-between items-center text-left text-blue-800 font-semibold bg-blue-50 hover:bg-blue-100 transition-all"
                                    onClick={() => toggleFaq(index)}
                                >
                                    <span>{faq.question}</span>
                                    {openFaq === index ? (
                                        <ChevronUp className="w-5 h-5" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5" />
                                    )}
                                </button>
                                <AnimatePresence>
                                    {openFaq === index && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="p-4 text-gray-600 bg-white"
                                        >
                                            {faq.answer}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div variants={itemVariants} className="text-center">
                    <h2 className="text-3xl font-bold text-blue-800 mb-4">
                        Ready to Make a Difference?
                    </h2>
                    <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
                        Join thousands of students transforming their communities. Start your journey today!
                    </p>
                    <NavLink
                        to="/register"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                    >
                        Get Started <ArrowRight className="w-5 h-5" />
                    </NavLink>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default AboutPage;