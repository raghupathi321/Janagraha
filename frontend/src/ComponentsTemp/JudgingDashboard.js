import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Star, MessageSquare, CheckCircle, Clock, Users, Award, FileText, Eye } from 'lucide-react';

// Constants for magic strings and numbers
const FILTER_ALL = 'all';
const STATUS_COMPLETED = 'completed';
const STATUS_IN_PROGRESS = 'in-progress';
const TOTAL_STEPS = 5;
const CRITERIA = {
  originality: 'Originality & Innovation',
  communityImpact: 'Community Impact',
  clarity: 'Clarity of Thought',
  teamwork: 'Teamwork & Collaboration',
  feasibility: 'Technical Feasibility',
};

const JudgingDashboard = () => {
  // State initialization
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [filterStep, setFilterStep] = useState(FILTER_ALL);
  const [filterSchool, setFilterSchool] = useState(FILTER_ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const [teams, setTeams] = useState([]);
  const [evaluations, setEvaluations] = useState({});
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch submitted projects
  const fetchSubmittedProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'Present' : 'Missing');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }
      const response = await fetch('http://localhost:5000/api/projects/submitted', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
      });
      console.log('Response status:', response.status);
      if (response.status === 401) {
        console.log('Unauthorized: Redirecting to login');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      // Map server project data to expected team structure
      const mappedTeams = (data.projects || []).map((project) => ({
        id: project.id,
        name: project.name || 'Unnamed Team',
        project: project.project || 'Untitled Project',
        school: project.school || 'Unknown School',
        members: project.members || 1,
        steps: project.steps || [],
        step: project.step || 0,
        status: project.status || STATUS_IN_PROGRESS,
        submittedAt: project.submittedAt ? new Date(project.submittedAt) : new Date(),
      }));
      setTeams(mappedTeams);
      setEvaluations(
        mappedTeams.reduce(
          (acc, team) => ({
            ...acc,
            [team.id]: {
              originality: 0,
              communityImpact: 0,
              clarity: 0,
              teamwork: 0,
              feasibility: 0,
              comment: '',
            },
          }),
          {}
        )
      );
    } catch (err) {
      console.error('Fetch projects error:', err.message);
      setError(err.message || 'Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch submitted projects on mount
  useEffect(() => {
    fetchSubmittedProjects();
  }, []);

  // Derived data
  const schools = useMemo(() => [...new Set(teams.map((team) => team.school))], [teams]);

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const matchesStep = filterStep === FILTER_ALL || team.step.toString() === filterStep;
      const matchesSchool = filterSchool === FILTER_ALL || team.school === filterSchool;
      const matchesSearch =
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.project.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStep && matchesSchool && matchesSearch;
    });
  }, [teams, filterStep, filterSchool, searchQuery]);

  // Handlers
  const handleScoreChange = (teamId, criterion, score) => {
    setEvaluations((prev) => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        [criterion]: score,
      },
    }));
  };

  const handleCommentChange = (teamId, comment) => {
    setEvaluations((prev) => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        comment,
      },
    }));
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmitEvaluation = async () => {
    if (!selectedTeam?.id) {
      showNotification('No team selected for evaluation.', 'error');
      return;
    }
    const teamId = selectedTeam.id;
    const evaluation = evaluations[teamId];
    if (!evaluation) {
      showNotification('No evaluation data found.', 'error');
      return;
    }

    const requiredFields = Object.keys(CRITERIA);
    const scores = [
      evaluation.originality,
      evaluation.communityImpact,
      evaluation.clarity,
      evaluation.teamwork,
      evaluation.feasibility,
    ];
    const isComplete = scores.every((score) => Number.isInteger(score) && score >= 0 && score <= 5);

    if (!isComplete) {
      showNotification('Please complete all scoring criteria with values between 0 and 5.', 'error');
      return;
    }
    if (scores.length !== 5) {
      showNotification('Scores must include exactly 5 criteria.', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification('No authentication token found. Please log in.', 'error');
        return;
      }

      console.log('Sending evaluation:', {
        projectId: teamId,
        scores,
        comments: evaluation.comment || 'No comments provided',
      });
      const response = await fetch('http://localhost:5000/api/evaluations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
          projectId: teamId,
          scores,
          comments: evaluation.comment || 'No comments provided',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Evaluation submission failed:', data);
        if (response.status === 401) {
          console.log('Unauthorized: Redirecting to login');
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        if (data.message === 'You have already evaluated this project') {
          showNotification('You have already submitted an evaluation for this project.', 'error');
          return;
        }
        const errorMessage = data.errors
          ? data.errors.map((e) => e.msg).join(', ')
          : data.message || 'Failed to submit evaluation';
        showNotification(errorMessage, 'error');
        throw new Error(errorMessage);
      }

      showNotification('Evaluation submitted successfully!', 'success');
      setSelectedTeam(null);
      setEvaluations((prev) => ({
        ...prev,
        [teamId]: {
          originality: 0,
          communityImpact: 0,
          clarity: 0,
          teamwork: 0,
          feasibility: 0,
          comment: '',
        },
      }));
      await fetchSubmittedProjects(); // Refresh projects after submission
    } catch (err) {
      console.error('Submit evaluation error:', err.message);
      showNotification(err.message || 'Failed to submit evaluation. Please try again.', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      [STATUS_COMPLETED]: 'neon-success',
      [STATUS_IN_PROGRESS]: 'neon-warning',
      pending: 'neon-neutral',
    };
    return badges[status] || badges.pending;
  };

  const getStepProgress = (currentStep, totalSteps = TOTAL_STEPS) => {
    return (currentStep / totalSteps) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <p className="text-red-400 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 pointer-events-none z-[-10]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse pointer-events-none z-[-10]"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none z-[-10]"></div>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg border transition-all duration-300 ${notification.type === 'success' ? 'neon-success-notification' : 'neon-error-notification'
            }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 border-b border-cyan-500/30 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 neon-glow-cyan">
                <Award className="h-8 w-8 text-cyan-400" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  JUDGING PANEL
                </h1>
                <p className="text-gray-300 font-medium">Innovation Challenge • Evaluation Interface</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-cyan-400 font-semibold">Judge Panel</p>
                <p className="text-gray-400 text-sm">Evaluation Session</p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center neon-glow-cyan">
                <span className="text-white font-bold text-lg">JP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {!selectedTeam ? (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="neon-card group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 font-medium">Total Teams</p>
                    <p className="text-4xl font-bold text-white mt-2">{teams.length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-cyan-500/20 neon-glow-cyan group-hover:scale-110 transition-transform">
                    <Users className="h-8 w-8 text-cyan-400" aria-hidden="true" />
                  </div>
                </div>
              </div>
              <div className="neon-card group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 font-medium">Completed</p>
                    <p className="text-4xl font-bold text-green-400 mt-2">
                      {teams.filter((t) => t.status === STATUS_COMPLETED).length}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-green-500/20 neon-glow-green group-hover:scale-110 transition-transform">
                    <CheckCircle className="h-8 w-8 text-green-400" aria-hidden="true" />
                  </div>
                </div>
              </div>
              <div className="neon-card group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 font-medium">In Progress</p>
                    <p className="text-4xl font-bold text-yellow-400 mt-2">
                      {teams.filter((t) => t.status === STATUS_IN_PROGRESS).length}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-yellow-500/20 neon-glow-yellow group-hover:scale-110 transition-transform">
                    <Clock className="h-8 w-8 text-yellow-400" aria-hidden="true" />
                  </div>
                </div>
              </div>
              <div className="neon-card group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 font-medium">Avg Progress</p>
                    <p className="text-4xl font-bold text-purple-400 mt-2">
                      {teams.length ? Math.round(teams.reduce((acc, t) => acc + t.step, 0) / teams.length) : 0}/
                      {TOTAL_STEPS}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/20 neon-glow-purple group-hover:scale-110 transition-transform">
                    <FileText className="h-8 w-8 text-purple-400" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="neon-card">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-4 h-5 w-5 text-cyan-400" aria-hidden="true" />
                    <input
                      type="text"
                      id="search-teams"
                      placeholder="Search teams or projects..."
                      className="neon-input pl-12"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search teams or projects"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <select
                    className="neon-select"
                    value={filterStep}
                    onChange={(e) => setFilterStep(e.target.value)}
                    aria-label="Filter by step"
                  >
                    <option value={FILTER_ALL}>All Steps</option>
                    {[1, 2, 3, 4, 5].map((step) => (
                      <option key={step} value={step}>
                        Step {step}
                      </option>
                    ))}
                  </select>
                  <select
                    className="neon-select"
                    value={filterSchool}
                    onChange={(e) => setFilterSchool(e.target.value)}
                    aria-label="Filter by school"
                  >
                    <option value={FILTER_ALL}>All Schools</option>
                    {schools.map((school) => (
                      <option key={school} value={school}>
                        {school}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTeams.map((team) => (
                <div key={team.id} className="neon-card group hover:scale-[1.02] transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                          {team.name}
                        </h3>
                        <p className="text-gray-300 mb-3 font-medium">{team.project}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="font-medium">{team.school}</span>
                          <span className="text-cyan-400">•</span>
                          <span>{team.members} members</span>
                        </div>
                      </div>
                      <span className={`neon-badge ${getStatusBadge(team.status)}`}>
                        {team.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span className="font-medium">Progress</span>
                        <span className="text-cyan-400 font-bold">
                          {team.step}/{TOTAL_STEPS} steps
                        </span>
                      </div>
                      <div className="neon-progress-track">
                        <div
                          className="neon-progress-fill"
                          style={{ width: `${getStepProgress(team.step)}%` }}
                          aria-label={`Progress: ${team.step} out of ${TOTAL_STEPS} steps`}
                        ></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button
                        onClick={() => setSelectedTeam(team)}
                        className="neon-button-primary flex-1"
                        aria-label={`Evaluate ${team.name}`}
                      >
                        <Eye className="h-5 w-5 mr-2" aria-hidden="true" />
                        EVALUATE
                      </button>
                      <button
                        className="neon-button-secondary"
                        aria-label={`View details for ${team.name}`}
                      >
                        <FileText className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Detailed Evaluation View */
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedTeam(null)}
                className="neon-button-secondary"
                aria-label="Back to teams list"
              >
                ← BACK TO TEAMS
              </button>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-white">{selectedTeam.name}</h2>
                <p className="text-cyan-400 font-medium">{selectedTeam.school}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Project Overview */}
              <div className="xl:col-span-2 space-y-8">
                <div className="neon-card">
                  <h3 className="text-xl font-bold text-white mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    PROJECT OVERVIEW
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-white text-lg mb-2">{selectedTeam.project}</h4>
                      <p className="text-gray-300 leading-relaxed">
                        {selectedTeam.steps.find((step) => step.id === 1)?.description ||
                          'No description provided.'}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="neon-info-box">
                        <span className="text-cyan-400 font-semibold">Team Members</span>
                        <span className="text-white font-bold text-xl">{selectedTeam.members}</span>
                      </div>
                      <div className="neon-info-box">
                        <span className="text-purple-400 font-semibold">Submitted</span>
                        <span className="text-white font-bold">
                          {new Date(selectedTeam.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5-Step Summary */}
                <div className="neon-card">
                  <h3 className="text-xl font-bold text-white mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    PROJECT STEPS
                  </h3>
                  <div className="space-y-6">
                    {selectedTeam.steps.map((step, index) => (
                      <div
                        key={step.id ? `${step.id}-${index}` : `step-${index}`}
                        className="flex gap-6 group"
                      >
                        <div
                          className={`neon-step-badge ${step.status === 'Completed' ? 'neon-step-completed' : 'neon-step-pending'
                            }`}
                        >
                          {step.id || index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                            {step.title || `Step ${index + 1}`}
                          </h4>
                          <p className="text-gray-300 leading-relaxed">
                            {step.description || 'No description provided.'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Evaluation Panel */}
              <div className="space-y-8">
                <div className="neon-card">
                  <h3 className="text-xl font-bold text-white mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    EVALUATION RUBRIC
                  </h3>
                  <div className="space-y-8">
                    {Object.entries(CRITERIA).map(([key, label]) => (
                      <div key={key}>
                        <label className="block text-white font-semibold mb-3">{label}</label>
                        <div className="flex gap-3 mb-2">
                          {[1, 2, 3, 4, 5].map((score) => (
                            <button
                              key={`${key}-${score}`}
                              onClick={() => handleScoreChange(selectedTeam.id, key, score)}
                              className={`neon-score-button ${evaluations[selectedTeam.id]?.[key] === score
                                  ? 'neon-score-active'
                                  : 'neon-score-inactive'
                                }`}
                              aria-label={`Score ${score} for ${label}`}
                            >
                              {score}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Poor</span>
                          <span>Excellent</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="neon-card">
                  <label
                    htmlFor="evaluation-comment"
                    className="block text-xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
                  >
                    COMMENTS
                  </label>
                  <textarea
                    id="evaluation-comment"
                    className="neon-textarea"
                    placeholder="Enter your detailed feedback and comments..."
                    value={evaluations[selectedTeam.id]?.comment || ''}
                    onChange={(e) => handleCommentChange(selectedTeam.id, e.target.value)}
                    rows="6"
                    aria-label="Evaluation comments"
                  />
                </div>

                <button
                  onClick={handleSubmitEvaluation}
                  className="neon-button-success w-full"
                  aria-label={`Submit evaluation for ${selectedTeam.name}`}
                >
                  SUBMIT EVALUATION
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .neon-card {
          background: rgba(17, 24, 39, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(6, 182, 212, 0.3);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 8px 32px rgba(6, 182, 212, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .neon-card:hover {
          box-shadow: 0 8px 32px rgba(6, 182, 212, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          border-color: rgba(6, 182, 212, 0.5);
        }

        .neon-button-primary {
          background: linear-gradient(135deg, #0891b2, #2563eb);
          color: white;
          font-weight: bold;
          padding: 12px 24px;
          border-radius: 12px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(6, 182, 212, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .neon-button-primary:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 30px rgba(6, 182, 212, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .neon-button-secondary {
          background: rgba(31, 41, 55, 0.5);
          border: 1px solid #4b5563;
          color: #d1d5db;
          font-weight: bold;
          padding: 12px 24px;
          border-radius: 12px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          cursor: pointer;
        }

        .neon-button-secondary:hover {
          background: rgba(55, 65, 81, 0.5);
          border-color: #6b7280;
          color: white;
          transform: scale(1.05);
          box-shadow: 0 4px 20px rgba(107, 114, 128, 0.3);
        }

        .neon-button-success {
          background: linear-gradient(135deg, #059669, #10b981);
          color: white;
          font-weight: bold;
          padding: 16px 32px;
          border-radius: 12px;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          width: 100%;
          box-shadow: 0 4px 20px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .neon-button-success:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 30px rgba(34, 197, 94, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .neon-input {
          width: 100%;
          padding: 16px;
          background: rgba(17, 24, 39, 0.5);
          border: 1px solid rgba(6, 182, 212, 0.3);
          border-radius: 12px;
          color: white;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
          box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .neon-input::placeholder {
          color: #9ca3af;
        }

        .neon-input:focus {
          outline: none;
          border-color: #06b6d4;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.3), inset 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .neon-select {
          padding: 16px;
          background: rgba(17, 24, 39, 0.5);
          border: 1px solid rgba(6, 182, 212, 0.3);
          border-radius: 12px;
          color: white;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
          box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .neon-select:focus {
          outline: none;
          border-color: #06b6d4;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.3), inset 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .neon-textarea {
          width: 100%;
          padding: 16px;
          background: rgba(17, 24, 39, 0.5);
          border: 1px solid rgba(6, 182, 212, 0.3);
          border-radius: 12px;
          color: white;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
          resize: none;
          box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .neon-textarea::placeholder {
          color: #9ca3af;
        }

        .neon-textarea:focus {
          outline: none;
          border-color: #06b6d4;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.3), inset 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .neon-badge {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .neon-success {
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.5);
          box-shadow: 0 2px 10px rgba(34, 197, 94, 0.3);
        }

        .neon-warning {
          background: rgba(234, 179, 8, 0.2);
          color: #facc15;
          border: 1px solid rgba(234, 179, 8, 0.5);
          box-shadow: 0 2px 10px rgba(234, 179, 8, 0.3);
        }

        .neon-neutral {
          background: rgba(107, 114, 128, 0.2);
          color: #9ca3af;
          border: 1px solid rgba(107, 114, 128, 0.5);
          box-shadow: 0 2px 10px rgba(107, 114, 128, 0.3);
        }

        .neon-progress-track {
          width: 100%;
          background: #1f2937;
          border-radius: 9999px;
          height: 12px;
          overflow: hidden;
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.5);
        }

        .neon-progress-fill {
          background: linear-gradient(90deg, #06b6d4, #3b82f6);
          height: 100%;
          border-radius: 9999px;
          transition: all 0.5s ease;
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.5);
        }

        .neon-score-button {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          border: 2px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          transition: all 0.2s ease;
          cursor: pointer;
          background: none;
        }

        .neon-score-active {
          background: linear-gradient(135deg, #06b6d4, #2563eb);
          border-color: #06b6d4;
          color: white;
          box-shadow: 0 4px 15px rgba(6, 182, 212, 0.4);
        }

        .neon-score-inactive {
          border-color: #4b5563;
          color: #9ca3af;
          background: rgba(31, 41, 55, 0.5);
        }

        .neon-score-inactive:hover {
          border-color: #06b6d4;
          color: #06b6d4;
          transform: scale(1.1);
          box-shadow: 0 2px 10px rgba(6, 182, 212, 0.3);
        }

        .neon-step-badge {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 18px;
          flex-shrink: 0;
        }

        .neon-step-completed {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
        }

        .neon-step-pending {
          background: rgba(75, 85, 99, 0.5);
          color: #9ca3af;
          border: 2px solid #4b5563;
        }

        .neon-info-box {
          background: rgba(17, 24, 39, 0.3);
          border: 1px solid rgba(6, 182, 212, 0.2);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .neon-glow-cyan {
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
        }

        .neon-glow-green {
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
        }

        .neon-glow-yellow {
          box-shadow: 0 0 20px rgba(234, 179, 8, 0.3);
        }

        .neon-glow-purple {
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
        }

        .neon-success-notification {
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.5);
          color: #10b981;
          backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
        }

        .neon-error-notification {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.5);
          color: #ef4444;
          backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px rgba(239, 68, 68, 0.3);
        }
      `}</style>
    </div>
  );
};

export default JudgingDashboard;