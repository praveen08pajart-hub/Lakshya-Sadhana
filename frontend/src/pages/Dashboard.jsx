import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { handleUnauthorized } from "../utils/auth";
import { getResponseData } from "../utils/api";

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
    const navigate = useNavigate();

    const [subjects, setSubjects] = useState([]);
    const [attempts, setAttempts] = useState([]);
    const [weakTopics, setWeakTopics] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchSubjects = async () => {
        const response = await fetch(
            `${API_URL}/api/subjects`
        );

        const data = await getResponseData(response);

        if (handleUnauthorized(response, navigate)) {
            return;
        }

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to load subjects."
            );
        }

        setSubjects(data);
    };

    const fetchProgress = async () => {
        const token = localStorage.getItem("token");

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

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to load progress."
            );
        }

        setAttempts(data);
    };

    const fetchWeakTopics = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `${API_URL}/api/weak-topics`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to load weak topics."
            );
        }

        setWeakTopics(data);
    };

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            await Promise.all([
                fetchSubjects(),
                fetchProgress(),
                fetchWeakTopics()
            ]);

        } catch (error) {
            console.log(
                "Dashboard fetch error:",
                error
            );

            setError(
                error.message ||
                "Unable to load dashboard data."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
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
                <p>Loading dashboard...</p>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="dashboard-card">
                    <h3>Unable to load dashboard</h3>

                    <p>{error}</p>

                    <button onClick={fetchDashboardData}>
                        Try Again
                    </button>
                </div>
            </DashboardLayout>
        );
    }
    return (
        <DashboardLayout>
            <h1 className="dashboard-title">
                Dashboard
            </h1>

            <div className="welcome-card">
                <div className="welcome-content">
                    <p className="welcome-small">
                        KEEP LEARNING
                    </p>

                    <h2>
                        Build your skills, one quiz at a time.
                    </h2>

                    <p>
                        Continue practicing your subjects and
                        improve your weak topics.
                    </p>

                    <button
                        onClick={() => navigate("/progress")}
                    >
                        View My Progress
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>

                <div className="welcome-icon">
                    <i className="fa-solid fa-graduation-cap"></i>
                </div>
            </div>

            <div className="stats-grid">

                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fa-solid fa-clipboard-question"></i>
                    </div>

                    <div>
                        <p>Quizzes Attempted</p>
                        <h2>{attempts.length}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fa-solid fa-chart-line"></i>
                    </div>

                    <div>
                        <p>Average Score</p>
                        <h2>{averageScore}%</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                    </div>

                    <div>
                        <p>Weak Topics</p>
                        <h2>{weakTopics.length}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fa-solid fa-book-open"></i>
                    </div>

                    <div>
                        <p>Subjects</p>
                        <h2>{subjects.length}</h2>
                    </div>
                </div>

            </div>

            <div className="dashboard-section">
                <div className="section-header">
                    <div>
                        <h2>My Subjects</h2>
                        <p>
                            Select a subject to continue learning
                        </p>
                    </div>
                </div>

                <div className="subject-grid">

                    {subjects.length === 0 ? (
                        <div className="dashboard-card">
                            <p>
                                No subjects available.
                            </p>
                        </div>
                    ) : (
                        subjects.map((subject) => (
                            <div
                                className="subject-card"
                                key={subject._id}
                                onClick={() =>
                                    navigate(
                                        `/subjects/${subject._id}/topics`
                                    )
                                }
                            >
                                <div className="subject-icon">
                                    <i className="fa-solid fa-book"></i>
                                </div>

                                <div>
                                    <h3>{subject.name}</h3>
                                    <p>{subject.category}</p>
                                </div>

                                <i className="fa-solid fa-arrow-right subject-arrow"></i>
                            </div>
                        ))
                    )}

                </div>
            </div>

            <div className="dashboard-section">
                <div className="section-header">
                    <div>
                        <h2>Quick Actions</h2>
                        <p>
                            Access important learning tools
                        </p>
                    </div>
                </div>

                <div className="quick-actions-grid">

                    <div
                        className="quick-action-card"
                        onClick={() =>
                            navigate("/progress")
                        }
                    >
                        <div className="quick-action-icon">
                            <i className="fa-solid fa-chart-line"></i>
                        </div>

                        <div>
                            <h3>View Progress</h3>
                            <p>
                                Check your quiz performance
                                and scores
                            </p>
                        </div>

                        <i className="fa-solid fa-arrow-right quick-action-arrow"></i>
                    </div>

                    <div
                        className="quick-action-card"
                        onClick={() =>
                            navigate("/weak-topics")
                        }
                    >
                        <div className="quick-action-icon">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                        </div>

                        <div>
                            <h3>Weak Topics</h3>
                            <p>
                                Review topics that need more
                                practice
                            </p>
                        </div>

                        <i className="fa-solid fa-arrow-right quick-action-arrow"></i>
                    </div>

                </div>
            </div>

            <div className="dashboard-section">

                <div className="section-header">
                    <div>
                        <h2>Recent Activity</h2>
                        <p>
                            Your latest quiz attempts
                        </p>
                    </div>

                    <button
                        className="view-all-btn"
                        onClick={() =>
                            navigate("/progress")
                        }
                    >
                        View All
                    </button>
                </div>

                <div className="recent-activity-list">

                    {attempts.length === 0 ? (
                        <div className="empty-activity">
                            <p>
                                No quiz activity yet.
                            </p>
                        </div>
                    ) : (
                        attempts
                            .slice(0, 3)
                            .map((attempt) => (
                                <div
                                    className="activity-item"
                                    key={attempt._id}
                                >
                                    <div className="activity-left">

                                        <div className="activity-icon">
                                            <i className="fa-solid fa-clipboard-check"></i>
                                        </div>

                                        <div>
                                            <h3>
                                                {attempt.topic?.name ||
                                                    "Quiz"}
                                            </h3>

                                            <p>
                                                {attempt.correctAnswers} /{" "}
                                                {attempt.totalQuestions}{" "}
                                                correct
                                            </p>
                                        </div>

                                    </div>

                                    <div className="activity-right">

                                        <strong>
                                            {attempt.score}%
                                        </strong>

                                        <span>
                                            {attempt.createdAt
                                                ? new Date(
                                                    attempt.createdAt
                                                ).toLocaleDateString()
                                                : ""}
                                        </span>

                                    </div>
                                </div>
                            ))
                    )}

                </div>
            </div>

        </DashboardLayout>
    );
}

export default Dashboard;