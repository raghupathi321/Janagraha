// src/pages/Step3.js
import React from "react";
import StepForm from "../ComponentsTemp/StepForm";
import { useNavigate } from "react-router-dom";

export default function Step3() {
    const navigate = useNavigate();
    return (
        <StepForm
            stepTitle="Step 3: Propose a Solution"
            instruction="Now think of a smart and practical idea to solve the problem. You can sketch, write, or explain it with media."
            onNext={() => navigate("/step4")}
        />
    );
}
