import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { handleUnauthorized } from "../utils/auth";
import { getResponseData } from "../utils/api";

const API_URL = import.meta.env.VITE_API_URL;

function QuizHistory() {
    const navigate = useNavigate();

    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getStatus = (score) => {
        if (score >= 80) {
            return "Strong Understanding";
        } else if (score >= 60) {
            return "Needs More Practice";
        } else {
            return "Needs Revision";
        }
    };

    const fetchHistory = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/");
                return;
            }

            const response = await fetch(
                `${API_URL}/api/progress`,
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
                setAttempts(data);
            } else {
                setError(
                    data.message || "Unable to load quiz history."
                );
            }

        } catch (error) {
            console.log("Quiz history error:", error);

            setError(
                "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <p>Loading quiz history...</p>
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
                Quiz History
            </h1>

            {error ? (
                <div className="dashboard-card">
                    <h3>Unable to load quiz history</h3>
                    <p>{error}</p>

                    <button onClick={fetchHistory}>
                        Try Again
                    </button>
                </div>
            ) : attempts.length === 0 ? (
                <div className="dashboard-card">
                    <h3>No quiz history yet</h3>

                    <p>
                        Complete a quiz to see your attempts here.
                    </p>
                </div>
            ) : (
                <div className="history-list">

                    {attempts.map((attempt) => (
                        <div
                            className="history-card"
                            key={attempt._id}
                        >
                            <div className="history-info">
                                <h3>
                                    {attempt.topic?.name ||
                                        "Unknown Topic"}
                                </h3>

                                <p>
                                    Correct Answers:{" "}
                                    {attempt.correctAnswers} /{" "}
                                    {attempt.totalQuestions}
                                </p>

                                <p>
                                    {attempt.createdAt
                                        ? new Date(
                                            attempt.createdAt
                                        ).toLocaleDateString()
                                        : "Date unavailable"}
                                </p>
                            </div>

                            <div className="history-result">
                                <span className="history-score">
                                    {attempt.score}%
                                </span>

                                <small>
                                    {getStatus(attempt.score)}
                                </small>
                            </div>
                        </div>
                    ))}

                </div>
            )}

        </DashboardLayout>
    );
}

export default QuizHistory;
