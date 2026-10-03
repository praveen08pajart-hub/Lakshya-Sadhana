import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { handleUnauthorized } from "../utils/auth";
import { getResponseData } from "../utils/api";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

const API_URL = import.meta.env.VITE_API_URL;

function Subjects() {
    const navigate = useNavigate();

    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/subjects`,
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
                setSubjects(data);
            } else {
                setError(
                    data.message || "Unable to load subjects."
                );
            }

        } catch (error) {
            console.log("Subject fetch error:", error);

            setError(
                "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <LoadingState
                    title="Loading subjects"
                    message="Getting your available subjects..."
                />
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
                Subjects
            </h1>

            <p>
                Select a subject to view its topics.
            </p>

            {error ? (
                <ErrorState
                    title="Unable to load subjects"
                    message={error}
                    onRetry={fetchSubjects}
                />
            ) : subjects.length === 0 ? (
                <div className="dashboard-card">
                    <h3>No subjects available</h3>

                    <p>
                        Subjects have not been added yet.
                    </p>
                </div>
            ) : (
                <div className="dashboard-grid">

                    {subjects.map((subject) => (
                        <div
                            className="dashboard-card"
                            key={subject._id}
                            onClick={() =>
                                navigate(`/subjects/${subject._id}/topics`)
                            }
                        >
                            <h3>{subject.name}</h3>

                            <p>
                                {subject.category}
                            </p>

                            <p>
                                View Topics →
                            </p>
                        </div>
                    ))}

                </div>
            )}

        </DashboardLayout>
    );
}

export default Subjects;