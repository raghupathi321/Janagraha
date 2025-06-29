import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function ProgramsSection({ programs }) {
    return (
        <section className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Our Programs</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Comprehensive programs designed to nurture every aspect of student development
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {programs.map((program, index) => {
                        const IconComponent = program.icon;
                        return (
                            <div key={index} className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                                <div className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
                                <div className={`w-16 h-16 bg-gradient-to-br ${program.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <IconComponent className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{program.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{program.description}</p>
                                <div className="mt-6">
                                    <button className="text-blue-600 font-semibold hover:text-blue-800 transition-colors group-hover:translate-x-1 transform transition-transform duration-300 flex items-center">
                                        Learn More <ArrowRight className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
