import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

const API_URL = import.meta.env.VITE_API_URL;

function Progress() {
    const navigate = useNavigate();

    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProgress = async () => {
        try {
            setLoading(true);
            setError("");

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

            if (response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/");
                return;
            }

            if (response.ok) {
                setAttempts(data);
            } else {
                setError(
                    data.message || "Unable to load progress."
                );
            }

        } catch (error) {
            console.log("Progress fetch error:", error);

            setError(
                "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProgress();
    }, []);

    const averageScore =
        attempts.length > 0
            ? Math.round(
                attempts.reduce(
                    (sum, attempt) =>
                        sum + attempt.score,
                    0
                ) / attempts.length
            )
            : 0;

    if (loading) {
        return (
            <DashboardLayout>
                <p>Loading progress...</p>
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
                Progress
            </h1>

            {error ? (
                <div className="dashboard-card">
                    <h3>Unable to load progress</h3>
                    <p>{error}</p>

                    <button onClick={fetchProgress}>
                        Try Again
                    </button>
                </div>
            ) : (
                <>
                    <div className="progress-summary">

                        <div>
                            <p>Total Attempts</p>
                            <h2>{attempts.length}</h2>
                        </div>

                        <div>
                            <p>Average Score</p>
                            <h2>{averageScore}%</h2>
                        </div>

                    </div>

                    {attempts.length === 0 ? (
                        <div className="dashboard-card">
                            <h3>No attempts yet</h3>

                            <p>
                                Complete a quiz to start
                                tracking your progress.
                            </p>
                        </div>
                    ) : (
                        <div className="progress-list">

                            {attempts.map((attempt) => (
                                <div
                                    className="progress-card"
                                    key={attempt._id}
                                >
                                    <div className="progress-card-left">

                                        <div className="progress-topic-icon">
                                            <i className="fa-solid fa-book-open"></i>
                                        </div>

                                        <div>
                                            <h3>
                                                {attempt.topic?.name ||
                                                    "Unknown Topic"}
                                            </h3>

                                            <p>
                                                Correct Answers:{" "}
                                                {attempt.correctAnswers} /{" "}
                                                {attempt.totalQuestions}
                                            </p>

                                            <p className="attempt-date">
                                                <i className="fa-regular fa-calendar"></i>{" "}

                                                {attempt.createdAt
                                                    ? new Date(
                                                        attempt.createdAt
                                                    ).toLocaleString()
                                                    : "Date unavailable"}
                                            </p>
                                        </div>

                                    </div>

                                    <div className="progress-score">

                                        <span>
                                            {attempt.score}%
                                        </span>

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
                    )}
                </>
            )}

        </DashboardLayout>
    );
}

export default Progress;