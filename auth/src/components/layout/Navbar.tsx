import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useRole } from "../../context/RoleContext";

const Navbar = () => {
    const { role, loading } = useRole();
    return (
        <nav style={{ padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ccc" }}>
            <Link to="/" style={{ fontSize: "1.5rem", textDecoration: "none" }}>MyApp</Link>

            <div style={{ display: "flex", gap: "1rem", alignItems: 'center' }}>
                <Link to="/venues">Venues</Link>
                <Link to="/my-bookings">My Bookings</Link>
                <Link to="/profile">Profile</Link>

                {!loading && role === 'Admin' && <Link to="/admin/dashboard">Admin</Link>}
                {!loading && role === 'FacilityOwner' && <Link to="/owner/dashboard">Owner</Link>}

                {!loading && role && <span style={{ opacity: 0.7 }}>Role: {role}</span>}

                <SignedIn>
                    <UserButton afterSignOutUrl="/sign-in" />
                </SignedIn>
                <SignedOut>
                    <Link to="/sign-in">Sign In</Link>
                </SignedOut>
            </div>
        </nav>
    );
};

export default Navbar;



