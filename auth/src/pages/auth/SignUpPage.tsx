import { SignUp } from "@clerk/clerk-react";
import { useState } from "react";

export const SignUpPage = () => {
    const [role, setRole] = useState("User");

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100vh",
            justifyContent: "center"
        }}>
            <h2>Sign Up</h2>

            <label style={{ marginBottom: "10px" }}>
                Select Role:
                <select
                    value={role}
                    onChange={(e) => {
                        setRole(e.target.value);
                        sessionStorage.setItem("selectedRole", e.target.value);
                    }}
                >
                    <option value="User">User</option>
                    <option value="FacilityOwner">Facility Owner</option>
                </select>
            </label>

            <SignUp
                path="/sign-up"
                routing="path"
                signInUrl="/sign-in"
                afterSignUpUrl="/post-signup"
            />
        </div>
    );
};


