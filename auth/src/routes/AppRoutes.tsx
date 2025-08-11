import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { Suspense, lazy } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';
import { AdminRoute, OwnerRoute, UserRoute, AuthRoute } from '../components/ProtectedRoute';
import { useRole } from '../context/RoleContext';
import { useEffect } from 'react';

// Lazy load components
const Home = lazy(() => import('../pages/user/Home'));
const SignInPage = lazy(() => import('../pages/auth/SignInPage'));
const SignUpPage = lazy(() => import('../pages/auth/SignUpPage').then(module => ({ default: module.SignUpPage })));
const PostSignUpPage = lazy(() => import('../pages/auth/PostSignUpPage').then(module => ({ default: module.PostSignUpPage })));
const AdminUnlock = lazy(() => import('../pages/AdminUnlock'));
const Dashboard = lazy(() => import('../pages/DashBoard'));
const AddItem = lazy(() => import('../pages/AddItem'));
const Venues = lazy(() => import('../pages/user/Venues'));
const VenueDetails = lazy(() => import('../pages/user/VenueDetails'));
const BookCourtPage = lazy(() => import('../pages/BookCourtPage'));
const PaymentPage = lazy(() => import('../pages/PaymentPage'));
const MyBookings = lazy(() => import('../pages/user/MyBookings'));
const Profile = lazy(() => import('../pages/profile/Profile'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const OwnerDashboard = lazy(() => import('../pages/owner/dashboard/OwnerDashboard'));

// Lazy loading fallback
const LazyFallback = ({ text }: { text: string }) => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text={text} />
    </div>
);

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
        <ErrorBoundary>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={
                    <Suspense fallback={<LazyFallback text="Loading Home..." />}>
                        <Home />
                    </Suspense>
                } />
                <Route path="/sign-in/*" element={
                    <Suspense fallback={<LazyFallback text="Loading Sign In..." />}>
                        <SignInPage />
                    </Suspense>
                } />
                <Route path="/sign-up/*" element={
                    <Suspense fallback={<LazyFallback text="Loading Sign Up..." />}>
                        <SignUpPage />
                    </Suspense>
                } />

                {/* Post Signup Route - Protected but allows all roles */}
                <Route path="/post-signup" element={
                    <SignedIn>
                        <Suspense fallback={<LazyFallback text="Setting up your account..." />}>
                            <PostSignUpPage />
                        </Suspense>
                    </SignedIn>
                } />

                {/* Admin Unlock Route - Special case */}
                <Route path="/admin-unlock" element={
                    <SignedIn>
                        <Suspense fallback={<LazyFallback text="Loading Admin Unlock..." />}>
                            <AdminUnlock />
                        </Suspense>
                    </SignedIn>
                } />

                {/* Admin Routes - RESTRICTED TO ADMIN ONLY */}
                <Route path="/admin/dashboard" element={
                    <AdminRoute>
                        <Suspense fallback={<LazyFallback text="Loading Admin Dashboard..." />}>
                            <AdminDashboard />
                        </Suspense>
                    </AdminRoute>
                } />
                <Route path="/admin/facilities" element={
                    <AdminRoute>
                        <Suspense fallback={<LazyFallback text="Loading Facility Management..." />}>
                            <AdminDashboard />
                        </Suspense>
                    </AdminRoute>
                } />
                <Route path="/admin/users" element={
                    <AdminRoute>
                        <Suspense fallback={<LazyFallback text="Loading User Management..." />}>
                            <AdminDashboard />
                        </Suspense>
                    </AdminRoute>
                } />
                <Route path="/admin/reports" element={
                    <AdminRoute>
                        <Suspense fallback={<LazyFallback text="Loading Reports..." />}>
                            <AdminDashboard />
                        </Suspense>
                    </AdminRoute>
                } />

                {/* Owner Routes - RESTRICTED TO FACILITY OWNER ONLY */}
                <Route path="/owner/dashboard/*" element={
                    <OwnerRoute>
                        <Suspense fallback={<LazyFallback text="Loading Owner Dashboard..." />}>
                            <OwnerDashboard />
                        </Suspense>
                    </OwnerRoute>
                } />

                {/* User Routes - RESTRICTED TO REGULAR USERS ONLY */}
                <Route path="/dashboard" element={
                    <UserRoute>
                        <Suspense fallback={<LazyFallback text="Loading User Dashboard..." />}>
                            <Dashboard />
                        </Suspense>
                    </UserRoute>
                } />
                <Route path="/add-item" element={
                    <UserRoute>
                        <Suspense fallback={<LazyFallback text="Loading Add Item..." />}>
                            <AddItem />
                        </Suspense>
                    </UserRoute>
                } />

                {/* Mixed Routes - Allow both Users and Facility Owners */}
                <Route path="/venues" element={
                    <Suspense fallback={<LazyFallback text="Loading Venues..." />}>
                        <Venues />
                    </Suspense>
                } />
                <Route path="/venues/:id" element={
                    <Suspense fallback={<LazyFallback text="Loading Venue Details..." />}>
                        <VenueDetails />
                    </Suspense>
                } />
                <Route path="/venues/:id/book" element={
                    <AuthRoute>
                        <Suspense fallback={<LazyFallback text="Loading Booking..." />}>
                            <BookCourtPage />
                        </Suspense>
                    </AuthRoute>
                } />
                <Route path="/payment" element={
                    <AuthRoute>
                        <Suspense fallback={<LazyFallback text="Loading Payment..." />}>
                            <PaymentPage />
                        </Suspense>
                    </AuthRoute>
                } />
                <Route path="/my-bookings" element={
                    <AuthRoute>
                        <Suspense fallback={<LazyFallback text="Loading Your Bookings..." />}>
                            <MyBookings />
                        </Suspense>
                    </AuthRoute>
                } />
                <Route path="/profile" element={
                    <AuthRoute>
                        <Suspense fallback={<LazyFallback text="Loading Profile..." />}>
                            <Profile />
                        </Suspense>
                    </AuthRoute>
                } />

                {/* Catch-all route for 404 */}
                <Route path="*" element={
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-6xl mb-4">404</div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Page Not Found</h2>
                            <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
                            <button
                                onClick={() => navigate('/')}
                                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                } />
            </Routes>
        </ErrorBoundary>
    );
};

export default AppRoutes;