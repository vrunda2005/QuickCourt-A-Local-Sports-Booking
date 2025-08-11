import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { useRole } from '../context/RoleContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('User' | 'FacilityOwner' | 'Admin')[];
    redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles = [],
    redirectTo = '/'
}) => {
    const { role, loading } = useRole();
    const location = useLocation();

    // Show loading while determining role
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // If no role restrictions, allow access
    if (allowedRoles.length === 0) {
        return <>{children}</>;
    }

    // Check if user has required role
    const hasAccess = role && allowedRoles.includes(role);

    if (!hasAccess) {
        // Redirect to appropriate dashboard based on user's role
        let redirectPath = redirectTo;

        if (role === 'Admin') {
            redirectPath = '/admin/dashboard';
        } else if (role === 'FacilityOwner') {
            redirectPath = '/owner/dashboard';
        } else if (role === 'User') {
            redirectPath = '/venues';
        }

        return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

// Wrapper components for different role types
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <SignedIn>
        <ProtectedRoute allowedRoles={['Admin']} redirectTo="/admin/dashboard">
            {children}
        </ProtectedRoute>
    </SignedIn>
);

export const OwnerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <SignedIn>
        <ProtectedRoute allowedRoles={['FacilityOwner']} redirectTo="/owner/dashboard">
            {children}
        </ProtectedRoute>
    </SignedIn>
);

export const UserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <SignedIn>
        <ProtectedRoute allowedRoles={['User']} redirectTo="/venues">
            {children}
        </ProtectedRoute>
    </SignedIn>
);

export const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <SignedIn>
        <ProtectedRoute allowedRoles={['User', 'FacilityOwner', 'Admin']}>
            {children}
        </ProtectedRoute>
    </SignedIn>
);

export default ProtectedRoute;
