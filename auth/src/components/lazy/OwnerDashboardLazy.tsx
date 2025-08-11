import React, { Suspense } from 'react';
import LoadingSpinner from '../LoadingSpinner';

const OwnerDashboard = React.lazy(() => import('../../pages/owner/dashboard/OwnerDashboard'));

const OwnerDashboardLazy: React.FC = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading Owner Dashboard..." />
            </div>
        }>
            <OwnerDashboard />
        </Suspense>
    );
};

export default OwnerDashboardLazy;
