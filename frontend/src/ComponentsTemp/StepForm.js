// src/components/StepForm.js
import React, { useState } from "react";

export default function StepForm({ stepTitle, instruction, onNext }) {
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("Not Started");

    const handleSave = () => {
        if (description.trim()) {
            setStatus("Completed");
        } else {
            setStatus("In Progress");
        }
        onNext();
    };

    return (
        <div className="step-form" style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
            <h2>{stepTitle}</h2>
            <p>{instruction}</p>

            <label>Description:</label><br />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                cols="50"
                placeholder="Describe your work here..."
            /><br /><br />

            <label>📷 Upload Photos:</label>
            <input type="file" accept="image/*" multiple /><br /><br />

            <label>📹 Upload Videos:</label>
            <input type="file" accept="video/*" multiple /><br /><br />

            <label>📄 Upload Reports/Presentations:</label>
            <input type="file" accept=".pdf,.doc,.ppt" multiple /><br /><br />

            <p>Status: <strong>{status}</strong></p>

            <button onClick={handleSave}>Save & Continue</button>
        </div>
    );
}
