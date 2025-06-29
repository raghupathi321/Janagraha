import React, { useState, useEffect } from 'react';
import HeroSection from './HeroSection';
import ProgramsSection from './ProgramsSection';
import TestimonialsSection from './TestimonialsSection';
import EventsSection from './EventsSection';
import CTASection from './CTASection';
import { testimonials, programs, upcomingEvents } from '../data/homeData';

export default function Home() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [stats, setStats] = useState({
        students: 0,
        alumni: 0,
        programs: 0,
        years: 0
    });

    // Animate stats on component mount
    useEffect(() => {
        const animateStats = () => {
            const finalStats = { students: 2500, alumni: 850, programs: 12, years: 8 };
            const duration = 2000;
            const steps = 60;
            const stepTime = duration / steps;

            let step = 0;
            const interval = setInterval(() => {
                step++;
                const progress = step / steps;

                setStats({
                    students: Math.floor(finalStats.students * progress),
                    alumni: Math.floor(finalStats.alumni * progress),
                    programs: Math.floor(finalStats.programs * progress),
                    years: Math.floor(finalStats.years * progress)
                });

                if (step >= steps) {
                    clearInterval(interval);
                    setStats(finalStats);
                }
            }, stepTime);
        };

        animateStats();
    }, []);

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <HeroSection stats={stats} />
            <ProgramsSection programs={programs} />
            <TestimonialsSection
                testimonials={testimonials}
                currentTestimonial={currentTestimonial}
                setCurrentTestimonial={setCurrentTestimonial}
                nextTestimonial={nextTestimonial}
                prevTestimonial={prevTestimonial}
            />
            <EventsSection upcomingEvents={upcomingEvents} />
            <CTASection />
        </div>
    );
}
