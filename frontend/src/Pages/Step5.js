// src/pages/Step5.js
import React from "react";
import StepForm from "../ComponentsTemp/StepForm";
import { useNavigate } from "react-router-dom";

export default function Step5() {
    const navigate = useNavigate();
    return (
        <StepForm
            stepTitle="Step 5: Implement Solution"
            instruction="Take action! Show how your team tried to solve the problem. Add final reports, pictures, or success stories."
            onNext={() => navigate("/thanks")}
        />
    );
}
