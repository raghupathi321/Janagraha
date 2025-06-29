// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./ComponentsTemp/Home";
import Layout from "./ComponentsTemp/Layout";
import Navbar from "./ComponentsTemp/Navbar";
import Footer from "./ComponentsTemp/Footer";// layout with navbar and footer
import Login from "./ComponentsTemp/Login";
import Signup from "./ComponentsTemp/Signup";
import AdminDashboard from "./ComponentsTemp/teacherdashboard";
import StudentDashboard from "./ComponentsTemp/studentdashboard";
import Alumni from "./ComponentsTemp/Alumni";
import Volunteer from "./ComponentsTemp/Volunteer";
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          {/* Add more routes here */}
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/teacherdashboard" element={<AdminDashboard />} />
          <Route path="/studentdashboard" element={<StudentDashboard />} />
          <Route path="/alumni" element={<Alumni />} />
          <Route path="/volunteer" element={<Volunteer />} />
          {/* Add other routes as needed */}

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
