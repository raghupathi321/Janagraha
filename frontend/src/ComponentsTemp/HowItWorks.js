import React, { useState, useEffect } from "react";
import { ChevronRight, CheckCircle, Users, Lightbulb, Search, Target, Share2, Clock, Award, ArrowRight } from "lucide-react";

function HowItWorks() {
    const [activeStep, setActiveStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    const steps = [
        {
            step: "1. Identify",
            title: "Identify",
            desc: "Find a civic issue around you that you care about.",
            icon: Search,
            color: "from-red-400 to-red-600",
            details: "Look around your community for problems that affect people's daily lives. This could be anything from traffic safety to environmental concerns.",
            examples: ["Traffic congestion", "Lack of green spaces", "Digital divide", "Public transportation"],
            duration: "1-2 weeks",
            tips: "Talk to neighbors, observe your daily commute, check local news"
        },
        {
            step: "2. Investigate",
            title: "Investigate",
            desc: "Gather data, talk to people, and understand the root of the problem.",
            icon: Users,
            color: "from-orange-400 to-orange-600",
            details: "Conduct surveys, interviews, and research to understand the scope and impact of the issue. Collect both quantitative and qualitative data.",
            examples: ["Community surveys", "Expert interviews", "Data analysis", "Site visits"],
            duration: "2-3 weeks",
            tips: "Use multiple data sources, ask open-ended questions, document everything"
        },
        {
            step: "3. Ideate",
            title: "Ideate",
            desc: "Think of possible solutions and select the best one.",
            icon: Lightbulb,
            color: "from-yellow-400 to-yellow-600",
            details: "Brainstorm creative solutions with your team. Evaluate each idea based on feasibility, impact, and available resources.",
            examples: ["Brainstorming sessions", "Solution mapping", "Feasibility analysis", "Resource planning"],
            duration: "1-2 weeks",
            tips: "Think outside the box, consider existing solutions, prioritize impact over complexity"
        },
        {
            step: "4. Implement",
            title: "Implement",
            desc: "Put your solution into action with your team.",
            icon: Target,
            color: "from-green-400 to-green-600",
            details: "Execute your plan systematically. Start with a pilot program, gather feedback, and iterate based on results.",
            examples: ["Pilot program", "Community engagement", "Stakeholder coordination", "Progress tracking"],
            duration: "4-8 weeks",
            tips: "Start small, measure progress, be ready to adapt, engage stakeholders early"
        },
        {
            step: "5. Influence",
            title: "Influence",
            desc: "Share results and influence others to take action!",
            icon: Share2,
            color: "from-blue-400 to-blue-600",
            details: "Document your impact, share your story, and inspire others to replicate or build upon your solution.",
            examples: ["Impact report", "Community presentation", "Media outreach", "Policy recommendations"],
            duration: "2-3 weeks",
            tips: "Use data to tell your story, engage local media, connect with policymakers"
        },
    ];

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const toggleStepCompletion = (index) => {
        if (completedSteps.includes(index)) {
            setCompletedSteps(completedSteps.filter(step => step !== index));
        } else {
            setCompletedSteps([...completedSteps, index]);
        }
    };

    const progressPercentage = (completedSteps.length / steps.length) * 100;

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header Section */}
            <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    How It Works
                </h1>
                <p className="text-xl text-gray-700 mb-6 max-w-3xl mx-auto">
                    Follow the 5-I Model to complete your "Our City, Our Challenge" project. Each step brings your idea closer to reality!
                </p>

                {/* Progress Bar */}
                <div className="max-w-md mx-auto mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm text-gray-600">{completedSteps.length}/{steps.length} steps</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-1"
                            style={{ width: `${progressPercentage}%` }}
                        >
                            {progressPercentage > 15 && <Award className="w-3 h-3 text-white" />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Steps Grid */}
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-12">
                {steps.map((s, i) => {
                    const IconComponent = s.icon;
                    const isCompleted = completedSteps.includes(i);
                    const isActive = activeStep === i;

                    return (
                        <div
                            key={i}
                            className={`relative bg-white border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${isActive ? 'border-blue-500 shadow-lg' : isCompleted ? 'border-green-500 shadow-md' : 'border-gray-200 hover:border-blue-300'
                                }`}
                            onClick={() => setActiveStep(i)}
                            onMouseEnter={() => setActiveStep(i)}
                        >
                            {/* Completion Checkbox */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleStepCompletion(i);
                                }}
                                className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all duration-300 ${isCompleted
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : 'border-gray-300 hover:border-green-400'
                                    }`}
                            >
                                {isCompleted && <CheckCircle className="w-4 h-4" />}
                            </button>

                            {/* Icon with gradient background */}
                            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${s.color} flex items-center justify-center mb-4 mx-auto`}>
                                <IconComponent className="w-8 h-8 text-white" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{s.title}</h3>
                            <p className="text-gray-600 mb-4 leading-relaxed">{s.desc}</p>

                            {/* Duration badge */}
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-gray-100 rounded-full px-3 py-1 flex items-center">
                                    <Clock className="w-4 h-4 text-gray-500 mr-1" />
                                    <span className="text-sm text-gray-600">{s.duration}</span>
                                </div>
                            </div>

                            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center">
                                Learn More <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Detailed Step Information */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 mb-12">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                        <span className={`w-12 h-12 rounded-full bg-gradient-to-r ${steps[activeStep].color} flex items-center justify-center mr-4`}>
                            {React.createElement(steps[activeStep].icon, { className: "w-6 h-6 text-white" })}
                        </span>
                        Step {activeStep + 1}: {steps[activeStep].title}
                    </h2>

                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                        {steps[activeStep].details}
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-3">Examples & Activities</h4>
                            <ul className="space-y-2">
                                {steps[activeStep].examples.map((example, idx) => (
                                    <li key={idx} className="flex items-center text-gray-600">
                                        <ChevronRight className="w-4 h-4 text-blue-500 mr-2" />
                                        {example}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-3">Pro Tips</h4>
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                                <p className="text-gray-700 italic">💡 {steps[activeStep].tips}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
                <h3 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h3>
                <p className="text-xl mb-6 opacity-90">
                    Start your civic engagement journey today and create positive change in your community!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
                        Get Started
                    </button>
                    <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300">
                        Download Guide
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HowItWorks;