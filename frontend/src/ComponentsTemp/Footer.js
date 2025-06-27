import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

function Footer() {
    return (
        <footer className="bg-blue-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-400 rounded-full flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="font-bold">Our City, Our Challenge</div>
                                <div className="text-sm text-blue-300">by Our Team</div>
                            </div>
                        </div>
                        <p className="text-blue-300 text-sm">
                            Empowering teams to become active citizens and solve real community problems.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">For Students</h4>
                        <ul className="space-y-2 text-sm text-blue-300">
                            <li><NavLink to="/register" className="hover:text-white transition-colors">Register Team</NavLink></li>
                            <li><NavLink to="/projects" className="hover:text-white transition-colors">Browse Projects</NavLink></li>
                            <li><NavLink to="/resources" className="hover:text-white transition-colors">Resources</NavLink></li>
                            <li><NavLink to="/help" className="hover:text-white transition-colors">Get Help</NavLink></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">For Educators</h4>
                        <ul className="space-y-2 text-sm text-blue-300">
                            <li><NavLink to="/teacher-guide" className="hover:text-white transition-colors">Teacher Guide</NavLink></li>
                            <li><NavLink to="/curriculum" className="hover:text-white transition-colors">Curriculum</NavLink></li>
                            <li><NavLink to="/evaluation" className="hover:text-white transition-colors">Evaluation Links</NavLink></li>
                            <li><NavLink to="/webinars" className="hover:text-white transition-colors">Webinar</NavLink></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-blue-300">
                            <li><NavLink to="/contact" className="hover:text-white transition-colors">Contact Us</NavLink></li>
                            <li><NavLink to="/faq" className="hover:text-white transition-colors">FAQ</NavLink></li>
                            <li><NavLink to="/technical-support" className="hover:text-white transition-colors">Technical Support</NavLink></li>
                            <li><NavLink to="/feedback" className="hover:text-white transition-colors">Feedback</NavLink></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-b-blue-800 mt-8 pt-8 text-center text-sm text-blue-400">
                    <p className="text-blue-400">© 2024 Our Team for Student Innovation. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;