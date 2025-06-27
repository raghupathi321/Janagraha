// src/pages/Step2.js
import React from "react";
import StepForm from "../ComponentsTemp/StepForm";
import { useNavigate } from "react-router-dom";

export default function Step2() {
    const navigate = useNavigate();
    return (
        <StepForm
            stepTitle="Step 2: Study the Problem"
            instruction="Research more about the problem. Who is affected? Why does it happen? Use pictures, videos, or interviews."
            onNext={() => navigate("/step3")}
        />
    );
}
