import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { handleUnauthorized } from "../utils/auth";
import { getResponseData } from "../utils/api";

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
            const data = await getResponseData(response);

            if (handleUnauthorized(response, navigate)) {
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
    const userInitial =
        profile?.name
            ? profile.name.charAt(0).toUpperCase()
            : "U";
    if (loading) {
        return (
            <DashboardLayout>
                <div className="dashboard-loading">

                    <div className="loading-spinner"></div>

                    <h3>Loading your profile</h3>

                    <p>
                        Getting your account information...
                    </p>

                </div>
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
                <div className="dashboard-error">

                    <div className="dashboard-error-icon">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                    </div>

                    <h3>Unable to load profile</h3>

                    <p>{error}</p>

                    <button
                        className="dashboard-retry-btn"
                        onClick={fetchProfile}
                    >
                        <i className="fa-solid fa-rotate-right"></i>
                        Try Again
                    </button>

                </div>
            ) : (
                <div className="dashboard-card profile-card">

                    <div className="profile-avatar">
                        {userInitial}
                    </div>

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