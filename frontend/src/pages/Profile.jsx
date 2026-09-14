import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

const API_URL = import.meta.env.VITE_API_URL;

function Profile() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/");
                return;
            }

            const response = await fetch(
                `${API_URL}/api/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/");
                return;
            }

            if (response.ok) {
                setProfile(data);
            } else {
                setError(
                    data.message || "Unable to load profile."
                );
            }

        } catch (error) {
            console.log("Profile fetch error:", error);

            setError(
                "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <p>Loading profile...</p>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>

            <button
                className="back-btn"
                onClick={() => navigate("/dashboard")}
            >
                ← Back to Dashboard
            </button>

            <h1 className="dashboard-title">
                Profile
            </h1>

            {error ? (
                <div className="dashboard-card">
                    <h3>Unable to load profile</h3>
                    <p>{error}</p>

                    <button onClick={fetchProfile}>
                        Try Again
                    </button>
                </div>
            ) : (
                <div className="dashboard-card">
                    <h2>
                        {profile?.name || "User"}
                    </h2>

                    <p>
                        <strong>Email:</strong>{" "}
                        {profile?.email || "Not available"}
                    </p>
                </div>
            )}

        </DashboardLayout>
    );
}

export default Profile;