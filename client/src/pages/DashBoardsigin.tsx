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

    if (!isSignedIn) return <p>Please sign in to continue.</p>;

    return (
        <div>
            <h2>Welcome, user {userId}</h2>
            <button onClick={fetchData}>Fetch Protected Data</button>
        </div>
    );
};

export default DashBoard;