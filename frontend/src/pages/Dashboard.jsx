const API_URL = import.meta.env.VITE_API_URL;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

function Dashboard() {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [attempts, setAttempts] = useState([]);
    const [weakTopics, setWeakTopics] = useState([]);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await fetch(`${API_URL}/api/subjects`);
                const data = await response.json();

                if (response.ok) {
                    setSubjects(data);
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.log("Subject fetch error:", error);
            }
        };
        const fetchProgress = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(`${API_URL}/api/progress`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setAttempts(data);
                }
            } catch (error) {
                console.log("Progress fetch error:", error);
            }
        };

        const fetchWeakTopics = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(`${API_URL}/api/weak-topics`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setWeakTopics(data);
                }
            } catch (error) {
                console.log("Weak topics error:", error);
            }
        };
        fetchSubjects();
        fetchProgress();
        fetchWeakTopics();
    }, []);

    const averageScore =
        attempts.length > 0
            ? Math.round(
                attempts.reduce((sum, attempt) => sum + attempt.score, 0) /
                attempts.length
            )
            : 0;

    return (
        <DashboardLayout>
            <h1 className="dashboard-title">Dashboard</h1>

            <div className="welcome-card">
                <div className="welcome-content">
                    <p className="welcome-small">KEEP LEARNING</p>

                    <h2>Build your skills, one quiz at a time.</h2>

                    <p>
                        Continue practicing your subjects and improve your weak topics.
                    </p>

                    <button onClick={() => navigate("/progress")}>
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
                        <p>Select a subject to continue learning</p>
                    </div>
                </div>

                <div className="subject-grid">
                    {subjects.map((subject) => (
                        <div
                            className="subject-card"
                            key={subject._id}
                            onClick={() =>
                                navigate(`/subjects/${subject._id}/topics`)
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
                    ))}
                </div>
            </div>

            <div className="dashboard-section">
                <div className="section-header">
                    <div>
                        <h2>Quick Actions</h2>
                        <p>Access important learning tools</p>
                    </div>
                </div>

                <div className="quick-actions-grid">
                    <div
                        className="quick-action-card"
                        onClick={() => navigate("/progress")}
                    >
                        <div className="quick-action-icon">
                            <i className="fa-solid fa-chart-line"></i>
                        </div>

                        <div>
                            <h3>View Progress</h3>
                            <p>Check your quiz performance and scores</p>
                        </div>

                        <i className="fa-solid fa-arrow-right quick-action-arrow"></i>
                    </div>

                    <div
                        className="quick-action-card"
                        onClick={() => navigate("/weak-topics")}
                    >
                        <div className="quick-action-icon">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                        </div>

                        <div>
                            <h3>Weak Topics</h3>
                            <p>Review topics that need more practice</p>
                        </div>

                        <i className="fa-solid fa-arrow-right quick-action-arrow"></i>
                    </div>
                </div>
            </div>

        </DashboardLayout>

    );
}

export default Dashboard;