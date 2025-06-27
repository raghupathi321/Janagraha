import React, { useState, useEffect } from "react";
import { Trophy, Medal, Award, Users, MapPin, TrendingUp, Calendar, Filter, Search, Download } from "lucide-react";

function Leaderboard() {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('score');
    const [timeRange, setTimeRange] = useState('all-time');
    const [showStats, setShowStats] = useState(false);

    const allTeams = [
        { name: "Green Warriors", city: "Hyderabad", score: 95, members: 12, category: "Environment", streak: 7, lastActive: "2 hours ago", badge: "🌱", trend: "up" },
        { name: "Water Savers", city: "Mumbai", score: 92, members: 8, category: "Water Conservation", streak: 5, lastActive: "1 hour ago", badge: "💧", trend: "up" },
        { name: "Clean Champs", city: "Bengaluru", score: 90, members: 15, category: "Cleanliness", streak: 4, lastActive: "30 min ago", badge: "✨", trend: "stable" },
        { name: "Solar Squad", city: "Chennai", score: 88, members: 10, category: "Energy", streak: 6, lastActive: "45 min ago", badge: "☀️", trend: "up" },
        { name: "Waste Warriors", city: "Pune", score: 85, members: 9, category: "Waste Management", streak: 3, lastActive: "1 hour ago", badge: "♻️", trend: "down" },
        { name: "Air Guardians", city: "Delhi", score: 83, members: 11, category: "Air Quality", streak: 2, lastActive: "3 hours ago", badge: "🌬️", trend: "stable" },
        { name: "Tree Planters", city: "Kolkata", score: 81, members: 7, category: "Environment", streak: 8, lastActive: "2 hours ago", badge: "🌳", trend: "up" },
        { name: "Eco Heroes", city: "Ahmedabad", score: 79, members: 13, category: "General", streak: 1, lastActive: "4 hours ago", badge: "🦸", trend: "up" },
    ];

    const categories = ['all', 'Environment', 'Water Conservation', 'Cleanliness', 'Energy', 'Waste Management', 'Air Quality', 'General'];

    const filteredAndSortedTeams = allTeams
        .filter(team => {
            const matchesCategory = selectedFilter === 'all' || team.category === selectedFilter;
            const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                team.city.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'score':
                    return b.score - a.score;
                case 'members':
                    return b.members - a.members;
                case 'streak':
                    return b.streak - a.streak;
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return b.score - a.score;
            }
        });

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1:
                return <Trophy className="w-6 h-6 text-yellow-500" />;
            case 2:
                return <Medal className="w-6 h-6 text-gray-400" />;
            case 3:
                return <Award className="w-6 h-6 text-orange-500" />;
            default:
                return <span className="w-6 h-6 flex items-center justify-center font-bold text-gray-600">{rank}</span>;
        }
    };

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="w-4 h-4 text-green-500" />;
            case 'down':
                return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
            default:
                return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
        }
    };

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-green-600 bg-green-100';
        if (score >= 80) return 'text-blue-600 bg-blue-100';
        if (score >= 70) return 'text-orange-600 bg-orange-100';
        return 'text-red-600 bg-red-100';
    };

    const totalTeams = allTeams.length;
    const averageScore = Math.round(allTeams.reduce((sum, team) => sum + team.score, 0) / totalTeams);
    const totalMembers = allTeams.reduce((sum, team) => sum + team.members, 0);

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-green-600 mb-4 flex items-center justify-center gap-3">
                    <Trophy className="w-12 h-12 text-yellow-500" />
                    Leaderboard
                </h1>
                <p className="text-gray-700 text-lg mb-6">
                    Top-performing teams in the "Our City, Our Challenge" competition!
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-4 rounded-lg">
                        <div className="flex items-center justify-center gap-2">
                            <Users className="w-5 h-5" />
                            <span className="font-semibold">Total Teams</span>
                        </div>
                        <div className="text-2xl font-bold">{totalTeams}</div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-4 rounded-lg">
                        <div className="flex items-center justify-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            <span className="font-semibold">Avg Score</span>
                        </div>
                        <div className="text-2xl font-bold">{averageScore}</div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-4 rounded-lg">
                        <div className="flex items-center justify-center gap-2">
                            <Users className="w-5 h-5" />
                            <span className="font-semibold">Total Members</span>
                        </div>
                        <div className="text-2xl font-bold">{totalMembers}</div>
                    </div>
                </div>
            </div>

            {/* Filters and Controls */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search teams or cities..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category === 'all' ? 'All Categories' : category}
                            </option>
                        ))}
                    </select>

                    {/* Sort By */}
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="score">Sort by Score</option>
                        <option value="members">Sort by Members</option>
                        <option value="streak">Sort by Streak</option>
                        <option value="name">Sort by Name</option>
                    </select>

                    {/* Export Button */}
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Leaderboard Table */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                            <tr>
                                <th className="py-4 px-6 text-left">Rank</th>
                                <th className="py-4 px-6 text-left">Team</th>
                                <th className="py-4 px-6 text-left">Category</th>
                                <th className="py-4 px-6 text-left">Location</th>
                                <th className="py-4 px-6 text-center">Members</th>
                                <th className="py-4 px-6 text-center">Score</th>
                                <th className="py-4 px-6 text-center">Streak</th>
                                <th className="py-4 px-6 text-center">Trend</th>
                                <th className="py-4 px-6 text-left">Last Active</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedTeams.map((team, index) => (
                                <tr
                                    key={index}
                                    className={`border-b hover:bg-green-50 transition-colors ${index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
                                        }`}
                                >
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            {getRankIcon(index + 1)}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{team.badge}</span>
                                            <div>
                                                <div className="font-semibold text-gray-800">{team.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                            {team.category}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4 text-gray-500" />
                                            <span className="text-gray-700">{team.city}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Users className="w-4 h-4 text-gray-500" />
                                            <span className="font-medium">{team.members}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className={`px-3 py-1 rounded-full font-bold ${getScoreColor(team.score)}`}>
                                            {team.score}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <span className="font-medium">{team.streak}</span>
                                            <span className="text-orange-500">🔥</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        {getTrendIcon(team.trend)}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-600">{team.lastActive}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredAndSortedTeams.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">No teams found matching your criteria</div>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedFilter('all');
                            }}
                            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Achievements Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                        <Trophy className="w-8 h-8" />
                        <h3 className="text-xl font-bold">Top Performer</h3>
                    </div>
                    <div className="text-2xl font-bold">{allTeams[0]?.name}</div>
                    <div className="text-yellow-100">{allTeams[0]?.city} • {allTeams[0]?.score} points</div>
                </div>

                <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                        <Users className="w-8 h-8" />
                        <h3 className="text-xl font-bold">Largest Team</h3>
                    </div>
                    <div className="text-2xl font-bold">
                        {allTeams.reduce((max, team) => team.members > max.members ? team : max, allTeams[0])?.name}
                    </div>
                    <div className="text-blue-100">
                        {allTeams.reduce((max, team) => team.members > max.members ? team : max, allTeams[0])?.members} members
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                        <TrendingUp className="w-8 h-8" />
                        <h3 className="text-xl font-bold">Longest Streak</h3>
                    </div>
                    <div className="text-2xl font-bold">
                        {allTeams.reduce((max, team) => team.streak > max.streak ? team : max, allTeams[0])?.name}
                    </div>
                    <div className="text-orange-100">
                        {allTeams.reduce((max, team) => team.streak > max.streak ? team : max, allTeams[0])?.streak} days 🔥
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;