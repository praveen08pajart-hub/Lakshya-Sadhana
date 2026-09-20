import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { handleUnauthorized } from "../utils/auth";
import { getResponseData } from "../utils/api";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { getLearningStatus } from "../utils/learningStatus";

const API_URL = import.meta.env.VITE_API_URL;

function QuizHistory() {
    const navigate = useNavigate();

    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


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
                `${API_URL}/api/quiz-history`,
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

    const averageScore =
        attempts.length > 0
            ? Math.round(
                attempts.reduce(
                    (sum, attempt) => sum + attempt.score,
                    0
                ) / attempts.length
            )
            : 0;

    if (loading) {
        return (
            <DashboardLayout>
                <LoadingState
                    title="Loading quiz history"
                    message="Getting your previous quiz attempts..."
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
                Quiz History
            </h1>

            {error ? (
                <ErrorState
                    title="Unable to load quiz history"
                    message={error}
                    onRetry={fetchHistory}
                />
            ) : attempts.length === 0 ? (
                <div className="dashboard-card">
                    <h3>No quiz history yet</h3>

                    <p>
                        Complete a quiz to see your attempts here.
                    </p>
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
                                            ).toLocaleString()
                                            : "Date unavailable"}
                                    </p>
                                </div>

                                <div className="history-result">
                                    <span className="history-score">
                                        {attempt.score}%
                                    </span>

                                    <small>
                                        {getLearningStatus(attempt.score)}
                                    </small>
                                    <button
                                        className="practice-again-btn"
                                        disabled={!attempt.topic?._id}
                                        onClick={() =>
                                            navigate(`/quiz/${attempt.topic._id}`)
                                        }
                                    >
                                        Practice Again
                                        <i className="fa-solid fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        ))}

                    </div>
                </>
            )}

        </DashboardLayout>
    );
}

export default QuizHistory;
