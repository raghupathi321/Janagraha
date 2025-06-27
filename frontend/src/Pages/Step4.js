// src/pages/Step4.js
import React from "react";
import StepForm from "../ComponentsTemp/StepForm";
import { useNavigate } from "react-router-dom";

export default function Step4() {
    const navigate = useNavigate();
    return (
        <StepForm
            stepTitle="Step 4: Engage Stakeholders"
            instruction="Talk to people who can help: teachers, neighbors, leaders. Add photos, quotes, or videos of their support."
            onNext={() => navigate("/step5")}
        />
    );
}
