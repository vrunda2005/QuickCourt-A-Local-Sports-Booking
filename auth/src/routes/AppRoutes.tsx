import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { SignedIn } from '@clerk/clerk-react';
import Home from '../pages/user/Home';
import SignInPage from '../pages/auth/SignInPage';
import { SignUpPage } from '../pages/auth/SignUpPage';
import { PostSignUpPage } from '../pages/auth/PostSignUpPage';
import AdminUnlock from '../pages/AdminUnlock';
import Dashboard from '../pages/DashBoard';
import AddItem from '../pages/AddItem';
import Venues from '../pages/user/Venues';
import VenueDetails from '../pages/user/VenueDetails';
import BookCourtPage from '../pages/BookCourtPage';
import PaymentPage from '../pages/PaymentPage';
import MyBookings from '../pages/user/MyBookings';
import Profile from '../pages/profile/Profile';
import { useRole } from '../context/RoleContext';
import { useEffect } from 'react';
import AdminDashboard from '../pages/admin/AdminDashboard';
import OwnerDashboard from '../pages/owner/dashboard/OwnerDashboard';

const AppRoutes = () => {
    const { role, loading } = useRole();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading && location.pathname === "/") {
            // Only redirect if user is authenticated and has a role
            if (role && role !== null) {
                if (role === 'Admin') {
                    navigate('/admin/dashboard');
                } else if (role === 'FacilityOwner') {
                    navigate('/owner/dashboard');
                } else if (role === 'User') {
                    navigate('/venues');
                }
            }
        }
    }, [role, loading, navigate, location.pathname]);

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            <Route path="/post-signup" element={<SignedIn><PostSignUpPage /></SignedIn>} />
            <Route path="/admin-unlock" element={<SignedIn><AdminUnlock /></SignedIn>} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<SignedIn><AdminDashboard /></SignedIn>} />
            <Route path="/admin/facilities" element={<SignedIn><AdminDashboard /></SignedIn>} />
            <Route path="/admin/users" element={<SignedIn><AdminDashboard /></SignedIn>} />
            <Route path="/admin/reports" element={<SignedIn><AdminDashboard /></SignedIn>} />

            {/* Owner Routes */}
            <Route path="/owner/dashboard/*" element={<SignedIn><OwnerDashboard /></SignedIn>} />

            {/* User Routes */}
            <Route path="/dashboard" element={<SignedIn><Dashboard /></SignedIn>} />
            <Route path="/add-item" element={<SignedIn><AddItem /></SignedIn>} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/venues/:id" element={<VenueDetails />} />
            <Route path="/venues/:id/book" element={<BookCourtPage />} />
            <Route path="/payment" element={<SignedIn><PaymentPage /></SignedIn>} />
            <Route path="/my-bookings" element={<SignedIn><MyBookings /></SignedIn>} />
            <Route path="/profile" element={<SignedIn><Profile /></SignedIn>} />
        </Routes>
    );
};

export default AppRoutes;