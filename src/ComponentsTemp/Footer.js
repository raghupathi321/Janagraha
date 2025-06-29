import React from "react";
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-16">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-6 text-yellow-400">Diksha Foundation</h3>
                        <p className="text-gray-400 mb-6">
                            Empowering students through holistic education and lifelong connections.
                        </p>
                        <div className="flex space-x-4">
                            <Facebook className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                            <Twitter className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                            <Instagram className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                            <Linkedin className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6">Programs</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Health Tracking</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Creative Arts</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Alumni Network</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Academic Support</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6">Resources</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Student Portal</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Alumni Directory</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Events Calendar</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6">Contact</h4>
                        <div className="space-y-3 text-gray-400">
                            <div className="flex items-center">
                                <Mail className="w-5 h-5 mr-3" />
                                hello@dikshafoundation.org
                            </div>
                            <div className="flex items-center">
                                <Phone className="w-5 h-5 mr-3" />
                                +91 98765 43210
                            </div>
                            <div className="flex items-center">
                                <MapPin className="w-5 h-5 mr-3" />
                                Mumbai, India
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 Diksha Foundation. All rights reserved. Empowering futures, building dreams.</p>
                </div>
            </div>
        </footer>
    );
}
