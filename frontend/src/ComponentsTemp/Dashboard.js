import React, { useReducer, useState, useEffect, useCallback, useRef } from "react";
import { CheckCircle, AlertCircle, Upload, Image, Video, FileText, Mic, Save, Eye, Send, X, Play, Pause, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";

// Initial state aligned with backend schema
const initialState = {
    projectId: null,
    steps: [
        {
            id: 1,
            title: "Identify a Civic Problem",
            description: "",
            photos: [],
            videos: [],
            reports: [],
            audio: null,
            status: "Not Started",
            location: "",
            urgency: "medium",
            affectedPopulation: "",
            tags: [],
        },
        {
            id: 2,
            title: "Study the Problem",
            description: "",
            photos: [],
            videos: [],
            reports: [],
            audio: null,
            status: "Not Started",
            researchMethods: [],
            dataCollected: "",
            keyFindings: "",
        },
        {
            id: 3,
            title: "Propose a Solution",
            description: "",
            photos: [],
            videos: [],
            reports: [],
            audio: null,
            status: "Not Started",
            solutionType: "",
            timeline: "",
            budget: "",
            resources: [],
        },
        {
            id: 4,
            title: "Engage Stakeholders",
            description: "",
            photos: [],
            videos: [],
            reports: [],
            audio: null,
            status: "Not Started",
            stakeholders: [],
            meetingDates: [],
            feedback: "",
        },
        {
            id: 5,
            title: "Implement Solution",
            description: "",
            photos: [],
            videos: [],
            reports: [],
            audio: null,
            status: "Not Started",
            implementationDate: "",
            outcomes: "",
            lessons: "",
            nextSteps: "",
        },
    ],
    errors: {},
    lastSaved: null,
    isSubmitted: false,
    overallProgress: 0,
    name: "Untitled Project",
    project: "Civic Engagement Project",
    school: "Unknown School",
    members: 1,
    currentStepIndex: 1, // Reflects the backend schema change
};

// Reducer for global project state management
const reducer = (state, action) => {
    switch (action.type) {
        case "SET_PROJECT":
            const incomingProject = action.payload;
            const newStepsData = incomingProject.steps || [];

            const mergedSteps = initialState.steps.map(initialTemplateStep => {
                const serverDataForThisStep = newStepsData.find(s => s.id === initialTemplateStep.id);
                if (serverDataForThisStep) {
                    const merged = {
                        ...initialTemplateStep,
                        ...serverDataForThisStep,
                    };
                    merged.photos = Array.isArray(serverDataForThisStep.photos) ? serverDataForThisStep.photos : [];
                    merged.videos = Array.isArray(serverDataForThisStep.videos) ? serverDataForThisStep.videos : [];
                    merged.reports = Array.isArray(serverDataForThisStep.reports) ? serverDataForThisStep.reports : [];
                    merged.tags = Array.isArray(serverDataForThisStep.tags) ? serverDataForThisStep.tags : [];
                    merged.researchMethods = Array.isArray(serverDataForThisStep.researchMethods) ? serverDataForThisStep.researchMethods : [];
                    merged.resources = Array.isArray(serverDataForThisStep.resources) ? serverDataForThisStep.resources : [];
                    merged.stakeholders = Array.isArray(serverDataForThisStep.stakeholders) ? serverDataForThisStep.stakeholders : [];
                    merged.meetingDates = Array.isArray(serverDataForThisStep.meetingDates) ? serverDataForThisStep.meetingDates : [];
                    merged.audio = serverDataForThisStep.audio || null;
                    return merged;
                }
                return initialTemplateStep;
            });

            return {
                ...state,
                projectId: incomingProject._id || state.projectId,
                name: incomingProject.name || state.name,
                project: incomingProject.project || state.project,
                school: incomingProject.school || state.school,
                members: incomingProject.members !== undefined ? incomingProject.members : state.members,
                status: incomingProject.status || state.status,
                currentStepIndex: incomingProject.currentStepIndex !== undefined ? incomingProject.currentStepIndex : state.currentStepIndex,
                isSubmitted: incomingProject.isSubmitted !== undefined ? incomingProject.isSubmitted : state.isSubmitted,
                lastSaved: incomingProject.lastSaved || state.lastSaved,
                overallProgress: incomingProject.overallProgress !== undefined ? incomingProject.overallProgress : state.overallProgress,
                steps: mergedSteps,
                errors: {},
            };

        case "UPDATE_PROJECT_INFO_GLOBAL":
            return {
                ...state,
                [action.payload.field]: action.payload.value,
                errors: { ...state.errors, [action.payload.field]: "" },
            };

        case "UPDATE_STEP_GLOBAL":
            const updatedStepsGlobal = state.steps.map(step => {
                if (step.id === action.payload.id) {
                    const newStatus = action.payload.field === "description" && action.payload.value.trim() && step.status === "Not Started"
                        ? "In Progress"
                        : step.status;
                    return { ...step, [action.payload.field]: action.payload.value, status: newStatus };
                }
                return step;
            });
            const newErrorsAfterUpdateGlobal = { ...state.errors };
            delete newErrorsAfterUpdateGlobal[`step_${action.payload.id}_${action.payload.field}`];
            const hasOtherStepErrorsGlobal = Object.keys(newErrorsAfterUpdateGlobal).some(key => key.startsWith(`step_${action.payload.id}_`) && key !== `step_${action.payload.id}_status`);
            if (!hasOtherStepErrorsGlobal) {
                delete newErrorsAfterUpdateGlobal.stepValidation;
            }
            return { ...state, steps: updatedStepsGlobal, errors: newErrorsAfterUpdateGlobal };

        case "SET_ERRORS":
            return { ...state, errors: action.payload };

        case "CLEAR_ALL_ERRORS":
            return { ...state, errors: {} };

        case "COMPLETE_STEP":
            return {
                ...state,
                steps: state.steps.map(step =>
                    step.id === action.payload.stepId ? { ...step, status: "Completed" } : step
                ),
            };

        case "SAVE_DRAFT_SUCCESS":
            return { ...state, lastSaved: action.payload.lastSaved || new Date().toLocaleString(), errors: {} };

        case "UPDATE_PROGRESS":
            const completedStepsCount = state.steps.filter(step => step.status === "Completed").length;
            return { ...state, overallProgress: Math.round((completedStepsCount / state.steps.length) * 100) };

        case "SUBMIT_PROJECT_SUCCESS":
            return { ...state, isSubmitted: true, errors: {}, lastSaved: new Date().toLocaleString(), status: "submitted" };

        case "SET_CURRENT_STEP_INDEX":
            return { ...state, currentStepIndex: action.payload };

        default:
            return state;
    }
};

const Dashboard = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [currentStep, setCurrentStep] = useState(state.currentStepIndex);
    const [showPreview, setShowPreview] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);
    const [audioPlaying, setAudioPlaying] = useState(null);
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const lastSyncedStateRef = useRef(JSON.parse(JSON.stringify(initialState)));

    const [localInputs, setLocalInputs] = useState(() => {
        const initialStep1Data = initialState.steps.find(step => step.id === 1) || {};
        return {
            description: initialStep1Data.description || "",
            location: initialStep1Data.location || "",
            affectedPopulation: initialStep1Data.affectedPopulation || "",
            tags: initialStep1Data.tags || [],
            urgency: initialStep1Data.urgency || "medium",
            keyFindings: initialStep1Data.keyFindings || "",
            researchMethods: initialStep1Data.researchMethods || [],
            dataCollected: initialStep1Data.dataCollected || "",
            solutionType: initialStep1Data.solutionType || "",
            timeline: initialStep1Data.timeline || "",
            budget: initialStep1Data.budget || "",
            resources: initialStep1Data.resources || [],
            feedback: initialStep1Data.feedback || "",
            stakeholders: initialStep1Data.stakeholders || [],
            meetingDates: initialStep1Data.meetingDates || [],
            outcomes: initialStep1Data.outcomes || "",
            implementationDate: initialStep1Data.implementationDate || "",
            lessons: initialStep1Data.lessons || "",
            nextSteps: initialStep1Data.nextSteps || "",
        };
    });

    const [projectInfo, setProjectInfo] = useState({
        name: initialState.name,
        project: initialState.project,
        school: initialState.school,
        members: initialState.members,
    });

    // Add a local state for members input as string
    const [membersInput, setMembersInput] = useState(String(initialState.members));

    const instructions = {
        1: "Identify a civic problem in your community. Describe the issue, specify its location, affected population, tags, and urgency.",
        2: "Research the problem. Document your research methods, data collected, and key findings.",
        3: "Develop a solution. Define the solution type, timeline, budget, and required resources.",
        4: "Engage stakeholders. List stakeholders, meeting dates, and document their feedback.",
        5: "Implement your solution. Specify the implementation date, outcomes, lessons learned, and next steps.",
    };

    // Effect to sync localInputs from global state.steps (when global state is updated by SET_PROJECT or navigation)
    // FIX: Removed `localInputs` from dependency array to prevent erratic re-renders
    useEffect(() => {
        const currentStepData = state.steps.find(step => step.id === currentStep);
        if (currentStepData) {
            const newLocalInputs = {
                description: currentStepData.description || "",
                location: currentStepData.location || "",
                affectedPopulation: currentStepData.affectedPopulation || "",
                tags: currentStepData.tags || [],
                urgency: currentStepData.urgency || "medium",
                keyFindings: currentStepData.keyFindings || "",
                researchMethods: currentStepData.researchMethods || [],
                dataCollected: currentStepData.dataCollected || "",
                solutionType: currentStepData.solutionType || "",
                timeline: currentStepData.timeline || "",
                budget: currentStepData.budget || "",
                resources: currentStepData.resources || [],
                feedback: currentStepData.feedback || "",
                stakeholders: currentStepData.stakeholders || [],
                meetingDates: currentStepData.meetingDates || [],
                outcomes: currentStepData.outcomes || "",
                implementationDate: currentStepData.implementationDate || "",
                lessons: currentStepData.lessons || "",
                nextSteps: currentStepData.nextSteps || "",
            };
            // Only update localInputs if data is truly different (deep comparison)
            if (JSON.stringify(newLocalInputs) !== JSON.stringify(localInputs)) {
                setLocalInputs(newLocalInputs);
            }
        }
    }, [currentStep, state.steps]); // FIXED: `localInputs` removed from deps

    // Effect to sync projectInfo local state from global `state`
    useEffect(() => {
        const newProjectInfo = {
            name: state.name,
            project: state.project,
            school: state.school,
            members: state.members,
        };
        if (JSON.stringify(newProjectInfo) !== JSON.stringify(projectInfo)) {
            setProjectInfo(newProjectInfo);
        }
    }, [state.name, state.project, state.school, state.members, projectInfo]);

    // Update currentStep when global state.currentStepIndex changes (e.g., on initial load)
    useEffect(() => {
        if (state.currentStepIndex !== currentStep) {
            setCurrentStep(state.currentStepIndex);
        }
    }, [state.currentStepIndex, currentStep]);

    // Central function to collect all current form data (from local `useState`s)
    const collectCurrentFormData = useCallback(() => {
        const currentStepsSnapshot = JSON.parse(JSON.stringify(state.steps));

        const updatedSteps = currentStepsSnapshot.map(s => {
            if (s.id === currentStep) {
                const updatedStep = { ...s, ...localInputs };
                if (typeof updatedStep.tags === 'string') updatedStep.tags = updatedStep.tags.split(',').map(item => item.trim()).filter(item => item);
                if (typeof updatedStep.researchMethods === 'string') updatedStep.researchMethods = updatedStep.researchMethods.split(',').map(item => item.trim()).filter(item => item);
                if (typeof updatedStep.resources === 'string') updatedStep.resources = updatedStep.resources.split(',').map(item => item.trim()).filter(item => item);
                if (typeof updatedStep.stakeholders === 'string') updatedStep.stakeholders = updatedStep.stakeholders.split(',').map(item => item.trim()).filter(item => item);
                if (typeof updatedStep.meetingDates === 'string') updatedStep.meetingDates = updatedStep.meetingDates.split(',').map(item => item.trim()).filter(item => item);
                return updatedStep;
            }
            return s;
        });

        return {
            projectId: state.projectId,
            name: projectInfo.name,
            project: projectInfo.project,
            school: projectInfo.school,
            members: projectInfo.members,
            steps: updatedSteps,
            status: state.status,
            currentStepIndex: currentStep,
            isSubmitted: state.isSubmitted,
            overallProgress: state.overallProgress,
            lastSaved: state.lastSaved,
        };
    }, [state.steps, currentStep, localInputs, projectInfo, state.projectId, state.status, state.isSubmitted, state.overallProgress, state.lastSaved]);

    // Save project to backend (PUT request)
    const saveProject = useCallback(async () => {
        const currentData = collectCurrentFormData();

        if (!currentData.projectId) {
            console.warn("Attempted to save project before projectId was assigned.");
            dispatch({ type: "SET_ERRORS", payload: { submit: "Project not initialized. Please refresh." } });
            return;
        }

        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found, redirecting to login");
            localStorage.removeItem("token");
            dispatch({ type: "SET_ERRORS", payload: { submit: "Please log in to continue." } });
            navigate("/login");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/projects/${currentData.projectId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(currentData),
            });

            const data = await res.json();

            if (res.ok) {
                dispatch({
                    type: "SET_PROJECT",
                    payload: data.project,
                });
                dispatch({ type: "SAVE_DRAFT_SUCCESS", payload: { lastSaved: data.project.lastSaved } });
                dispatch({ type: "CLEAR_ALL_ERRORS" });

                lastSyncedStateRef.current = {
                    projectId: data.project._id,
                    name: data.project.name,
                    project: data.project.project,
                    school: data.project.school,
                    members: data.project.members,
                    steps: JSON.parse(JSON.stringify(data.project.steps)),
                    status: data.project.status,
                    currentStepIndex: data.project.currentStepIndex,
                    isSubmitted: data.project.isSubmitted,
                    overallProgress: data.project.overallProgress,
                    lastSaved: data.project.lastSaved,
                };
            } else {
                const errorMessages = data.errors
                    ? Object.values(data.errors).map(err => typeof err === 'string' ? err : Object.values(err).join(', ')).join('\n')
                    : (data.message || "Failed to save project.");
                dispatch({ type: "SET_ERRORS", payload: { submit: errorMessages, details: data.errors } });
            }
        } catch (error) {
            console.error("Error saving project:", error);
            dispatch({ type: "SET_ERRORS", payload: { submit: "An unexpected error occurred while saving the project." } });
        } finally {
            setIsLoading(false);
        }
    }, [navigate, dispatch, collectCurrentFormData]);

    // Debounced dispatchers for input fields.
    const debouncedDispatchUpdateStep = useCallback(
        debounce((stepId, field, value) => {
            dispatch({ type: "UPDATE_STEP_GLOBAL", payload: { id: stepId, field, value } });
        }, 200),
        [dispatch]
    );

    const debouncedDispatchUpdateProjectInfo = useCallback(
        debounce((field, value) => {
            dispatch({ type: "UPDATE_PROJECT_INFO_GLOBAL", payload: { field, value } });
        }, 200),
        [dispatch]
    );

    // Debounced save for actual API calls (less frequent).
    const debouncedSaveProjectAPI = useCallback(
        debounce(() => {
            const currentData = collectCurrentFormData();

            if (JSON.stringify(currentData) !== JSON.stringify(lastSyncedStateRef.current)) {
                console.log("Triggering debounced save to API due to actual changes.");
                saveProject();
            } else {
                // console.log("No significant changes, debounced API save skipped.");
            }
        }, 1500),
        [collectCurrentFormData, saveProject]
    );

    // Initialize project on component mount
    const initializeProject = useCallback(async () => {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found, redirecting to login");
            localStorage.removeItem("token");
            dispatch({ type: "SET_ERRORS", payload: { submit: "Please log in to continue." } });
            navigate("/login");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/projects/me", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 404) {
                console.log("No project found for user, creating new project...");
                const createRes = await fetch("http://localhost:5000/api/projects", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ // Send initial project details for new project creation
                        name: initialState.name,
                        project: initialState.project,
                        school: initialState.school,
                        members: initialState.members,
                    }),
                });

                if (createRes.ok) {
                    const { project } = await createRes.json();
                    dispatch({
                        type: "SET_PROJECT",
                        payload: project,
                    });
                    // Initialize local UI states with data from backend response
                    setProjectInfo({
                        name: project.name,
                        project: project.project,
                        school: project.school,
                        members: project.members,
                    });
                    const firstStepData = project.steps.find(s => s.id === 1) || {}; // Always reset to step 1's data on new project
                    setLocalInputs({
                        description: firstStepData.description || "",
                        location: firstStepData.location || "",
                        affectedPopulation: firstStepData.affectedPopulation || "",
                        tags: firstStepData.tags || [],
                        urgency: firstStepData.urgency || "medium",
                        keyFindings: firstStepData.keyFindings || "",
                        researchMethods: firstStepData.researchMethods || [],
                        dataCollected: firstStepData.dataCollected || "",
                        solutionType: firstStepData.solutionType || "",
                        timeline: firstStepData.timeline || "",
                        budget: firstStepData.budget || "",
                        resources: firstStepData.resources || [],
                        feedback: firstStepData.feedback || "",
                        stakeholders: firstStepData.stakeholders || [],
                        meetingDates: firstStepData.meetingDates || [],
                        outcomes: firstStepData.outcomes || "",
                        implementationDate: firstStepData.implementationDate || "",
                        lessons: firstStepData.lessons || "",
                        nextSteps: firstStepData.nextSteps || "",
                    });
                    setCurrentStep(project.currentStepIndex || 1); // Also set current step based on loaded project
                    lastSyncedStateRef.current = { ...project, projectId: project._id }; // Initialize ref
                } else {
                    const errorData = await createRes.json();
                    console.error("Failed to create project:", errorData);
                    dispatch({ type: "SET_ERRORS", payload: { submit: errorData.message || "Failed to create project." } });
                }
            } else if (res.ok) {
                const { project } = await res.json();
                dispatch({
                    type: "SET_PROJECT",
                    payload: project,
                });
                // Initialize local UI states with data from backend response
                setProjectInfo({
                    name: project.name,
                    project: project.project,
                    school: project.school,
                    members: project.members,
                });
                // Ensure localInputs for currentStep are initialized from the loaded project's data
                const currentStepData = project.steps.find(s => s.id === project.currentStepIndex) || {}; // Use project.currentStepIndex
                setLocalInputs({
                    description: currentStepData.description || "",
                    location: currentStepData.location || "",
                    affectedPopulation: currentStepData.affectedPopulation || "",
                    tags: currentStepData.tags || [],
                    urgency: currentStepData.urgency || "medium",
                    keyFindings: currentStepData.keyFindings || "",
                    researchMethods: currentStepData.researchMethods || [],
                    dataCollected: currentStepData.dataCollected || "",
                    solutionType: currentStepData.solutionType || "",
                    timeline: currentStepData.timeline || "",
                    budget: currentStepData.budget || "",
                    resources: currentStepData.resources || [],
                    feedback: currentStepData.feedback || "",
                    stakeholders: currentStepData.stakeholders || [],
                    meetingDates: currentStepData.meetingDates || [],
                    outcomes: currentStepData.outcomes || "",
                    implementationDate: currentStepData.implementationDate || "",
                    lessons: currentStepData.lessons || "",
                    nextSteps: currentStepData.nextSteps || "",
                });
                setCurrentStep(project.currentStepIndex || 1); // Set current step based on loaded project
                lastSyncedStateRef.current = { ...project, projectId: project._id }; // Initialize ref
            } else {
                const errorData = await res.json();
                console.error("Failed to fetch project:", errorData);
                dispatch({ type: "SET_ERRORS", payload: { submit: errorData.message || "Failed to load project." } });
            }
        } catch (error) {
            console.error("Error initializing project:", error);
            dispatch({ type: "SET_ERRORS", payload: { submit: "An unexpected error occurred during project initialization. Please check your network." } });
        } finally {
            setIsLoading(false);
        }
    }, [navigate, dispatch]);

    // Initial project load on component mount
    useEffect(() => {
        initializeProject();
    }, [initializeProject]);

    // Update overall progress whenever global state.steps change
    useEffect(() => {
        dispatch({ type: "UPDATE_PROGRESS" });
    }, [state.steps, dispatch]);

    // Client-side validation for the current step (including top-level fields)
    const validateStep = useCallback(() => {
        const currentData = collectCurrentFormData(); // Get latest data from local inputs + global state
        const step = currentData.steps.find(s => s.id === currentStep);
        const currentErrors = {};

        // Validate top-level project info (always required)
        if (!currentData.name || !currentData.name.trim()) {
            currentErrors.name = "Team Name is required.";
        }
        if (!currentData.project || !currentData.project.trim()) {
            currentErrors.project = "Project Title is required.";
        }
        if (!currentData.school || !currentData.school.trim()) {
            currentErrors.school = "School Name is required.";
        }
        if (!Number.isInteger(currentData.members) || currentData.members < 1) {
            currentErrors.members = "Number of Members is required and must be at least 1.";
        }

        if (!step) {
            currentErrors.step = "Step data not found.";
        } else {
            // Description is required for ALL steps
            if (!step.description || !step.description.trim()) {
                currentErrors[`step_${currentStep}_description`] = "Description is required."; // Use step-specific error key
            }
            // Step-specific validations (ESSENTIALS ONLY for "Save & Continue" or "Mark Completed")
            if (currentStep === 1) {
                if (!step.location || !step.location.trim()) {
                    currentErrors[`step_${currentStep}_location`] = "Location is required.";
                }
                if (!step.affectedPopulation || !step.affectedPopulation.trim()) {
                    currentErrors[`step_${currentStep}_affectedPopulation`] = "Affected population is required.";
                }
            }
            if (currentStep === 2) {
                if (!step.dataCollected || !step.dataCollected.trim()) {
                    currentErrors[`step_${currentStep}_dataCollected`] = "Data collected is required.";
                }
                if (!step.keyFindings || !step.keyFindings.trim()) {
                    currentErrors[`step_${currentStep}_keyFindings`] = "Key findings are required.";
                }
            }
            if (currentStep === 3) {
                if (!step.solutionType || !step.solutionType.trim()) {
                    currentErrors.solutionType = "Solution type is required.";
                }
                if (!step.timeline || !step.timeline.trim()) {
                    currentErrors[`step_${currentStep}_timeline`] = "Timeline is required.";
                }
                if (!step.budget || !step.budget.trim()) {
                    currentErrors[`step_${currentStep}_budget`] = "Budget is required.";
                }
            }
            if (currentStep === 4) {
                if (!step.feedback || !step.feedback.trim()) {
                    currentErrors.feedback = "Stakeholder feedback is required.";
                }
            }
            if (currentStep === 5) {
                if (!step.outcomes || !step.outcomes.trim()) {
                    currentErrors.outcomes = "Outcomes are required.";
                }
                if (!step.implementationDate || !step.implementationDate.trim()) {
                    currentErrors[`step_${currentStep}_implementationDate`] = "Implementation date is required.";
                }
            }
        }

        // Clear previous step errors and set new ones for the current step
        dispatch({
            type: "SET_ERRORS", payload: {
                ...Object.fromEntries(Object.keys(state.errors).filter(key => !key.startsWith(`step_${currentStep}_`)).map(key => [key, state.errors[key]])),
                ...currentErrors,
                stepValidation: Object.keys(currentErrors).length > 0 ? "Please fill in all required fields for the current step." : ""
            }
        });
        return Object.keys(currentErrors).length === 0;
    }, [currentStep, dispatch, collectCurrentFormData, state.errors]);

    // Client-side validation for entire project before final submission
    const validateAllStepsForSubmission = useCallback(() => {
        const currentData = collectCurrentFormData();
        const allErrors = {};

        // Validate top-level project fields
        if (!currentData.name || !currentData.name.trim()) {
            allErrors.name = "Team name is required.";
        }
        if (!currentData.project || !currentData.project.trim()) {
            allErrors.project = "Project title is required.";
        }
        if (!currentData.school || !currentData.school.trim()) {
            allErrors.school = "School name is required.";
        }
        if (!Number.isInteger(currentData.members) || currentData.members < 1) {
            allErrors.members = "Number of members is required and must be at least 1.";
        }

        // Validate each step for only essential fields
        currentData.steps.forEach(step => {
            // Description is required for all steps
            if (!step.description || !step.description.trim()) {
                allErrors[`step_${step.id}_description`] = `Description for step ${step.id} is required.`;
            }
            // Step 3: solutionType required
            if (step.id === 3 && (!step.solutionType || !step.solutionType.trim())) {
                allErrors[`step3_solutionType`] = "Solution type is required.";
            }
            // Step 4: feedback required
            if (step.id === 4 && (!step.feedback || !step.feedback.trim())) {
                allErrors[`step4_feedback`] = "Stakeholder feedback is required.";
            }
            // Step 5: outcomes required
            if (step.id === 5 && (!step.outcomes || !step.outcomes.trim())) {
                allErrors[`step5_outcomes`] = "Outcomes are required.";
            }
            // Ensure all steps are marked as 'Completed' before final submission (STRICT REQUIREMENT)
            if (step.status !== "Completed") {
                allErrors[`step_${step.id}_status`] = `Step ${step.id} "${step.title}" must be marked as "Completed" to submit.`;
            }
        });

        dispatch({ type: "SET_ERRORS", payload: { ...allErrors, submit: Object.keys(allErrors).length > 0 ? "Project validation failed before submission. Please fix all listed errors." : "" } });
        return Object.keys(allErrors).length === 0;
    }, [dispatch, collectCurrentFormData]);

    // Prevents form submission on Enter key (useful for textareas)
    const preventEnterSubmit = useCallback((e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
        }
    }, []);

    // Handles changes for step-specific input fields (text, textarea, select)
    const handleInputChange = useCallback((stepId, field, value) => {
        // Update localInputs directly for immediate UI feedback
        setLocalInputs(prev => {
            const newState = { ...prev, [field]: value };
            if (["tags", "researchMethods", "resources", "stakeholders", "meetingDates"].includes(field)) {
                newState[field] = value.split(',').map(item => item.trim()).filter(item => item);
            }
            return newState;
        });
        // Debounce updating global state and saving to API
        debouncedDispatchUpdateStep(stepId, field, value);
        debouncedSaveProjectAPI();
    }, [debouncedDispatchUpdateStep, debouncedSaveProjectAPI]);

    // Handles changes for top-level project fields (Team Name, Project Title, School, Members)
    const handleProjectInfoChange = useCallback((field, value) => {
        setProjectInfo(prev => ({ ...prev, [field]: value }));
        debouncedDispatchUpdateProjectInfo(field, value);
        debouncedSaveProjectAPI();
    }, [debouncedDispatchUpdateProjectInfo, debouncedSaveProjectAPI]);

    // Update projectInfo effect to sync membersInput
    useEffect(() => {
        setMembersInput(String(state.members));
    }, [state.members]);

    const handleFileUpload = useCallback(async (stepId, field, files) => {
        const currentData = collectCurrentFormData();
        if (!currentData.projectId) {
            console.error("No projectId, cannot upload files");
            dispatch({ type: "SET_ERRORS", payload: { submit: "Invalid project ID. Please refresh or try logging in again." } });
            return;
        }
        if (!files || files.length === 0) {
            console.warn("No files selected for upload.");
            dispatch({ type: "SET_ERRORS", payload: { submit: "Please select at least one file to upload." } });
            return;
        }
        if (!Number.isInteger(stepId) || stepId < 1 || stepId > initialState.steps.length) {
            console.error("Invalid stepId for upload:", stepId);
            dispatch({ type: "SET_ERRORS", payload: { submit: "Invalid step selected for file upload." } });
            return;
        }

        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found, redirecting to login");
            localStorage.removeItem("token");
            dispatch({ type: "SET_ERRORS", payload: { submit: "Please log in to continue." } });
            navigate("/login");
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append(field, file);
        });
        formData.append("stepId", String(stepId));

        try {
            const res = await fetch(`http://localhost:5000/api/projects/${currentData.projectId}/upload`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await res.json();
            console.log("File upload response:", data);

            if (res.ok) {
                dispatch({
                    type: "SET_PROJECT",
                    payload: data.project,
                });
                dispatch({ type: "CLEAR_ALL_ERRORS" });

                lastSyncedStateRef.current = { ...data.project, projectId: data.project._id };
            } else {
                console.error("Failed to upload files:", data);
                dispatch({
                    type: "SET_ERRORS",
                    payload: { submit: data.message || "Failed to upload files.", details: data.errors },
                });
            }
        } catch (error) {
            console.error("Error uploading files:", error.message, error.stack);
            dispatch({
                type: "SET_ERRORS",
                payload: { submit: `An unexpected error occurred during file upload: ${error.message}` },
            });
        } finally {
            setIsLoading(false);
        }
    }, [collectCurrentFormData, dispatch, navigate]);

    const handleRemoveFile = useCallback(async (stepId, field, fileIndex) => {
        const currentData = collectCurrentFormData();
        if (!currentData.projectId) {
            console.error("No projectId, cannot remove files");
            dispatch({ type: "SET_ERRORS", payload: { submit: "Invalid project ID." } });
            return;
        }
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found, redirecting to login");
            localStorage.removeItem("token");
            dispatch({ type: "SET_ERRORS", payload: { submit: "Please log in to continue." } });
            navigate("/login");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/projects/${currentData.projectId}/files`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ stepId, field, fileIndex }),
            });
            const data = await res.json();
            console.log("File remove response:", data);
            if (res.ok) {
                dispatch({
                    type: "SET_PROJECT",
                    payload: data.project,
                });
                dispatch({ type: "CLEAR_ALL_ERRORS" });
                lastSyncedStateRef.current = { ...data.project, projectId: data.project._id };
            } else {
                console.error("Failed to delete file:", data);
                dispatch({ type: "SET_ERRORS", payload: { submit: data.message || "Failed to delete file." } });
            }
        } catch (error) {
            console.error("Error deleting file:", error);
            dispatch({ type: "SET_ERRORS", payload: { submit: "An unexpected error occurred during file deletion." } });
        } finally {
            setIsLoading(false);
        }
    }, [collectCurrentFormData, dispatch, navigate]);

    const handleSaveDraft = useCallback(() => {
        debouncedSaveProjectAPI();
    }, [debouncedSaveProjectAPI]);

    const handleSaveAndContinue = async () => {
        // Step 1: Validate current step
        if (!validateStep()) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            // Step 2: Mark current step as 'Completed' if validation passed
            dispatch({ type: "COMPLETE_STEP", payload: { stepId: currentStep } });

            // Flush any pending debounced updates for the current step's fields
            debouncedDispatchUpdateStep.flush();
            debouncedDispatchUpdateProjectInfo.flush();

            // Step 3: Save the project to the backend with the updated status
            await saveProject(); // saveProject will now include the 'Completed' status

            // Step 4: Navigate to the next step or handle final review
            if (currentStep < initialState.steps.length) {
                setCurrentStep(currentStep + 1);
                dispatch({ type: "SET_CURRENT_STEP_INDEX", payload: currentStep + 1 });
            } else {
                console.log("All steps saved and completed. Click 'Submit Project' to finalize.");
                dispatch({ type: "SET_ERRORS", payload: { submit: "All steps are completed. Click 'Submit Project' to finalize." } });
            }
        } catch (error) {
            console.error("Error during Save & Continue:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handler for "Mark as Completed" button
    const handleMarkStepCompleted = useCallback(async () => {
        if (!validateStep()) {
            return;
        }

        setIsLoading(true);
        try {
            debouncedDispatchUpdateStep.flush();
            debouncedDispatchUpdateProjectInfo.flush();

            dispatch({ type: "COMPLETE_STEP", payload: { stepId: currentStep } });

            await saveProject();

            console.log(`Step ${currentStep} marked as Completed and saved.`);
        } catch (error) {
            console.error(`Error marking step ${currentStep} as completed:`, error);
            dispatch({ type: "SET_ERRORS", payload: { submit: `Failed to mark step ${currentStep} as completed. Please try again.` } });
        } finally {
            setIsLoading(false);
        }
    }, [currentStep, validateStep, dispatch, debouncedDispatchUpdateStep, debouncedDispatchUpdateProjectInfo, saveProject]);

    const handleSubmitProject = async () => {
        // IMPORTANT: Flush all pending debounced updates before final submission attempt
        debouncedDispatchUpdateStep.flush();
        debouncedDispatchUpdateProjectInfo.flush();
        debouncedSaveProjectAPI.flush();

        const currentData = collectCurrentFormData();
        if (!currentData.projectId) {
            console.error("No projectId, cannot submit project.");
            dispatch({ type: "SET_ERRORS", payload: { submit: "Invalid project ID. Please refresh or log in again." } });
            setShowSubmitDialog(false);
            return;
        }

        // Run client-side comprehensive validation one last time
        const isAllValid = validateAllStepsForSubmission();
        if (!isAllValid) {
            console.error("Client-side validation failed for final submission:", state.errors);
            setShowSubmitDialog(false); // Hide dialog if validation fails
            return;
        }

        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found, redirecting to login.");
            localStorage.removeItem("token");
            dispatch({ type: "SET_ERRORS", payload: { submit: "Please log in to continue." } });
            navigate("/login");
            setIsLoading(false);
            setShowSubmitDialog(false);
            return;
        }

        try {
            console.log("Submitting project with payload (POST /submit):", currentData);

            const res = await fetch(`http://localhost:5000/api/projects/${currentData.projectId}/submit`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(currentData),
            });
            const data = await res.json();
            console.log("Submit project backend response:", data);

            if (res.ok) {
                dispatch({ type: "SUBMIT_PROJECT_SUCCESS" });
            } else {
                let backendErrorDetails = [];
                if (data.errors) {
                    backendErrorDetails = Object.entries(data.errors).map(([key, err]) => {
                        return `${key}: ${typeof err === 'string' ? err : (err.message || JSON.stringify(err))}`;
                    });
                }
                const errorMessage = data.message || "Failed to submit project.";
                console.error("Failed to submit project:", { data, backendErrors: backendErrorDetails });
                dispatch({ type: "SET_ERRORS", payload: { submit: errorMessage, details: backendErrorDetails } });
            }
        } catch (error) {
            console.error("Error submitting project:", error);
            dispatch({ type: "SET_ERRORS", payload: { submit: "An unexpected network error occurred during submission." } });
        } finally {
            setIsLoading(false);
            setShowSubmitDialog(false);
        }
    };

    const handlePreviewFile = useCallback((file) => {
        setPreviewFile(file);
        setShowPreview(true);
    }, []);

    const toggleAudioPlayback = useCallback((audioUrl) => {
        setAudioPlaying(audioPlaying === audioUrl ? null : audioUrl);
    }, [audioPlaying]);

    const formatFileSize = useCallback((bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }, []);

    // Safely get current step data from global state for display purposes (read-only)
    const currentStepData = state.steps.find(step => step.id === currentStep);

    // Custom Tailwind CSS classes for neon effects (unchanged)
    const neonText = "text-blue-400 bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]";
    const neonButton = "bg-gradient-to-r from-blue-600 to-cyan-700 text-white shadow-lg shadow-blue-500/50 hover:shadow-cyan-500/70 hover:from-blue-500 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105";
    const neonBorder = "border-2 border-blue-500/50 focus:ring-blue-500/70 focus:border-cyan-500/70";
    const neonBgLight = "bg-gray-900/50 backdrop-blur-sm shadow-lg shadow-blue-500/20";
    const neonBgDark = "bg-gray-950/70 backdrop-blur-md shadow-2xl shadow-blue-500/20";
    const neonProgress = "bg-gradient-to-r from-blue-500 to-cyan-600 shadow-md shadow-blue-500/30";
    const neonStatusCompleted = "bg-green-700 text-green-200 shadow-sm shadow-green-500/30";
    const neonStatusInProgress = "bg-yellow-700/30 text-yellow-200 shadow-sm shadow-yellow-500/20";
    const neonStatusNotStarted = "bg-gray-700/30 text-gray-200 shadow-sm shadow-gray-500/20";
    const neonCardActive = "bg-gradient-to-r from-blue-950/70 to-cyan-950/70 border-blue-500 shadow-blue-500/50 border-2";
    const neonCardInactive = "bg-gray-900/50 border border-gray-700/20 hover:border-blue-700 hover:shadow-md hover:shadow-blue-500/10";
    const neonInputError = "border-red-500 bg-red-900/20 text-red-100 focus:ring-red-500/70";
    const neonTextMuted = "text-gray-400";

    // Debug project state
    console.log("Current project state (global):", {
        projectId: state.projectId,
        name: state.name,
        project: state.project,
        school: state.school,
        members: state.members,
        isSubmitted: state.isSubmitted,
        overallProgress: state.overallProgress,
        currentStepIndex: state.currentStepIndex,
        steps: state.steps.map(step => ({
            id: step.id,
            title: step.title,
            status: step.status,
            description: step.description,
            location: step.location,
            affectedPopulation: step.affectedPopulation,
            tags: step.tags,
            urgency: step.urgency,
            keyFindings: step.keyFindings,
            researchMethods: step.researchMethods,
            dataCollected: step.dataCollected,
            solutionType: step.solutionType,
            timeline: step.timeline,
            budget: step.budget,
            resources: step.resources,
            feedback: step.feedback,
            stakeholders: step.stakeholders,
            meetingDates: step.meetingDates,
            outcomes: step.outcomes,
            implementationDate: step.implementationDate,
            lessons: step.lessons,
            nextSteps: step.nextSteps,
            photosCount: step.photos?.length || 0,
            videosCount: step.videos?.length || 0,
            reportsCount: step.reports?.length || 0,
            audioPresent: !!step.audio,
        })),
        errors: state.errors,
    });
    console.log("Local projectInfo state (UI bound):", projectInfo);
    console.log("LocalInputs state (UI bound for current step):", localInputs);


    if (isLoading && !state.projectId && !state.isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 p-6 flex items-center justify-center font-mono">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                <p className="text-white ml-4">Loading project...</p>
            </div>
        );
    }

    if (state.isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 p-6 flex items-center justify-center font-mono">
                <div className={`rounded-xl p-12 text-center max-w-2xl ${neonBgDark}`}>
                    <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/50">
                        <CheckCircle className="w-12 h-12 text-green-300" />
                    </div>
                    <h1 className={`text-3xl font-bold mb-4 ${neonText}`}>Project Submitted Successfully!</h1>
                    <p className={`mb-8 ${neonTextMuted}`}>
                        Your civic project has been submitted for review. You'll receive a confirmation email shortly.
                    </p>
                    <div className={`rounded-lg p-6 mb-6 ${neonBgLight}`}>
                        <h3 className={`font-semibold mb-2 ${neonText}`}>Project Summary</h3>
                        <div className={`text-left space-y-2 text-sm ${neonTextMuted}`}>
                            <p>
                                <strong>Team Name:</strong> {state.name}
                            </p>
                            <p>
                                <strong>Project Title:</strong> {state.project}
                            </p>
                            <p>
                                <strong>School:</strong> {state.school}
                            </p>
                            <p>
                                <strong>Members:</strong> {state.members}
                            </p>
                            <p>
                                <strong>Steps Completed:</strong> {state.steps.filter(s => s.status === "Completed").length}/5
                            </p>
                            <p>
                                <strong>Files Uploaded:</strong>{" "}
                                {state.steps.reduce((acc, s) => acc + (s.photos?.length || 0) + (s.videos?.length || 0) + (s.reports?.length || 0) + (s.audio ? 1 : 0), 0)}
                            </p>
                            <p>
                                <strong>Submission ID:</strong> CP-{state.projectId?.slice(-6) || "N/A"}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className={`px-8 py-3 rounded-lg font-medium ${neonButton}`}
                        disabled={isLoading}
                    >
                        Start New Project
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 to-blue-900 p-6 font-mono text-gray-100">
            <div className="max-w-7xl mx-auto">
                {/* Project Header and Progress Bar */}
                <div className={`mb-8 p-6 rounded-xl ${neonBgLight}`}>
                    <h2 className={`text-2xl font-bold mb-4 ${neonText}`}>Your Civic Project</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Team Name *</label>
                            <input
                                type="text"
                                value={projectInfo.name}
                                onChange={e => handleProjectInfoChange("name", e.target.value)}
                                onKeyDown={preventEnterSubmit}
                                className={`w-full p-2 rounded-lg bg-gray-800/50 ${neonBorder} ${state.errors.name ? neonInputError : ""}`}
                                placeholder="Your Team Name"
                                disabled={isLoading || state.isSubmitted}
                            />
                            {state.errors.name && <p className="text-red-400 text-xs mt-1">{state.errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Project Title *</label>
                            <input
                                type="text"
                                value={projectInfo.project}
                                onChange={e => handleProjectInfoChange("project", e.target.value)}
                                onKeyDown={preventEnterSubmit}
                                className={`w-full p-2 rounded-lg bg-gray-800/50 ${neonBorder} ${state.errors.project ? neonInputError : ""}`}
                                placeholder="e.g., Smart City Initiative"
                                disabled={isLoading || state.isSubmitted}
                            />
                            {state.errors.project && <p className="text-red-400 text-xs mt-1">{state.errors.project}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">School Name *</label>
                            <input
                                type="text"
                                value={projectInfo.school}
                                onChange={e => handleProjectInfoChange("school", e.target.value)}
                                onKeyDown={preventEnterSubmit}
                                className={`w-full p-2 rounded-lg bg-gray-800/50 ${neonBorder} ${state.errors.school ? neonInputError : ""}`}
                                placeholder="Your School Name"
                                disabled={isLoading || state.isSubmitted}
                            />
                            {state.errors.school && <p className="text-red-400 text-xs mt-1">{state.errors.school}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Number of Members *</label>
                            <input
                                type="number"
                                value={membersInput}
                                onChange={e => {
                                    const val = e.target.value;
                                    // Allow empty string for typing
                                    setMembersInput(val);
                                    // Only update global state if valid number and >= 1
                                    if (/^\d+$/.test(val) && parseInt(val, 10) >= 1) {
                                        handleProjectInfoChange("members", parseInt(val, 10));
                                    }
                                }}
                                onBlur={e => {
                                    // On blur, if invalid or empty, reset to last valid value
                                    if (!/^\d+$/.test(membersInput) || parseInt(membersInput, 10) < 1) {
                                        setMembersInput(String(state.members));
                                    }
                                }}
                                onKeyDown={preventEnterSubmit}
                                className={`w-full p-2 rounded-lg bg-gray-800/50 ${neonBorder} ${state.errors.members ? neonInputError : ""}`}
                                placeholder="e.g., 3"
                                min="1"
                                disabled={isLoading || state.isSubmitted}
                            />
                            {state.errors.members && <p className="text-red-400 text-xs mt-1">{state.errors.members}</p>}
                        </div>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden mt-4">
                        <div
                            className={`h-full rounded-full ${neonProgress}`}
                            style={{ width: `${state.overallProgress}%` }}
                        ></div>
                    </div>
                    <p className={`mt-2 text-sm ${neonTextMuted}`}>
                        {state.overallProgress}% Complete • Last Saved: {state.lastSaved ? new Date(state.lastSaved).toLocaleString() : "Not saved yet"}
                    </p>
                </div>

                {/* Step Navigation */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                    {state.steps.map((step) => (
                        <button
                            type="button"
                            key={`step-${step.id}`}
                            onClick={() => {
                                setCurrentStep(step.id);
                                dispatch({ type: "SET_CURRENT_STEP_INDEX", payload: step.id });
                                setIsLoading(false); // Ensure fields are enabled when navigating steps
                            }}
                            className={`p-4 rounded-lg text-left transition-all duration-200 ${currentStep === step.id ? neonCardActive : neonCardInactive}`}
                            disabled={state.isSubmitted}
                        >
                            <h3 className={`font-semibold ${currentStep === step.id ? neonText : "text-gray-300"}`}>
                                Step {step.id}: {step.title}
                            </h3>
                            <p
                                className={`text-xs mt-2 ${step.status === "Completed"
                                    ? neonStatusCompleted
                                    : step.status === "In Progress"
                                        ? neonStatusInProgress
                                        : neonStatusNotStarted
                                    } rounded-full px-2 py-1 inline-block`}
                            >
                                {step.status}
                            </p>
                            {Object.keys(state.errors).some(key => key.startsWith(`step_${step.id}_`) && key !== `step_${step.id}_status`) && (
                                <AlertCircle className="w-4 h-4 text-red-400 inline-block ml-2" title="Errors in this step" />
                            )}
                            {state.errors[`step_${step.id}_status`] && (
                                <AlertCircle className="w-4 h-4 text-orange-400 inline-block ml-2" title="Step not marked completed" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Main Content Form */}
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className={`p-8 rounded-xl ${neonBgDark}`}
                >
                    <h2 className={`text-3xl font-bold mb-4 ${neonText}`}>{currentStepData?.title || "Loading..."}</h2>
                    <p className={`mb-6 ${neonTextMuted}`}>{instructions[currentStep]}</p>

                    {/* Global Error Message Display (for both submit and step validation) */}
                    {(Object.keys(state.errors).length > 0) && (
                        <div className={`mb-6 p-4 rounded-lg bg-red-900/30 text-red-200`}>
                            <div className="flex items-center">
                                <AlertCircle className="w-5 h-5 mr-2" />
                                <span>
                                    {state.errors.submit || state.errors.stepValidation || "Please correct the following issues:"}
                                </span>
                            </div>
                            <ul className="list-disc ml-6 mt-2 text-sm">
                                {Array.isArray(state.errors.details) && state.errors.details.length > 0 ? (
                                    state.errors.details.map((msg, index) => (
                                        <li key={index}>{msg}</li>
                                    ))
                                ) : (
                                    Object.entries(state.errors)
                                        .filter(([key, value]) => value && key !== "submit" && key !== "stepValidation")
                                        .map(([key, value]) => (
                                            <li key={key}>{value}</li>
                                        ))
                                )}
                            </ul>
                        </div>
                    )}

                    {/* Description (Common to all steps) */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Description *</label>
                        <textarea
                            key={`description-${currentStep}`}
                            value={localInputs.description}
                            onChange={e => handleInputChange(currentStep, "description", e.target.value)}
                            onKeyDown={preventEnterSubmit}
                            className={`w-full p-3 rounded-lg bg-gray-800/50 ${neonBorder} ${state.errors[`step_${currentStep}_description`] ? neonInputError : ""}`}
                            rows={5}
                            placeholder="Describe the step in detail..."
                            disabled={isLoading || state.isSubmitted}
                        />
                        {state.errors[`step_${currentStep}_description`] && (
                            <p className="text-red-400 text-xs mt-1">{state.errors[`step_${currentStep}_description`]}</p>
                        )}
                    </div>

                    {/* Step-Specific Fields */}
                    {currentStep === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Location *</label>
                                <input
                                    type="text"
                                    value={localInputs.location}
                                    onChange={e => handleInputChange(currentStep, "location", e.target.value)}
                                    onKeyDown={preventEnterSubmit}
                                    className={`w-full p-3 rounded-lg bg-gray-800/50 ${neonBorder} ${state.errors[`step_${currentStep}_location`] ? neonInputError : ""}`}
                                    placeholder="Enter location"
                                    disabled={isLoading || state.isSubmitted}
                                />
                                {state.errors[`step_${currentStep}_location`] && (
                                    <p className="text-red-400 text-xs mt-1">{state.errors[`step_${currentStep}_location`]}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Urgency</label>
                                <select
                                    value={localInputs.urgency}
                                    onChange={e => handleInputChange(currentStep, "urgency", e.target.value)}
                                    className={`w-full p-3 rounded-lg bg-gray-800/50 ${neonBorder}`}
                                    disabled={isLoading || state.isSubmitted}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Affected Population *</label>
                                <input
                                    type="text"
                                    value={localInputs.affectedPopulation}
                                    onChange={e => handleInputChange(currentStep, "affectedPopulation", e.target.value)}
                                    onKeyDown={preventEnterSubmit}
                                    className={`w-full p-3 rounded-lg bg-gray-800/50 ${neonBorder} ${state.errors[`step_${currentStep}_affectedPopulation`] ? neonInputError : ""}`}
                                    placeholder="Describe affected population"
                                    disabled={isLoading || state.isSubmitted}
                                />
                                {state.errors[`step_${currentStep}_affectedPopulation`] && (
                                    <p className="text-red-400 text-xs mt-1">{state.errors[`step_${currentStep}_affectedPopulation`]}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                                <input
                                    type="text"
                                    value={Array.isArray(localInputs.tags) ? localInputs.tags.join(", ") : localInputs.tags}
                                    onChange={e => handleInputChange(currentStep, "tags", e.target.value)}
                                    onKeyDown={preventEnterSubmit}
                                    className={`w-full p-3 rounded-lg bg-gray-800/50 ${neonBorder}`}
                                    placeholder="e.g., environment, community, urban"
                                    disabled={isLoading || state.isSubmitted}
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Research Methods (comma-separated)</label>
                                <input
                                    type="text"
                                    value={Array.isArray(localInputs.researchMethods) ? localInputs.researchMethods.join(", ") : localInputs.researchMethods}
                                    onChange={e => handleInputChange(currentStep, "researchMethods", e.target.value)}
                                    onKeyDown={preventEnterSubmit}
                                    className={`w-full p-3 rounded-lg bg-gray-800/50 ${neonBorder}`}
                                    placeholder="e.g., surveys, interviews, data analysis"
                                    disabled={isLoading || state.isSubmitted}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Data Collected *</label>
                                <textarea
                                    value={localInputs.dataCollected}
                                    onChange={e => handleInputChange(currentStep, "dataCollected", e.target.value)}
                                    onKeyDown={preventEnterSubmit}
                                    className={`w-full p-3 rounded-lg bg-gray-800/50 ${neonBorder} ${state.errors[`step_${currentStep}_dataCollected`] ? neonInputError : ""}`}
                                    rows={3}
                                    placeholder="Describe collected data"
                                    disabled={isLoading || state.isSubmitted}
                                />
                                {state.errors[`step_${currentStep}_dataCollected`] && (
                                    <p className="text-red-400 text-xs mt-1">{state.errors[`step_${currentStep}_dataCollected`]}</p>
                                )}
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-2">Key Findings *</label>
                                <textarea
                                    value={localInputs.keyFindings}
                                    onChange={e => handleInputChange(currentStep, "keyFindings", e.target.value)}
                                    onKeyDown={preventEnterSubmit}
                                    className={`w-full p-3 rounded-lg bg-gray-800/50 ${neonBorder} ${state.errors[`step_${currentStep}_keyFindings`] ? neonInputError : ""}`}
                                    rows={5}
                                    placeholder="Summarize key findings"
                                    disabled={isLoading || state.isSubmitted}
                                />
                                {state.errors[`step_${currentStep}_keyFindings`] && (
                                    <p className="text-red-400 text-xs mt-1">{state.errors[`step_${currentStep}_keyFindings`]}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Solution Type *</label>
                                <input
                                    type="text"
                                    value={localInputs.solutionType}
                                    onChange={e => handleInputChange(currentStep, "solutionType", e.target.value)}
                                    onKeyDown={preventEnterSubmit}
                                    className={`w-full p-3 rounded-lg bg-gray-800/50 ${neonBorder} ${state.errors[`step_${currentStep}_solutionType`] ? neonInputError : ""}`}
                                    placeholder="e.g., Policy, Infrastructure, Technology"
                                    disabled={isLoading || state.isSubmitted}
                                />
                                {state.errors[`step_${currentStep}_solutionType`] && (
                                    <p className="text-red-400 text-xs mt-1">{state.errors[`step_${currentStep}_solutionType`]}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Timeline *</label>
                                <input
                                    type="text"
                                    value={localInputs.timeline}
                                    onChange={e => handleInputChange(currentStep, "timeline", e.target.value)}
                                    onKeyDown={preventEnterSubmit}
                                    className={`w-full p-3 rounded-lg bg-gray-800/50 ${neonBorder} ${state.errors[`step_${currentStep}_timeline`] ? neonInputError : ""}`}
                                    placeholder="e.g., 6 months, Jan 2025 - Jun 2025"
                                    disabled={isLoading || state.isSubmitted}
                                />
                                {state.errors[`step_${currentStep}_timeline`] && (
                                    <p className="text-red-400 text-xs mt-1">{state.errors[`step_${currentStep}_timeline`]}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Budget *</label>
                                <input
                                    type="text"
                                    value={localInputs.budget}
                                    onChange={e => handleInputChange(currentStep, "budget", e.target.value)}
                                    onKeyDown={preventEnterSubmit}
                                    className={`w-full p-3 rounded-lg bg-gray-800/50 ${neonBorder} ${state.errors[`step_${currentStep}_budget`] ? neonInputError : ""}`}
                                    placeholder="Estimated budget (e.g., $500, Rs. 10,000)"
                                    disabled={isLoading || state.isSubmitted}
                                />
                                {state.errors[`step_${currentStep}_budget`] && (
                                    <p className="text-red-400 text-xs mt-1">{state.errors[`step_${currentStep}_budget`]}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Resources (comma-separated)</label>
                                <input
                                    type="text"
                                    value={Array.isArray(localInputs.resources) ? localInputs.resources.join(", ") : localInputs.resources}
                                    onChange={e => handleInputChange(currentStep, "resources", e.target.value)}
                                    onKeyDown={preventEnterSubmit}
                                    className={`w-full p-3 rounded-lg bg-gray-800/50 ${neonBorder}`}
                                    placeholder="e.g., volunteers, software, equipment"
                                    disabled={isLoading || state.isSubmitted}
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Stakeholders (comma-separated)</label>
                                <input
                                    type="text"
                                    value={Array.isArray(localInputs.stakeholders) ? localInputs.stakeholders.join(", ") : localInputs.stakeholders}
                                    onChange={e => handleInputChange(currentStep, "stakeholders", e.target.value)}
                                    onKeyDown={preventEnterSubmit}
                                    className={`w-full p-3 rounded-lg bg-gray-800/50 ${neonBorder}`}
                                    placeholder="e.g., City Council, local businesses, residents"
                                    disabled={isLoading || state.isSubmitted}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Meeting Dates (comma-separated,YYYY-MM-DD)</label>
                                <input
                                    type="text"
                                    value={Array.isArray(localInputs.meetingDates) ? localInputs.meetingDates.join(", ") : localInputs.meetingDates}
                                    onChange={e => handleInputChange(currentStep, "meetingDates", e.target.value)}
                                    onKeyDown={preventEnterSubmit}
                                    className={`w-full p-3 rounded-lg bg-gray-800/50 ${neonBorder}`}
                                    placeholder="e.g., 2025-10-01, 2025-10-15"
                                    disabled={isLoading || state.isSubmitted}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-2">Feedback *</label>
                                <textarea
                                    value={localInputs.feedback}
                                    onChange={e => handleInputChange(currentStep, "feedback", e.target.value)}
                                    onKeyDown={preventEnterSubmit}
                                    className={`w-full p-3 rounded-lg bg-gray-800/50 ${neonBorder} ${state.errors[`step_${currentStep}_feedback`] ? neonInputError : ""}`}
                                    rows={5}
                                    placeholder="Summarize stakeholder feedback and how it informed your project"
                                    disabled={isLoading || state.isSubmitted}
                                />
                                {state.errors[`step_${currentStep}_feedback`] && (
                                    <p className="text-red-400 text-xs mt-1">{state.errors[`step_${currentStep}_feedback`]}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Implementation Date *</label>
                                <input
                                    type="text"
                                    value={localInputs.implementationDate}
                                    onChange={e => handleInputChange(currentStep, "implementationDate", e.target.value)}
                                    onKeyDown={preventEnterSubmit}
                                    className={`w-full p-3 rounded-lg bg-gray-800/50 ${neonBorder} ${state.errors[`step_${currentStep}_implementationDate`] ? neonInputError : ""}`}
                                    placeholder="e.g., 2025-06-25"
                                    disabled={isLoading || state.isSubmitted}
                                />
                                {state.errors[`step_${currentStep}_implementationDate`] && (
                                    <p className="text-red-400 text-xs mt-1">{state.errors[`step_${currentStep}_implementationDate`]}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Outcomes *</label>
                                <textarea
                                    value={localInputs.outcomes}
                                    onChange={e => handleInputChange(currentStep, "outcomes", e.target.value)}
                                    onKeyDown={preventEnterSubmit}
                                    className={`w-full p-3 rounded-lg bg-gray-800/50 ${neonBorder} ${state.errors[`step_${currentStep}_outcomes`] ? neonInputError : ""}`}
                                    rows={5}
                                    placeholder="Describe the outcomes and impact of your solution"
                                    disabled={isLoading || state.isSubmitted}
                                />
                                {state.errors[`step_${currentStep}_outcomes`] && (
                                    <p className="text-red-400 text-xs mt-1">{state.errors[`step_${currentStep}_outcomes`]}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Lessons Learned</label>
                                <textarea
                                    value={localInputs.lessons}
                                    onChange={e => handleInputChange(currentStep, "lessons", e.target.value)}
                                    onKeyDown={preventEnterSubmit}
                                    className={`w-full p-3 rounded-lg bg-gray-800/50 ${neonBorder}`}
                                    rows={3}
                                    placeholder="Summarize key lessons learned during implementation"
                                    disabled={isLoading || state.isSubmitted}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Next Steps</label>
                                <textarea
                                    value={localInputs.nextSteps}
                                    onChange={e => handleInputChange(currentStep, "nextSteps", e.target.value)}
                                    onKeyDown={preventEnterSubmit}
                                    className={`w-full p-3 rounded-lg bg-gray-800/50 ${neonBorder}`}
                                    rows={3}
                                    placeholder="Describe future plans or next steps for your project"
                                    disabled={isLoading || state.isSubmitted}
                                />
                            </div>
                        </div>
                    )}

                    {/* File Uploads Section */}
                    <div className="mb-6">
                        <h3 className={`text-lg font-semibold mb-4 ${neonText}`}>Attachments</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="flex items-center justify-center p-4 rounded-lg bg-gray-800/50 border-dashed border-2 border-gray-600 hover:border-blue-500 cursor-pointer">
                                    <Upload className="w-5 h-5 mr-2" />
                                    Photos
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/png,image/jpeg"
                                        onChange={e => handleFileUpload(currentStep, "photos", e.target.files)}
                                        className="hidden"
                                        disabled={isLoading || state.isSubmitted}
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="flex items-center justify-center p-4 rounded-lg bg-gray-800/50 border-dashed border-2 border-gray-600 hover:border-blue-500 cursor-pointer">
                                    <Upload className="w-5 h-5 mr-2" />
                                    Videos
                                    <input
                                        type="file"
                                        multiple
                                        accept="video/mp4,video/quicktime"
                                        onChange={e => handleFileUpload(currentStep, "videos", e.target.files)}
                                        className="hidden"
                                        disabled={isLoading || state.isSubmitted}
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="flex items-center justify-center p-4 rounded-lg bg-gray-800/50 border-dashed border-2 border-gray-600 hover:border-blue-500 cursor-pointer">
                                    <Upload className="w-5 h-5 mr-2" />
                                    Reports
                                    <input
                                        type="file"
                                        multiple
                                        accept="application/pdf,.doc,.docx,.ppt,.pptx"
                                        onChange={e => handleFileUpload(currentStep, "reports", e.target.files)}
                                        className="hidden"
                                        disabled={isLoading || state.isSubmitted}
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="flex items-center justify-center p-4 rounded-lg bg-gray-800/50 border-dashed border-2 border-gray-600 hover:border-blue-500 cursor-pointer">
                                    <Upload className="w-5 h-5 mr-2" />
                                    Audio
                                    <input

                                        type="file"
                                        accept="audio/mpeg,audio/wav"
                                        onChange={e => handleFileUpload(currentStep, "audio", e.target.files)}
                                        className="hidden"
                                        disabled={isLoading || state.isSubmitted}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Display Uploaded Files */}
                    {(currentStepData?.photos?.length > 0 ||
                        currentStepData?.videos?.length > 0 ||
                        currentStepData?.reports?.length > 0 ||
                        currentStepData?.audio) && (
                            <div className="mb-6">
                                <h3 className={`text-lg font-semibold mb-4 ${neonText}`}>Uploaded Files</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {currentStepData.photos?.map((file, index) => (
                                        <div key={`photo-${file.url || index}`} className={`p-3 rounded-lg ${neonBgLight}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <Image className="w-5 h-5 mr-2" />
                                                    <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button type="button" onClick={() => handlePreviewFile(file)} className="text-blue-400 hover:text-cyan-500">
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFile(currentStep, "photos", index)}
                                                        className="text-red-400 hover:text-red-500"
                                                        disabled={isLoading || state.isSubmitted}
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className={`text-xs ${neonTextMuted}`}>{formatFileSize(file.size)}</p>
                                        </div>
                                    ))}
                                    {currentStepData.videos?.map((file, index) => (
                                        <div key={`video-${file.url || index}`} className={`p-3 rounded-lg ${neonBgLight}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <Video className="w-5 h-5 mr-2" />
                                                    <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button type="button" onClick={() => handlePreviewFile(file)} className="text-blue-400 hover:text-cyan-500">
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFile(currentStep, "videos", index)}
                                                        className="text-red-400 hover:text-red-500"
                                                        disabled={isLoading || state.isSubmitted}
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className={`text-xs ${neonTextMuted}`}>{formatFileSize(file.size)}</p>
                                        </div>
                                    ))}
                                    {currentStepData.reports?.map((file, index) => (
                                        <div key={`report-${file.url || index}`} className={`p-3 rounded-lg ${neonBgLight}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <FileText className="w-5 h-5 mr-2" />
                                                    <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button type="button" onClick={() => handlePreviewFile(file)} className="text-blue-400 hover:text-cyan-500">
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFile(currentStep, "reports", index)}
                                                        className="text-red-400 hover:text-red-500"
                                                        disabled={isLoading || state.isSubmitted}
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className={`text-xs ${neonTextMuted}`}>{formatFileSize(file.size)}</p>
                                        </div>
                                    ))}
                                    {currentStepData.audio && (
                                        <div key={`audio-${currentStepData.audio.url || 'temp'}`} className={`p-3 rounded-lg ${neonBgLight}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <Mic className="w-5 h-5 mr-2" />
                                                    <span className="text-sm max-w-[150px]">{currentStepData.audio.name}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleAudioPlayback(currentStepData.audio.url)}
                                                        className="text-blue-400 hover:text-cyan-500"
                                                        disabled={state.isSubmitted}
                                                    >
                                                        {audioPlaying === currentStepData.audio.url ? (
                                                            <Pause className="w-5 h-5" />
                                                        ) : (
                                                            <Play className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                    <button type="button" onClick={() => handlePreviewFile(currentStepData.audio)} className="text-blue-400 hover:text-cyan-500">
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFile(currentStep, "audio", 0)}
                                                        className="text-red-400 hover:text-red-500"
                                                        disabled={isLoading || state.isSubmitted}
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className={`text-xs ${neonTextMuted}`}>{formatFileSize(currentStepData.audio.size)}</p>
                                            {audioPlaying === currentStepData.audio.url && (
                                                <audio
                                                    src={`http://localhost:5000${currentStepData.audio.url}`}
                                                    autoPlay
                                                    loop={false}
                                                    onEnded={() => setAudioPlaying(null)}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 mt-6">
                        {/* The "Mark Step Completed" button, only shown if current step is NOT completed and project is NOT submitted */}
                        {currentStepData && currentStepData.status !== "Completed" && !state.isSubmitted && (
                            <button
                                type="button"
                                onClick={handleMarkStepCompleted}
                                className={`px-6 py-2 rounded-lg font-medium flex items-center bg-purple-600 text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 hover:bg-purple-500 transition-all duration-300 transform hover:scale-105`}
                                disabled={isLoading}
                            >
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Mark Step {currentStep} Completed
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleSaveDraft}
                            className={`px-6 py-2 rounded-lg font-medium flex items-center ${neonButton}`}
                            disabled={isLoading || state.isSubmitted || !state.projectId}
                        >
                            <Save className="w-5 h-5 mr-2" />
                            Save Draft
                        </button>
                        {/* The "Save & Continue" or "Review & Submit" button */}
                        {currentStep < initialState.steps.length ? (
                            <button
                                type="button"
                                onClick={handleSaveAndContinue}
                                className={`px-6 py-2 rounded-lg font-medium flex items-center ${neonButton}`}
                                disabled={isLoading || state.isSubmitted || !state.projectId}
                            >
                                <Send className="w-5 h-5 mr-2" />
                                Save & Continue
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowSubmitDialog(true)}
                                className={`px-6 py-2 rounded-lg font-medium flex items-center ${neonButton}`}
                                disabled={isLoading || state.isSubmitted || !state.projectId}
                            >
                                <Send className="w-5 h-5 mr-2" />
                                Review & Submit
                            </button>
                        )}
                    </div>
                </form>

                {/* File Preview Modal */}
                {
                    showPreview && previewFile && (
                        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                            <div className={`p-6 rounded-xl max-w-3xl w-full ${neonBgDark}`}>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className={`text-lg font-semibold ${neonText}`}>{previewFile.name}</h3>
                                    <button type="button" onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-red-500">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                {previewFile.type?.startsWith("image/") && (
                                    <img
                                        src={`http://localhost:5000${previewFile.url}`}
                                        alt={previewFile.name}
                                        className="w-full h-auto rounded-lg max-h-[60vh] object-contain"
                                    />
                                )}
                                {previewFile.type?.startsWith("video/") && (
                                    <video
                                        src={`http://localhost:5000${previewFile.url}`}
                                        controls
                                        className="w-full"
                                    />
                                )}
                                {previewFile.type?.startsWith("audio/") && (
                                    <audio
                                        src={`http://localhost:5000${previewFile.url}`}
                                        controls
                                        className="w-full"
                                    />
                                )}
                                {["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(
                                    previewFile.type
                                ) && (
                                        <iframe
                                            src={`http://localhost:5000${previewFile.url}`}
                                            className="w-full h-[60vh] rounded-lg"
                                            title={previewFile.name}
                                        />
                                    )}
                                <div className="mt-4 flex justify-end gap-2">
                                    <a
                                        href={`http://localhost:5000${previewFile.url}`}
                                        download={previewFile.name}
                                        className={`px-4 py-2 rounded-lg font-medium flex items-center ${neonButton}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Download className="w-5 h-5 mr-2" />
                                        Download
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => setShowPreview(false)}
                                        className={`px-4 py-2 rounded-lg font-medium ${neonButton}`}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Submit Confirmation Dialog */}
                {
                    showSubmitDialog && (
                        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                            <div className={`p-6 rounded-xl max-w-md w-full ${neonBgDark}`}>
                                <h3 className={`text-lg font-semibold mb-4 ${neonText}`}>Submit Project</h3>
                                <p className={`mb-6 ${neonTextMuted}`}>
                                    Are you sure you want to submit your project? Once submitted, you cannot make further changes.
                                </p>
                                {state.errors.submit && (
                                    <div className="mb-4 p-4 rounded-lg bg-red-900/30 text-red-200">
                                        <div className="flex items-center">
                                            <AlertCircle className="w-5 h-5 mr-2" />
                                            <span>Error submitting project:</span>
                                        </div>
                                        {Array.isArray(state.errors.details) && state.errors.details.length > 0 ? (
                                            <ul className="list-disc ml-6 mt-2">
                                                {state.errors.details.map((msg, index) => (
                                                    <li key={index}>{msg}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="mt-2">{state.errors.submit}</p>
                                        )}
                                    </div>
                                )}
                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowSubmitDialog(false)}
                                        className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600"
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmitProject}
                                        className={`px-4 py-2 rounded-lg font-medium flex items-center ${neonButton}`}
                                        disabled={isLoading}
                                    >
                                        <Send className="w-5 h-5 mr-2" />
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div >
        </div >
    );
};

export default React.memo(Dashboard);