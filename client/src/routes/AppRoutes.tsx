/*
import { Routes, Route } from 'react-router-dom';
import { SignedIn } from '@clerk/clerk-react';
import Navbar from '../components/Navbar';
import Home from '../pages/Home';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import Dashboard from '../pages/DashBoardsigin';
import AddItem from '../pages/AddItem';

const AppRoutes = () => {
    return (
        <>
            <Navbar />
            <main style={{ padding: '1rem' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/sign-in/*" element={<SignInPage />} />
                    <Route path="/sign-up/*" element={<SignUpPage />} />
                    <Route path="/dashboard" element={<SignedIn><Dashboard /></SignedIn>} />
                    <Route path="/add-item" element={<SignedIn><AddItem /></SignedIn>} />
                </Routes>
            </main>
        </>
    );
};

export default AppRoutes;
*/
import { Routes, Route } from 'react-router-dom';
import { SignedIn } from '@clerk/clerk-react';
import Navbar from '../components/Navbar';
import Home from '../pages/Home';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import Dashboard from '../pages/DashBoardsigin';
import AddItem from '../pages/AddItem';

// ===== Admin Pages =====
import AdminDashboard from '../pages/admin/AdminDashboard';
import FacilityApproval from '../pages/admin/FacilityApproval';
import UserManagement from '../pages/admin/UserManagement';
import Reports from '../pages/admin/Reports';
import AdminProfile from '../pages/admin/AdminProfile';

const AppRoutes = () => {
    return (
        <>
            <Navbar />
            <main style={{ padding: '1rem' }}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/sign-in/*" element={<SignInPage />} />
                    <Route path="/sign-up/*" element={<SignUpPage />} />

                    {/* User Routes */}
                    <Route path="/dashboard" element={<SignedIn><Dashboard /></SignedIn>} />
                    <Route path="/add-item" element={<SignedIn><AddItem /></SignedIn>} />

                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={<SignedIn><AdminDashboard /></SignedIn>} />
                    <Route path="/admin/facility-approval" element={<FacilityApproval />} />
                    <Route path="/admin/users" element={<SignedIn><UserManagement /></SignedIn>} />
                    <Route path="/admin/reports" element={<SignedIn><Reports /></SignedIn>} />
                    <Route path="/admin/profile" element={<SignedIn><AdminProfile /></SignedIn>} />
                </Routes>
            </main>
        </>
    );
};

export default AppRoutes;

