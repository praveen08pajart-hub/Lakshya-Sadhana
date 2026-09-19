import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { handleUnauthorized } from "../utils/auth";
import { getResponseData } from "../utils/api";

const API_URL = import.meta.env.VITE_API_URL;

function Progress() {
    const navigate = useNavigate();

    const [attempts, setAttempts] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProgress = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/");
                return;
            }

            // Fetch latest attempt for each topic
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

            if (!response.ok) {
                setError(
                    data.message || "Unable to load progress."
                );
                return;
            }

            setAttempts(data);

            // Fetch all quiz attempts for performance trend
            const historyResponse = await fetch(
                `${API_URL}/api/quiz-history`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const historyData =
                await getResponseData(historyResponse);

            if (
                handleUnauthorized(
                    historyResponse,
                    navigate
                )
            ) {
                return;
            }

            if (!historyResponse.ok) {
                setError(
                    historyData.message ||
                    "Unable to load performance history."
                );
                return;
            }

            setHistory(historyData);

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

    // Current average based on latest attempt per topic
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

    // Recent quiz history for performance graph
    const chartHistory = [...history]
        .reverse()
        .slice(-8);

    // Prepared data for upcoming line graph
    const chartPoints = chartHistory.map(
        (attempt, index) => ({
            attemptNumber: index + 1,
            score: attempt.score,
            topic:
                attempt.topic?.name ||
                "Unknown Topic",
            date: attempt.createdAt
                ? new Date(
                    attempt.createdAt
                ).toLocaleString()
                : "Date unavailable"
        })
    );

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
                onClick={() =>
                    navigate("/dashboard")
                }
            >
                ← Back to Dashboard
            </button>

            <h1 className="dashboard-title">
                Progress
            </h1>

            {error ? (
                <div className="dashboard-card">

                    <h3>
                        Unable to load progress
                    </h3>

                    <p>{error}</p>

                    <button
                        onClick={fetchProgress}
                    >
                        Try Again
                    </button>

                </div>
            ) : (
                <>

                    {/* Summary Cards */}

                    <div className="progress-summary">

                        <div>
                            <p>
                                Topics Attempted
                            </p>

                            <h2>
                                {attempts.length}
                            </h2>
                        </div>

                        <div>
                            <p>
                                Current Average Score
                            </p>

                            <h2>
                                {averageScore}%
                            </h2>
                        </div>

                    </div>


                    {/* Performance Trend will go here */}

                    {chartPoints.length > 0 && (
                        <div className="performance-chart-card">

                            <div className="performance-chart-header">

                                <div>
                                    <h2>
                                        Performance Trend
                                    </h2>

                                    <p>
                                        Your recent quiz performance
                                    </p>
                                </div>

                                <i className="fa-solid fa-chart-line"></i>

                            </div>

                            <div className="trend-chart">

                                <div className="trend-y-axis">
                                    <span>100%</span>
                                    <span>80%</span>
                                    <span>60%</span>
                                    <span>40%</span>
                                    <span>20%</span>
                                    <span>0%</span>
                                </div>

                                <div className="trend-graph">

                                    <div className="trend-grid">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>

                                    <svg
                                        className="trend-line-svg"
                                        viewBox="0 0 700 200"
                                        preserveAspectRatio="none"
                                    >
                                        {chartPoints.length > 1 && (
                                            <polyline
                                                className="trend-line"
                                                points={chartPoints
                                                    .map((point, index) => {
                                                        const x =
                                                            chartPoints.length === 1
                                                                ? 350
                                                                : (index /
                                                                    (chartPoints.length - 1)) *
                                                                700;

                                                        const y =
                                                            200 -
                                                            (point.score / 100) * 200;

                                                        return `${x},${y}`;
                                                    })
                                                    .join(" ")}
                                            />
                                        )}
                                    </svg>

                                    <div className="trend-points">

                                        {chartPoints.map((point, index) => {

                                            const left =
                                                chartPoints.length === 1
                                                    ? 50
                                                    : (index /
                                                        (chartPoints.length - 1)) *
                                                    100;

                                            return (
                                                <div
                                                    className="trend-point-wrapper"
                                                    key={`${point.attemptNumber}-${index}`}
                                                    style={{
                                                        left: `${left}%`,
                                                        bottom: `${point.score}%`
                                                    }}
                                                >
                                                    <div className="trend-tooltip">
                                                        <strong>
                                                            {point.topic}
                                                        </strong>

                                                        <span>
                                                            Score: {point.score}%
                                                        </span>

                                                        <span>
                                                            {point.date}
                                                        </span>
                                                    </div>

                                                    <span className="trend-score">
                                                        {point.score}%
                                                    </span>

                                                    <div className="trend-point"></div>

                                                    <span className="trend-attempt">
                                                        A{point.attemptNumber}
                                                    </span>
                                                </div>
                                            );
                                        })}

                                    </div>

                                </div>

                            </div>

                            <p className="trend-x-label">
                                Quiz Attempts
                            </p>

                        </div>
                    )}


                    {/* Latest Topic Progress */}

                    {attempts.length > 0 && (
                        <div className="progress-section-header">
                            <div>
                                <h2>Latest Topic Progress</h2>
                                <p>
                                    Your most recent performance in each topic
                                </p>
                            </div>

                            <i className="fa-solid fa-chart-simple"></i>
                        </div>
                    )}

                    {attempts.length === 0 ? (
                        <div className="dashboard-card">

                            <h3>
                                No attempts yet
                            </h3>

                            <p>
                                Complete a quiz to start
                                tracking your progress.
                            </p>

                        </div>
                    ) : (
                        <div className="progress-list">

                            {attempts.map(
                                (attempt) => (
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
                                                    {attempt.correctAnswers}
                                                    {" / "}
                                                    {attempt.totalQuestions}
                                                </p>

                                                <p className="attempt-date">

                                                    <i className="fa-regular fa-calendar"></i>
                                                    {" "}

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
                                )
                            )}

                        </div>
                    )}

                </>
            )}

        </DashboardLayout>
    );
}

export default Progress;