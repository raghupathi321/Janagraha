// src/ComponentsTemp/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Install with: npm install jwt-decode

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('token');
    console.log('ProtectedRoute - Token:', !!token); // Debug

    if (!token) {
        console.log('ProtectedRoute - No token, redirecting to /login');
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        console.log('ProtectedRoute - Decoded token:', decoded); // Debug
        const userRole = decoded.role || decoded.userRole || 'user'; // Fallback to 'user' if role is missing
        const isAuthenticated = !!decoded.id; // Ensure user ID exists

        if (!isAuthenticated) {
            console.log('ProtectedRoute - Invalid token, no user ID');
            localStorage.removeItem('token');
            return <Navigate to="/login" replace />;
        }

        if (!allowedRoles.includes(userRole.toLowerCase())) {
            console.log(`ProtectedRoute - Role ${userRole} not allowed for ${allowedRoles}`);
            return <Navigate to="/" replace />; // Redirect to home if role not allowed
        }

        return <Outlet />; // Render child routes
    } catch (error) {
        console.error('ProtectedRoute - Token decode error:', error);
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;