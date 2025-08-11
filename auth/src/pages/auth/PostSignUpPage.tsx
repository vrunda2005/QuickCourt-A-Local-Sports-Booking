import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const PostSignUpPage = () => {
    const { isSignedIn, user } = useUser();
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const saveRoleAndRedirect = async () => {
            if (isSignedIn && user) {
                try {
                    setLoading(true);
                    const role = sessionStorage.getItem("selectedRole") || "User";
                    
                    // Save user role to backend
                    const token = await getToken();
                    await axios.post(
                        "http://localhost:5000/api/users",
                        {
                            clerkUserId: user.id,
                            email: user.primaryEmailAddress?.emailAddress,
                            role,
                        },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    // Clear the selected role from session storage
                    sessionStorage.removeItem("selectedRole");

                    // Redirect based on role
                    setTimeout(() => {
                        if (role === 'Admin') {
                            navigate('/admin/dashboard');
                        } else if (role === 'FacilityOwner') {
                            navigate('/owner/dashboard');
                        } else {
                            navigate('/venues');
                        }
                    }, 2000); // 2 second delay to show success message

                } catch (err) {
                    console.error("Error saving role:", err);
                    setError("Failed to save your role. Please contact support.");
                } finally {
                    setLoading(false);
                }
            }
        };

        saveRoleAndRedirect();
    }, [isSignedIn, user, getToken, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Setting up your account...</h2>
                    <p className="text-gray-600">Please wait while we configure your dashboard.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <div className="text-red-500 text-6xl mb-4">❌</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Setup Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/venues')}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Continue to App
                    </button>
                </div>
            </div>
        );
    }

    const role = sessionStorage.getItem("selectedRole") || "User";
    const getRedirectMessage = () => {
        switch (role) {
            case 'Admin':
                return 'Redirecting to Admin Dashboard...';
            case 'FacilityOwner':
                return 'Redirecting to Facility Owner Dashboard...';
            default:
                return 'Redirecting to Venues...';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                <div className="text-green-500 text-6xl mb-4">✅</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to QuickCourt!</h2>
                <p className="text-gray-600 mb-4">Your account has been successfully created.</p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-blue-800 font-medium">Role: {role}</p>
                    <p className="text-blue-600 text-sm">
                        {role === 'Admin' && 'You can manage all facilities and users.'}
                        {role === 'FacilityOwner' && 'You can create and manage your sports facilities.'}
                        {role === 'User' && 'You can browse and book sports venues.'}
                    </p>
                </div>

                <div className="animate-pulse">
                    <p className="text-gray-500">{getRedirectMessage()}</p>
                </div>
            </div>
        </div>
    );
};


