const API_URL = import.meta.env.VITE_API_URL;
import DashboardLayout from "../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Progress() {
    const navigate = useNavigate();
    const [attempts, setAttempts] = useState([]);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${API_URL}/api/progress`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    setAttempts(data);
                } else {
                    alert(data.message);
                }

            } catch (error) {
                console.log("Progress fetch error:", error);
            }
        };

        fetchProgress();
    }, []);

    return (
        <DashboardLayout>
            <button
                className="back-btn"
                onClick={() => navigate("/dashboard")}
            >
                ← Back to Dashboard
            </button>

            <h1 className="dashboard-title">Progress</h1>

            <div className="progress-summary">
                <div>
                    <p>Total Attempts</p>
                    <h2>{attempts.length}</h2>
                </div>

                <div>
                    <p>Average Score</p>
                    <h2>
                        {attempts.length > 0
                            ? Math.round(
                                attempts.reduce(
                                    (sum, attempt) => sum + attempt.score,
                                    0
                                ) / attempts.length
                            )
                            : 0}%
                    </h2>
                </div>
            </div>

            <div className="progress-list">
                {attempts.map((attempt) => (
                    <div className="progress-card" key={attempt._id}>
                        <div className="progress-card-left">
                            <div className="progress-topic-icon">
                                <i className="fa-solid fa-book-open"></i>
                            </div>

                            <div>
                                <h3>{attempt.topic?.name}</h3>

                                <p>
                                    Correct Answers: {attempt.correctAnswers} / {attempt.totalQuestions}
                                </p>

                                <p className="attempt-date">
                                    <i className="fa-regular fa-calendar"></i>

                                    {attempt.createdAt
                                        ? new Date(attempt.createdAt).toLocaleString()
                                        : "Date unavailable"}
                                </p>
                            </div>
                        </div>

                        <div className="progress-score">
                            <span>{attempt.score}%</span>

                            <span
                                className={`score-badge ${attempt.score >= 80
                                    ? "strong"
                                    : attempt.score >= 60
                                        ? "practice"
                                        : "revise"
                                    }`}
                            >
                                {attempt.score >= 80
                                    ? "Strong"
                                    : attempt.score >= 60
                                        ? "Practice"
                                        : "Revise"}
                            </span>

                        </div>
                    </div>
                ))}
            </div>

        </DashboardLayout>
    );
}

export default Progress;