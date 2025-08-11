import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav style={{ padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ccc" }}>
            <Link to="/" style={{ fontSize: "1.5rem", textDecoration: "none" }}>MyApp</Link>

            <div style={{ display: "flex", gap: "1rem" }}>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/add-item">Add Item</Link>

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
