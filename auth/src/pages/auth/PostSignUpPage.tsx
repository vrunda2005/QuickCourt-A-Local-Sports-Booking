import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import axios from "axios";

export const PostSignUpPage = () => {
    const { isSignedIn, user } = useUser();
    const { getToken } = useAuth();

    useEffect(() => {
        const saveRole = async () => {
            if (isSignedIn && user) {
                const role = sessionStorage.getItem("selectedRole") || "User";
                try {
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
                } catch (err) {
                    console.error("Error saving role:", err);
                }
            }
        };
        saveRole();
    }, [isSignedIn, user]);

    return <h2>Welcome! Your role has been saved.</h2>;
};


