import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

export default function HeroSection({ stats }) {
    return (
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-48 h-48 bg-purple-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                                Welcome to{' '}
                                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                    Diksha Foundation
                                </span>
                            </h1>
                            <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
                                Empowering students beyond academics — tracking health, nurturing creativity, and building lifelong connections through our alumni network.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="group bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                                Get Started
                                <ArrowRight className="inline ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="group border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-900 transition-all duration-300 flex items-center justify-center">
                                <Play className="w-5 h-5 mr-2" />
                                Watch Our Story
                            </button>
                        </div>
                    </div>
                    <div className="relative">

                        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-yellow-400">{stats.students.toLocaleString()}+</div>
                                    <div className="text-blue-200">Active Students</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-green-400">{stats.alumni.toLocaleString()}+</div>
                                    <div className="text-blue-200">Alumni Network</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-purple-400">{stats.programs}+</div>
                                    <div className="text-blue-200">Programs</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-orange-400">{stats.years}+</div>
                                    <div className="text-blue-200">Years of Impact</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
