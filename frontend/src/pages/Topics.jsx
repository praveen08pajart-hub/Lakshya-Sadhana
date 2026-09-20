import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { handleUnauthorized } from "../utils/auth";
import { getResponseData } from "../utils/api";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

const API_URL = import.meta.env.VITE_API_URL;

function Topics() {
    const navigate = useNavigate();
    const { subjectId } = useParams();

    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTopics = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/subjects/${subjectId}/topics`,
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
                setTopics(data);
            } else {
                setError(
                    data.message || "Unable to load topics."
                );
            }

        } catch (error) {
            console.log("Topic fetch error:", error);

            setError(
                "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, [subjectId]);

    if (loading) {
        return (
            <DashboardLayout>
                <LoadingState
                    title="Loading topics"
                    message="Getting the topics for this subject..."
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
                Topics
            </h1>

            {error ? (
                <ErrorState
                    title="Unable to load topics"
                    message={error}
                    onRetry={fetchTopics}
                />
            ) : topics.length === 0 ? (
                <div className="dashboard-card">
                    <h3>No topics available</h3>

                    <p>
                        Topics have not been added for this subject yet.
                    </p>
                </div>
            ) : (
                <div className="dashboard-grid">

                    {topics.map((topic) => (
                        <div
                            className="dashboard-card"
                            key={topic._id}
                            onClick={() =>
                                navigate(`/quiz/${topic._id}`)
                            }
                        >
                            <h3>{topic.name}</h3>
                            <p>Start quiz</p>
                        </div>
                    ))}

                </div>
            )}

        </DashboardLayout>
    );
}

export default Topics;