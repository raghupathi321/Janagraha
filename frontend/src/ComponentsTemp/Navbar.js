import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ isAuthenticated, user }) {
    const navigate = useNavigate();

    console.log("Navbar props:", { isAuthenticated, user }); // Debug log

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">
                    Janagraha
                </Link>
                <ul className="flex space-x-4">
                    <li>
                        <Link to="/" className="hover:text-gray-300">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/how-it-works" className="hover:text-gray-300">
                            How It Works
                        </Link>
                    </li>
                    <li>
                        <Link to="/leaderboard" className="hover:text-gray-300">
                            Leaderboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" className="hover:text-gray-300">
                            About
                        </Link>
                    </li>
                    <li>
                        <Link to="/help" className="hover:text-gray-300">
                            Help
                        </Link>
                    </li>
                    {isAuthenticated ? (
                        <>
                            <li>
                                <Link to="/dashboard" className="hover:text-gray-300">
                                    Dashboard
                                </Link>
                            </li>
                            {user?.role === "admin" && (
                                <li>
                                    <Link to="/judging-dashboard" className="hover:text-gray-300">
                                        Judging Dashboard
                                    </Link>
                                </li>
                            )}
                            <li>
                                <button
                                    onClick={() => navigate("/logout")}
                                    className="hover:text-gray-300"
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/signup" className="hover:text-gray-300">
                                    Sign Up
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="hover:text-gray-300">
                                    Login
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;