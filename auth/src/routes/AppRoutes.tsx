import { Routes, Route } from 'react-router-dom';
import { SignedIn } from '@clerk/clerk-react';
import Navbar from '../components/Navbar';
import Home from '../pages/Home';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import Dashboard from '../pages/DashBoard';
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
