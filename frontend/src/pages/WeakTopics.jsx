const API_URL = import.meta.env.VITE_API_URL;
import Navbar from "../components/Navbar";
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
        <><Navbar />
            <div className="dashboard-page">
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
                    <div className="dashboard-grid">
                        {weakTopics.map((attempt) => (
                            <div
                                className="dashboard-card"
                                key={attempt._id}
                            >
                                <h3>{attempt.topic?.name}</h3>
                                <p>Score: {attempt.score}%</p>
                                <p>Needs more revision and practice.</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default WeakTopics;