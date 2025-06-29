import React from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

export default function TestimonialsSection({ testimonials, currentTestimonial, setCurrentTestimonial, nextTestimonial, prevTestimonial }) {
    return (
        <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6">Alumni Success Stories</h2>
                    <p className="text-xl text-blue-200">Hear from our graduates who are making a difference</p>
                </div>
                <div className="relative">
                    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
                        <div className="flex items-center justify-between mb-8">
                            <button
                                onClick={prevTestimonial}
                                className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <div className="flex space-x-2">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentTestimonial(index)}
                                        className={`w-3 h-3 rounded-full transition-colors ${index === currentTestimonial ? 'bg-yellow-400' : 'bg-white/40'}`}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={nextTestimonial}
                                className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="text-center">
                            <div className="flex justify-center mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                                ))}
                            </div>
                            <blockquote className="text-2xl lg:text-3xl font-light mb-8 leading-relaxed">
                                "{testimonials[currentTestimonial].quote}"
                            </blockquote>
                            <div className="flex items-center justify-center space-x-4">
                                <img
                                    src={testimonials[currentTestimonial].image}
                                    alt={testimonials[currentTestimonial].name}
                                    className="w-16 h-16 rounded-full border-4 border-white/30"
                                />
                                <div className="text-left">
                                    <div className="text-xl font-semibold">{testimonials[currentTestimonial].name}</div>
                                    <div className="text-blue-200">{testimonials[currentTestimonial].role}</div>
                                    <div className="text-sm text-blue-300">{testimonials[currentTestimonial].year}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
