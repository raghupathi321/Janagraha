// ComponentsTemp/UserHelpPage.jsx
import React from "react";

function UserHelpPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Help & Support</h1>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-700">🧐 Frequently Asked Questions</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li><strong>How do I register?</strong> Click the "Sign Up" button in the navbar and fill in the form.</li>
                    <li><strong>How can I submit my civic project?</strong> Log in and navigate to the Dashboard to follow the 5-step submission process.</li>
                    <li><strong>I forgot my password. What should I do?</strong> Currently, password reset is handled manually. Contact support using the email below.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-700">📧 Contact Support</h2>
                <p className="text-gray-600">
                    If your question isn’t listed here, feel free to reach out to us via email at{" "}
                    <a href="mailto:support@janagraha.org" className="text-blue-600 underline">
                        support@janagraha.org
                    </a>.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2 text-gray-700">📄 Guidelines & Rules</h2>
                <p className="text-gray-600">
                    Please make sure to read the official participation guidelines and project evaluation criteria in the
                    <a href="/about" className="text-blue-600 underline ml-1">About</a> section before submitting.
                </p>
            </section>
        </div>
    );
}

export default UserHelpPage;
