import React, { useState, useReducer, memo } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, Upload, X, Plus, User, Users, School, Mail, Phone, Award } from "lucide-react";

const initialState = {
    student: {
        name: "",
        class: "",
        school: "",
        email: "",
        phone: "",
        schoolCode: "",
        dateOfBirth: "",
        address: "",
        guardianName: "",
        guardianPhone: "",
        previousExperience: ""
    },
    team: {
        teamName: "",
        members: [{ id: Date.now(), name: "", email: "", role: "Member" }],
        mentor: "",
        mentorEmail: "",
        projectTitle: "",
        category: "",
        description: ""
    },
    errors: {
        student: {},
        team: {},
        members: []
    }
};

const reducer = (state, action) => {
    switch (action.type) {
        case "UPDATE_STUDENT":
            return {
                ...state,
                student: { ...state.student, [action.payload.name]: action.payload.value },
                errors: { ...state.errors, student: { ...state.errors.student, [action.payload.name]: "" } }
            };
        case "UPDATE_TEAM":
            return {
                ...state,
                team: { ...state.team, [action.payload.name]: action.payload.value },
                errors: { ...state.errors, team: { ...state.errors.team, [action.payload.name]: "" } }
            };
        case "UPDATE_MEMBER":
            const newMembers = [...state.team.members];
            newMembers[action.payload.index] = {
                ...newMembers[action.payload.index],
                [action.payload.field]: action.payload.value
            };
            const newMemberErrors = [...state.errors.members];
            newMemberErrors[action.payload.index] = {
                ...newMemberErrors[action.payload.index],
                [action.payload.field]: ""
            };
            return {
                ...state,
                team: { ...state.team, members: newMembers },
                errors: { ...state.errors, members: newMemberErrors }
            };
        case "ADD_MEMBER":
            return {
                ...state,
                team: {
                    ...state.team,
                    members: [...state.team.members, { id: Date.now(), name: "", email: "", role: "Member" }]
                },
                errors: {
                    ...state.errors,
                    members: [...state.errors.members, { name: "", email: "" }]
                }
            };
        case "REMOVE_MEMBER":
            return {
                ...state,
                team: {
                    ...state.team,
                    members: state.team.members.filter((_, i) => i !== action.payload.index)
                },
                errors: {
                    ...state.errors,
                    members: state.errors.members.filter((_, i) => i !== action.payload.index)
                }
            };
        case "SET_ERRORS":
            return {
                ...state,
                errors: action.payload
            };
        default:
            return state;
    }
};

const InputField = memo(({ icon: Icon, error, ...props }) => (
    <div className="relative">
        <div className="relative">
            {Icon && (
                <Icon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                    aria-hidden="true"
                />
            )}
            <input
                {...props}
                className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'}`}
            />
        </div>
        {error && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
            </div>
        )}
    </div>
));

const RegisterPage = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const navigate = useNavigate();

    const { student, team, errors } = state;

    const categoryOptions = ["Technology", "Science", "Innovation", "Social Impact", "Environment", "Healthcare"];

    const validateStep = (step) => {
        const newErrors = {
            student: {},
            team: {},
            members: team.members.map(() => ({})) // create separate object for each member
        };

        if (step === 1) {
            if (!student.name.trim()) newErrors.student.name = "Name is required";
            if (!student.class.trim()) newErrors.student.class = "Class is required";
            if (!student.school.trim()) newErrors.student.school = "School is required";
            if (!student.email.trim()) newErrors.student.email = "Email is required";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) newErrors.student.email = "Email is invalid";

            if (!student.phone.trim()) newErrors.student.phone = "Phone is required";
            else if (!/^\d{10}$/.test(student.phone.replace(/\D/g, '')))
                newErrors.student.phone = "Phone must be 10 digits";
        }

        if (step === 2) {
            if (!team.teamName.trim()) newErrors.team.teamName = "Team name is required";
            if (!team.projectTitle.trim()) newErrors.team.projectTitle = "Project title is required";
            if (!team.category) newErrors.team.category = "Category is required";

            team.members.forEach((member, index) => {
                if (!member.name.trim()) newErrors.members[index].name = "Member name is required";
                if (member.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
                    newErrors.members[index].email = "Member email is invalid";
                }
            });

            if (team.mentorEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(team.mentorEmail)) {
                newErrors.team.mentorEmail = "Mentor email is invalid";
            }
        }

        dispatch({ type: "SET_ERRORS", payload: newErrors });

        // Check that all error objects are empty
        const noStudentErrors = Object.keys(newErrors.student).length === 0;
        const noTeamErrors = Object.keys(newErrors.team).length === 0;
        const noMemberErrors = newErrors.members.every(member => Object.keys(member).length === 0);

        return noStudentErrors && noTeamErrors && noMemberErrors;
    };

    const handleStudentChange = (e) => {
        const { name, value } = e.target;
        dispatch({ type: "UPDATE_STUDENT", payload: { name, value } });
    };

    const handleTeamChange = (e) => {
        const { name, value } = e.target;
        dispatch({ type: "UPDATE_TEAM", payload: { name, value } });
    };

    const handleMemberChange = (index, field, value) => {
        dispatch({ type: "UPDATE_MEMBER", payload: { index, field, value } });
    };

    const addMemberField = () => {
        dispatch({ type: "ADD_MEMBER" });
    };

    const removeMemberField = (index) => {
        if (team.members.length > 1) {
            dispatch({ type: "REMOVE_MEMBER", payload: { index } });
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setProfileImage(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep(currentStep)) {
            console.log("Validation failed:", errors);
            return;
        }

        setIsSubmitting(true);

        try {
            console.log("Submitting registration...");
            console.log("Student:", student);
            console.log("Team:", team);
            console.log("Profile Image:", profileImage);

            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log("Navigating to dashboard...");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error during submission:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const ProgressBar = () => (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / 3) * 100}%` }}
            />
        </div>
    );

    const StepIndicator = () => (
        <div className="flex justify-center mb-8">
            {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                    <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all
                        ${currentStep >= step
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }
                    `}>
                        {step}
                    </div>
                    {step < 3 && (
                        <div className={`
                            w-16 h-1 mx-2 transition-all
                            ${currentStep > step ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-200'}
                        `} />
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Student Registration
                    </h1>
                    <p className="text-gray-600">Join the innovation competition</p>
                </div>

                <ProgressBar />
                <StepIndicator />

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit}>
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Personal Information</h2>
                                    <p className="text-gray-600">Tell us about yourself</p>
                                </div>

                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100">
                                            {profileImage ? (
                                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <User className="h-10 w-10 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                                            <Upload className="h-4 w-4" />
                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                        </label>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Full Name"
                                            value={student.name}
                                            onChange={handleStudentChange}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.student.name ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'}`}
                                            required
                                        />
                                        {errors.student.name && (
                                            <div className="flex items-center mt-1 text-red-600 text-sm">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                {errors.student.name}
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type="text"
                                            name="class"
                                            placeholder="Class (e.g., 8th, 9th)"
                                            value={student.class}
                                            onChange={handleStudentChange}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.student.class ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'}`}
                                            required
                                        />
                                        {errors.student.class && (
                                            <div className="flex items-center mt-1 text-red-600 text-sm">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                {errors.student.class}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="relative">
                                    <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        name="school"
                                        placeholder="School Name"
                                        value={student.school}
                                        onChange={handleStudentChange}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.student.school ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'}`}
                                        required
                                    />
                                    {errors.student.school && (
                                        <div className="flex items-center mt-1 text-red-600 text-sm">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.student.school}
                                        </div>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <InputField
                                        icon={Mail}
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={student.email}
                                        onChange={handleStudentChange}
                                        error={errors.student.email}
                                        required
                                    />

                                    <InputField
                                        icon={Phone}
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number"
                                        value={student.phone}
                                        onChange={handleStudentChange}
                                        error={errors.student.phone}
                                        required
                                    />
                                </div>

                                <InputField
                                    icon={School}
                                    type="text"
                                    name="schoolCode"
                                    placeholder="School Code (Optional)"
                                    value={student.schoolCode}
                                    onChange={handleStudentChange}
                                />
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Team & Project Details</h2>
                                    <p className="text-gray-600">Create your team and describe your project</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <InputField
                                        icon={Users}
                                        type="text"
                                        name="teamName"
                                        placeholder="Team Name"
                                        value={team.teamName}
                                        onChange={handleTeamChange}
                                        error={errors.team.teamName}
                                        required
                                    />

                                    <InputField
                                        icon={Award}
                                        type="text"
                                        name="projectTitle"
                                        placeholder="Project Title"
                                        value={team.projectTitle}
                                        onChange={handleTeamChange}
                                        error={errors.team.projectTitle}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Category</label>
                                    <select
                                        name="category"
                                        value={team.category}
                                        onChange={handleTeamChange}
                                        className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.team.category ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'}`}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categoryOptions.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    {errors.team.category && (
                                        <div className="flex items-center mt-1 text-red-600 text-sm">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.team.category}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                                    <textarea
                                        name="description"
                                        placeholder="Describe your project idea..."
                                        value={team.description}
                                        onChange={handleTeamChange}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Team Members</label>
                                    <div className="space-y-3">
                                        {team.members.map((member, index) => (
                                            <div key={`member-${member.id}`} className="flex gap-3 items-center">
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        placeholder={`Member ${index + 1} Name`}
                                                        value={member.name}
                                                        onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.members[index]?.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                                        required
                                                    />
                                                    {errors.members[index]?.name && (
                                                        <div className="flex items-center mt-1 text-red-600 text-sm">
                                                            <AlertCircle className="h-4 w-4 mr-1" />
                                                            {errors.members[index].name}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <input
                                                        type="email"
                                                        placeholder="Email"
                                                        value={member.email}
                                                        onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.members[index]?.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                                    />
                                                    {errors.members[index]?.email && (
                                                        <div className="flex items-center mt-1 text-red-600 text-sm">
                                                            <AlertCircle className="h-4 w-4 mr-1" />
                                                            {errors.members[index].email}
                                                        </div>
                                                    )}
                                                </div>
                                                <select
                                                    value={member.role}
                                                    onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="Member">Member</option>
                                                    <option value="Leader">Leader</option>
                                                    <option value="Developer">Developer</option>
                                                    <option value="Designer">Designer</option>
                                                </select>
                                                {team.members.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMemberField(index)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addMemberField}
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Team Member
                                        </button>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <InputField
                                        icon={User}
                                        type="text"
                                        name="mentor"
                                        placeholder="Mentor Name (Optional)"
                                        value={team.mentor}
                                        onChange={handleTeamChange}
                                    />

                                    <InputField
                                        icon={Mail}
                                        type="email"
                                        name="mentorEmail"
                                        placeholder="Mentor Email (Optional)"
                                        value={team.mentorEmail}
                                        onChange={handleTeamChange}
                                        error={errors.team.mentorEmail}
                                    />
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Review Your Information</h2>
                                    <p className="text-gray-600">Please review your details before submitting</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                                            <User className="h-5 w-5 mr-2" />
                                            Student Information
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="font-medium">Name:</span> {student.name}</p>
                                            <p><span className="font-medium">Class:</span> {student.class}</p>
                                            <p><span className="font-medium">School:</span> {student.school}</p>
                                            <p><span className="font-medium">Email:</span> {student.email}</p>
                                            <p><span className="font-medium">Phone:</span> {student.phone}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                                            <Users className="h-5 w-5 mr-2" />
                                            Team Information
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="font-medium">Team:</span> {team.teamName}</p>
                                            <p><span className="font-medium">Project:</span> {team.projectTitle}</p>
                                            <p><span className="font-medium">Category:</span> {team.category}</p>
                                            <p><span className="font-medium">Members:</span> {team.members.filter(m => m.name).length}</p>
                                            {team.mentor && (
                                                <p><span className="font-medium">Mentor:</span> {team.mentor}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 rounded-lg p-4">
                                    <label className="flex items-start space-x-3">
                                        <input type="checkbox" required className="mt-1" />
                                        <span className="text-sm text-gray-700">
                                            I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and
                                            <a href="#" className="text-blue-600 hover:underline"> Privacy Policy</a>.
                                            I confirm that all information provided is accurate.
                                        </span>
                                    </label>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between mt-8 pt-6 border-t">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Previous
                                </button>
                            )}

                            <div className="ml-auto">
                                {currentStep < 3 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 font-medium"
                                    >
                                        Next Step
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all transform hover:scale-105 font-medium disabled:opacity-50 disabled:transform-none"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Submitting...
                                            </div>
                                        ) : (
                                            'Submit Registration'
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        Already registered?{" "}
                        <a href="/login" className="text-blue-600 font-medium hover:underline">
                            Login here
                        </a>
                    </p>
                </div>
            </div>
        </div>

    );
};

export default RegisterPage;