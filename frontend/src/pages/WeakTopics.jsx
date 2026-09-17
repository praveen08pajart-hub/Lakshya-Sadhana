import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { handleUnauthorized } from "../utils/auth";
import { getResponseData } from "../utils/api";

const API_URL = import.meta.env.VITE_API_URL;

function WeakTopics() {
    const navigate = useNavigate();

    const [weakTopics, setWeakTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchWeakTopics = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/");
                return;
            }

            const response = await fetch(
                `${API_URL}/api/weak-topics`,
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
                setWeakTopics(data);
            } else {
                setError(
                    data.message || "Unable to load weak topics."
                );
            }

        } catch (error) {
            console.log(
                "Weak topics fetch error:",
                error
            );

            setError(
                "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeakTopics();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <p>Loading weak topics...</p>
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
                Weak Topics
            </h1>

            {error ? (
                <div className="dashboard-card">
                    <h3>Unable to load weak topics</h3>
                    <p>{error}</p>

                    <button onClick={fetchWeakTopics}>
                        Try Again
                    </button>
                </div>
            ) : weakTopics.length === 0 ? (
                <div className="dashboard-card">
                    <h3>No weak topics 🎉</h3>

                    <p>
                        Your latest quiz results are above
                        the weak-topic threshold.
                    </p>

                    <button
                        className="practice-again-btn"
                        onClick={() => navigate("/dashboard")}
                    >
                        Continue Learning
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            ) : (
                <div className="weak-topic-list">

                    {weakTopics.map((attempt) => (
                        <div
                            className="weak-topic-card"
                            key={attempt._id}
                        >

                            <div className="weak-topic-left">

                                <div className="weak-topic-icon">
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                </div>

                                <div>
                                    <h3>
                                        {attempt.topic?.name ||
                                            "Unknown Topic"}
                                    </h3>

                                    <p className="weak-topic-message">
                                        This topic needs more revision
                                        and practice.
                                    </p>

                                    <p className="weak-topic-tip">
                                        Try reviewing the topic again
                                        before your next quiz.
                                    </p>
                                    <p className="attempt-date">
                                        <i className="fa-regular fa-calendar"></i>{" "}
                                        {attempt.createdAt
                                            ? new Date(attempt.createdAt).toLocaleString()
                                            : "Date unavailable"}
                                    </p>
                                </div>

                            </div>

                            <div className="weak-topic-actions">

                                <div className="weak-topic-score">
                                    <span>
                                        {attempt.score}%
                                    </span>

                                    <small>
                                        Needs Revision
                                    </small>
                                </div>

                                <button
                                    className="practice-again-btn"
                                    disabled={!attempt.topic?._id}
                                    onClick={() =>
                                        navigate(
                                            `/quiz/${attempt.topic._id}`
                                        )
                                    }
                                >
                                    Practice Again

                                    <i className="fa-solid fa-arrow-right"></i>
                                </button>

                                <button
                                    className="view-history-btn"
                                    onClick={() => navigate("/quiz-history")}
                                >
                                    View Quiz History
                                </button>
                            </div>

                        </div>
                    ))}

                </div>
            )}

        </DashboardLayout>
    );
}

export default WeakTopics;