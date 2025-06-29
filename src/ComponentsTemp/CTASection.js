import React from 'react';

export default function CTASection() {
    return (
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
            <div className="max-w-4xl mx-auto text-center px-6">
                <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Transform Your Future?</h2>
                <p className="text-xl mb-8 text-blue-100">
                    Join thousands of students who have discovered their potential through our comprehensive programs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors transform hover:scale-105 duration-300">
                        Apply Now
                    </button>
                    <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors">
                        Schedule a Visit
                    </button>
                </div>
            </div>
        </section>
    );
}
