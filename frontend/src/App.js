import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ComponentsTemp/ProtectedRoute";
import Layout from "./ComponentsTemp/Layout";
import HomePage from "./ComponentsTemp/Home";
import HowItWorks from "./ComponentsTemp/HowItWorks";
import Leaderboard from "./ComponentsTemp/Leaderboard";
import Login from "./ComponentsTemp/Login";
import AboutPage from "./ComponentsTemp/About";
import RegisterPage from "./ComponentsTemp/Register";
import Step1 from "./Pages/Step1";
import Step2 from "./Pages/Step2";
import Step3 from "./Pages/Step3";
import Step4 from "./Pages/Step4";
import Step5 from "./Pages/Step5";
import Dashboard from "./ComponentsTemp/Dashboard";
import JudgingDashboard from "./ComponentsTemp/JudgingDashboard";
import Signup from "./ComponentsTemp/Signup";
import UserHelpPage from "./ComponentsTemp/UserHelpPage";
import Logout from "./ComponentsTemp/Logout";


function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/help" element={<UserHelpPage />} />
          <Route path="/logout" element={<Logout />} />
          <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/step1" element={<Step1 />} />
            <Route path="/step2" element={<Step2 />} />
            <Route path="/step3" element={<Step3 />} />
            <Route path="/step4" element={<Step4 />} />
            <Route path="/step5" element={<Step5 />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/judging-dashboard" element={<JudgingDashboard />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;