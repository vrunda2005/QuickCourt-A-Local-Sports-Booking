import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

const DashBoard = () => {
    const { isSignedIn, userId, getToken } = useAuth();

    const fetchData = async () => {
        const token = await getToken();
        const res = await axios.get("/api/protected", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(res.data);
    };

    const fetchToken = async () => {
        const token = await getToken(); // gets JWT from Clerk
        console.log("JWT Token:", token);
        alert(token); // You can copy it from here
        console.log(token);

    };
    if (!isSignedIn) return <p>Please sign in to continue.</p>;

    return (
        <div>
            <h2>Welcome, user {userId}</h2>
            <button onClick={fetchData}>Fetch Protected Data</button>
            <h1>Welcome!</h1>
            <button onClick={fetchToken}>Get JWT Token </button>
        </div>
    );
};

export default DashBoard;