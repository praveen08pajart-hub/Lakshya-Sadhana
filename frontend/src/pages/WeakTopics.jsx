const API_URL = import.meta.env.VITE_API_URL;
import DashboardLayout from "../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function WeakTopics() {
    const navigate = useNavigate();
    const [weakTopics, setWeakTopics] = useState([]);

    useEffect(() => {
        const fetchWeakTopics = async () => {
            try {
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

                if (response.ok) {
                    setWeakTopics(data);
                } else {
                    alert(data.message);
                }

            } catch (error) {
                console.log("Weak topics fetch error:", error);
            }
        };

        fetchWeakTopics();
    }, []);

    return (
        <DashboardLayout>
            <button
                className="back-btn"
                onClick={() => navigate("/dashboard")}
            >
                ← Back to Dashboard
            </button>

            <h1 className="dashboard-title">Weak Topics</h1>

            {weakTopics.length === 0 ? (
                <div className="dashboard-card">
                    <p>No weak topics found.</p>
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
                                    <h3>{attempt.topic?.name}</h3>

                                    <p className="weak-topic-message">
                                        This topic needs more revision and practice.
                                    </p>

                                    <p className="weak-topic-tip">
                                        Try reviewing the topic again before your next quiz.
                                    </p>
                                </div>
                            </div>

                            <div className="weak-topic-actions">
                                <div className="weak-topic-score">
                                    <span>{attempt.score}%</span>
                                    <small>Needs Revision</small>
                                </div>

                                <button
                                    className="practice-again-btn"
                                    onClick={() => navigate(`/quiz/${attempt.topic?._id}`)}
                                    disabled={!attempt.topic?._id}
                                >
                                    Practice Again
                                    <i className="fa-solid fa-arrow-right"></i>
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