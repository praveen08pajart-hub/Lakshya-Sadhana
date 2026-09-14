import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

const API_URL = import.meta.env.VITE_API_URL;

function QuizHistory() {
    const navigate = useNavigate();

    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    const getStatus = (score) => {
        if (score >= 80) {
            return "Strong Understanding";
        } else if (score >= 60) {
            return "Needs More Practice";
        } else {
            return "Needs Revision";
        }
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
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

                const data = await response.json();

                if (response.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/");
                    return;
                }

                if (response.ok) {
                    setAttempts(data);
                } else {
                    alert(data.message);
                }

            } catch (error) {
                console.log("Quiz history error:", error);
                alert("Unable to load quiz history.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [navigate]);

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

            {attempts.length === 0 ? (
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
                                    {attempt.topic?.name || "Unknown Topic"}
                                </h3>

                                <p>
                                    Correct Answers:{" "}
                                    {attempt.correctAnswers} /{" "}
                                    {attempt.totalQuestions}
                                </p>

                                <p>
                                    {new Date(
                                        attempt.createdAt
                                    ).toLocaleDateString()}
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