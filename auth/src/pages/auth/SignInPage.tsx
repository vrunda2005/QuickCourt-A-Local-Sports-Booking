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



