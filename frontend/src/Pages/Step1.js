// src/pages/Step1.js
import React from "react";
import StepForm from "../ComponentsTemp/StepForm";
import { useNavigate } from "react-router-dom";

export default function Step1() {
    const navigate = useNavigate();
    return (
        <StepForm
            stepTitle="Step 1: Identify a Civic Problem"
            instruction="Think about a real issue in your neighborhood or school that affects many people. Describe it clearly."
            onNext={() => navigate("/step2")}
        />
    );
}
