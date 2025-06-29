import React, { useState } from 'react';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([
        {
            id: 1,
            title: 'Welcome to New Semester',
            content: 'We are excited to start the new academic year with all our volunteers!',
            date: '2024-01-15',
            author: 'Admin'
        },
        {
            id: 2,
            title: 'Workshop Schedule',
            content: 'Please find the updated workshop schedule for this month.',
            date: '2024-01-10',
            author: 'Teacher'
        }
    ]);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0]
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.title && formData.content) {
            const newAnnouncement = {
                id: Date.now(),
                ...formData,
                author: 'Teacher'
            };
            setAnnouncements(prev => [newAnnouncement, ...prev]);
            setFormData({
                title: '',
                content: '',
                date: new Date().toISOString().split('T')[0]
            });
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">📣 Announcements</h1>

            <div className="bg-white p-8 rounded-xl shadow-md mb-12">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">Post New Announcement</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-gray-600 font-medium">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter announcement title"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-gray-600 font-medium">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-gray-600 font-medium">Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="5"
                            placeholder="Enter announcement content"
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Send Announcement
                    </button>
                </form>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">Recent Announcements</h2>
                <div className="space-y-5">
                    {announcements.map((announcement) => (
                        <div
                            key={announcement.id}
                            className="border border-gray-200 rounded-lg p-5 bg-gray-50 hover:bg-white hover:shadow transition"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-bold text-gray-800">{announcement.title}</h3>
                                <span className="text-sm text-gray-500">{announcement.date}</span>
                            </div>
                            <p className="text-gray-700 mb-3">{announcement.content}</p>
                            <div className="text-right text-sm text-gray-600 italic">
                                By: {announcement.author}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Announcements;