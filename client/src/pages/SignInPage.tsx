/*
import { SignIn } from "@clerk/clerk-react";
import React from 'react';

const SignInPage: React.FC = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
        </div>
    );
}

export default SignInPage;
*/
import { SignIn, useUser } from "@clerk/clerk-react";
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignInPage: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const email = user.primaryEmailAddress?.emailAddress || "";
            if (email === "admin@admin.com") {
                navigate("/admin/profile");
            }
        }
    }, [user, navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
        </div>
    );
}

export default SignInPage;
