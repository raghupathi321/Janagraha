import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <header className="bg-amber-400 text-slate-900 p-4 shadow-md">
            <nav className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-extrabold text-slate-900">Diksha</h1>

                <ul className="flex gap-6 text-sm md:text-base items-center">
                    <li><Link to="/" className="hover:text-white font-medium transition-colors duration-300">Home</Link></li>
                    <li><Link to="/StudentDashboard" className="hover:text-white font-medium transition-colors duration-300">Student Profile</Link></li>


                    <li><Link to="/alumni" className="hover:text-white font-medium transition-colors duration-300">Alumni</Link></li>

                    {/* Add Login and Signup */}
                    <li><Link to="/login" className="hover:text-white font-medium transition-colors duration-300">Login/signup</Link></li>

                </ul>
            </nav>
        </header>
    );
}
