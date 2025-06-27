import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        user: null,
    });

    const checkAuth = () => {
        const token = localStorage.getItem("token");
        console.log("Checking auth, token:", !!token); // Debug log
        if (token) {
            try {
                const decoded = jwtDecode(token);

                console.log("Decoded token:", decoded); // Debug log
                if (decoded.exp * 1000 > Date.now()) {
                    setAuthState({
                        isAuthenticated: true,
                        user: {
                            id: decoded.id,
                            email: decoded.email,
                            role: decoded.role,
                            name: decoded.name,
                        },
                    });
                } else {
                    console.log("Token expired, clearing localStorage"); // Debug log
                    localStorage.removeItem("token");
                    localStorage.removeItem("rememberLogin");
                    setAuthState({
                        isAuthenticated: false,
                        user: null,
                    });
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("rememberLogin");
                setAuthState({
                    isAuthenticated: false,
                    user: null,
                });
            }
        } else {
            setAuthState({
                isAuthenticated: false,
                user: null,
            });
        }
    };

    useEffect(() => {
        checkAuth(); // Initial check
        window.addEventListener("storage", checkAuth);
        return () => window.removeEventListener("storage", checkAuth);
    }, []);
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar isAuthenticated={authState.isAuthenticated} user={authState.user} />
            <main className="flex-grow px-4 py-6 bg-white">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default Layout;