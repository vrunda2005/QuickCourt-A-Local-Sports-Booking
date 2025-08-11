import React, { Suspense } from 'react';
import LoadingSpinner from '../LoadingSpinner';

const AdminDashboard = React.lazy(() => import('../../pages/admin/AdminDashboard'));

const AdminDashboardLazy: React.FC = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading Admin Dashboard..." />
            </div>
        }>
            <AdminDashboard />
        </Suspense>
    );
};

export default AdminDashboardLazy;
