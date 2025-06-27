import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, XCircle, ArrowLeft } from "lucide-react";

function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("rememberLogin");

        // Redirect to login
        navigate("/login", {
            replace: true,
            state: { message: "You have been logged out successfully." },
        });
    };

    const handleCancel = () => {
        // Redirect to previous page or home
        navigate(-1);
    };

    return (
        <div className="flex justify-center items-center py-8 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 min-h-screen">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                        <LogOut className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Confirm Logout
                    </h2>
                    <p className="text-gray-600 mt-2">Are you sure you want to log out?</p>
                </div>

                <div className="space-y-4">
                    {/* Confirm Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className="flex items-center justify-center">
                            <LogOut className="w-5 h-5 mr-2" />
                            Log Out
                        </div>
                    </button>

                    {/* Cancel Button */}
                    <button
                        onClick={handleCancel}
                        className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className="flex items-center justify-center">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Cancel
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Logout;