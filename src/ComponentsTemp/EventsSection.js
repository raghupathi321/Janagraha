import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

export default function EventsSection({ upcomingEvents }) {
    return (
        <section className="py-20 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
                    <p className="text-xl text-gray-600">Join us for these exciting upcoming activities</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {upcomingEvents.map((event, index) => (
                        <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                            <div className="flex items-start space-x-4">
                                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-4 text-center min-w-fit">
                                    <div className="text-2xl font-bold">{event.date}</div>
                                    <div className="text-sm uppercase">{event.month}</div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                                    <div className="space-y-1 text-gray-600">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            {event.time}
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            {event.location}
                                        </div>
                                    </div>
                                    <button className="mt-4 text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                                        Register Now →
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
